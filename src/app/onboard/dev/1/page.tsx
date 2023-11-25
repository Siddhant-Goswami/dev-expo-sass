'use client';

import { OnboardingSteps } from '@/components/ui/onboarding-steps';
import { URLs } from '@/lib/constants';
import { LucideTerminal } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <div className="container relative flex min-h-screen flex-row items-center justify-center lg:max-w-none lg:px-0">
        <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 lg:p-8">
          {/* <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your email below to create your account
              </p>
            </div> */}

          <OnboardingSteps
            buttonText="Next"
            onClickNext={() => console.log('Next')}
            title="What is your skill level?"
            skillLevels={[
              { id: 'beginner', label: 'Beginner' },
              { id: 'intermediate', label: 'Intermediate' },
              { id: 'experienced', label: 'Experienced' },
            ]}
            defaultSkillLevel="beginner"
          />

          <OnboardingSteps
            buttonText="Next"
            onClickNext={() => console.log('Next')}
            title="What is your skill level?"
            skillLevels={[
              { id: 'beginner', label: 'Beginner' },
              { id: 'intermediate', label: 'Intermediate' },
              { id: 'experienced', label: 'Experienced' },
            ]}
            defaultSkillLevel="beginner"
          />

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

        <div className="bg-balck relative hidden h-screen min-h-full max-w-lg grow flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
            className="absolute inset-0 bg-zinc-900 bg-cover bg-center bg-no-repeat opacity-90"
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <LucideTerminal className="mr-2 h-6 w-6" />
            Dev Expo
          </div>
          <div className="relative z-20 mt-auto opacity-0">
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
      </div>
    </>
  );
}
