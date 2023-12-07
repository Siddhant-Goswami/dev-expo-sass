'use server';
import { eq } from 'drizzle-orm';
// TODO: make these regular functions instead of server actions, and import `server-only`

import DevApplicationSubmittedEmail from '@/components/emails/dev-application-submitted';
import {
  flushServerEvents,
  logServerEvent,
} from '@/lib/analytics/posthog/server';
import { sendEmail } from '@/lib/emails/resend';
import {
  devApplicationSchema,
  type DevApplicationFormSubmitType,
} from '@/lib/validations/user';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
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
  const userEmail = z.string().email().parse(session.user.email);
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

    const emailSendResponse = await sendEmail({
      to: userEmail,
      subject: 'Dev Application Submitted! 😎',
      react: DevApplicationSubmittedEmail({
        userFirstname: session.user.user_metadata.name as unknown as string,
      }),
    });

    if (emailSendResponse.error ?? !emailSendResponse.data?.id) {
      console.error(
        `🔴 Failed to send dev application confirmation email to [${userEmail}]!`,
      );
      logServerEvent('dev_application_submit_email_send_fail', {
        distinct_id: userId,
        properties: {
          userId,
          userEmail,
          devApplicationId: devApplication.id.toString(),
          reason: emailSendResponse.error?.message ?? 'Unknown error',
        },
      });
      await flushServerEvents();
      return { success: false, message: 'Could not send email to developer!' };
    }

    console.log(
      `Email sent to [${userEmail}] with ID:`,
      emailSendResponse.data.id,
    );

    logServerEvent('dev_application_submit_email_send_success', {
      distinct_id: userId,
      properties: {
        userId,
        userEmail,
        devApplicationId: devApplication.id.toString(),
      },
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
