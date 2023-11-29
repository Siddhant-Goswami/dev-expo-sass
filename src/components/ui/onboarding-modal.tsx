'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { OnboardingSteps } from '@/components/ui/onboarding-steps';
import { useState } from 'react';

type OnboardUserProps = {
  children: React.ReactNode;
};

function OnboardUser({ children }: OnboardUserProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="md:max-h-3/4 h-screen min-w-full overflow-scroll md:h-max md:min-w-50">
        <DialogHeader>
          <DialogTitle>Get Verified</DialogTitle>
          <DialogDescription>
            Get verified to upload projects and showcase your work to the
            community.
          </DialogDescription>
        </DialogHeader>
        <OnboardingSteps />
      </DialogContent>
    </Dialog>
  );
}

export default OnboardUser;
