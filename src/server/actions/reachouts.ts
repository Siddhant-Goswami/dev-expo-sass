'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { db } from '../db';
import { RecruiterReachoutInsert, recruiterReachouts } from '../db/schema';
import { cookies } from 'next/headers';

const createRecruiterReachout = async ({
  devId,
  workType,
  quotePrice,
  message,
}: Pick<
  RecruiterReachoutInsert,
  | 'devId' | 'workType' | 'quotePrice' | 'message'
>) => {
  const supabase = createServerActionClient({
    cookies
  });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Unauthenticated');
  }

  const recruiterId = session.user.id;
  await db.insert(recruiterReachouts).values({
    recruiterId,
    devId,
    workType: workType as 'freelance' | 'full-time',
    quotePrice,
    message,
    timestamp: new Date(),
  });
};

// const getIncomingReachouts = async ({ userId }: { userId: number }) => {
//   // const reachouts = await db.query.recruiterReachouts.findMany({
//   //   where: eq(recruiterReachouts.devId, userId),
//   // });
//   // return reachouts;
// };

export { createRecruiterReachout };
