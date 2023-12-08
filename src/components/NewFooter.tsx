'use client';

import { URLs } from '@/lib/constants';
import { LucideInstagram } from 'lucide-react';
import Link from 'next/link';

export default function NewFooter() {
  return (
    <>
      <footer className="mx-auto flex w-full max-w-6xl justify-center py-20">
        <div className="mx-auto flex flex-col items-center justify-start gap-y-4 px-20 lg:w-full lg:flex-row lg:justify-between">
          <div className="flex w-max flex-col items-center justify-between gap-4 md:flex-row">
            <div className="inline-flex flex-col items-end justify-center py-[7px] pl-px">
              <div className=" text-xl font-medium text-brand">
                OverpoweredJobs
              </div>
              <div className=" text-sm font-medium text-zinc-100 ">
                by{' '}
                <Link
                  href={URLs._100xengineers}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {' '}
                  100xEngineers{' '}
                </Link>
              </div>
            </div>
            <div className="text-sm font-medium text-white">
              Codible Ventures LLP © {new Date().getFullYear()}
              <br />
              <Link href={URLs.termsOfService} className="hover:underline">
                Terms & Conditions{' '}
              </Link>
              ・{' '}
              <Link href={URLs.privacyPolicy} className="hover:underline">
                Privacy
              </Link>
            </div>
          </div>
          <div className="flex items-start justify-start gap-[9px]">
            <Link href={URLs.x} target="_blank" rel="noopener noreferrer">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800 p-1">
                <div className="relative flex h-6 w-6 flex-col items-center justify-center text-center text-2xl text-white">
                  𝕏
                </div>
              </div>
            </Link>
            <Link
              href={URLs.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800 p-1">
                <div className="relative flex h-6 w-6 flex-col items-start justify-start">
                  <LucideInstagram className=" stroke-white" />
                </div>
              </div>
            </Link>
            <Link href={URLs.youtube} target="_blank" rel="noopener noreferrer">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800 p-1">
                <div className="relative flex h-6 w-6 flex-col items-start justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <g id="mdi:youtube">
                      <path
                        id="Vector"
                        d="M10.5 15L15.69 12L10.5 9V15ZM22.06 7.17C22.19 7.64 22.28 8.27 22.34 9.07C22.41 9.87 22.44 10.56 22.44 11.16L22.5 12C22.5 14.19 22.34 15.8 22.06 16.83C21.81 17.73 21.23 18.31 20.33 18.56C19.86 18.69 19 18.78 17.68 18.84C16.38 18.91 15.19 18.94 14.09 18.94L12.5 19C8.31 19 5.7 18.84 4.67 18.56C3.77 18.31 3.19 17.73 2.94 16.83C2.81 16.36 2.72 15.73 2.66 14.93C2.59 14.13 2.56 13.44 2.56 12.84L2.5 12C2.5 9.81 2.66 8.2 2.94 7.17C3.19 6.27 3.77 5.69 4.67 5.44C5.14 5.31 6 5.22 7.32 5.16C8.62 5.09 9.81 5.06 10.91 5.06L12.5 5C16.69 5 19.3 5.16 20.33 5.44C21.23 5.69 21.81 6.27 22.06 7.17Z"
                        fill="white"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </Link>
            <Link href="mailto:overpoweredjobs@100xengineers.com">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800 p-1">
                <div className="relative flex h-6 w-6 flex-col items-start justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <g id="ic:baseline-email">
                      <path
                        id="Vector"
                        d="M20.5 4H4.5C3.4 4 2.51 4.9 2.51 6L2.5 18C2.5 19.1 3.4 20 4.5 20H20.5C21.6 20 22.5 19.1 22.5 18V6C22.5 4.9 21.6 4 20.5 4ZM20.5 8L12.5 13L4.5 8V6L12.5 11L20.5 6V8Z"
                        fill="white"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
