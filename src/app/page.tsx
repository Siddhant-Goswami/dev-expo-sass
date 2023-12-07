import GetStartedButton from '@/components/get-started-button';
import NewFooter from '@/components/NewFooter';
import BackgroundLooper from '@/components/ui/background-looper';
import Grid from '@/components/ui/grid';
import Navbar from '@/components/ui/navbar';
import { getAllProjectsSortedByLikes } from '@/server/actions/projects';
import { JetBrains_Mono } from 'next/font/google';
import React from 'react';

const GradientCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="relative flex h-72 w-[304px] flex-col justify-end overflow-hidden rounded-[20px] border border-green-800 bg-neutral-900 p-2 pb-3">
        <div className="absolute left-[-26px] top-[254px] h-[353px] w-[353px] rounded-full bg-green-600 bg-opacity-70 blur-[370.40px]" />
        <div className="bg-neutral-900 bg-opacity-20 py-1">{children}</div>

        {/* <div className="absolute left-[-21px] top-[-143px] h-[327px] w-[343px] bg-neutral-900 bg-opacity-20"></div> */}
      </div>
    </>
  );
};

export const revalidate = 15;
// export const dynamic = 'force-dynamic';
const jetBrainFont = JetBrains_Mono({ weight: ['400'], subsets: ['latin'] });
export const runtime = 'edge';
export default async function Page() {
  const allProjects = await getAllProjectsSortedByLikes({ limit: 6 });
  const filteredProjectsData = allProjects.map(
    ({ project, user, tags, media, likesCount }) => {
      const { id, title } = project;
      const displayName = user?.displayName ?? ' ';

      return {
        id,
        title,
        media,
        tags,
        displayName,
        likesCount,
      };
    },
  );

  return (
    <>
      <Navbar />
      {/* <div className="relative h-[286px] w-[302px] rounded-[20px] border border-green-800 bg-neutral-900 overflow-clip">
        <div className="absolute left-[-26px] top-[254px] h-[353px] w-[353px] rounded-full bg-green-600 bg-opacity-70 blur-[370.40px]"></div>
      </div> */}
      <section className="relative flex h-hero w-full flex-col items-center justify-center overflow-clip px-5 sm:px-18">
        {/* <h3 className="mt-18 rounded-full border-2 border-brand bg-brand-secondarybg px-4 py-2 font-medium text-black backdrop-blur-md sm:mt-0">
          Elevate Your GenAI Game
        </h3> */}
        <h2 className="flex flex-col gap-2 text-center text-4xl font-medium md:text-6xl">
          Elevate Your <span className="text-brand">Generative-AI Game</span>
        </h2>
        {/* <h2 className="mt-12 text-center text-2xl font-semibold leading-10 [text-wrap:balance] sm:w-3/4 sm:text-4xl sm:font-bold">
          Join
          <span className="p-1 text-brand">OverpoweredJobs</span> – an invite
          only club for the smartest GenAI builders. Showcase your work,
          connect, and step into new frontiers of innovation.
        </h2> */}
        <h3
          className={`mt-6 max-w-xl text-center text-lg md:max-w-3xl md:text-2xl ${jetBrainFont.className}`}
        >
          Join OverpoweredJobs – an invite only club for the smartest GenAI
          builders. Showcase your work, connect, and step into new frontiers of
          innovation.
        </h3>
        <GetStartedButton />
        <div className="absolute -z-10 mt-16 min-h-screen w-full min-w-[720px] max-w-[1280px]">
          <BackgroundLooper />
        </div>
      </section>

      <section className="flex min-h-screen w-full flex-col items-center justify-center gap-2 px-5 sm:px-18">
        <h2 className="max-w-xl text-center text-4xl font-medium sm:text-6xl">
          Simple Steps to Join Our
          <span className="text-brand"> Elite Circle</span>
        </h2>
        <p
          className={`mb-12 mt-6 max-w-2xl text-center text-lg sm:text-xl ${jetBrainFont.className}`}
        >
          Becoming a member of OverpoweredJobs is straightforward yet
          distinguished. Here’s what it takes:
        </p>
        <div className="flex w-11/12 max-w-6xl flex-col items-center justify-center gap-6 lg:flex-row lg:gap-0">
          <GradientCard>
            <div className="z-50 px-2 text-base font-medium text-white">
              Submit Your Pitch
            </div>
            <div className="z-50 px-2 text-sm font-normal text-green-300">
              One minute to impress. Show us your passion and skill in GenAI.
            </div>
          </GradientCard>

          <div className="w-[0px] flex-grow border border-dashed border-green-800/40 md:h-[0px]"></div>

          <GradientCard>
            <div className="z-50 px-2 text-base font-medium text-white">
              Share your work
            </div>
            <div className="z-50 px-2 text-sm font-normal text-green-300">
              Provide your GitHub link and portfolio. We look for groundbreaking
              and innovative projects.
            </div>
          </GradientCard>

          <div className="w-[0px] flex-grow border border-dashed border-green-800/40 md:h-[0px]"></div>

          <GradientCard>
            <div className="z-50 px-2 text-base font-medium text-white">
              Welcome to the community
            </div>
            <div className="z-50 px-2 text-sm font-normal text-green-300">
              Get approved and join an elite network of GenAI professionals.
            </div>
          </GradientCard>
        </div>
      </section>

      <section className="mt-20 flex min-h-screen w-full flex-col items-center justify-center px-5 sm:px-18">
        <h2 className="flex max-w-xl flex-col gap-2 text-center text-4xl font-medium sm:text-6xl">
          Discover Pioneering
          <span className="text-brand">GenAI Projects</span>
        </h2>
        <p
          className={`mb-12 mt-6 max-w-2xl text-center text-lg sm:text-xl ${jetBrainFont.className}`}
        >
          Browse through the innovative works of our members. Each project
          showcases the power and potential of GenAI.
        </p>
        <div className="max-w-6xl">
          <Grid projects={filteredProjectsData} />
        </div>
      </section>

      <section className="mt-32 flex w-full flex-col items-center justify-center">
        <div className="flex w-3/4 flex-col items-center justify-center rounded-xl border-x border-t border-green-800 py-12">
          <h2 className="w-full text-center text-3xl sm:w-3/4 sm:text-6xl">
            Ready to Join the GenAI Elite?
          </h2>
          <p
            className={`mt-8 w-full max-w-2xl text-center text-lg sm:w-3/4 sm:text-xl ${jetBrainFont.className}`}
          >
            Apply now to OverpoweredJobs and mark your place among top GenAI
            builders.
          </p>
          <GetStartedButton />
        </div>
      </section>

      <NewFooter />
    </>
  );
}
