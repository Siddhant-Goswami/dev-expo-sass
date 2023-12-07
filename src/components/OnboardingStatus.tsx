import { URLs } from '@/lib/constants';
import { type DevApplicationStatus } from '@/lib/validations/user';
import { cn } from '@/utils/cn';
import {
  LucideCheckCircle2,
  LucideCircleOff,
  LucideShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from './ui/button';

export default function OnboardingStatus(props: {
  onboardingStatus: DevApplicationStatus;
}) {
  const devStatus = props.onboardingStatus;

  return (
    <div className="mx-auto mt-10 flex min-h-[70vh] max-w-3xl flex-col items-center">
      {
        {
          pending: (
            <LucideCheckCircle2
              size={50}
              className="fill-emerald-100 stroke-emerald-600 dark:fill-emerald-800 dark:stroke-emerald-300"
            />
          ),

          rejected: (
            <LucideCircleOff
              size={50}
              className="fill-red-100 stroke-red-600 dark:fill-red-800 dark:stroke-red-300"
            />
          ),

          approved: (
            <LucideShieldCheck
              size={50}
              className="fill-emerald-100 stroke-emerald-600 dark:fill-emerald-800 dark:stroke-emerald-300"
            />
          ),
        }[devStatus]
      }

      <h1 className="mt-7 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        {
          {
            pending: 'Application Submitted!',
            rejected: 'Application Rejected!',
            approved: 'Application Approved!',
          }[devStatus]
        }
      </h1>

      {
        {
          pending: (
            <>
              <p className="text-center leading-7 [&:not(:first-child)]:mt-6">
                Thank you for submitting your application. We will be in touch
                with you shortly.
                <br />
                Till then, you can follow us on{' '}
                <Link
                  href={`https://twitter.com/100xengineers`}
                  className={cn(
                    buttonVariants({
                      variant: 'link',
                      className: 'pl-1 pr-0 text-lg font-semibold',
                    }),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  𝕏
                </Link>
                .
              </p>
            </>
          ),

          approved: (
            <>
              <p className="text-center leading-7 [&:not(:first-child)]:mt-6">
                Congratulations! Your application has been approved.
                <br />
                You can now publish your projects and get recognized all over
                the world.
              </p>

              <Link
                href={URLs.create}
                className={cn(
                  buttonVariants({ variant: 'brand', className: 'mt-6' }),
                )}
              >
                Publish now
              </Link>
            </>
          ),

          rejected: (
            <>
              <p className="text-center leading-7 [&:not(:first-child)]:mt-6">
                We are sorry to inform you that your application was rejected.
                <br />
                You can try harder and apply again after 6 weeks.
              </p>

              <Link
                href={URLs.feed}
                className={cn(
                  buttonVariants({ variant: 'brand', className: 'mt-6' }),
                )}
              >
                &larr;
                <span className="ml-[1ch]">Go back</span>
              </Link>
            </>
          ),
        }[devStatus]
      }

      {
        {
          pending: (
            <Image
              src={'https://illustrations.popsy.co/white/shaking-hands.svg'}
              width={500}
              height={500}
              className="w-72 dark:invert"
              alt="Success iamge"
            />
          ),

          approved: (
            <Image
              src={'https://illustrations.popsy.co/white/app-launch.svg'}
              width={500}
              height={500}
              className="w-72 dark:invert"
              alt="Approved iamge"
            />
          ),

          rejected: (
            <Image
              src={'https://illustrations.popsy.co/amber/resistance-band.svg'}
              width={500}
              height={500}
              className="w-72 dark:invert"
              alt="Rejected iamge"
            />
          ),
        }[devStatus]
      }
    </div>
  );
}
