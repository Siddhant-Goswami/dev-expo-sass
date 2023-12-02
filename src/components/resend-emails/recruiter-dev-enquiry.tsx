type OpportunityEmailProps = {
  devName: string;
  recruiterName: string;
  typeOfWork: string;
  quotePriceInRupees: number;
  message: string;
  recruiterEmail: string;
};

export const OpportunityEmail = ({
  devName,
  recruiterName,
  typeOfWork,
  quotePriceInRupees,
  message,
  recruiterEmail,
}: Readonly<OpportunityEmailProps>) => (
  <div>
    <p>Hey {devName},</p>
    <p>We hope this message finds you well! 🤩</p>

    <p>
      We're excited to share an opportunity highlighted by {recruiterName} who
      found interest in your showcased project. They've identified a fantastic
      opportunity for you to consider:
    </p>

    <ul>
      <li>Recruiter's Name: {recruiterName}</li>
      <li>Type of Work: {typeOfWork}</li>
      <li>Quote Price: {quotePriceInRupees}</li>
      <li>Message from Recruiter: {message}</li>
      <li>Recruiter's Email: {recruiterEmail}</li>
    </ul>

    <p>
      This could be the next big step in your career journey, and we believe
      your skills and expertise align perfectly with what our client is looking
      for.
    </p>

    <p>
      If you're interested or have any questions, please don't hesitate to reach
      out to {recruiterName} at {recruiterEmail}. We're looking forward to
      hearing from you soon!
    </p>

    <p>
      Best regards, <br /> The 100xTalent Team 🚀
    </p>
  </div>
);
