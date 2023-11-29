import { env } from '@/env.js';
import { PostHog } from 'posthog-node';

/**
 * @deprecated Don't use this directly, use `logServerEvent` instead. */
const internal_client = new PostHog(env.NEXT_PUBLIC_POSTHOG_PUBLIC_KEY);

export const flushServerEvents = () => internal_client.flushAsync();

type VALID_SERVER_EVENTS = {
  signin: {
    //
  };

  project_created: {
    //
  };

  project_creation_failed: {
    //
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
