import DevApplicationApprovedEmail from '@/components/emails/dev-application-approved';
import { env } from '@/env';
import {
  flushServerEvents,
  logServerEvent,
} from '@/lib/analytics/posthog/server';
import { sendEmail } from '@/lib/emails/resend';
import { adminProcedure, createTRPCRouter } from '@/server/api/trpc';
import { devApplications, devProfiles, userProfiles } from '@/server/db/schema';
import { createClient } from '@supabase/supabase-js';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const adminRouter = createTRPCRouter({
  approveDev: adminProcedure
    .input(z.object({ applicationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const application = await ctx.db.query.devApplications.findFirst({
        where: (da, { eq }) => eq(da.id, input.applicationId),
      });
      if (!application) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Application not found!',
        });
      }

      const supabaseAdmin = createClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        },
      );

      const {
        data: { user: userOfApplication },
      } = await supabaseAdmin.auth.getUser(application.userId);

      if (!userOfApplication) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found!' });
      }

      const userId = application.userId;
      const userEmail = z.string().email().parse(ctx.session.user.email);

      const now = new Date();

      await Promise.allSettled([
        ctx.db.insert(devProfiles).values({
          userId: application.userId,
          gitHubUsername: application.gitHubUsername,
          twitterUsername: application.twitterUsername,
          websiteUrl: application.websiteUrl,
        }),
        ctx.db
          .update(devApplications)
          .set({
            status: 'approved',
            statusUpdatedAt: now,
            updatedAt: now,
          })
          .where(eq(devApplications.id, input.applicationId)),

        ctx.db
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

      const emailSendResponse = await sendEmail({
        to: userEmail,
        subject: "You're approved! 🔥",
        react: DevApplicationApprovedEmail({
          userFirstname: userOfApplication.user_metadata
            .name as unknown as string,
        }),
      });

      if (emailSendResponse.error ?? !emailSendResponse.data?.id) {
        console.error(
          `🔴 Failed to send dev application approval email to [${userEmail}]!`,
        );
        logServerEvent('dev_application_approve_email_send_fail', {
          distinct_id: userId,
          properties: {
            userId,
            userEmail,
            reason: emailSendResponse.error?.message ?? 'Unknown error',
            devApplicationId: application.id.toString(),
          },
        });
        await flushServerEvents();
        return {
          success: false,
          message: 'Could not send email to developer!',
        };
      }

      console.log(
        `Email sent to [${userEmail}] with ID:`,
        emailSendResponse.data.id,
      );

      logServerEvent('dev_application_approve_email_send_success', {
        distinct_id: userId,
        properties: {
          userId,
          userEmail,
          devApplicationId: application.id.toString(),
        },
      });

      await flushServerEvents();

      return {
        success: true,
      };
    }),
});
