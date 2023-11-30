'use client';
import { Button } from '@/components/ui/button';
import GetInTouchModal from '@/components/ui/get-in-touch-modal';
import SignUpModal from '@/components/ui/sign-up-modal';
import { useAuth } from '@/hooks/user/auth';

type GetInTouchButtonProps = {
  displayName: string;
};

export const GetInTouchButton = ({ displayName }: GetInTouchButtonProps) => {
  const { userId } = useAuth();

  return (
    <div className="flex justify-center">
      {userId ? (
        <GetInTouchModal username={displayName} text="Get in Touch" />
      ) : (
        <SignUpModal>
          <Button variant="brand" className="w-fit">
            Login To Get in Touch
          </Button>
        </SignUpModal>
      )}
    </div>
  );
};

export const IsNotSameUserWrapper = ({
  projectUserId,
  children,
}: {
  projectUserId: string;
  children: React.ReactNode;
}) => {
  const { userId } = useAuth();
  const isSameUser = projectUserId !== userId;
  return isSameUser && children;
};

export const GetInTouchSection = ({
  projectUserId,
  userDisplayName,
}: {
  projectUserId: string;
  userDisplayName: string;
}) => {
  return (
    <IsNotSameUserWrapper projectUserId={projectUserId}>
      <div className="mt-6 flex w-full flex-col items-center justify-center border-t border-gray-500 py-8">
        <h3 className="text-xl font-medium">
          {' '}
          Liked {userDisplayName}'s work??{' '}
        </h3>
        <p className="mb-4 mt-2 text-sm">
          Get in touch with {userDisplayName} to discuss your project.
        </p>
      </div>
      <GetInTouchButton displayName={userDisplayName} />
    </IsNotSameUserWrapper>
  );
};
