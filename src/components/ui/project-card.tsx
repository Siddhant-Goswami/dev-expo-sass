'use client';

import { useAuth } from '@/hooks/user/auth';
import logClientEvent from '@/lib/analytics/posthog/client';
import { type getAllProjects } from '@/server/actions/projects';
import Image from 'next/image';

type ProjectCardProps = {
  projectId: number;
  projectName: string;
  creator: string;
  likes?: number;
  hideTags?: boolean;
} & Pick<Awaited<ReturnType<typeof getAllProjects>>[number], 'tags' | 'media'>;

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectId,
  projectName,
  creator,
  tags,
  media,
  hideTags,
}) => {
  const { userId } = useAuth();
  const visibleTags = hideTags ? [] : tags.slice(0, 3);

  return (
    <div
      onClick={() => {
        logClientEvent('click_project_card', {
          userId: userId ?? undefined,
          projectId: projectId.toString(),
          timestamp: Date.now(),
        });
      }}
      className="overflow-hidden rounded-md"
    >
      <div className="relative h-max w-72 overflow-clip rounded-[20px] border border-green-800 bg-neutral-900">
        <div className="absolute left-[-26px] top-[360px] h-[353px] w-[353px] rounded-full bg-green-600 bg-opacity-70 blur-[180px]"></div>
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl px-2 sm:w-72">
          <Image
            // fill={true}
            width={1000}
            height={1000}
            src={
              (media?.[0]?.type === 'image' ? media?.[0]?.url : null) ??
              'https://images.unsplash.com/photo-1557599443-2071a2df9c19?q=80&w=3007&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
            alt="demo"
            className="aspect-square rounded-xl object-cover object-center transition-all duration-200 group-hover:brightness-105"
          />
        </div>

        <div className="flex items-center justify-between px-3 pb-4 pt-1.5">
          <div className="flex flex-col gap-3">
            <h2 className="h-6 w-full text-lg font-semibold">{projectName}</h2>
            <div className="mt-1 flex flex-col justify-between">
              <h3 className="text-left text-sm font-medium">{creator}</h3>
              <div className="mt-1.5 flex gap-1 text-center text-xs font-medium text-white">
                {visibleTags.map((tag) => {
                  return (
                    <div
                      key={String(tag.id)}
                      className="rounded-md border border-brand-tertiary bg-[rgba(0,0,0,0.85)] px-2 py-1 text-xs text-brand-tertiary"
                    >
                      # {tag.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* {likes!==null && (
          <div>
            <span className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-2 py-1">
              <LucideTriangle size={12} className="fill-white" />
              {likes}
            </span>
          </div>
        )} */}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
