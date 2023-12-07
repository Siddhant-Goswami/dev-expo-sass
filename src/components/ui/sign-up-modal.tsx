'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/user/auth';
import { URLs } from '@/lib/constants';
import Link from 'next/link';
import { UserAuthForm } from '../AuthForm';

type SignInModalProps = {
  children: React.ReactNode;
  redirectAfterSignin?: string;
};

function AuthwallWrapper({ children, redirectAfterSignin }: SignInModalProps) {
  const { userId } = useAuth();

  return (
    <Dialog>
      {userId ? children : <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="h-screen w-full overflow-scroll md:h-max md:max-w-md">
        <DialogHeader>
          <DialogTitle>Get Started</DialogTitle>
          <DialogDescription>
            Sign in with your Github or Google account.
          </DialogDescription>
        </DialogHeader>

        <UserAuthForm redirectAfterSignin={redirectAfterSignin} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          By proceeding, you agree to our{' '}
          <Link
            href={URLs.termsOfService}
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href={URLs.privacyPolicy}
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default AuthwallWrapper;
