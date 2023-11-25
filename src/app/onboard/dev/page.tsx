'use client';

import { Button } from '@/components/ui/button';
import { URLs } from '@/lib/constants';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

export default function Page() {
  return (
    <AnimatePresence>
      <motion.div className="relative flex min-h-[100vh] w-screen flex-col overflow-hidden bg-[#F2F3F5] sm:min-h-screen">
        <motion.svg
          style={{ filter: 'contrast(125%) brightness(110%)' }}
          className="fixed z-[1] h-full w-full opacity-[35%]"
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".7"
              numOctaves={3}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </motion.svg>
        <motion.main className="static z-[100] flex h-[90%] w-screen grid-rows-[1fr_repeat(3,auto)_1fr] flex-col justify-center overflow-hidden px-4 pb-[320px] pt-[30px] md:fixed md:px-20 md:py-0">
          <Link
            className="py-1.5 font-semibold leading-7 hover:underline focus:underline"
            href={'https://github.com/100x-Engineers/'}
          >
            100x Engineers
          </Link>

          <h1
            className="relative z-[100] text-[16vw] font-extrabold leading-[0.9] tracking-[-2px] text-[#1E2B3A] md:mb-[37px] md:ml-[-10px] md:text-[130px]"
            style={{ opacity: 1, transform: 'none' }}
          >
            Elevate Your
            <br />
            <span className="text-[#005CEB]">AI Creations.</span>
          </h1>
          <motion.div
            className="z-20 mx-0 mb-0 mt-8 flex max-w-2xl flex-row justify-center md:mb-[35px] md:mt-0 md:space-x-8"
            style={{ opacity: 1, transform: 'none' }}
          >
            <motion.div className="w-1/2">
              <h2 className="flex items-center text-[1em] font-semibold text-[#1a2b3b]">
                Platform
              </h2>
              <motion.p className="text-[14px] font-normal leading-[20px] text-[#1a2b3b]">
                Explore a world of AI projects and solutions at your fingertips.
              </motion.p>
            </motion.div>
            <motion.div className="w-1/2">
              <h2 className="flex items-center text-[1em] font-semibold text-[#1a2b3b]">
                Community
              </h2>
              <motion.p className="text-[14px] font-normal leading-[20px] text-[#1a2b3b]">
                Join a community of like-minded individuals, and learn from each
                other.
              </motion.p>
            </motion.div>
          </motion.div>
          <motion.div className="mt-8 flex gap-[15px] md:mt-0">
            {/* <motion.div style={{ opacity: 1, transform: 'none' }}>
            <a
              target="_blank"
              className="hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] group flex flex min-w-[180px] scale-100 items-center justify-center gap-x-2 rounded-full bg-[#1E2B3A] py-2 pl-[8px] pr-4 text-[13px] font-semibold text-white no-underline  transition-all duration-75 active:scale-95"
              style={{
                boxShadow:
                  '0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)',
              }}
              href="https://github.com/100x-Engineers"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#407BBF]">
                <svg
                  className="h-[16px] w-[16px] text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.75 7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H6.75C5.64543 18.25 4.75 17.3546 4.75 16.25V7.75Z"
                  />
                  <motion.path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.5 6.5L12 12.25L18.5 6.5"
                  />
                </svg>
              </span>
              Star on Github
            </a>
          </motion.div> */}

            <Button asChild variant={'default'} className="">
              <Link href={URLs.onboardDev}>
                Get started
                <span className="ml-3">&rarr;</span>
              </Link>
            </Button>

            {/* <motion.div style={{ opacity: 1, transform: 'none' }}>
            <a
              className="group flex scale-100 items-center justify-center rounded-full bg-[#f5f7f9] px-4 py-2 text-[13px] font-semibold text-[#1E2B3A] no-underline transition-all duration-75 active:scale-95"
              style={{ boxShadow: '0 1px 1px #0c192714, 0 1px 3px #0c192724' }}
              href="/demo"
            >
              <span className="mr-2"> Try it out </span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M13.75 6.75L19.25 12L13.75 17.25"
                  stroke="#1E2B3A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <motion.path
                  d="M19 12H4.75"
                  stroke="#1E2B3A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            B
          </motion.div> */}
          </motion.div>
        </motion.main>
        <motion.div
          className="fixed right-0 top-0 h-screen w-[80%] bg-blue-200 md:w-1/2"
          style={{
            clipPath:
              'polygon(100px 0,100% 0,calc(100% + 225px) 100%, 480px 100%)',
          }}
        />
        {/* <canvas
          style={{
            clipPath:
              'polygon(100px 0px, 100% 0px, calc(100% + 225px) 100%, 480px 100%)',
            filter: 'blur(0px)',
          }}
          id="gradient-canvas"
          data-transition-in="true"
          className="fixed right-[-2px] top-0 z-50 h-screen w-[80%] bg-[#0b3b89] md:w-1/2"
          width={1000}
          height={600}
        /> */}
      </motion.div>
    </AnimatePresence>
  );
}
