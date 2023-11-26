import { Button } from '@/components/ui/button';
import Footer from '@/components/ui/footer';
import Grid from '@/components/ui/grid';
import Navbar from '@/components/ui/navbar';

export default function Page() {
  return (
    <div>
      <Navbar />
      <section className="h-hero sm:px-18 relative flex w-full flex-col items-center justify-center px-5">
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <h3 className="mt-18 rounded-full bg-accent/90 px-4 py-2 font-semibold backdrop-blur-md dark:bg-accent/60 sm:mt-0">
          Unleash Your Generative AI Mastery
        </h3>
        <h2 className="mt-12 text-center text-3xl font-semibold sm:w-2/3 sm:text-5xl sm:font-bold">
          Join the elite circle of{' '}
          <span className="bg-blue-100 dark:bg-blue-800"> GenAI</span>{' '}
          innovators. Showcase your projects, inspire, and be discovered.
        </h2>
        <p className="mt-10 text-center text-lg font-normal sm:w-3/4 sm:text-xl sm:font-medium">
          Your creations deserve the spotlight. Showcase your most innovative
          Generative AI projects to a community that understands and values your
          expertise.
        </p>

        <Button className="mt-10 p-6">Get Started Now</Button>
      </section>

      <section className="sm:px-18 min-h-screen w-full px-5">
        <h2 className="mb-12 text-center text-2xl font-medium sm:text-5xl">
          Explore Trending Projects
        </h2>
        <Grid />
      </section>

      <section className="sm:px-18 relative flex w-full flex-col items-center justify-center px-5 py-36">
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <h2 className="w-full text-center text-3xl sm:w-2/4 sm:text-6xl">
          Ready to Amplify Your GenAI Journey?
        </h2>
        <p className="mt-12 w-full text-center text-lg sm:w-2/4 sm:text-xl">
          Join Job Board today and take your first step towards being recognized
          in the world of Generative AI.
        </p>
        <Button
          variant="link"
          className="mt-10 py-8 text-lg underline sm:text-xl"
        >
          Join Now
        </Button>
      </section>
      <Footer />
    </div>
  );
}
