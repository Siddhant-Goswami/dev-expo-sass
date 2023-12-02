import { type getAllProjects } from '@/server/actions/projects';
import Image from 'next/image';

type ProjectCardProps = {
  projectName: string;
  creator: string;
} & Pick<Awaited<ReturnType<typeof getAllProjects>>[number], 'tags' | 'media'>;

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectName,
  creator,
  tags,
  media,
}) => {
  const visibleTags = tags.slice(0, 3);

  return (
    <div className="rounded-sm">
      <div className="relative h-64 w-80 overflow-hidden rounded-sm sm:h-56 sm:w-72">
        <Image
          // fill={true}
          width={1000}
          height={1000}
          src={
            (media?.[0]?.type === 'image' ? media?.[0]?.url : null) ??
            'https://images.unsplash.com/photo-1597484661973-ee6cd0b6482c?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          alt="demo"
          className="h-full w-full object-fill transition-all duration-200 group-hover:brightness-105"
        />
      </div>

      <div className="px-2 pb-2 pt-1.5">
        <h2 className="h-6 w-full text-lg font-semibold">{projectName}</h2>
        <div className="mt-1 flex flex-col justify-between">
          <h3 className="text-left text-sm font-medium">{creator}</h3>
          <div className="mt-1.5 flex gap-1 text-center text-xs font-medium text-white">
            {visibleTags.map((tag) => {
              return (
                <span
                  key={String(tag.id)}
                  className="rounded-sm bg-[rgba(0,0,0,0.85)] px-2 py-1 text-xs"
                >
                  # {tag.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
