import { env } from '@/env.js';
import { PostHog } from 'posthog-node';

/**
 * @deprecated Don't use this directly, use `logServerEvent` instead. */
const internal_client = new PostHog(env.NEXT_PUBLIC_POSTHOG_PUBLIC_KEY, {
  enable: env.NEXT_PUBLIC_VERCEL_ENV === 'production',
});

export const flushServerEvents = () => internal_client.flushAsync();

type VALID_SERVER_EVENTS = {
  user_signin: {
    email: string;
    userId: string;
  };

  dev_application_submit_email_send_success: {
    userId: string;
    devApplicationId: string;
    userEmail: string;
  };

  dev_application_submit_email_send_fail: {
    userId: string;
    devApplicationId: string;
    userEmail: string;
    reason: string;
  };

  dev_application_approve_email_send_success: {
    userId: string;
    devApplicationId: string;
    userEmail: string;
  };

  dev_application_approve_email_send_fail: {
    userId: string;
    devApplicationId: string;
    userEmail: string;
    reason: string;
  };

  dev_application_create_success: {
    userId: string;
    applicationId: string; // Unique identifier for the application
  };

  dev_application_create_failed: {
    reason: string;
    userId: string;
  };

  dev_application_approve: {
    userId: string;
    applicationId: string;
  };

  project_create_failed: {
    userId: string;
    reason: string;
  };
  project_create_success: {
    userId: string;
    projectId: string;
  };

  project_delete_failed: {
    userId: string;
    projectId: string;
    reason: string;
  };

  project_delete_success: {
    userId: string;
    projectId: string;
  };

  project_liked_toggled: {
    userId: string;
    projectId: string;
    liked: boolean;
  };

  project_media_upload_validation_failed: {
    userId: string;
    projectId: string;
    publicId: string;
    reason: string;
  };

  project_media_upload_validation_success: {
    userId: string;
    projectId: string;
    projectMediaId: string;
  };

  reachout_email_send_failed: {
    userId: string;
    reachoutId: string;
    reason: string;
  };

  reachout_email_send_success: {
    recruiterId: string;
    devId: string;
    reachoutId: string;
  };
};

export const logServerEvent = <TEventKey extends keyof VALID_SERVER_EVENTS>(
  event: TEventKey,
  payload: {
    distinct_id: string;
    properties: VALID_SERVER_EVENTS[TEventKey];
  },
) => {
  try {
    internal_client.capture({
      distinctId: payload.distinct_id,
      event,
      properties: payload.properties,
    });
  } catch (err) {
    console.error(`Posthog failed on server??`, err);
  }
};
