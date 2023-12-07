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

export const DevApplicationSubmittedEmail = ({
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
          Thank you for taking the time to complete your developer profile on
          Overpowered Jobs. We are thrilled to have you on board and are eager
          to dive into the details of your application.
        </Text>
        <Text style={paragraph}>
          Expect to hear back from us shortly. Upon approval of your
          application, you will receive detailed instructions on the next steps
          to fully activate your membership and begin connecting with top-tier
          employers.
        </Text>
        <Text style={paragraph}>
          We strive to provide a comprehensive assessment, considering not just
          your technical expertise but also your unique experiences and
          perspectives in the field of development. As a result, we evaluate
          each application carefully to ensure that every developer we onboard
          aligns with the high standards of skill, innovation, and passion that
          define the Overpowered Jobs community.
        </Text>

        <Text style={paragraph}>
          We are excited about the potential of working together. Keep your
          fingers crossed, and hope for the best!
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

export default DevApplicationSubmittedEmail;

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
