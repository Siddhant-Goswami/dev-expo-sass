/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '../db';
import { RecruiterReachoutInsert, recruiterReachouts } from '../db/schema';

const createRecruiterReachout = async ({
  devId,
  workType,
  quotePrice,
  message,
}: Pick<
  RecruiterReachoutInsert,
  'devId' | 'workType' | 'quotePrice' | 'message'
>) => {
  const supabase = createServerActionClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Unauthenticated');
  }

  try {
    const recruiterId = session.user.id;
    await db.insert(recruiterReachouts).values({
      recruiterId,
      devId,
      workType: workType as 'freelance' | 'full-time',
      quotePrice,
      message,
      timestamp: new Date(),
    });

    return { success: true, message: 'Reachout sent' };
  } catch (error) {
    return { success: false, message: 'Something went wrong' };
  }
};

// const getIncomingReachouts = async ({ userId }: { userId: number }) => {
//   // const reachouts = await db.query.recruiterReachouts.findMany({
//   //   where: eq(recruiterReachouts.devId, userId),
//   // });
//   // return reachouts;
// };

export { createRecruiterReachout };
