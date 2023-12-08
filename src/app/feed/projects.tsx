import ShimmerButton from '@/components/magicui/shimmer-button';
import Grid from '@/components/ui/grid';
import { URLs, categories } from '@/lib/constants';
import { getAllProjects } from '@/server/actions/projects';
import Link from 'next/link';

const Projects = async ({ filter }: { filter: string }) => {
  const allProjects = await getAllProjects({});
  const filteredProjectsData = allProjects.map(
    ({ project, user, tags, media }) => {
      const { id, title } = project;
      const displayName = user?.displayName ?? ' ';

      return {
        id,
        title,
        media,
        tags,
        displayName,
      };
    },
  );

  const validFilter =
    categories.find((item) => item.id === filter) ?? categories[0];

  const filteredProjects = filteredProjectsData.filter((item) => {
    const tagNames = item.tags.map((tag) => tag.name);
    if (validFilter.id === 'all') return true;
    return tagNames.includes(validFilter.id);
  });

  const selectedCategoryProjects =
    filteredProjects.length > 0 ? filteredProjects : [];

  return (
    <>
      {selectedCategoryProjects.length > 0 ? (
        <Grid projects={selectedCategoryProjects} />
      ) : (
        <div className="flex h-96 flex-col items-center justify-center gap-8">
          <h3 className="text-3xl font-semibold">
            No {validFilter.label} projects found
          </h3>

          {
            <Link href={URLs.create}>
              <ShimmerButton>
                Be the first one to upload {validFilter.label} project
              </ShimmerButton>
            </Link>
          }
        </div>
      )}
    </>
  );
};

export default Projects;
