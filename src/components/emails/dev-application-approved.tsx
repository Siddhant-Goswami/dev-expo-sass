import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Text,
} from '@react-email/components';
import * as React from 'react';
import Logo from '../ui/logo';

type DevApplicationSubmittedEmailProps = {
  userFirstname: string;
};

export const DevApplicationApprovedEmail = ({
  userFirstname,
}: DevApplicationSubmittedEmailProps) => (
  <Html>
    <Head />
    {/* <Preview>
      

    </Preview> */}
    <Body style={main}>
      <Container style={container}>
        <Logo style={logo} />
        {/* <Img
          src={`${baseUrl}/static/koala-logo.png`}
          width="170"
          height="50"
          alt="Koala"
          style={logo}
        /> */}
        <Text style={paragraph}>Hey {userFirstname} 👋!</Text>
        <Text style={paragraph}>
          We are thrilled to let you know that your application for becoming a
          Developer on Overpowered Jobs is accepted, and we extend a warm
          welcome to you as a valued member of our community!
        </Text>
        <Text style={paragraph}>
          Your profile has been successfully activated, and you are now part of
          an exclusive community of top-tier GenAI developers.
        </Text>
        <Text style={paragraph}>
          This is more than just a platform; it's a gateway to a realm of
          exciting projects, innovative companies, and unparalleled growth
          opportunities in the GenAI Space.
        </Text>
        <Text style={paragraph}>
          So what's next? Here are a few things you can do to get started:
          <br />
          1. List your existing and upcoming projects on your profile.
          <br />
          2. Share your profile with your network to get more exposure.
          <br />
          3. Explore other GenAI Developers on the platform and connect with
          them.
          <br />
        </Text>

        <Text style={paragraph}>
          if you have any questions or need assistance, our support team is here
          to help. You can reach us at{' '}
          <Link href={`mailto:overpoweredjobs@100xengineers.com`}>
            overpoweredjobs@100xengineers.com
          </Link>
          .
        </Text>

        <Text style={paragraph}>
          We are excited to support you on your journey to achieving
          extraordinary career milestones.
        </Text>
        {/* <Section style={btnContainer}>
          <Button className="" style={button} href="https://getkoala.com">
            Get started
          </Button>
        </Section> */}
        <Text style={paragraph}>
          Warm regards,
          <br />
          <Link href="https://www.overpoweredjobs.com/">
            The Overpowered Jobs Team
          </Link>
        </Text>
        {/* <Hr style={hr} /> */}
        {/* <Text style={footer}>408 Warren Rd - San Mateo, CA 94402</Text> */}
      </Container>
    </Body>
  </Html>
);

export default DevApplicationApprovedEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
};

const button: React.CSSProperties = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 12px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
