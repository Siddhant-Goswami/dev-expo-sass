'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProjectUpload } from '@/components/ui/project-upload';
import { useAuth } from '@/hooks/user/auth';
import { useState } from 'react';

type ProjectUploadModalProps = {
  children: React.ReactNode;
};

function ProjectUploadModal({ children }: ProjectUploadModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userId } = useAuth();

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{userId && children}</DialogTrigger>
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
