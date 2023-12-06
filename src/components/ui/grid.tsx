import ProjectCard from '@/components/ui/project-card';
import { URLs } from '@/lib/constants';
import { type getAllProjects } from '@/server/actions/projects';
import Link from 'next/link';

type ProjectData = {
  id: number;
  title: string;
  displayName: string;
  likesCount?: number;
} & Pick<Awaited<ReturnType<typeof getAllProjects>>[number], 'tags' | 'media'>;

type GridProps = {
  projects: ProjectData[];
};

function Grid({ projects }: GridProps) {
  return (
    <div className="flex h-max w-full flex-wrap items-start justify-center gap-6 xl:gap-x-10 [&>*:nth-child(7)]:hidden sm:[&>*:nth-child(7)]:block [&>*:nth-child(8)]:hidden sm:[&>*:nth-child(8)]:block">
      {projects.map((project) => (
        <Link
          href={URLs.projectPage(project.id.toString())}
          key={project.id}
          className="h-max w-max"
        >
          <ProjectCard
            projectId={project.id}
            projectName={project.title}
            creator={project.displayName}
            tags={project.tags}
            media={project.media}
            likes={project.likesCount}
          />
        </Link>
      ))}
    </div>
  );
}

export default Grid;
