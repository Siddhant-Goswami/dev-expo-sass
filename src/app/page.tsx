import { Button } from '@/components/ui/button';
import { URLs } from '@/lib/constants';
import { UserButton, currentUser } from '@clerk/nextjs';
import Link from 'next/link';

export default async function HomePage() {
  const user = await currentUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        {user ? (
          <>
            <p>Hello {user?.username ?? user?.firstName ?? 'No name??'}!</p>
            {user.externalAccounts?.[0]?.provider === 'oauth_github' && (
              <Link href={`https://github.com/${user?.username}`}>
                Your Github
              </Link>
            )}
          </>
        ) : (
          <Link href={URLs.signIn}>
            <Button>Sign in</Button>
          </Link>
        )}

        <UserButton />
      </div>
    </main>
  );
}
