import Link from 'next/link';
import Logo100xTalents from './ui/logo';

export default function NewFooter() {
  return (
    <>
      <footer className="m-1 rounded-lg bg-white shadow dark:bg-gray-900">
        <div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
          <div className="flex flex-col gap-y-4 sm:items-center sm:justify-between lg:flex-row">
            <Link href="/" className="text-2xl font-semibold">
              <Logo100xTalents />
            </Link>

            <ul className="mb-6 flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:mb-0">
              <li></li>
              <li>
                <a
                  href="/privacy-policy"
                  className="me-4 hover:underline md:me-6"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="/terms-and-conditions" className="hover:underline">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
          <span className="flex items-center justify-center py-2">
            <span className="text-sm text-accent-foreground">
              © {new Date().getFullYear()}{' '}
              <Link
                href="https://100xengineers.com/"
                className="font-semibold text-brand"
              >
                100xTalent
              </Link>{' '}
              by Codible Ventures LLP
            </span>
          </span>
        </div>
      </footer>
    </>
  );
}
