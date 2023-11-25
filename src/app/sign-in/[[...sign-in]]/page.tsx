'use client';

import { supabaseClientComponentClient } from '@/hooks/user/auth';
import { URLs } from '@/lib/constants';
import { Auth } from '@supabase/auth-ui-react';
import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared';
import { LucideTerminal } from 'lucide-react';
import Link from 'next/link';

// async function handleGithubSignin() {
//   'use server';

//   const supabase = createClient(cookies());

//   const sesh = await supabase.auth.getSession();
//   console.log({ sesh });

//   const githubResult = await supabase.auth.signInWithOAuth({
//     provider: 'github',
//   });

//   const redirectUrl = githubResult.data.url;

//   if (!redirectUrl) {
//     throw new Error('No redirect URL');
//   }

//   redirect(redirectUrl);
// }

export default function Page() {
  return (
    <>
      <div className="container relative grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            style={{
              backgroundImage:
                "url('https://img.freepik.com/free-vector/gradient-network-connection-background_23-2148871843.jpg')",
            }}
            className="absolute inset-0 bg-zinc-900 bg-cover bg-center bg-no-repeat"
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <LucideTerminal className="mr-2 h-6 w-6" />
            Dev Expo
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Nulla, odio tempore incidunt facilis quis fuga rerum! Impedit
                ipsa tenetur quaerat recusandae sapiente.&rdquo;
              </p>
              <footer className="text-sm">Lorem Ipsum</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-80">
            {/* <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your email below to create your account
              </p>
            </div> */}
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

  // Apply predefined theme
  return (
    <Auth
      supabaseClient={supabase}
      providers={['github', 'google']}
      appearance={{ theme: ThemeSupa }}
    />
  );
};
