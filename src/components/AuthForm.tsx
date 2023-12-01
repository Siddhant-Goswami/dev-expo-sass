import { env } from '@/env';
import { supabaseClientComponentClient } from '@/hooks/user/auth';
import { URLs } from '@/lib/constants';

import { Auth } from '@supabase/auth-ui-react';
import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared';

export const UserAuthForm = () => {
  const supabase = supabaseClientComponentClient();

  return (
    <>
      <Auth
        onlyThirdPartyProviders
        dark={false}
        // socialLayout="horizontal"
        // providerScopes={{google: }}
        supabaseClient={supabase}
        providers={['github', 'google']}
        appearance={{ theme: ThemeSupa }}
        redirectTo={
          (env.NEXT_PUBLIC_VERCEL_ENV === 'production'
            ? env.NEXT_PUBLIC_APP_URL
            : env.NEXT_PUBLIC_VERCEL_URL ?? env.NEXT_PUBLIC_APP_URL) + URLs.feed
        }
      />
    </>
  );
};
