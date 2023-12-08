import { env } from '@/env';
import posthog from 'posthog-js';

posthog.init(env.NEXT_PUBLIC_POSTHOG_PUBLIC_KEY, {
  api_host: 'https://app.posthog.com',
});

const internal_client = posthog;

type VALID_CLIENT_EVENTS = {
  click_auth_button: {
    timestamp: number;
  };

  click_signout_button: {
    userId: string;
  };

  click_project_card: {
    userId?: string;
    projectId: string;
    timestamp: number;
  };

  click_get_started_button: {
    userId?: string;
    timestamp: number;
  };

  dev_application_submit_success: {
    userId: string;
    applicationId: string;
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

  click_project_submit: {
    userId: string;
    timestamp: number;
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
    projectId?: string;
    imageSize?: number;
    publicId?: string; // public_id of the image in cloudinary (referenced in the `projectMedia` table)
    reason: string;
  };

  project_image_upload_success: {
    userId: string;
    projectId: string;
    imageSize: number;
  };
};

export const logClientEvent = <TEventKey extends keyof VALID_CLIENT_EVENTS>(
  event: TEventKey,
  payload: VALID_CLIENT_EVENTS[TEventKey],
) => {
  try {
    internal_client.capture(event, payload);
  } catch (err) {
    console.error(`Posthog failed on client??`, err);
  }
};

export default logClientEvent;
