'use client';

import { URLs } from '@/lib/constants';
import { Button, ButtonVariant } from './ui/button';

import SignUpModal from './ui/sign-up-modal';
import Link from 'next/link';
import { useAuth } from '@/hooks/user/auth';

function GetStartedButton({ fallback }: { fallback: React.ReactNode }) {
  const { userId } = useAuth();
  return userId ? (
    fallback
  ) : (
    <SignUpModal>
      <Button variant="brand" className="mt-10 p-6">
        Get Started Now
      </Button>
    </SignUpModal>
  );
}

export default GetStartedButton;
