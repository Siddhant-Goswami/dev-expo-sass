import { env } from '@/env';
import { Resend } from 'resend';

const resendClient = new Resend(env.RESEND_API_KEY);

export const sendEmail = async (
  props: Omit<Parameters<typeof resendClient.emails.send>[0], 'from'>,
) => {
  const response = await resendClient.emails.send({
    // For some reason this gives type error if not included here as non-nullable.
    text: props.text!,

    ...props,

    from: 'Overpowered Jobs <hello@overpoweredjobs.com>',
    reply_to: 'overpoweredjobs@100xengineers.com',
  });

  return response;
};
