'use client';

import { UserAuthForm } from '@/components/AuthForm';
import NavBar from '@/components/ui/navbar';
import { URLs } from '@/lib/constants';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <NavBar />
      <div className="container relative grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
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
