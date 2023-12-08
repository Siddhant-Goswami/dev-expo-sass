import { type projectReturnType } from '@/app/page';
import Grid from './ui/grid';

async function ProjectsGrid({ dataFn }: { dataFn: () => projectReturnType }) {
  const projects = await dataFn();

  return (
    <>
      <Grid projects={projects} />
    </>
  );
}

export default ProjectsGrid;
