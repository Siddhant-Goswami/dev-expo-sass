import { env } from '@/env.js';
import React from 'react';

import { type CloudinaryUploadResponse } from '@/lib/types/cloudinary';
import { api } from '@/trpc/react';
import { useAuth } from './user/auth';

const useFacecamUpload = ({
  onError,
  onSuccess,
}: {
  onError?: (error: unknown) => Promise<void>;
  onSuccess?: (props: {
    public_id: string;
    devApplicationId: number;
    url: string;
  }) => Promise<void>;
}) => {
  const generatePresignedUrlMutation =
    api.devApplication.initiateFacecamUpload.useMutation();

  const [status, setStatus] = React.useState<
    'idle' | 'uploading' | 'succeeded' | 'failed' | 'cancelled'
  >('idle');

  const { userId } = useAuth();

  const upload = async ({
    type = 'video',
    blobUrl,
    useWebcamOptimization = false,
    devApplicationId,
    overridenOnSuccess,
  }: {
    type?: 'video' | 'image';
    // | 'audio' | 'screen'
    blobUrl: string;
    useWebcamOptimization?: boolean;
    overridenOnSuccess?: (url: string) => void;
    devApplicationId: number;
  }) => {
    if (!userId) {
      return alert('You must be logged in to upload media');
    }

    setStatus('uploading');
    if (
      blobUrl.startsWith('blob:') &&
      generatePresignedUrlMutation.status !== 'loading'
    ) {
      // Get signature
      const { success, public_id, error, signature, timestamp, uploadUrl } =
        await generatePresignedUrlMutation.mutateAsync({
          applicationId: devApplicationId,
        });

      if (error ?? !success) {
        throw new Error(
          error ??
            'Error generating signature for uploading. Please try again.',
        );
      }

      // console.log(`Uploading the blob:`, {
      //   uploadUrl,
      //   blobUrl,
      // });

      // Get file
      const file = await fetch(blobUrl)
        .then((r) => r.blob())
        .then(
          (blobFile) =>
            new File([blobFile], 'fileNameGoesHere', {
              type:
                type === 'video'
                  ? // || type === 'screen'
                    'video/mp4'
                  : // : type === 'audio'
                    //   ? 'audio/mp3'
                    'image/png',
            }),
        )
        .catch(onError);

      if (!file) {
        throw new Error(
          'File not found while uploading to bucket. Please try again.',
        );
      }

      // Start uploading the video
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      formData.append('signature', signature);

      // * Make sure to append everything that was included during the signing process
      formData.append('timestamp', timestamp.toString());
      formData.append('public_id', public_id);

      // formData.append('userId', userId);

      try {
        const res = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error(
            `Error uploading video: ${res.status} ${res.statusText}`,
          );
        }

        const data = (await res.json()) as CloudinaryUploadResponse;

        if (!data.secure_url) {
          console.error('No secure url returned from cloudinary');
          return onError?.('No secure url returned!');
        }
        const usableUrl = useWebcamOptimization
          ? data.secure_url.replace('/upload/', '/upload/w_250,h_250,c_fill/')
          : data.secure_url;

        setStatus('succeeded');
        overridenOnSuccess
          ? overridenOnSuccess(usableUrl)
          : await onSuccess?.({
              public_id,
              devApplicationId,
              url: usableUrl,
            });
      } catch (e) {
        setStatus('failed');
        void onError?.((e as Error)?.message ?? 'Unknown error');
      }
    } else {
      // TODO: Handle this better
      setStatus('failed');
      void onError?.(
        'The media is not yet ready for uploading. Please try again.',
      );
    }
  };

  return { upload, status };
};

export default useFacecamUpload;
