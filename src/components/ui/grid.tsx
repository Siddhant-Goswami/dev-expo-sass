import ProjectCard from '@/components/ui/project-card';
import { getAllProjects } from '@/server/actions/projects';
import Link from 'next/link';

const projectsList = [
  {
    projectName: 'Project One',
    creator: 'Nartuo',
    tags: ['GenAI', 'AI/ML'],
  },
  {
    projectName: 'Project Two',
    creator: 'Sasuke',
    tags: ['GenAI', 'AI/ML'],
  },
  {
    projectName: 'Project Three',
    creator: 'Sakura',
    tags: ['GenAI', 'AI/ML'],
  },
  {
    projectName: 'Project Four',
    creator: 'Kakashi',
    tags: ['GenAI', 'AI/ML'],
  },
  {
    projectName: 'Project Five',
    creator: 'Jiraiya',
    tags: ['GenAI', 'AI/ML'],
  },
  {
    projectName: 'Project Six',
    creator: 'Itachi',
    tags: ['GenAI', 'AI/ML'],
  },
  {
    projectName: 'Project Seven',
    creator: 'Kisame',
    tags: ['GenAI', 'AI/ML'],
  },
  {
    projectName: 'Project Eight',
    creator: 'Pain',
    tags: ['GenAI', 'AI/ML'],
  },
  {
    projectName: 'Project Nine',
    creator: 'Konan',
    tags: ['GenAI', 'AI/ML'],
  },
  {
    projectName: 'Project Ten',
    creator: 'Obito',
    tags: ['GenAI', 'AI/ML'],
  },
  {
    projectName: 'Project Eleven',
    creator: 'Madara',
    tags: ['GenAI', 'AI/ML'],
  },
  {
    projectName: 'Project Twelve',
    creator: 'Hashirama',
    tags: ['GenAI', 'AI/ML'],
  },
];

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
    <div className="[nth-child(7)]:hidden grid h-max w-full grid-cols-1 gap-6 sm:grid-cols-2 tablet:grid-cols-3 xl:grid-cols-4">
      {data.map((project) => (
        <Link href={`/feed/${project.id}`} key={project.id}>
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
