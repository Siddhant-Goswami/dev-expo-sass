'use client';
import Footer from '@/components/ui/footer';
import NavBar from '@/components/ui/navbar';
import { OnboardingSteps } from '@/components/ui/onboarding-steps';
import { ProjectUpload } from '@/components/ui/project-upload';
import { useState } from 'react';

function Page() {
  const isUserVerified = true;
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <NavBar />
      <section className="mx-auto mb-32 flex max-w-4xl flex-col items-center justify-center px-4">
        <h1 className="mt-8 w-max text-2xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
          {isUserVerified ? 'Create a new project' : 'Become a developer now!'}
        </h1>
        <p className="text-center leading-7 [text-wrap:balance]">
          {isUserVerified
            ? 'Create a new project to showcase your skills and get hired.'
            : 'Showcase your incredible work to the world and get hired by the best companies.'}
        </p>
        <main className="mt-14 flex w-full flex-col items-center justify-center px-4">
          {isUserVerified ? (
            <ProjectUpload setIsModalOpen={setIsModalOpen} />
          ) : (
            <OnboardingSteps />
          )}
        </main>
      </section>
      <Footer />
    </>
  );
}

export default Page;
