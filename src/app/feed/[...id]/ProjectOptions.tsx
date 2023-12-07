'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { URLs } from '@/lib/constants';
import { deleteProject } from '@/server/actions/projects';
import { LucideMoreVertical, LucideTrash } from 'lucide-react';
import { useRouter } from 'next/navigation';

function ProjectOptions({ projectId }: { projectId: number }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Button variant={'ghost'}>
          <LucideMoreVertical size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            try {
              await deleteProject(projectId);
              toast({
                title: 'Project Deleted successfully',
                variant: 'default',
              });
              // router.push(URLs.feed);
            } catch (error) {
              toast({
                title: 'Could not delete project',
                variant: 'destructive',
              });
            } finally {
              window.location.href = URLs.feed;
            }
          }}
        >
          <LucideTrash className="mr-2" size={18} stroke="red" />
          <span className="text-red-500">Delete Project</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProjectOptions;
