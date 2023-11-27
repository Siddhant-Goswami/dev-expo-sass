import ProjectCard from '@/components/ui/project-card';
import { type getAllProjects } from '@/server/actions/projects';
import Link from 'next/link';

type ProjectData = {
  id: number;
  title: string;
  coverImageUrl: string;
  displayName: string;
} & Pick<Awaited<ReturnType<typeof getAllProjects>>[number], 'tags' | 'media'>;

type GridProps = {
  data: ProjectData[];
};

function Grid({ data }: GridProps) {
  return (
    <div className="flex h-max w-full flex-wrap items-center justify-center gap-6 xl:gap-x-10 [&>*:nth-child(7)]:hidden sm:[&>*:nth-child(7)]:block [&>*:nth-child(8)]:hidden sm:[&>*:nth-child(8)]:block">
      {data.map((project) => (
        <Link
          href={`/feed/${project.id}`}
          key={project.id}
          className="h-max w-max"
        >
          <ProjectCard
            projectName={project.title}
            creator={project.displayName}
            tags={project.tags}
            media={project.media}
          />
        </Link>
      ))}
    </div>
  );
}

export default Grid;
