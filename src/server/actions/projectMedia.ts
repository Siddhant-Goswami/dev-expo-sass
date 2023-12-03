'use server';

import { env } from '@/env';
import { MAX_PENDING_UPLOAD_REQUESTS_PER_DAY } from '@/lib/constants/cloudinary';
import { sendLogToDiscord } from '@/utils/discord';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import cloudinary from 'cloudinary';
import { createHash } from 'crypto';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { presign } from '../../utils/cloudinary';
import { db } from '../db';
import { projectMedia } from '../db/schema';

const initiateNewUploadPropsSchema = z.object({
  type: z.enum(['video', 'image']),
  projectId: z.number(),
});

type InitiateNewUploadProps = z.infer<typeof initiateNewUploadPropsSchema>;

export const initiateNewUpload = async (_props: InitiateNewUploadProps) => {
  const { projectId, type } = initiateNewUploadPropsSchema.parse(_props);

  const supabase = createServerActionClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Unauthorized');
  }
  const userId = session.user.id;
  const userEmail = session.user.email;

  if (!userEmail) {
    throw new Error("User doesn't have an email");
  }

  try {
    const pendingMediaUploadUrls = await db.query.projectMedia.findMany({
      // Fetch all pending uploads from the last 24 hours
      // TODO: Actually see whether we can set 24 hrs expiration for cloudinary presigned urls
      where: (pm, { and, gte }) =>
        and(gte(pm.expiresAt, new Date(Date.now() - 24 * 60 * 60 * 1000))),
    });

    if (pendingMediaUploadUrls.length > MAX_PENDING_UPLOAD_REQUESTS_PER_DAY) {
      throw new Error(
        `You've reached the maximum uploads for the day. Please try again later.`,
      );
    }

    const uploadInitiatedAt = new Date();

    const filePublicId = createHash('sha256')
      .update(
        JSON.stringify({
          userId,
          userEmail,
          uploadInitiatedAt,
          projectId,
          type,
        }),
      )
      .digest('hex'); // TODO: More programatically generate inputHash, with more params

    const { cloudName, signature, timestamp } = await presign({
      // userId,
      public_id: filePublicId,
    });
    const [projectMediaId] = await db
      .insert(projectMedia)
      .values({
        userId,
        type,
        projectId,
        publicId: filePublicId,
        // "Expires" in 24 hours
        expiresAt: new Date(uploadInitiatedAt.getTime() + 24 * 60 * 60 * 1000),
        uploadInitiatedAt: uploadInitiatedAt,
      })
      .returning({
        id: projectMedia.id,
      });

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${
      type === 'image' ? 'image' : 'video'
    }/upload`;

    return {
      success: true,
      uploadUrl,
      public_id: filePublicId,
      signature,
      timestamp,
      projectMediaId,
    };
  } catch (err) {
    console.error(err);

    await sendLogToDiscord(
      `Error while initiating new Cloudinary image upload: ${
        (err as Error)?.message ?? 'Unknown err...'
      }`,
    );

    return {
      success: false,
      error: (err as Error)?.message ?? 'Could not get upload URL!',
    };
  }
};

const validateAndPersistUploadPropsSchema = z.object({
  projectId: z.number(),
  publicId: z.string(),
});
export const validateAndPersistUpload = async (
  _props: z.infer<typeof validateAndPersistUploadPropsSchema>,
) => {
  try {
    const { projectId, publicId } =
      validateAndPersistUploadPropsSchema.parse(_props);

    const supabase = createServerActionClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Unauthorized');
    }
    console.log(`Validating and persisting upload:`, publicId);

    const userId = session.user.id;

    const existingMediaInDb = await db.query.projectMedia.findFirst({
      where: (pm, { eq, and }) =>
        and(
          eq(pm.publicId, publicId),
          eq(pm.projectId, projectId),
          eq(pm.userId, userId),
        ),
    });

    if (!existingMediaInDb?.id) {
      throw new Error('Could not find project media record');
    }

    if (!existingMediaInDb?.expiresAt) {
      return {
        message: 'This upload has already been validated and persisted.',
        success: true,
      };
    }

    if (existingMediaInDb?.expiresAt.getTime() < new Date().getTime()) {
      await db
        .delete(projectMedia)
        .where(eq(projectMedia.id, existingMediaInDb.id));

      return {
        message: 'This upload has expired.',
        success: false,
      };
    }

    cloudinary.v2.config({
      api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      secure: true,
    });

    const assetUrl = cloudinary.v2.utils.url(publicId);

    const [updatedRecord] = await db
      .update(projectMedia)
      .set({
        expiresAt: null,
        updatedAt: new Date(),
        url: assetUrl,
      })
      .where(eq(projectMedia.id, existingMediaInDb.id))
      .returning({ id: projectMedia.id });

    const updatedMediaId = updatedRecord?.id;

    if (!updatedMediaId) {
      throw new Error('Could not update project media record');
    }

    return {
      success: true,
      message: 'Successfully validated and persisted upload!',
      projectMediaId: updatedMediaId,
    };
  } catch (err) {
    console.error(err);

    await sendLogToDiscord(
      `Error while validating and persisting Cloudinary image upload: ${
        (err as Error)?.message ?? 'Unknown err...'
      }`,
    );

    return {
      success: false,
      error:
        (err as Error)?.message ?? 'Could not validate and persist upload!',
    };
  }
};
