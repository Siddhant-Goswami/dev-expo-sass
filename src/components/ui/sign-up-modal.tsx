import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import SignUp from '@/components/ui/sign-up';

function SignUpModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-10 p-6">
          Get Started Now
        </Button>
      </DialogTrigger>
      <DialogContent className="h-screen min-w-full overflow-scroll md:h-screen-3/4 md:min-w-50">
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
