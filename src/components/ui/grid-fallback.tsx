import { ProjectCardFallback } from './project-card-fallback';

export const GridFallback = ({count}:{count: number}) => {
  return (
    <div className="flex h-max w-full flex-wrap items-start justify-center gap-6 xl:gap-x-10 [&>*:nth-child(7)]:hidden sm:[&>*:nth-child(7)]:block [&>*:nth-child(8)]:hidden sm:[&>*:nth-child(8)]:block">
      {Array.from({ length: count }, () => (
        <ProjectCardFallback />
      ))}
    </div>
  );
};
