/* eslint-disable @next/next/no-img-element */
import Footer from '@/components/ui/footer';
import NavBar from '@/components/ui/navbar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import GetInTouchModal from '@/components/ui/get-in-touch-modal';
import { getProjectById } from '@/server/actions/projects';
import { notFound } from 'next/navigation';

type PageProps = {
  params: { id: string[] };
};
async function Page({ params }: PageProps) {
  const availableForWork = true;

  const projectId = params.id[0];

  if (!projectId) {
    return notFound();
  }

  console.log('projectId', projectId);
  const projectDetails = await getProjectById(Number(projectId));

  console.log('projectDetails', projectDetails);

  // project: {
  //   id: 6,
  //   userId: '0f320908-9b8a-4520-94ad-c4dcfc7d4063',
  //   title: '324567654321`2345678',
  //   slug: '324567654321`2345678-1701012939506',
  //   description: 'adsfghfderwtdfhgjw5qertygjhkterwtyugkhjltewrryufgkhjtewryuhjk',
  //   coverImageUrl: '',
  //   hostedUrl: 'http://localhost:3000/',
  //   youtubeUrl: '',
  //   sourceCodeUrl: 'http://localhost:3000/',
  //   createdAt: 2023-11-26T15:35:41.778Z,
  //   publishedAt: null,
  //   updatedAt: 2023-11-26T15:35:41.778Z
  // },
  // dev: {
  //   id: '0f320908-9b8a-4520-94ad-c4dcfc7d4063',
  //   username: 'kishanmandora7',
  //   displayName: 'Kishan Mandora',
  //   displayPictureUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJEQRXFqEX_ODLBzxjX7qOZeoKFmzIVKnJnK4ygmrDKzfY=s96-c',
  //   bio: "Hi, I'm Kishan Mandora, one of the early users of this platform!",
  //   createdAt: 2023-11-26T12:45:49.707Z,
  //   updatedAt: 2023-11-26T12:45:49.707Z
  // },
  // tags: [],
  // media: []

  if (!projectDetails) return notFound();

  const { project, dev, tags, media } = projectDetails;
  const { title, description } = project;
  const { displayName, displayPictureUrl } = dev!;
  const video = media.find((m) => m.type === 'video');
  const images = media.filter((m) => m.type === 'image');
  const primaryMedia = video ? video : images[0];

  const initialLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      <NavBar />
      <section className="mt-8 flex justify-center">
        <main className="flex w-8/12 flex-col justify-center">
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
            <div className="flex gap-2">
              {/* <Button variant="outline" className="icon">
                Like
              </Button> */}

              <GetInTouchModal
                username={displayName}
                text="Get in Touch"
                roundedFull={false}
              />
            </div>
          </div>

          {primaryMedia?.type === 'video' && (
            <div className="h-500 w-900 mb-8 overflow-hidden rounded-sm">
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
              className="h-500 w-900 mb-8 overflow-hidden rounded-sm"
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

          <div className="mt-6 flex w-full flex-col items-center justify-center border-t border-gray-500 py-8">
            <h3 className="text-xl font-medium">
              {' '}
              Liked {displayName}'s work??{' '}
            </h3>
            <p className="mb-4 mt-2 text-sm">
              Get in touch with {displayName} to discuss your project.
            </p>
            <GetInTouchModal username="Rishabh" text="Get in Touch" />
          </div>
        </main>
      </section>
      <Footer />
    </>
  );
}

export default Page;
