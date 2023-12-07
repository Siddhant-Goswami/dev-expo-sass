'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/user/auth';
import { URLs } from '@/lib/constants';
import { useState } from 'react';
import { GetInTouch } from './reachouts';
import AuthwallWrapper from './sign-up-modal';

type GetInTouchModalProps = {
  username?: string;
  text?: string;
  roundedFull?: boolean;
  devId: string;
  buttonVariant?: 'brand' | 'secondaryAction';
  projectId: number;
};

function GetInTouchModal({
  username,
  text,
  roundedFull,
  devId,
  projectId,
  buttonVariant,
}: GetInTouchModalProps) {
  const { userId } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      {userId ? (
        <DialogTrigger asChild>
          <Button
            variant={buttonVariant ?? 'brand'}
            className={roundedFull ? '' : 'rounded-sm'}
          >
            {text}
          </Button>
        </DialogTrigger>
      ) : (
        <AuthwallWrapper
          redirectAfterSignin={URLs.projectPage(projectId.toString())}
        >
          <Button
            variant={buttonVariant ?? 'brand'}
            className={roundedFull ? '' : 'rounded-sm'}
          >
            {text}
          </Button>
        </AuthwallWrapper>
      )}
      <DialogContent className="h-screen min-w-full overflow-scroll md:h-max md:min-w-50">
        <DialogHeader>
          <DialogTitle>Message {username}</DialogTitle>
        </DialogHeader>
        <GetInTouch setIsModalOpen={setIsModalOpen} devId={devId} />
      </DialogContent>
    </Dialog>
  );
}

export default GetInTouchModal;
