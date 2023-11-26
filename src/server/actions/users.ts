'use server';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { devs, projects, recruiters, users } from '../db/schema';

// TODO: get in touch with the user

// create user
export const createUser = async ({
  authId,
  username,
  displayName,
  displayPictureUrl,
  bio,
}: {
  authId: number;
  username: string;
  displayName: string;
  displayPictureUrl: string;
  bio: string;
}) => {
  const userId = await db.insert(users).values({
    id: authId,
    username,
    displayName,
    displayPictureUrl,
    bio,
  });
  console.log(userId);
  return userId;
};
// create dev
export const approveDev = async ({
  userId,
  availibity,
  gitHubUrl,
  linkedInUrl,
  twitterUrl,
  websiteUrl,
}: {
  userId: number;
  availibity: boolean;
  gitHubUrl?: string;
  linkedInUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}) => {
  await db.insert(devs).values({
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
}: {
  userId: number;
  orgUrl: string;
}) => {
  await db.insert(recruiters).values({
    userId,
    orgUrl,
  });
};

// getUserInfo
export const getUserInfo = async ({ userId }: { userId: number }) => {
  const userInfo = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const devInfo = await db.query.devs.findFirst({
    where: eq(devs.userId, userId),
  });

  const recruiterInfo = await db.query.recruiters.findFirst({
    where: eq(recruiters.userId, userId),
  });

  const projectsCount = (await db.query.projects.findMany({
    where: eq(projects.userId, userId),
  })).length;

  console.log(userInfo, devInfo, recruiterInfo, projectsCount)

  return { info: {
    userInfo,
    devInfo,
    recruiterInfo,
  }, projectsCount };
};
