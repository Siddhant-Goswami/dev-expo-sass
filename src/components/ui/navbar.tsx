'use client';

import { Button } from '@/components/ui/button';
import { URLs } from '@/lib/constants';

import { supabaseClientComponentClient, useAuth } from '@/hooks/user/auth';
import Link from 'next/link';
import UserAuthButton from '../UserAuthButton';

const NavBar = () => {
  const { session, isLoaded } = useAuth();

  const supabase = supabaseClientComponentClient();

  const userId = session?.user?.id;

  return (
    <nav className="flex w-screen items-center justify-between bg-background px-6 py-4">
      <div className="flex w-full items-center justify-between space-x-4">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-semibold">
            Innov<span className="font-bold text-blue-600">AI</span>te
          </Link>
        </div>
        <div className="flex h-10 items-center gap-6">
          {!isLoaded ? (
            <span className="inline-block aspect-square h-9 w-9 animate-pulse rounded-full bg-gray-300"></span>
          ) : // <LucideLoader className="animate-spin" />
          userId ? (
            <UserAuthButton />
          ) : (
            <div className="flex items-center gap-2">
              <Link href={URLs.signIn}>
                <Button>Sign In</Button>
              </Link>

              <Button
                onClick={async () => {
                  console.log(`Signing out...`);
                  const { error } = await supabase.auth.signOut();

                  if (error) {
                    alert(error.message);
                  }
                }}
              >
                Sign out
              </Button>

              <Link href={URLs.signUp}>
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}

          {/* <ThemeToggle /> */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
