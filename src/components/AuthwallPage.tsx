import { URLs } from '@/lib/constants';
import Link from 'next/link';
import { UserAuthForm } from './AuthForm';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import NavBar from './ui/navbar';

export default function AuthwallPage(props: { redirectAfterSignin?: string }) {
  return (
    <>
      <NavBar />
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <h2 className="text-lg font-medium">Get Started</h2>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <UserAuthForm redirectAfterSignin={props.redirectAfterSignin}/>
              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{' '}
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
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
