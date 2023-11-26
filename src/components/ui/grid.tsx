import ProjectCard from '@/components/ui/project-card';

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

function Grid() {
  return (
    <div className="tablet:grid-cols-3 grid h-max w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {projectsList.map((project) => (
        <ProjectCard
          projectName={project.projectName}
          creator={project.creator}
          tags={project.tags}
        />
      ))}
    </div>
  );
}

export default Grid;
