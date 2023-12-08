import { api } from '@/trpc/server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { DevApplicationCard } from '../_components/devAppCard';

export default async function DemoCreateAccount() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user.id;
  const userRole = session?.user.role;
  console.log({ userId, userRole });
  const { applications } = await api.admin.getAllPendingApplications.query();
  return (
    <div>
      {applications.map((app) => (
        <DevApplicationCard application={app} />
      ))}
    </div>
  );
}
