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
import { useState } from 'react';

function ProjectUploadModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-sm">
          Upload Project
        </Button>
      </DialogTrigger>
      <DialogContent className="h-screen min-w-full overflow-scroll md:h-screen-3/4 md:min-w-50">
        <DialogHeader>
          <DialogTitle>Upload Project</DialogTitle>
          <DialogDescription>
            Add and showcase your project to the community.
          </DialogDescription>
        </DialogHeader>
        <ProjectUpload setIsModalOpen={setIsModalOpen} />
      </DialogContent>
    </Dialog>
  );
}

export default ProjectUploadModal;
