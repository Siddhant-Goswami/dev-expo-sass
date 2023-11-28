/* eslint-disable @next/next/no-img-element */
import Footer from '@/components/ui/footer';
import NavBar from '@/components/ui/navbar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import GetInTouchModal from '@/components/ui/get-in-touch-modal';
import SignUp from '@/components/ui/sign-up';
import SignUpModal from '@/components/ui/sign-up-modal';
import { projectFormSchema } from '@/lib/validations/project';
import { getProjectById } from '@/server/actions/projects';
import { extractIDfromYtURL } from '@/utils';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

type PageProps = {
  params: { id: string[] };
};
async function Page({ params }: PageProps) {
  const availableForWork = true;
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const projectId = params.id[0];

  if (!projectId) {
    return notFound();
  }

  const projectDetails = await getProjectById(Number(projectId));

  if (!projectDetails) return notFound();

  const { project, dev, media } = projectDetails;
  const { title, description, youtubeUrl } = project;
  const { displayName, displayPictureUrl } = dev!;
  const video = media.find((m) => m.type === 'video');
  const images = media.filter((m) => m.type === 'image');
  const primaryMedia = video ? video : images[0];

  const validYoutubeUrlResult =
    projectFormSchema.shape.youtubeUrl.safeParse(youtubeUrl);
  const initialLetter = displayName.charAt(0).toUpperCase();

  const userId = session?.user?.id;
  const isSameUser = project.userId === userId;

  console.log('userId', userId);

  return (
    <>
      <NavBar />

      <Dialog open={!userId}>
        <DialogContent className="h-screen w-full overflow-scroll md:h-max md:max-w-xl">
          <DialogHeader>
            <DialogTitle>Get Started</DialogTitle>
            <DialogDescription>
              Sign in with your Github or Google account.
            </DialogDescription>
          </DialogHeader>
          <SignUp />
        </DialogContent>
      </Dialog>

      <section className="flex min-h-feed items-start justify-center">
        <main className="mt-8 flex w-full flex-col justify-center px-4 md:w-3/4">
          <h1 className="mb-4 w-full text-left text-2xl font-semibold">
            {title}
          </h1>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={displayPictureUrl} alt={displayName} />
                <AvatarFallback> {initialLetter} </AvatarFallback>
              </Avatar>
              <div>
                <div className="mb-0.5 text-sm font-semibold">
                  {displayName}
                </div>
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

            {!isSameUser && (
              <>
                {!userId ? null : (
                  <div className="flex gap-2">
                    <GetInTouchModal
                      username={displayName}
                      text="Get in Touch"
                      roundedFull={false}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {primaryMedia?.type === 'video' && (
            // h-500 w-900
            <div className="mb-8 aspect-video w-full max-w-lg overflow-hidden rounded-sm md:max-w-full">
              <video
                className="h-full w-full object-cover"
                src={primaryMedia.url}
                autoPlay={!!userId}
                controls
              />
            </div>
          )}
          {validYoutubeUrlResult.success ? (
            <iframe
              className="aspect-video w-full max-w-2xl overflow-hidden rounded-lg"
              src={
                'https://www.youtube.com/embed/' +
                extractIDfromYtURL(validYoutubeUrlResult.data)
              }
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            `Invalid youtube video URL: ${youtubeUrl}`
          )}

          {images.map((image, index) => (
            // h-500 w-900
            <div className="mb-8 overflow-hidden rounded-sm" key={image.id}>
              <img
                className="h-full w-full object-cover"
                src={image.url}
                alt={`${project.title} image ${index + 1} `}
              />
            </div>
          ))}

          <div className="mt-8">
            {description.split('\n').map((line, index) => (
              <p key={index} className="my-2 text-base">
                {line}
              </p>
            ))}
          </div>

          {!isSameUser && (
            <div className="mt-6 flex w-full flex-col items-center justify-center border-t border-gray-500 py-8">
              <h3 className="text-xl font-medium">
                {' '}
                Liked {displayName}'s work??{' '}
              </h3>
              <p className="mb-4 mt-2 text-sm">
                Get in touch with {displayName} to discuss your project.
              </p>

              {!userId ? (
                <SignUpModal>
                  <Button variant="brand" className="mt-10 p-6">
                    Login in To Get in Touch
                  </Button>
                </SignUpModal>
              ) : (
                <GetInTouchModal username={displayName} text="Get in Touch" />
              )}
            </div>
          )}
        </main>
      </section>
      <Footer />
    </>
  );
}

export default Page;
