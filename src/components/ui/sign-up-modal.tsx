import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserAuthForm } from '../AuthForm';

type SignInModalProps = {
  children: React.ReactNode;
};

function SignInModal({ children }: SignInModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-screen w-full overflow-scroll md:h-max md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Get Started</DialogTitle>
          <DialogDescription>
            Sign in with your Github or Google account.
          </DialogDescription>
        </DialogHeader>
        <UserAuthForm />
      </DialogContent>
    </Dialog>
  );
}

export default SignInModal;
