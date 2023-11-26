import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GetInTouch } from './get-in-touch';

type GetInTouchModalProps = {
  username?: string;
  text?: string;
  roundedFull?: boolean;
};

function GetInTouchModal({
  username,
  text,
  roundedFull,
}: GetInTouchModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className={roundedFull ? '' : 'rounded-xl'}>
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent className="p- h-screen min-w-full overflow-scroll md:h-screen-3/4 md:min-w-50">
        <DialogHeader>
          <DialogTitle>Message {username}</DialogTitle>
        </DialogHeader>
        <GetInTouch />
      </DialogContent>
    </Dialog>
  );
}

export default GetInTouchModal;
