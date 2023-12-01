import { OpportunityEmail } from '@/components/resend-emails/recruiter-dev-enquiry';
import { env } from '@/env';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);
const emailSendResponse = await resend.emails.send({
  from: '',
  to: '',
  subject: '',
  react: OpportunityEmail({
    devName: '',
    message: '',
    recruiterName: '',
    quotePriceInRupees: 10000,
    typeOfWork: '',
    recruiterEmail: '',
  }),
});

if (emailSendResponse.error) {
  throw new Error(
    emailSendResponse?.error?.message ?? 'Could not send email to dev!',
  );
} else {
  console.log(emailSendResponse);
}
