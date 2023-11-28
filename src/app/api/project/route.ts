import { env } from '@/env';
import { MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from '@/lib/constants';
import { projectFormSchema } from '@/lib/validations/project';
import { createProject } from '@/server/actions/projects';
import { db } from '@/server/db';
import { projectMedia } from '@/server/db/schema';
import { sendLogToDiscord } from '@/utils/discord';
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
    const formData = await req.formData();

    const sanitizedProjectData = projectFormSchema.parse(
      JSON.parse(formData.get('projectData') as string),
    );

    cloudinary.v2.config({
      api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      secure: true,
    });

    // const mediaUrlsToSet: {
    //   type: 'image' | 'video';
    //   url: string;
    // }[] = [];

    // TODO: Add this restriction to api properly!!
    //   if (videoFiles.length > MAX_NUMBER_OF_VIDEOS) {
    //     throw new Error('🔴 You can only upload up to 1 video!');
    //   }

    const videoBlobFile = formData.get('video') as File;

    const image1BlobFile = formData.get('image1') as File | null;
    const image2BlobFile = formData.get('image2') as File | null;
    const image3BlobFile = formData.get('image3') as File | null;
    const imagesToUpload = [
      image1BlobFile,
      image2BlobFile,
      image3BlobFile,
    ].filter(
      (imageBlobFile) =>
        imageBlobFile instanceof File && imageBlobFile.size < MAX_IMAGE_SIZE,
    );

    console.log(`Images to upload:`, imagesToUpload.length);

    // let videoUrl: string | null = null;

    const uploadPromises: Promise<{
      type: 'image' | 'video';
      url: string;
    }>[] = [];

    if (videoBlobFile) {
      if (videoBlobFile.size > MAX_VIDEO_SIZE) {
        throw new Error('🔴 Video file size must be less than 5MB!');
      }

      console.log(`\n⭐ Uploading Video:`, videoBlobFile.type);
      const videoUrlPromise = uploadVideoToCloudinary(
        videoBlobFile,
        session.user.id,
      );
      // 1 in uploadPromises is video
      uploadPromises.push(videoUrlPromise);
    }

    imagesToUpload.forEach((imageBlobFile) => {
      const imageUrlPromise = uploadImageToCloudinary(
        imageBlobFile!,
        session.user.id,
      );
      // Rest in uploadPromises are images
      uploadPromises.push(imageUrlPromise);
    });

    const projectSlug =
      sanitizedProjectData.title.replace(/\s+/g, '-').toLowerCase() +
      '-' +
      Date.now().toString();

    const newProjectInDbPromise = createProject({
      userId: session.user.id,
      slug: projectSlug,
      title: sanitizedProjectData.title,
      description: sanitizedProjectData.description,
      hostedUrl: sanitizedProjectData.hostedUrl,
      sourceCodeUrl: sanitizedProjectData.sourceCodeUrl,

      tagsList: sanitizedProjectData.tags,
    });

    const uploadedMediaToCloudinary = await Promise.all([
      newProjectInDbPromise,
      ...uploadPromises,
    ]);

    const [newProjectInDb, ...uploadedMediaResults] = uploadedMediaToCloudinary;

    if (!newProjectInDb.projectId) {
      throw new Error('🔴 Could not get id of newly created project!');
    }

    // const uploadedImages = await Promise.all(imagePromises);

    const totalImagesUploaded = uploadedMediaResults.filter(
      (media) => media.type === 'image',
    ).length;

    const totalVideosUploaded = uploadedMediaResults.filter(
      (media) => media.type === 'video',
    ).length;

    console.log(`\n1️⃣ Uploaded Media to Cloudinary: `, {
      images: totalImagesUploaded,
      videos: totalVideosUploaded,
    });

    // Upload media to table
    const mediaPromises = uploadedMediaResults.map(
      async (mediaUrlToSet) =>
        await db.insert(projectMedia).values({
          projectId: newProjectInDb.projectId,
          type: mediaUrlToSet.type,
          url: mediaUrlToSet.url,
        }),
    );

    const mediaUploaded = await Promise.all(mediaPromises);

    console.log(`\n2️⃣ Uploaded total Media to DB:`, mediaUploaded.length);

    console.log(`\n3️⃣ New project ID:`, newProjectInDb.projectId);

    console.timeEnd('Project-upload');
    return NextResponse.json(
      {
        projectId: newProjectInDb.projectId,
        success: true,
      },
      { status: 200 },
    );
  } catch (e) {
    const errorMessage =
      'Failed to create the project:' + (e as Error)?.message ?? 'Unknown err';

    await sendLogToDiscord(`@everyone ${errorMessage}`);
    return new NextResponse(errorMessage, { status: 500 });
  }
}

async function uploadVideoToCloudinary(videoBlobFile: Blob, userId: string) {
  const publicId = Math.random().toString() + Date.now();

  //   WRITE BLOB TO DISK
  const blobFilePath = '/tmp/' + publicId + '-' + userId;
  const blobFileStream = fs.createWriteStream(blobFilePath);

  const videoBlobFileArrayBuffer = await videoBlobFile.arrayBuffer();
  const videoBlobFileBuffer = Buffer.from(videoBlobFileArrayBuffer);
  blobFileStream.write(videoBlobFileBuffer);

  //   wait 4 seconds
  // await new Promise((resolve) => setTimeout(resolve, 4000));

  const cldResult = await cloudinary.v2.uploader.upload(blobFilePath, {
    resource_type: 'video',
    //   public_id: publicId + userId,
    // overwrite: true,
    // notification_url: "https://mysite.example.com/notify_endpoint",
  });

  return {
    type: 'video' as const,
    url: cldResult.secure_url,
  };
}

async function uploadImageToCloudinary(imageBlobFile: Blob, userId: string) {
  const publicId = Math.random().toString() + Date.now();

  //   WRITE BLOB TO DISK
  const blobFilePath = '/tmp/' + publicId + '-' + userId;
  const blobFileStream = fs.createWriteStream(blobFilePath);

  const imageBlobFileArrayBuffer = await imageBlobFile.arrayBuffer();
  const imageBlobFileBuffer = Buffer.from(imageBlobFileArrayBuffer);
  blobFileStream.write(imageBlobFileBuffer);

  //   wait 4 seconds
  // await new Promise((resolve) => setTimeout(resolve, 4000));

  const cldResult = await cloudinary.v2.uploader.upload(blobFilePath, {
    resource_type: 'image',
    //   public_id: publicId + userId,
    // overwrite: true,
    // notification_url: "https://mysite.example.com/notify_endpoint",
  });

  //   console.log(`🔴 Maybe we have a secure image url? ${cldResult.secure_url}`);
  return {
    type: 'image' as const,
    url: cldResult.secure_url,
  };
}
