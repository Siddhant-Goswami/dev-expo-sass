'use client';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/toggle';
import { URLs } from '@/lib/constants';

import {
  supabaseClientComponentClient,
  useUserSession,
} from '@/hooks/user/auth';
import Link from 'next/link';
import UserAuthButton from '../UserButton';

const NavBar = () => {
  const { session } = useUserSession();

  const supabase = supabaseClientComponentClient();

  const userId = session?.user?.id;
  const avatarUrl = session?.user?.identities?.[0]?.identity_data
    ?.avatar_url as unknown as string | null;

  return (
    <nav className="flex w-screen items-center justify-between bg-background px-6 py-4">
      <div className="flex w-full items-center justify-between space-x-4">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-semibold">
            Innov<span className="font-bold text-blue-600">AI</span>te
          </Link>
        </div>
        <div className="flex items-center gap-6">
          {userId ? (
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

          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
