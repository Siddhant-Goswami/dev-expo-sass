'use client';

import { Button } from '@/components/ui/button';
import ProjectUploadModal from '@/components/ui/project-upload-modal';
import { ThemeToggle } from '@/components/ui/toggle';
import { useAuth } from '@/hooks/user/auth';
import { URLs } from '@/lib/constants';
import Link from 'next/link';
import UserAuthButton from '../UserAuthButton';

const NavBar = () => {
  const { session, isLoaded } = useAuth();
  // const supabase = supabaseClientComponentClient();
  const userId = session?.user?.id;

  console.log('session', session?.user);

  return (
    <nav className="flex w-screen items-center justify-between bg-background px-6 py-4">
      <div className="flex w-full items-center justify-between space-x-4">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-semibold">
            Innov<span className="font-bold text-blue-600">AI</span>te
          </Link>
        </div>
        <div className="flex h-10 items-center gap-6">
          {userId && isLoaded && (
            <div className="flex items-center gap-4">
              <ProjectUploadModal />
              <UserAuthButton />
            </div>
          )}

          {!userId && isLoaded && (
            <Link href={URLs.signIn}>
              <Button>Get Started</Button>
            </Link>
          )}

          {!isLoaded && !userId && (
            <span className="inline-block aspect-square h-9 w-9 animate-pulse rounded-full bg-gray-300"></span>
          )}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
