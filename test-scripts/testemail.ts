import { OpportunityEmail } from '@/components/resend-emails/recruiter-dev-enquiry';
import { env } from '@/env';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);
const emailSendResponse = await resend.emails.send({
  from: 'hello@overpoweredjobs.com',
  to: 'ajinkyabodke@gmail.com',
  subject: 'hello world',
  react: OpportunityEmail({
    devName: 'AjinkyaB',
    message: 'Hi,testing 123',
    recruiterName: 'Sid 100x',
    quotePriceInRupees: 10000,
    typeOfWork: 'freelance',
    recruiterEmail: 'siddhant@100xengineers.com',
  }),
});

if (emailSendResponse.error) {
  throw new Error(
    emailSendResponse?.error?.message ?? 'Could not send email to dev!',
  );
} else {
  console.log(emailSendResponse);
}
