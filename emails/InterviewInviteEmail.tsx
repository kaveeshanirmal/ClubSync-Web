import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface InterviewInviteEmailProps {
  applicantName: string;
  clubName: string;
  scheduleUrl: string;
}

export const InterviewInviteEmail = ({
  applicantName,
  clubName,
  scheduleUrl,
}: InterviewInviteEmailProps) => (
  <Html>
    <Head />
    <Preview>Invitation to Interview with {clubName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Interview Invitation</Heading>
        <Text style={text}>Hello {applicantName},</Text>
        <Text style={text}>
          Congratulations! We were very impressed with your application to join{" "}
          <strong style={clubNameStrongStyle}>{clubName}</strong> and would like
          to invite you for a brief online interview.
        </Text>
        <Text style={text}>
          Please use the button below to select a time that works best for you.
          Once you select a time, you will receive an automatic calendar
          invitation with a Google Meet link.
        </Text>
        <Button style={button} href={scheduleUrl}>
          Schedule Your Interview
        </Button>
        <Text style={text}>We look forward to speaking with you soon! 🚀</Text>
        <Text style={text}>
          Best regards,
          <br />
          <strong style={clubNameStrongStyle}>The {clubName} Team</strong>
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f7f7f7",
  fontFamily:
    "Inter, 'Helvetica Neue', Arial, sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "30px 20px 50px",
  borderRadius: "12px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
  maxWidth: "600px",
};

const h1 = {
  color: "#d94833",
  fontSize: "32px",
  fontWeight: "800",
  textAlign: "center" as const,
  padding: "0 20px",
  marginBottom: "30px",
};

const text = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 30px",
  marginBottom: "15px",
};

const clubNameStrongStyle = {
  color: "#f97316",
  fontWeight: "700",
};

const button = {
  backgroundColor: "#f97316",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "240px",
  padding: "15px 20px",
  margin: "30px auto",

  boxShadow: "0 4px 6px rgba(249, 115, 22, 0.3)",
};
