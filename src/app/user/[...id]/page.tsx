import Footer from '@/components/ui/footer';
import Grid from '@/components/ui/grid';
import NavBar from '@/components/ui/navbar';
import { getProjectsByUserId } from '@/server/actions/projects';
import { getUserInfo } from '@/server/actions/users';
import { notFound } from 'next/navigation';
import { z } from 'zod';

type PageProps = {
  params: { id: string[] };
};
async function Page({ params }: PageProps) {
  const userIdResult = z.string().max(100).safeParse(params.id[0]);

  if (!userIdResult.success) {
    notFound();
  }

  const { userInfo, devInfo } = await getUserInfo(userIdResult.data);
  if (!userInfo) {
    notFound();
  }

  //   const user = {
  //     userInfo: {
  //       id: 'f4122dff-4398-4124-9c85-1a4a93ad2ecb',
  //       username: 'rishabh.gurbani23',
  //       displayName: 'Rishabh Gurbani',
  //       displayPictureUrl:
  //         'https://lh3.googleusercontent.com/a/ACg8ocLfbKiBRQohC1aCKjnp_7mEa7LGMSewqNZOVZHVuvjwLNFS=s96-c',
  //       bio: "Hi, I'm Rishabh Gurbani, one of the early users of this platform!",
  //         createdAt: `2023-11-26T14:30:55.900Z`,
  //         updatedAt: `2023-11-26T14:30:55.900Z`
  //     },
  //     devInfo: {
  //       availibity: true,
  //       gitHubUrl: 'g',
  //       linkedInUrl: 'l',
  //       twitterUrl: 't',
  //       websiteUrl: 'w',
  //       bio: 'perfectly balanced',
  //     },
  //     recruiterInfo: undefined,
  //     projectsCount: 4,
  //   };

  const projects = await getProjectsByUserId(userInfo.id);
  const projectsData = projects.map((project) => {
    return {
      id: project?.project.id,
      title: project?.project.title,
      displayName: userInfo.displayName,
      // user: user,
      tags: project?.tags,
      media: project?.media,
    };
  });

  return (
    <>
      <NavBar />
      <section className="flex min-h-feed items-start justify-center">
        <main className="mt-8 flex w-full flex-col justify-center px-4 md:w-3/4 gap-6">
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <img
              className="h-auto w-32 rounded-full md:w-36"
              src={userInfo.displayPictureUrl}
              alt="Profile Picture"
            />
            <div>
              <h1 className="grow-1 text-2xl text-center font-medium tracking-tight lg:text-3xl ">
                {userInfo.displayName}
              </h1>
              <p className="text-lg lg:text-xl">
                perfectly balanced as all things should be
                {/* {devInfo.bio} */}
              </p>
              <p>Projects: {projects.length}</p>
            </div>
          </div>
          <Grid data={projectsData} />
        </main>
      </section>
      <Footer />
    </>
  );
}

export default Page;
