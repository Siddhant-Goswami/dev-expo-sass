'use client';

import { useAuth } from '@/hooks/user/auth';
import ShimmerButton from './magicui/shimmer-button';
import SignUpModal from './ui/sign-up-modal';

function GetStartedButton({ fallback }: { fallback: React.ReactNode }) {
  const { userId } = useAuth();
  return userId ? (
    fallback
  ) : (
    <SignUpModal>
      <ShimmerButton className="mt-10 px-6 font-medium">
        Get Started Now
      </ShimmerButton>
      {/* <Button variant="brand" className="mt-10 p-6">
        Get Started Now
      </Button> */}
    </SignUpModal>
  );
}

export default GetStartedButton;
