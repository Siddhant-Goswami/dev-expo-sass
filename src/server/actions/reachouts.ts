'use server';

import { OpportunityEmail } from '@/components/emails/recruiter-dev-enquiry';
import { env } from '@/env';
import {
  flushServerEvents,
  logServerEvent,
} from '@/lib/analytics/posthog/server';
import { sendEmail } from '@/lib/emails/resend';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { db } from '../db';
import { recruiterReachouts, type RecruiterReachoutInsert } from '../db/schema';

const recruiterReachoutInsertSchema = z.object({
  devId: z.string(),
  workType: z.enum(['full-time', 'freelance']),
  // quotePrice: null,
  message: z.string(),
});

export const createRecruiterReachout = async (
  props: Pick<
    RecruiterReachoutInsert,
    'devId' | 'workType' | 'quotePrice' | 'message'
  >,
) => {
  const { devId, workType, message } =
    recruiterReachoutInsertSchema.parse(props);

  const supabase = createServerActionClient({
    cookies,
  });

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
    data: { session },
  } = await supabase.auth.getSession();

  const recruiterId = session?.user.id;
  if (!recruiterId) {
    throw new Error('Unauthenticated');
  }

  try {
    const [newlyCreatedReachout] = await db
      .insert(recruiterReachouts)
      .values({
        recruiterId,
        devId,
        workType,
        // quotePrice,
        message,
        timestamp: new Date(),
      })
      .returning({
        id: recruiterReachouts.id,
      });

    const reachoutId = newlyCreatedReachout?.id;

    if (!reachoutId) {
      throw new Error('Could not create reachout!');
    }

    const { data, error } = await supabaseAdmin.auth.admin.getUserById(devId);

    if (!data || error) {
      throw new Error('Could not find dev! ' + devId + ' ' + error?.message);
    }

    const dev = data.user;

    console.log(`Sending email to: `, dev.email);

    if (!dev.email) {
      throw new Error('Dev does not have an email!');
    }

    if (!session.user.email) {
      throw new Error('Recruiter does not have an email!');
    }

    if (session.user.email === dev.email) {
      throw new Error('You cannot send enquiry to yourself!');
    }

    const emailSendResponse = await sendEmail({
      to: dev.email,
      subject: 'Exciting Opportunity Awaits You! 🚀',
      react: OpportunityEmail({
        devName: dev.user_metadata.name as unknown as string,
        message,
        recruiterName: session.user.user_metadata.name as unknown as string,
        // quotePriceInRupees: quotePrice,
        typeOfWork: workType,
        recruiterEmail: session.user.email as unknown as string,
      }),
    });

    if (emailSendResponse.error) {
      logServerEvent('reachout_email_send_failed', {
        distinct_id: recruiterId,
        properties: {
          userId: recruiterId,
          reason: emailSendResponse.error.message,
          reachoutId: reachoutId.toString(),
        },
      });

      console.error(`Resend errrrrr`, emailSendResponse.error);

      throw new Error('Could not send email to developer!');
    }

    console.log(
      `Email sent to [${dev.email}] with ID:`,
      emailSendResponse.data?.id,
    );

    logServerEvent('reachout_email_send_success', {
      distinct_id: recruiterId,
      properties: {
        recruiterId,
        devId: dev.id,
        reachoutId: reachoutId.toString(),
      },
    });
    await flushServerEvents();

    return { success: true, message: 'Reachout sent!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Something went wrong!' };
  }
};

// const getIncomingReachouts = async ({ userId }: { userId: number }) => {
//   // const reachouts = await db.query.recruiterReachouts.findMany({
//   //   where: eq(recruiterReachouts.devId, userId),
//   // });
//   // return reachouts;
// };
