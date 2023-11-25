import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/toggle';
import { UserButton, auth } from '@clerk/nextjs';
import Link from 'next/link';

const NavBar = () => {
  const { userId } = auth();

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
            <UserButton />
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost">Log In</Button>
              <Button>Sign Up</Button>
            </div>
          )}

          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
