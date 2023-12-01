import Footer from '@/components/ui/footer';
import NavBar from '@/components/ui/navbar';

import MarkdownComponent from '@/components/mark-down';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { URLs } from '@/lib/constants';
import { projectFormSchema } from '@/lib/validations/project';
import { getProjectById } from '@/server/actions/projects';
import { extractIDfromYtURL } from '@/utils';
import { ChevronLeft, LucideGithub, LucideLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  GetInTouchButton,
  GetInTouchSection,
  IsNotSameUserWrapper,
} from './GetInTouchSections';

type PageProps = {
  params: { id: string[] };
};

async function Page({ params }: PageProps) {
  const availableForWork = true;

  const projectId = params.id[0];

  if (!projectId) {
    return notFound();
  }

  const projectDetails = await getProjectById(Number(projectId));

  if (!projectDetails?.dev) return notFound();

  console.log(projectDetails);

  const { project, dev } = projectDetails;
  const { title, description, youtubeUrl, projectMedia: media } = project;

  const { displayName, displayPictureUrl } = dev;
  const images = media.filter((m) => m.type === 'image');

  const validYoutubeUrlResult =
    projectFormSchema.shape.youtubeUrl.safeParse(youtubeUrl);

  const toShowYTVideo = validYoutubeUrlResult.success;

  const initialLetter = displayName.charAt(0).toUpperCase();

  const { sourceCodeUrl, hostedUrl } = projectDetails.project;

  return (
    <>
      <NavBar />

      {/* <Dialog defaultOpen>
        <DialogContent className="h-screen w-full overflow-scroll md:h-max md:max-w-xl">
          <DialogHeader>
            <DialogTitle>Get Started</DialogTitle>
            <DialogDescription>
              Sign in with your Github or Google account.
            </DialogDescription>
          </DialogHeader>
          <SignUp />
        </DialogContent>
      </Dialog> */}

      <section className="flex items-start justify-center">
        <main className="mt-8 flex w-full flex-col justify-center px-4 md:max-w-4xl">
          <Link href={URLs.feed} className="mb-4 w-fit">
            <Button className="p-0" variant="link">
              <ChevronLeft className="mr-2" />
              Go back
            </Button>
          </Link>
          <h1 className="mb-4 w-full text-left text-2xl font-semibold">
            {title}
          </h1>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/user/${dev.username}`}>
                <Avatar className="h-auto w-14">
                  <AvatarImage src={displayPictureUrl} alt={displayName} />
                  <AvatarFallback> {initialLetter} </AvatarFallback>
                </Avatar>
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
                      (availableForWork ? 'bg-green-500' : 'bg-red-500') +
                      ' mr-2 rounded-full'
                    }
                  ></div>
                  {availableForWork ? (
                    <span className="text-xs text-green-500">
                      Available for work
                    </span>
                  ) : (
                    <span className="text-xs text-red-500">
                      Not available for work
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {hostedUrl && (
                <Button
                  variant="outline"
                  className="rounded-sm border-gray-500 px-2.5"
                >
                  <Link
                    className="flex items-center gap-2 text-gray-800 dark:text-white"
                    href={hostedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LucideLink size={18} />
                    <span className="hidden md:block">Visit</span>
                  </Link>
                </Button>
              )}
              {sourceCodeUrl && (
                <Button
                  variant="link"
                  className="rounded-sm border border-gray-500 px-2.5"
                >
                  <Link
                    className="flex items-center gap-2"
                    href={sourceCodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LucideGithub size={18} />
                    <span className="hidden md:block">View Code</span>
                  </Link>
                </Button>
              )}

              <IsNotSameUserWrapper projectUserId={project.userId}>
                <GetInTouchButton displayName={displayName} />
              </IsNotSameUserWrapper>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:gap-5">
            {youtubeUrl && toShowYTVideo && (
              <iframe
                className="aspect-video w-full max-w-2xl self-center overflow-hidden rounded-lg"
                src={
                  'https://www.youtube.com/embed/' +
                  extractIDfromYtURL(validYoutubeUrlResult.data!)
                }
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}

            {images.map(
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
            )}
          </div>
          <div className="mt-8 rounded-sm border border-gray-500 p-6">
            {/* <section className="mb-4 flex flex-col gap-2">
              <h2 className="text-md mb-4 border-b border-gray-600 font-semibold">
                Links
              </h2>
              {sourceCodeUrl && (
                <Link
                  className="flex items-center gap-2 text-blue-400"
                  href={sourceCodeUrl}
                >
                  <LucideGithub size={18} />
                  View Code
                </Link>
              )}
              {hostedUrl && (
                <Link
                  className="flex items-center gap-2 text-blue-400"
                  href={hostedUrl}
                >
                  <LucideArrowUpRight size={18} />
                  Visit
                </Link>
              )}
            </section> */}
            <section>
              <h2 className="text-md mb-4 border-b border-gray-600 font-semibold">
                Description
              </h2>
              <MarkdownComponent content={description} />
            </section>
          </div>

          <GetInTouchSection
            projectUserId={project.userId}
            userDisplayName={displayName}
          />
        </main>
      </section>
      <Footer />
    </>
  );
}

export default Page;
