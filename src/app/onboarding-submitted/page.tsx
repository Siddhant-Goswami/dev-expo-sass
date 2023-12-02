import { buttonVariants } from '@/components/ui/button';
import Footer from '@/components/ui/footer';
import NavBar from '@/components/ui/navbar';
import { cn } from '@/utils/cn';
import { LucideCheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <NavBar />

      <div className="mx-auto mt-10 flex min-h-[70vh] max-w-3xl flex-col items-center">
        <LucideCheckCircle2
          size={50}
          className="fill-emerald-100 stroke-emerald-600"
        />

        <h1 className="mt-7 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
          Application Submitted!
        </h1>
        <p className="text-center leading-7 [&:not(:first-child)]:mt-6">
          Thank you for submitting your application. We will be in touch with
          you shortly.
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

        <Image
          src={'https://illustrations.popsy.co/teal/shaking-hands.svg'}
          width={500}
          height={500}
          className="w-72"
          alt="Success iamge"
        />
      </div>
      <Footer />
    </>
  );
}
