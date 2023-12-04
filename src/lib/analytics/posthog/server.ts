import { env } from '@/env.js';
import { PostHog } from 'posthog-node';

/**
 * @deprecated Don't use this directly, use `logServerEvent` instead. */
const internal_client = new PostHog(env.NEXT_PUBLIC_POSTHOG_PUBLIC_KEY);

export const flushServerEvents = () => internal_client.flushAsync();

type VALID_SERVER_EVENTS = {
  user_signin: {
    email: string;
    userId: string;
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
};

export const logServerEvent = <TEventKey extends keyof VALID_SERVER_EVENTS>(
  event: TEventKey,
  payload: {
    distinct_id: string;
    properties: VALID_SERVER_EVENTS[TEventKey];
  },
) => {
  return internal_client.capture({
    distinctId: payload.distinct_id,
    event,
    properties: payload.properties,
  });
};
