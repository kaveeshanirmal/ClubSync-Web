import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/client";
import { Resend } from "resend";
import { InterviewInviteEmail } from "@/emails/InterviewInviteEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: { requestId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = params;

    // STEP 1: Fetch all necessary data in one go
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: {
        user: { select: { firstName: true, email: true } },
        club: { select: { name: true, interviewScheduleUrl: true, id: true } },
      },
    });

    if (!joinRequest) {
      return NextResponse.json(
        { error: "Join request not found" },
        { status: 404 },
      );
    }

    // Deconstruct for easier access
    const { user, club } = joinRequest;

    // Add a check to ensure the schedule URL is configured
    if (!club.interviewScheduleUrl) {
      return NextResponse.json(
        { error: "Interview schedule URL is not configured for this club." },
        { status: 400 },
      );
    }

    // STEP 2: Verify permissions
    const clubMember = await prisma.clubMember.findFirst({
      where: {
        clubId: club.id,
        userId: session.user.id,
        role: { in: ["president", "secretary"] },
      },
    });

    if (!clubMember) {
      return NextResponse.json(
        { error: "You don't have permission to perform this action" },
        { status: 403 },
      );
    }

    // STEP 3: Send the email using Resend
    await resend.emails.send({
      // Use a "from" address with your verified custom domain
      from: `The ${club.name} Team <invites@clubsync.me>`,
      to: user.email,
      subject: `Invitation to Interview with ${club.name}`,
      // Use the React Email component
      react: InterviewInviteEmail({
        applicantName: user.firstName,
        clubName: club.name,
        scheduleUrl: club.interviewScheduleUrl,
      }),
    });

    // STEP 4: Update the status in the database
    const updatedRequest = await prisma.joinRequest.update({
      where: { id: requestId },
      data: { status: "interviewPending" },
    });

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    console.error("Error sending interview invite:", error);
    return NextResponse.json(
      { error: "Failed to send interview invite" },
      { status: 500 },
    );
  }
}
