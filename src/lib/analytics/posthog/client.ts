import { env } from '@/env';
import posthog from 'posthog-js';

posthog.init(env.NEXT_PUBLIC_POSTHOG_PUBLIC_KEY, {
  api_host: 'https://app.posthog.com',
});

const internal_client = posthog;

type VALID_CLIENT_EVENTS = {
  dev_application_submit_success: {
    userId: string;
    applicationId: string; // Unique identifier for the application
    positionAppliedFor: string; // The role or position applied for
  };

  dev_application_submit_failed: {
    reason: string;
    userId: string;
  };

  dev_application_video_record_success: {
    userId: string;
    videoSize: number; // Size in bytes
  };
  dev_application_video_record_fail: {
    userId: string;
    reason: string;
  };

  dev_application_video_upload_success: {
    userId: string;
    applicationId: string;
    videoSize: number;
  };

  dev_application_video_upload_failed: {
    reason: string;
    userId: string;
    applicationId: string;
    videoSize: number;
  };

  project_submit_failed: {
    userId: string;
    reason: string;
  };
  project_submit_success: {
    userId: string;
    projectId: string;
  };

  project_image_upload_failed: {
    userId: string;
    projectId: string;
    imageSize: number;
    reason: string;
    publicId: string; // public_id of the image in cloudinary (referenced in the `projectMedia` table)
  };

  project_image_upload_success: {
    userId: string;
    projectId: string;
    imageSize: number;
  };
};

export const logClientEvent = <TEventKey extends keyof VALID_CLIENT_EVENTS>(
  event: TEventKey,
  payload: {
    distinct_id: string;
    properties: VALID_CLIENT_EVENTS[TEventKey];
  },
) => {
  return internal_client.capture(event, payload.properties);
};

export default logClientEvent;
