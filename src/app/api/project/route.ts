import { MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from '@/lib/constants';
import { projectFormSchema } from '@/lib/validations/project';
import { createProject } from '@/server/actions/projects';
import { db } from '@/server/db';
import { projectMedia } from '@/server/db/schema';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import cloudinary from 'cloudinary';
import fs from 'fs';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

// POST schema

export async function POST(req: NextRequest) {
  console.time('Project-upload');
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

    console.info(`All form data:`, formData.entries());

    const videoBlobFile = formData.get('video') as Blob;

    const image1BlobFile = formData.get('image1') as Blob;
    const image2BlobFile = formData.get('image2') as Blob;
    const image3BlobFile = formData.get('image3') as Blob;
    const imagesToUpload = [image1BlobFile, image2BlobFile, image3BlobFile];

    console.log(`Images to upload:`, imagesToUpload);

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

      console.log(
        `\n⭐ Video blob file:`,
        videoBlobFile.size / 1024 / 1024,
        'MB',
      );
      const url = await uploadVideo(videoBlobFile, session.user.id);

      if (url) {
        videoUrl = url;
        console.log(`\n⭐ Uploaded Valid Video file:` + url);
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

    const uploadedImages = await Promise.all(imagePromises);

    console.log(`\n⭐ Uploaded Valid Images:`, uploadedImages.length);

    const projectSlug =
      sanitizedProjectData.title.replace(/\s+/g, '-').toLowerCase() +
      '-' +
      Date.now().toString();

    await createProject({
      userId: session.user.id,
      slug: projectSlug,
      title: sanitizedProjectData.title,
      description: sanitizedProjectData.description,
      hostedUrl: sanitizedProjectData.hostedUrl,
      sourceCodeUrl: sanitizedProjectData.sourceCodeUrl,

      tagsList: sanitizedProjectData.tags,
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

    const mediaUploaded = await Promise.all(mediaPromises);
    console.log(`\n⭐ Uploaded total Media:`, mediaUploaded.length);

    console.log(`\n⭐ New project ID:`, newProject.id);

    console.timeEnd('Project-upload');
    return NextResponse.json(
      {
        projectId: newProject.id,
        success: true,
      },
      { status: 200 },
    );
  } catch (e) {
    return new NextResponse(
      'Failed to upload the video,' + (e as Error)?.message ?? 'Unknown err',
      { status: 500 },
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
