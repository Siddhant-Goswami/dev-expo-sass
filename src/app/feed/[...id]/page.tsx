/* eslint-disable @next/next/no-img-element */
import Footer from '@/components/ui/footer';
import NavBar from '@/components/ui/navbar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import GetInTouchModal from '@/components/ui/get-in-touch-modal';
import SignUpModal from '@/components/ui/sign-up-modal';
import { getProjectById } from '@/server/actions/projects';
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
  const { title, description } = project;
  const { displayName, displayPictureUrl } = dev!;
  const video = media.find((m) => m.type === 'video');
  const images = media.filter((m) => m.type === 'image');
  const primaryMedia = video ? video : images[0];

  const initialLetter = displayName.charAt(0).toUpperCase();

  const userId = session?.user?.id;
  const isSameUser = project.userId === userId;

  console.log('userId', userId);

  return (
    <>
      <NavBar />
      <section className="flex h-feed items-start justify-center">
        <main className="mt-8 flex w-8/12 flex-col justify-center">
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
            <div className="mb-8 h-500 w-900 overflow-hidden rounded-sm">
              <video
                className="h-full w-full object-cover"
                src={primaryMedia.url}
                autoPlay
                controls
              />
            </div>
          )}

          {images.map((image, index) => (
            <div
              className="mb-8 h-500 w-900 overflow-hidden rounded-sm"
              key={image.id}
            >
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
                <GetInTouchModal username="Rishabh" text="Get in Touch" />
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
