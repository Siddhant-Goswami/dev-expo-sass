'use client';
import { env } from '@/env';
import { supabaseClientComponentClient } from '@/hooks/user/auth';
import logClientEvent from '@/lib/analytics/posthog/client';
import { URLs } from '@/lib/constants';

import { Auth } from '@supabase/auth-ui-react';
import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared';

export const UserAuthForm = (props: { redirectAfterSignin?: string }) => {
  const supabase = supabaseClientComponentClient();

  const redirectUrl = props.redirectAfterSignin ?? URLs.feed;

  return (
    <div
      onClick={() => {
        // The auth form buttons have some invisible vertical padding, so clicking in that area will also trigger this handler.

        logClientEvent('click_auth_button', { timestamp: Date.now() });
      }}
    >
      <Auth
        onlyThirdPartyProviders
        dark={false}
        // socialLayout="horizontal"
        // providerScopes={{google: }}
        supabaseClient={supabase}
        providers={['github', 'google']}
        appearance={{ theme: ThemeSupa, className: 'py-0 my-0' }}
        redirectTo={
          (env.NEXT_PUBLIC_VERCEL_ENV === 'production'
            ? env.NEXT_PUBLIC_APP_URL
            : env.NEXT_PUBLIC_VERCEL_URL ?? env.NEXT_PUBLIC_APP_URL) +
          redirectUrl
        }
      />
    </div>
  );
};
