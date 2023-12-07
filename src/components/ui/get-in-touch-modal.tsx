'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { GetInTouch } from './reachouts';

type GetInTouchModalProps = {
  username?: string;
  text?: string;
  roundedFull?: boolean;
  devId: string;
  buttonVariant?: 'brand' | 'secondaryAction';
};

function GetInTouchModal({
  username,
  text,
  roundedFull,
  devId,
  buttonVariant,
}: GetInTouchModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant ?? 'brand'}
          className={roundedFull ? '' : 'rounded-sm'}
        >
          {text}
        </Button>
      </DialogTrigger>
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
