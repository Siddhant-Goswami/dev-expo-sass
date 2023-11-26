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

function ProjectUploadModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="mt-10 p-6">
          Get Started Now
        </Button>
      </DialogTrigger>
      <DialogContent className="h-screen min-w-full overflow-scroll md:h-screen-3/4 md:min-w-50">
        <DialogHeader>
          <DialogTitle>Upload Project</DialogTitle>
          <DialogDescription>
            Add and showcase your project to the community.
          </DialogDescription>
        </DialogHeader>
        <ProjectUpload />
      </DialogContent>
    </Dialog>
  );
}

export default ProjectUploadModal;
