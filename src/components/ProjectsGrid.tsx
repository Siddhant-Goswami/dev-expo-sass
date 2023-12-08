import { type projectReturnType } from '@/app/page';
import Grid from './ui/grid';

async function ProjectsGrid({
  dataFn,
  hideTags,
}: {
  hideTags?: boolean;
  dataFn: () => projectReturnType;
}) {
  const projects = await dataFn();

  return (
    <>
      <Grid hideTags={hideTags} projects={projects} />
    </>
  );
}

export default ProjectsGrid;
