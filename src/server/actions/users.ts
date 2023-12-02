'use server';
import { desc, eq } from 'drizzle-orm';
// TODO: make these regular functions instead of server actions, and import `server-only`

import {
  DevApplicationFormSubmitType,
  devApplicationSchema,
} from '@/lib/validations/user';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '../db';
import {
  devApplications,
  devProfiles,
  projects,
  recruiterProfiles,
  userProfiles,
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

export const createDevApplication = async (
  unsanitizedData: DevApplicationFormSubmitType,
) => {
  const supabase = createServerActionClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('You must be logged in to apply!');
  }

  const userId = session.user.id;

  const devApplicationInsertData = devApplicationSchema.parse(unsanitizedData);

  const existingApplication = await db.query.devApplications.findFirst({
    where: eq(devApplications.userId, userId),
  });
  if (existingApplication?.status === 'approved') {
    return {
      success: false,
      error: 'User already has a developer profile!',
    };
  }

  if (existingApplication?.status === 'pending') {
    return {
      success: false,
      error: 'User already has a pending application!',
    };
  }

  const appliedAt = new Date();

  const [devApplication] = await db
    .insert(devApplications)
    .values({
      bio: `${devApplicationInsertData.bio}`,
      displayName: devApplicationInsertData.displayName,
      twitterUrl: devApplicationInsertData.twitterUsername
        ? `https://twitter.com/` + devApplicationInsertData.twitterUsername
        : null,
      websiteUrl: devApplicationInsertData.websiteUrl,
      status: 'pending',
      gitHubUrl:
        `https://github.com/` + devApplicationInsertData.githubUsername,
      userId,
      appliedAt,
    })
    .returning();

  if (!devApplication?.id) {
    throw new Error('Could not create dev application');
  }
  return {
    success: true,
    devApplicationId: devApplication.id,
  };
};

// create dev
export const approveDevApplication = async (applicationId: number) => {
  const application = await db.query.devApplications.findFirst({
    where: eq(devApplications.id, applicationId),
  });
  if (!application) {
    return {
      success: false,
      error: 'Application not found',
    };
  }
  await db.insert(devProfiles).values({
    userId: application.userId,
    gitHubUrl: application.gitHubUrl,
    twitterUrl: application.twitterUrl,
    websiteUrl: application.websiteUrl,
  });

  await db
    .update(devApplications)
    .set({ status: 'approved' })
    .where(eq(devApplications.id, applicationId));

  await db
    .update(userProfiles)
    .set({ bio: application.bio, displayName: application.displayName })
    .where(eq(userProfiles.id, application.userId));

  return {
    success: true,
  };
};

export const rejectDevApplication = async (applicationId: number) => {
  const application = await db.query.devApplications.findFirst({
    where: eq(devApplications.id, applicationId),
  });
  if (!application) {
    return {
      success: false,
      error: 'Application not found',
    };
  }
  await db
    .update(devApplications)
    .set({ status: 'rejected' })
    .where(eq(devApplications.id, applicationId));

  return {
    success: true,
  };
};

export const getAllDevApplications = async () => {
  const applications = await db.query.devApplications.findMany({
    orderBy: [desc(devApplications.appliedAt)],
  });
  return applications;
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
    userInfo,
    devInfo,
    recruiterInfo,
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

export const getUserFromUsername = async (username: string) => {
  const user = await db.query.userProfiles.findFirst({
    where: (u, { eq }) => eq(u.username, username),
  });

  if (!user) {
    return {
      success: false,
      error: 'User not found',
    };
  }

  const devInfo = await db.query.devProfiles.findFirst({
    where: eq(devProfiles.userId, user.id),
  });

  const recruiterInfo = await db.query.recruiterProfiles.findFirst({
    where: eq(recruiterProfiles.userId, user.id),
  });

  const projectsCount = (
    await db.query.projects.findMany({
      where: eq(projects.userId, user.id),
    })
  ).length;

  return {
    succcess: true,
    userInfo: user,
    devInfo,
    recruiterInfo,
    projectsCount,
  };
};
