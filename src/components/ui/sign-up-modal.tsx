import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import SignUp from '@/components/ui/sign-up';

type SignUpModalProps = {
  children: React.ReactNode;
};

function SignUpModal({ children }: SignUpModalProps) {
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
        <SignUp />
      </DialogContent>
    </Dialog>
  );
}

export default SignUpModal;
