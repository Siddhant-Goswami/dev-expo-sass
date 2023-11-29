'use client';

import { supabaseClientComponentClient } from '@/hooks/user/auth';
import { URLs } from '@/lib/constants';
import { Auth } from '@supabase/auth-ui-react';
import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared';
import Link from 'next/link';

export default function SignUp() {
  return (
    <>
      <div className="">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-60">
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <Link
                href={URLs.termsOfService}
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href={URLs.privacyPolicy}
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const UserAuthForm = () => {
  const supabase = supabaseClientComponentClient();

  return (
    <>
      <Auth
        onlyThirdPartyProviders
        supabaseClient={supabase}
        providers={['github', 'google']}
        appearance={{ theme: ThemeSupa }}
        redirectTo="https://dev-expo-sass.vercel.app/feed"
      />
    </>
  );
};
