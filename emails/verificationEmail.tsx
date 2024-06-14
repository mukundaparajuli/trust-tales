import {
  Html,
  Head,
  Preview,
  Heading,
  Text,
  Section,
  Row,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function EmailVerification({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head>
        <title>Email Verification</title>
      </Head>
      <Preview>Your OTP for verification is {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username}</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Here is your code for verification:
          </Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
      </Section>
    </Html>
  );
}
