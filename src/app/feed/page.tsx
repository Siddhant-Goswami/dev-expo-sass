import ScrollableChips from '@/components/ui/chip';
import Footer from '@/components/ui/footer';
import Grid from '@/components/ui/grid';
import NavBar from '@/components/ui/navbar';
import { getAllProjects } from '@/server/actions/projects';

const categories = [
  'GenAI',
  'AI/ML',
  'AR/VR',
  'Blockchain',
  'Robotics',
  'IoT',
  'Cloud',
];

async function feed() {
  const allProjects = await getAllProjects();
  const filteredProjectsData = allProjects.map(
    ({ project, user, tags, media }) => {
      const { id, title, coverImageUrl } = project;
      const displayName = user?.displayName ?? ' ';

      return {
        id,
        title,
        coverImageUrl,
        media,
        tags,
        displayName,
      };
    },
  );

  return (
    <>
      <NavBar />
      <section className="min-h-screen w-full px-5 sm:px-18">
        <div className="mb-6 flex w-full justify-center py-4">
          <ScrollableChips items={categories} />
        </div>

        {filteredProjectsData && <Grid data={filteredProjectsData} />}
      </section>
      <Footer />
    </>
  );
}

export default feed;
