import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProjectUpload } from '@/components/ui/project-upload';
import { GetInTouch } from './get-in-touch';

function GetInTouchModal() {
  const userName = 'Rishabh';
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="rounded-xl">
          Get in touch
        </Button>
      </DialogTrigger>
      <DialogContent className="p- h-screen min-w-full overflow-scroll md:h-screen-3/4 md:min-w-50">
        <DialogHeader>
          <DialogTitle>Message {userName}</DialogTitle>
        </DialogHeader>
        <GetInTouch />
      </DialogContent>
    </Dialog>
  );
}

export default GetInTouchModal;
