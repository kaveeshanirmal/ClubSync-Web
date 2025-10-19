import { InterviewInviteEmail } from "./InterviewInviteEmail";

export default function Preview() {
  return (
    <InterviewInviteEmail
      applicantName="John Doe"
      clubName="Photography Club"
      scheduleUrl="https://calendly.com/example/interview"
    />
  );
}
