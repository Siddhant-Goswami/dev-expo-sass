'use server';

import { db } from '../db';
import { RecruiterReachoutInsert, recruiterReachouts } from '../db/schema';

const createRecruiterReachout = async ({
  recruiterId,
  devId,
  workType,
  quotePrice,
  message,
}: Pick<
  RecruiterReachoutInsert,
  'recruiterId' | 'devId' | 'workType' | 'quotePrice' | 'message'
>) => {
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
