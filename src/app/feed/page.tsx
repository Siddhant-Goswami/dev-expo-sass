import ShimmerButton from '@/components/magicui/shimmer-button';
import ScrollableChips from '@/components/ui/chip';
import Footer from '@/components/ui/footer';
import Grid from '@/components/ui/grid';
import NavBar from '@/components/ui/navbar';
import ProjectUploadModal from '@/components/ui/project-upload-modal';
import { categories } from '@/lib/constants';
import { getAllProjects } from '@/server/actions/projects';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type FeedProps = {
  searchParams: {
    filter?: string;
  };
};

export const revalidate = 30;
async function Feed({ searchParams }: FeedProps) {
  const filter = searchParams?.filter ?? '';

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
      <NavBar />
      <section className="min-h-screen w-full px-5 sm:px-18">
        <div className="mb-6 flex w-full justify-center py-4">
          <ScrollableChips />
        </div>

        {selectedCategoryProjects.length > 0 ? (
          <Grid data={selectedCategoryProjects} />
        ) : (
          <div className="flex h-96 flex-col items-center justify-center gap-8">
            <h3 className="text-3xl font-semibold">
              No {validFilter.label} projects found
            </h3>

            {
              <ProjectUploadModal>
                <ShimmerButton>
                  Be the first one to upload {validFilter.label} project
                </ShimmerButton>
              </ProjectUploadModal>
            }
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

export default Feed;
