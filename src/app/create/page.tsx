import AuthwallPage from '@/components/AuthwallPage';
import NewFooter from '@/components/NewFooter';
import OnboardingStatus from '@/components/OnboardingStatus';
import NavBar from '@/components/ui/navbar';
import { OnboardingSteps } from '@/components/ui/onboarding-steps';
import { ProjectUpload } from '@/components/ui/ProjectUpload';
import { URLs } from '@/lib/constants';
import { db } from '@/server/db';
import { devApplications } from '@/server/db/schema';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { desc } from 'drizzle-orm';
import { cookies } from 'next/headers';

export const runtime = 'edge';

async function Page() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user.id;

  if (!userId) {
    return <AuthwallPage redirectAfterSignin={URLs.create} />;
  }

  // const isUserVerified = true;

  const userApplication = await db.query.devApplications.findFirst({
    where: (da, { eq }) => eq(da.userId, userId),
    orderBy: [desc(devApplications.appliedAt)],
  });

  // TODO: Later, also check whether user has a developer profile
  const devApplicationStatus = userApplication?.status ?? null;
  // const devApplicationStatus = 'pending';

  console.log(`Your application status is: ${userApplication?.status}`);

  if (
    devApplicationStatus === 'pending' ||
    devApplicationStatus === 'rejected'
  ) {
    return (
      <>
        <NavBar />
        <OnboardingStatus onboardingStatus={'approved'} />
        <NewFooter />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="mx-auto mb-32 flex min-h-[105vh] max-w-4xl flex-col items-center justify-start px-4">
        <h1 className="mt-8 w-max text-2xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
          {devApplicationStatus
            ? 'Create a new project'
            : 'Become a developer now!'}
        </h1>
        <p className="text-center leading-7 [text-wrap:balance]">
          {devApplicationStatus
            ? 'Create a new project to showcase your skills and get hired.'
            : 'Showcase your incredible work to the world and get hired by the best companies.'}
        </p>
        <div className="mt-14 flex w-full flex-col items-center justify-center px-4">
          {devApplicationStatus ? <ProjectUpload /> : <OnboardingSteps />}
        </div>
      </div>
      <NewFooter />
    </>
  );
}

export default Page;
