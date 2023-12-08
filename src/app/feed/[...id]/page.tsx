import NewFooter from '@/components/NewFooter';
import MarkdownComponent from '@/components/mark-down';
import { buttonVariants } from '@/components/ui/button';
import Carousel from '@/components/ui/carousel';
import GoBack from '@/components/ui/go-back';
import NavBar from '@/components/ui/navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { URLs } from '@/lib/constants';
import { projectFormSchema } from '@/lib/validations/project';
import { getProjectById, isLikedByUser } from '@/server/actions/projects';
import { extractIDfromYtURL } from '@/utils';
import { cn } from '@/utils/cn';
import { GitHubLogoIcon, Link2Icon } from '@radix-ui/react-icons';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { z } from 'zod';
import {
  GetInTouchButton,
  GetInTouchSection,
  IsNotSameUserWrapper,
} from './GetInTouchSections';
import UpvoteButton from './LikeButton';
import ProjectOptions from './ProjectOptions';

type PageProps = {
  params: { id: string[] };
};

// export const revalidate = 10;
export const runtime = 'edge';
export const preferredRegion = 'sin1'; // only executes this page in this region

function Page({ params }: PageProps) {
  return (
    <>
      <NavBar />

      <section className="flex items-start justify-center">
        {/* <ProjectPageFallback /> */}
        <Suspense fallback={<ProjectPageFallback />}>
          <ProjectData params={params} />
        </Suspense>
      </section>
      <NewFooter />
    </>
  );
}

async function ProjectData({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user.id;

  const projectIdResult = z.coerce
    .number()
    .int()
    .finite()
    .safeParse(params.id[0]);

  if (!projectIdResult.success) {
    notFound();
  }
  const projectId = projectIdResult.data;
  const availableForWork = true;
  const projectDetails = await getProjectById(projectId);

  if (!projectDetails?.dev) {
    notFound();
  }

  const { project, dev } = projectDetails;
  const { title, description, youtubeUrl, projectMedia: media } = project;

  const { displayName, displayPictureUrl } = dev;
  const images = media.filter((m) => m.type === 'image');

  const validYoutubeUrlResult =
    projectFormSchema.shape.youtubeUrl.safeParse(youtubeUrl);

  const toShowYTVideo = validYoutubeUrlResult.success;

  const { sourceCodeUrl, hostedUrl } = projectDetails.project;

  const isLiked = await isLikedByUser({
    projectId: projectDetails.project.id,
  });

  return (
    <>
      <main className="mt-8 flex w-full flex-col justify-center px-4 md:max-w-4xl">
        <div className="flex w-full items-center justify-between">
          <GoBack goBackUrl={URLs.feed} />
          <h1 className="mb-4 w-full text-left text-2xl font-semibold">
            {title}
          </h1>
          {userId === dev.id && <ProjectOptions projectId={projectId} />}
        </div>
        <div className="md:px-12">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/user/${dev.username}`}>
                <Image
                  className="aspect-square h-14 w-14 rounded-full"
                  width={100}
                  height={100}
                  src={displayPictureUrl}
                  alt={displayName}
                />
              </Link>
              <div>
                <Link href={`/user/${dev.username}`}>
                  <div className="mb-0.5 text-sm font-semibold">
                    {displayName}
                  </div>
                </Link>
                <div className="flex items-center">
                  <div
                    className={
                      'h-2 w-2 ' +
                      (availableForWork ? 'bg-green-500' : 'bg-gray-500') +
                      ' mr-2 rounded-full'
                    }
                  ></div>
                  {availableForWork ? (
                    <span className="text-xs text-green-500">
                      Available for work
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      Not available for work
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {hostedUrl && (
                <Link
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      className: 'rounded-sm px-3.5',
                    }),
                  )}
                  href={hostedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Link2Icon className="mr-2" />
                  <span className="hidden md:inline-block">Visit</span>
                </Link>
              )}
              {sourceCodeUrl && (
                <Link
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      className: 'rounded-sm px-3.5',
                    }),
                  )}
                  href={sourceCodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubLogoIcon className="md:mr-2" />
                  <span className="hidden md:inline-block">View Code</span>
                </Link>
              )}
              <div className="hidden md:block">
                <IsNotSameUserWrapper projectUserId={project.userId}>
                  <GetInTouchButton
                    projectId={projectId}
                    buttonVariant={'secondaryAction'}
                    displayName={displayName}
                    devId={dev.id}
                  />
                </IsNotSameUserWrapper>
              </div>

              <UpvoteButton
                originalTotalLikes={projectDetails.likesCount}
                isOriginallyLikedByUser={isLiked}
                projectId={projectId}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 md:gap-5">
            {youtubeUrl && toShowYTVideo && (
              <iframe
                className="aspect-video w-full max-w-4xl self-center overflow-hidden rounded-lg"
                src={
                  'https://www.youtube.com/embed/' +
                  extractIDfromYtURL(validYoutubeUrlResult.data!)
                }
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}

            <Carousel imagesArr={images} />
          </div>

          <div className="mt-8 p-6">
            <section>
              <MarkdownComponent content={description} />
            </section>
          </div>

          <GetInTouchSection
            projectId={projectId}
            projectUserId={project.userId}
            userDisplayName={displayName}
            displayPictureUrl={displayPictureUrl}
          />
        </div>
      </main>
    </>
  );
}

async function ProjectPageFallback() {
  return (
    <>
      <main className="mt-8 flex w-full flex-col px-4 md:max-w-4xl">
        <div className="flex w-full items-center justify-between">
          <GoBack goBackUrl={URLs.feed} />
        </div>
        <div className="animate-pulse md:px-12">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px] bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-[200px] bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex w-full items-center justify-center gap-3">
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl px-2 sm:w-72">
                <svg
                  className="h-10 w-10 text-gray-200 dark:text-gray-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 20"
                >
                  <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:gap-5">{/* Image*/}</div>

          <div className="mt-8 py-6">
            <section>
              <div className="flex w-full items-center justify-between px-3 pt-1.5">
                <div className="flex w-full flex-col gap-2">
                  <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default Page;
