'use server';

import { MAX_PENDING_UPLOAD_REQUESTS_PER_DAY } from '@/lib/constants/cloudinary';
import { sendLogToDiscord } from '@/utils/discord';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { presign } from '../../utils/cloudinary';
import { db } from '../db';

const initiateNewUploadPropsSchema = z.object({
  type: z.enum(['video', 'audio', 'screen', 'image']),
});

type InitiateNewUploadProps = z.infer<typeof initiateNewUploadPropsSchema>;

export const initiateNewImageUpload = async (
  _props: InitiateNewUploadProps,
) => {
  const { type } = initiateNewUploadPropsSchema.parse(_props);

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

    const { cloudName, signature, timestamp } = await presign();

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${
      type === 'image' ? 'image' : 'video'
    }/upload`;

    return {
      success: true,
      uploadUrl,
      signature,
      timestamp,
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
