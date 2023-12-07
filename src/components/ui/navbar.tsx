'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import SignInModal from '@/components/ui/sign-up-modal';
import { useAuth } from '@/hooks/user/auth';
import { URLs } from '@/lib/constants';
import { cn } from '@/utils/cn';
import { LucidePlus } from 'lucide-react';
import Link from 'next/link';
import UserAuthButton from '../UserAuthButton';
import Logo from './new-logo';

const NavBar = () => {
  const { session, isLoaded } = useAuth();

  // const supabase = supabaseClientComponentClient();
  const userId = session?.user?.id;

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between bg-background/30 px-6 py-4 backdrop-blur-md md:px-10">
      <div className="flex w-full items-center justify-between space-x-4">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-semibold">
            <Logo />
          </Link>
        </div>
        <div className="flex h-10 items-center gap-6">
          {userId && isLoaded && (
            <div className="flex items-center gap-4">
              <Link
                className={cn(
                  buttonVariants({
                    variant: 'outline',
                    className:
                      'border-brand text-brand hover:bg-brand hover:text-black',
                  }),
                )}
                href={URLs.create}
              >
                <LucidePlus className="w-4 md:mr-2" />
                <span className="hidden md:block">Create Project</span>
              </Link>
              <UserAuthButton />
            </div>
          )}

          {!userId && isLoaded && (
            <SignInModal>
              <Button variant="secondary">Sign In</Button>
            </SignInModal>
          )}

          {!isLoaded && !userId && (
            <span className="inline-block aspect-square h-9 w-9 animate-pulse rounded-full bg-gray-300"></span>
          )}

          {/* <ThemeToggle /> */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
