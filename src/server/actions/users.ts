'use server';
import { eq } from 'drizzle-orm';
// TODO: make these regular functions instead of server actions, and import `server-only`

import {
  flushServerEvents,
  logServerEvent,
} from '@/lib/analytics/posthog/server';
import {
  devApplicationSchema,
  type DevApplicationFormSubmitType,
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
  try {
    const devApplicationInsertData =
      devApplicationSchema.parse(unsanitizedData);

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
        twitterUsername: devApplicationInsertData.twitterUsername,
        websiteUrl: devApplicationInsertData.websiteUrl,
        status: 'pending',
        gitHubUsername: devApplicationInsertData.githubUsername,
        userId,
        appliedAt,
      })
      .returning();

    if (!devApplication?.id) {
      throw new Error('Could not create dev application');
    }

    logServerEvent('dev_application_create_success', {
      distinct_id: userId,
      properties: { userId, applicationId: devApplication.id.toString() },
    });
    await flushServerEvents();
    return {
      success: true,
      devApplicationId: devApplication.id,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : JSON.stringify({ err });

    logServerEvent('dev_application_create_failed', {
      distinct_id: userId,
      properties: { userId, reason: errorMessage },
    });
    await flushServerEvents();

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// create dev
// ! Security RISK: This is a server-only action, but is not protected by any auth or validation. Don't make this a server action!
export const approveDevApplication = async (applicationId: number) => {
  const supabase = createServerActionClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const _userId = session?.user.id;
  if (!_userId) {
    throw new Error('You must be logged in to approve!');
  }

  const application = await db.query.devApplications.findFirst({
    where: eq(devApplications.id, applicationId),
  });
  if (!application) {
    return {
      success: false,
      error: 'Application not found',
    };
  }

  const now = new Date();

  await Promise.allSettled([
    db.insert(devProfiles).values({
      userId: application.userId,
      gitHubUsername: application.gitHubUsername,
      twitterUsername: application.twitterUsername,
      websiteUrl: application.websiteUrl,
    }),
    db
      .update(devApplications)
      .set({
        status: 'approved',
        statusUpdatedAt: now,
        updatedAt: now,
      })
      .where(eq(devApplications.id, applicationId)),

    db
      .update(userProfiles)
      .set({
        bio: application.bio,
        displayName: application.displayName,
        updatedAt: now,
      })
      .where(eq(userProfiles.id, application.userId)),
  ]);

  logServerEvent('dev_application_approve', {
    distinct_id: application.userId,
    properties: {
      userId: application.userId,
      applicationId: application.id.toString(),
    },
  });
  await flushServerEvents();

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

// create recruiter
export const approveRecruiter = async ({
  userId,
  orgUrl,
}: RecruiterProfileInsert) => {
  await db.insert(recruiterProfiles).values({ userId, orgUrl });
};

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

  // TODO: make this a count query instead
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

  // TODO: make this a count query
  const projectsCount = (
    await db.query.projects.findMany({
      where: eq(projects.userId, user.id),
    })
  ).length;

  return {
    success: true,
    userInfo: user,
    devInfo,
    recruiterInfo,
    projectsCount,
  };
};
