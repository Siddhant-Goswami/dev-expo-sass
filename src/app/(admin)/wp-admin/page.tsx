import { api } from '@/trpc/server';

import { URLs } from '@/lib/constants';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DevApplicationCard } from '../_components/devAppCard';

export default async function DemoCreateAccount() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userRole = session?.user.role;

  const isAdmin = userRole === '100x-admin';
  if (!isAdmin) {
    redirect(URLs.home);
  }

  const { applications } = await api.admin.getAllPendingApplications.query();
  
  return (
    <>
      <div>
        <h1 className="py-10 text-center text-4xl font-semibold">
          Pending Applications
        </h1>
        <div className=" flex w-full gap-4">
          {applications.map((app) => (
            <DevApplicationCard key={app.id} application={app} />
          ))}
        </div>
      </div>
    </>
  );
}
