'use server';
import { eq } from 'drizzle-orm';
// TODO: make these regular functions instead of server actions, and import `server-only`

import { db } from '../db';
import {
  devProfiles,
  projects,
  recruiterProfiles,
  userProfiles,
  type DevProfileInsert,
  type RecruiterProfileInsert,
  type UserProfileInsert,
  type UserProfileSelect,
} from '../db/schema';

// TODO: get in touch with the user

export const createUserProfileInDb = async (
  userProfileInsertData: UserProfileInsert,
) => {
  // TODO: Add zod validation for this data

  await db.insert(userProfiles).values(userProfileInsertData);

  const newUser = await db.query.userProfiles.findFirst({
    where: (u, { eq }) => eq(u.id, userProfileInsertData.id),
  });

  if (!newUser) {
    throw new Error(
      `Could not get newly created User! ${userProfileInsertData.id}`,
    );
  }

  return {
    success: true,
    user: newUser,
  } as const;
};

// create dev
export const approveDev = async ({
  userId,
  availibity,
  gitHubUrl,
  linkedInUrl,
  twitterUrl,
  websiteUrl,
}: DevProfileInsert) => {
  await db.insert(devProfiles).values({
    userId,
    availibity,
    gitHubUrl,
    linkedInUrl,
    twitterUrl,
    websiteUrl,
  });
};

// create recruiter
export const approveRecruiter = async ({
  userId,
  orgUrl,
}: RecruiterProfileInsert) => {
  await db.insert(recruiterProfiles).values({ userId, orgUrl });
};

// getUserInfo
// TODO: dont fetch everything in one go, when in trpc.
export const getUserInfo = async (userId: UserProfileSelect['id']) => {
  const userInfo = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, userId),
  });

  const devInfo = await db.query.devProfiles.findFirst({
    where: eq(devProfiles.userId, userId),
  });

  const recruiterInfo = await db.query.recruiterProfiles.findFirst({
    where: eq(recruiterProfiles.userId, userId),
  });

  const projectsCount = (
    await db.query.projects.findMany({
      where: eq(projects.userId, userId),
    })
  ).length;

  return {
    info: {
      userInfo,
      devInfo,
      recruiterInfo,
    },
    projectsCount,
  };
};

export const getUserProfileFromDb = async (userId: UserProfileSelect['id']) => {
  try {
    const user = await db.query.userProfiles.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
    });

    return user ?? null;
  } catch (err) {
    return null;
  }
};
