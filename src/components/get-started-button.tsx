'use client';

import { useAuth } from '@/hooks/user/auth';
import ShimmerButton from './magicui/shimmer-button';
import SignInModal from './ui/sign-up-modal';

function GetStartedButton({ fallback }: { fallback: React.ReactNode }) {
  const { userId } = useAuth();
  return userId ? (
    fallback
  ) : (
    <SignInModal>
      <ShimmerButton className="mt-10 px-6 font-medium">
        Get Started Now
      </ShimmerButton>
      {/* <Button variant="brand" className="mt-10 p-6">
        Get Started Now
      </Button> */}
    </SignInModal>
  );
}

export default GetStartedButton;
