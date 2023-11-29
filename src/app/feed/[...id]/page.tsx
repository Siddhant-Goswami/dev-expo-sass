import Footer from '@/components/ui/footer';
import NavBar from '@/components/ui/navbar';

import MarkdownComponent from '@/components/mark-down';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { projectFormSchema } from '@/lib/validations/project';
import { getProjectById } from '@/server/actions/projects';
import { extractIDfromYtURL } from '@/utils';
import { notFound } from 'next/navigation';
import {
  GetInTouchButton,
  GetInTouchSection,
  IsSameUserWrapper,
} from './GetInTouchSections';

type PageProps = {
  params: { id: string[] };
};

export const revalidate = false;
async function Page({ params }: PageProps) {
  const availableForWork = true;

  const projectId = params.id[0];

  if (!projectId) {
    return notFound();
  }

  const projectDetails = await getProjectById(Number(projectId));

  if (!projectDetails) return notFound();

  const { project, dev } = projectDetails;
  const { title, description, youtubeUrl, projectMedia: media } = project;

  const { displayName, displayPictureUrl } = dev!;
  const images = media.filter((m) => m.type === 'image');

  const validYoutubeUrlResult =
    projectFormSchema.shape.youtubeUrl.safeParse(youtubeUrl);

  const toShowYTVideo = validYoutubeUrlResult.success;

  const initialLetter = displayName.charAt(0).toUpperCase();

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

            <IsSameUserWrapper projectUserId={project.userId}>
              <GetInTouchButton displayName={displayName} />
            </IsSameUserWrapper>
          </div>

          {youtubeUrl && toShowYTVideo && (
            <iframe
              className="aspect-video w-full max-w-2xl overflow-hidden rounded-lg"
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
                <div className="mb-8 overflow-hidden rounded-sm" key={image.id}>
                  <img
                    className="h-full w-full object-cover"
                    src={image.url}
                    alt={`${project.title} image ${index + 1} `}
                  />
                </div>
              ),
          )}

          <div className="mt-8">
            <MarkdownComponent content={description} />
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
