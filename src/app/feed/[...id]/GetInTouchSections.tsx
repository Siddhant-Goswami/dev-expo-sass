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

  return userId ? (
    <GetInTouchModal username={displayName} text="Get in Touch" />
  ) : (
    <SignUpModal>
      <Button variant="brand" className="mt-10 p-6">
        Login in To Get in Touch
      </Button>
    </SignUpModal>
  );
};

export const IsSameUserWrapper = ({
  projectUserId,
  children,
}: {
  projectUserId: string;
  children: React.ReactNode;
}) => {
  const { userId } = useAuth();
  const isSameUser = projectUserId === userId;
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
    <IsSameUserWrapper projectUserId={projectUserId}>
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
    </IsSameUserWrapper>
  );
};
