import { projectFormSchema } from '@/lib/validations/project';
import { db } from '@/server/db';
import { projectMedia, projects } from '@/server/db/schema';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import cloudinary from 'cloudinary';
import fs from 'fs';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

const MAX_NUMBER_OF_IMAGES = 3;
const MAX_NUMBER_OF_VIDEOS = 1;
const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 2MB

// POST schema

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new NextResponse('Unauthenticated', { status: 401 });
  }

  try {
    if (
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET ||
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    ) {
      throw new Error('Missing Cloudinary Credentials');
    }

    const formData = await req.formData();

    const sanitizedProjectData = projectFormSchema.parse(
      JSON.parse(formData.get('projectData') as string),
    );

    cloudinary.v2.config({
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      secure: true,
    });

    const mediaUrlsToSet: {
      type: 'image' | 'video';
      url: string;
    }[] = [];

    // TODO: Add this restriction to api properly!!
    //   if (videoFiles.length > MAX_NUMBER_OF_VIDEOS) {
    //     throw new Error('🔴 You can only upload up to 1 video!');
    //   }

    const videoBlobFile = formData.get('video') as Blob;

    const image1BlobFile = formData.get('image1') as Blob;
    const image2BlobFile = formData.get('image2') as Blob;
    const image3BlobFile = formData.get('image3') as Blob;
    const imagesToUpload = [image1BlobFile, image2BlobFile, image3BlobFile];

    imagesToUpload.forEach((imageBlobFile) => {
      if (imageBlobFile) {
        if (imageBlobFile.size > MAX_IMAGE_SIZE) {
          throw new Error('🔴 Image file size must be less than 5MB!');
        }
      }
    });

    let videoUrl: string | null = null;
    if (videoBlobFile) {
      if (videoBlobFile.size > MAX_VIDEO_SIZE) {
        throw new Error('🔴 Video file size must be less than 5MB!');
      }

      console.log(`\n⭐ Video blob file:`, videoBlobFile.size);
      const url = await uploadVideo(videoBlobFile, session.user.id);

      if (url) {
        videoUrl = url;
        mediaUrlsToSet.push({ type: 'video', url });
      }
    }

    const imagePromises = imagesToUpload.map(async (imageBlobFile) => {
      if (imageBlobFile) {
        const url = await uploadImage(imageBlobFile, session.user.id);
        mediaUrlsToSet.push({
          type: 'image',
          url,
        });
      }
    });

    await Promise.all(imagePromises);

    const projectSlug =
      sanitizedProjectData.title.replace(/\s+/g, '-').toLowerCase() +
      '-' +
      Date.now().toString();

    await db.insert(projects).values({
      userId: session.user.id,
      slug: projectSlug,
      title: sanitizedProjectData.title,
      description: sanitizedProjectData.description,

      hostedUrl: sanitizedProjectData.hostedUrl,
      sourceCodeUrl: sanitizedProjectData.sourceCodeUrl,

      // coverImageUrl
    });

    // get created project id
    const newProject = await db.query.projects.findFirst({
      where: (p, { eq }) => eq(p.slug, projectSlug),
    });

    if (!newProject) {
      throw new Error('🔴 Could not find newly created project!');
    }

    // Upload media to table
    const mediaPromises = mediaUrlsToSet.map(
      async (mediaUrlToSet) =>
        await db.insert(projectMedia).values({
          projectId: newProject.id,
          type: mediaUrlToSet.type,
          url: mediaUrlToSet.url,
        }),
    );

    await Promise.all(mediaPromises);

    console.log(`\n⭐ New project:`, newProject.id);

    return NextResponse.json(
      {
        projectId: newProject.id,
        success: true,
      },
      { status: 200 },
    );
  } catch (e) {
    // Set status to failed in db

    if (e instanceof Error) {
      throw e;
    }

    throw new Error(
      `🔴 Workflow failed: ${(e as Error)?.message ?? 'unknown error!'}`,
    );
  }
}

async function uploadVideo(videoBlobFile: Blob, userId: string) {
  const publicId = Math.random().toString() + Date.now();

  //   WRITE BLOB TO DISK
  const blobFilePath = '/tmp/' + publicId + '-' + videoBlobFile.size;
  const blobFileStream = fs.createWriteStream(blobFilePath);

  const videoBlobFileArrayBuffer = await videoBlobFile.arrayBuffer();
  const videoBlobFileBuffer = Buffer.from(videoBlobFileArrayBuffer);
  blobFileStream.write(videoBlobFileBuffer);

  //   wait 4 seconds
  await new Promise((resolve) => setTimeout(resolve, 4000));

  const cldResult = await cloudinary.v2.uploader.upload(blobFilePath, {
    resource_type: 'video',
    //   public_id: publicId + userId,
    // overwrite: true,
    // notification_url: "https://mysite.example.com/notify_endpoint",
  });

  return cldResult.secure_url;
}

async function uploadImage(imageBlobFile: Blob, userId: string) {
  const publicId = Math.random().toString() + Date.now();

  //   WRITE BLOB TO DISK
  const blobFilePath = '/tmp/' + publicId + '-' + imageBlobFile.size;
  const blobFileStream = fs.createWriteStream(blobFilePath);

  const imageBlobFileArrayBuffer = await imageBlobFile.arrayBuffer();
  const imageBlobFileBuffer = Buffer.from(imageBlobFileArrayBuffer);
  blobFileStream.write(imageBlobFileBuffer);

  //   wait 4 seconds
  await new Promise((resolve) => setTimeout(resolve, 4000));

  const cldResult = await cloudinary.v2.uploader.upload(blobFilePath, {
    resource_type: 'image',
    //   public_id: publicId + userId,
    // overwrite: true,
    // notification_url: "https://mysite.example.com/notify_endpoint",
  });

  //   console.log(`🔴 Maybe we have a secure image url? ${cldResult.secure_url}`);
  return cldResult.secure_url;
}
