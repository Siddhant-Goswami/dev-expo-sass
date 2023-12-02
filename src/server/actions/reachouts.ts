'use server';

import { OpportunityEmail } from '@/components/resend-emails/recruiter-dev-enquiry';
import { env } from '@/env';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Resend } from 'resend';
import { db } from '../db';
import { type RecruiterReachoutInsert, recruiterReachouts } from '../db/schema';
import { z } from 'zod';

const resend = new Resend(env.RESEND_API_KEY);

const recruiterReachoutInsertSchema = z.object({
  devId: z.string(),
  workType: z.enum(['full-time', 'freelance']),
  quotePrice: z.number().min(1000).max(1000000),
  message: z.string(),
});

const createRecruiterReachout = async (
  props: Pick<
    RecruiterReachoutInsert,
    'devId' | 'workType' | 'quotePrice' | 'message'
  >,
) => {
  const { devId, workType, quotePrice, message } =
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

  if (!session) {
    throw new Error('Unauthenticated');
  }

  try {
    const recruiterId = session.user.id;
    await db.insert(recruiterReachouts).values({
      recruiterId,
      devId,
      workType,
      quotePrice,
      message,
      timestamp: new Date(),
    });

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

    const emailSendResponse = await resend.emails.send({
      from: 'hello@overpoweredjobs.com',
      to: dev.email,
      subject: 'Exciting Opportunity Awaits You! 🚀',
      react: OpportunityEmail({
        devName: dev.user_metadata.name as unknown as string,
        message,
        recruiterName: session.user.user_metadata.name as unknown as string,
        quotePriceInRupees: quotePrice,
        typeOfWork: workType,
        recruiterEmail: session.user.email as unknown as string,
      }),
    });

    if (emailSendResponse.error) {
      throw new Error(
        emailSendResponse?.error?.message ?? 'Could not send email to dev!',
      );
    }

    console.log(`ID of email sent: `, emailSendResponse.data?.id);
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

export { createRecruiterReachout };
