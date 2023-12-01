import { env } from '@/env.js';
import React from 'react';

import { type CloudinaryUploadResponse } from '@/lib/types/cloudinary';
import { initiateNewUpload } from '@/server/actions/projectMedia';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from './user/auth';

const useCloudinaryUpload = ({
  onError,
  onSuccess,
}: {
  onError?: (error: unknown) => void;
  onSuccess?: (props: {
    public_id: string;
    projectId: number;
    url: string;
  }) => void;
}) => {
  const generatePresignedUrlMutation = useMutation({
    mutationFn: initiateNewUpload,
  });
  const [status, setStatus] = React.useState<
    'idle' | 'uploading' | 'succeeded' | 'failed' | 'cancelled'
  >('idle');

  const { userId } = useAuth();

  const upload = async ({
    type = 'video',
    blobUrl,
    isWebcam = false,
    projectId,
    overridenOnSuccess,
  }: {
    type?: 'video' | 'image';
    // | 'audio' | 'screen'
    blobUrl: string;
    isWebcam?: boolean;
    overridenOnSuccess?: (url: string) => void;
    projectId: number;
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
        await generatePresignedUrlMutation.mutateAsync({ type, projectId });

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
        .catch((error) => {
          onError?.(error);
        });

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
        const usableUrl = isWebcam
          ? data.secure_url.replace('/upload/', '/upload/w_250,h_250,c_fill/')
          : data.secure_url;

        overridenOnSuccess
          ? overridenOnSuccess(usableUrl)
          : onSuccess?.({
              public_id,
              projectId,
              url: usableUrl,
            });
        setStatus('succeeded');
      } catch (e) {
        setStatus('failed');
        onError?.((e as Error)?.message ?? 'Unknown error');
      }
    } else {
      // TODO: Handle this better
      setStatus('failed');
      onError?.('The media is not yet ready for uploading. Please try again.');
    }
  };

  return { upload, status };
};

export default useCloudinaryUpload;
