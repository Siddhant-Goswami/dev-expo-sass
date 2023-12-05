import NavBar from '@/components/ui/navbar';

import AuthwallPage from '@/components/AuthwallPage';
import NewFooter from '@/components/NewFooter';
import MarkdownComponent from '@/components/mark-down';
import { buttonVariants } from '@/components/ui/button';
import Carousel from '@/components/ui/carousel';
import GoBack from '@/components/ui/go-back';
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

export const runtime = 'edge';

async function Page({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user.id;

  const availableForWork = true;

  const projectIdResult = z.coerce
    .number()
    .int()
    .finite()
    .safeParse(params.id[0]);

  if (!projectIdResult.success) {
    notFound();
  }
  const projectId = projectIdResult.data;

  if (!userId) {
    return <AuthwallPage redirectAfterSignin={`${URLs.feed}/${projectId}`} />;
  }

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

  const initialLetter = displayName.charAt(0).toUpperCase();

  const { sourceCodeUrl, hostedUrl } = projectDetails.project;

  const isLiked = await isLikedByUser({
    projectId: projectDetails.project.id,
  });

  console.log('isLiked', isLiked, 'devId', dev.id);

  return (
    <>
      <NavBar />
      <section className="flex items-start justify-center">
        <main className="mt-8 flex w-full flex-col justify-center px-4 md:max-w-4xl">
          <div className="flex w-full items-center justify-between">
            <GoBack goBackUrl={URLs.feed} />
            {userId === dev.id && <ProjectOptions projectId={projectId} />}
          </div>
          <h1 className="mb-4 w-full text-left text-2xl font-semibold">
            {title}
          </h1>
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
              <UpvoteButton
                originalTotalLikes={projectDetails.likesCount}
                isOriginallyLikedByUser={isLiked}
                projectId={projectId}
              />
              {hostedUrl && (
                <Link
                  className={cn(
                    buttonVariants({
                      variant: 'outline',
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
                      variant: 'outline',
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
              <IsNotSameUserWrapper projectUserId={project.userId}>
                <GetInTouchButton displayName={displayName} devId={dev.id} />
              </IsNotSameUserWrapper>
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

            {/* {images.map(
              (image, index) =>
                // h-500 w-900
                image.url && (
                  <div
                    className="mb-8 overflow-hidden rounded-sm"
                    key={image.id}
                  >
                    <Image
                      width={250}
                      height={250}
                      className="h-full w-full object-cover"
                      src={image.url}
                      alt={`${project.title} image ${index + 1} `}
                    />
                  </div>
                ),
            )} */}
          </div>

          <div className="mt-8 p-6">
            <section>
              <MarkdownComponent content={description} />
            </section>
          </div>

          <GetInTouchSection
            projectUserId={project.userId}
            userDisplayName={displayName}
          />
        </main>
      </section>
      <NewFooter />
    </>
  );
}

export default Page;
