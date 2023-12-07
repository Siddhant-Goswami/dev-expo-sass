'use client';
import GetInTouchModal from '@/components/ui/get-in-touch-modal';
import { useAuth } from '@/hooks/user/auth';
import Image from 'next/image';

type GetInTouchButtonProps = {
  displayName: string;
  devId: string;
  buttonVariant?: 'brand' | 'secondaryAction';
};

export const GetInTouchButton = ({
  displayName,
  devId,
  buttonVariant,
}: GetInTouchButtonProps) => {
  return (
    <div className="flex justify-center">
      <GetInTouchModal
        username={displayName}
        devId={devId}
        text="Get in Touch"
        roundedFull={true}
        buttonVariant={buttonVariant}
      />
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
  displayPictureUrl,
}: {
  projectUserId: string;
  userDisplayName: string;
  displayPictureUrl: string;
}) => {
  return (
    <IsNotSameUserWrapper projectUserId={projectUserId}>
      <div className="relative mt-6 flex w-full flex-col items-center justify-center gap-4 overflow-clip rounded-t-xl rounded-b-md bg-radial-gradient border-x border-t border-[#1F5D2B] p-10 pt-16">
        <div className="absolute h-1/4 w-1/4 rounded-full bg-green-600 bg-opacity-70 blur-[370.40px]"></div>
        <div className="flex w-full flex-col items-center justify-center gap-3 md:flex-row">
          <Image
            className="aspect-square h-16 w-16 rounded-full"
            width={100}
            height={100}
            src={displayPictureUrl}
            alt={userDisplayName}
          />
          <div className="px-2 text-center text-xl font-medium md:text-2xl">
            Hire {userDisplayName} for your next GenAI project
          </div>
        </div>
        <GetInTouchButton displayName={userDisplayName} devId={projectUserId} />
      </div>
    </IsNotSameUserWrapper>
  );
};
