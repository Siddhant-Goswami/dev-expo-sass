import Footer from '@/components/ui/footer';
import Grid from '@/components/ui/grid';
import NavBar from '@/components/ui/navbar';
import { getProjectsByUserId } from '@/server/actions/projects';
import { getUserFromUsername } from '@/server/actions/users';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { z } from 'zod';

type PageProps = {
  params: { userName: string[] };
};
async function Page({ params }: PageProps) {
  const usernameResult = z.string().max(100).safeParse(params.userName[0]);
  if (!usernameResult.success) {
    notFound();
  }
  const userResult = await getUserFromUsername(usernameResult.data);
  if (!userResult.succcess) {
    notFound();
  }

  const { userInfo, devInfo } = userResult;
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
    <div className="flex flex-col">
      <NavBar />
      <section className="flex min-h-[82vh] items-start justify-center">
        <main className="mt-8 flex w-full flex-col justify-center gap-6 px-4 md:w-3/4">
          <div className="flex w-full flex-col items-center justify-center gap-4">
            {/* <Avatar>
              <AvatarImage src={userInfo.displayPictureUrl} alt={userInfo.displayName} />
              <AvatarFallback> {userInfo.displayName.charAt(0).toUpperCase()} </AvatarFallback>
            </Avatar> */}
            <Image
              width={250}
              height={250}
              className="h-auto w-24 rounded-full md:w-32"
              src={userInfo.displayPictureUrl}
              alt="Profile Picture"
            />
            <div className="flex flex-col">
              <h1 className="grow-1 text-center text-xl font-medium tracking-tight lg:text-2xl ">
                {userInfo.displayName}
              </h1>
              <p className="mb-2 text-center text-base opacity-70 lg:text-lg">
                {/* perfectly balanced as all things should be */}
                {userInfo.bio}
              </p>
            </div>
          </div>
          <div className="h-1 border-b"></div>
          <h2 className="text-md mt-4 font-medium tracking-tight lg:text-lg">
            Projects ({projectsData.length})
          </h2>
          <Grid data={projectsData} />
        </main>
      </section>
      <Footer />
    </div>
  );
}

export default Page;
