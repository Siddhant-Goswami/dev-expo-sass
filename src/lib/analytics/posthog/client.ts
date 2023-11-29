import { env } from '@/env';
import posthog from 'posthog-js';

posthog.init(env.NEXT_PUBLIC_POSTHOG_PUBLIC_KEY, {
  api_host: 'https://app.posthog.com',
});

const internal_client = posthog;

// TODO: Add typesafe wrapper around this, just like we have for the server-side

type VALID_CLIENT_EVENTS = {
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
