import { env } from '@/env';
import { v2 } from 'cloudinary';

export const presign = async (props: Record<string, string | number>) =>
  // paramsToSign: Record<string, string | number>,
  {
    // timestamp - Unix time in seconds of the current time (e.g., 1315060076).
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = v2.utils.api_sign_request(
      { ...props, timestamp },
      env.CLOUDINARY_API_SECRET,
    );
    return {
      signature,
      timestamp,
      cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    };
  };
