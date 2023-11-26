'use server';

import { db } from '../db';
import { recruiterReachouts } from '../db/schema';

const createRecruiterReachout = async ({
  recruiterId,
  devId,
  workType,
  quotePrice,
  message,
}: {
  recruiterId: number;
  devId: number;
  workType: string;
  quotePrice: number;
  message: string;
}) => {
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
