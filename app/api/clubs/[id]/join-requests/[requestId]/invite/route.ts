import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/client";

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

    // Find the join request to get its clubId
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      select: { clubId: true },
    });

    if (!joinRequest) {
      return NextResponse.json(
        { error: "Join request not found" },
        { status: 404 },
      );
    }

    // Verify the user is an admin of the club associated with the request
    const clubMember = await prisma.clubMember.findFirst({
      where: {
        clubId: joinRequest.clubId,
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

    // Update the status to 'interviewPending'
    const updatedRequest = await prisma.joinRequest.update({
      where: { id: requestId },
      data: { status: "interviewPending" },
    });

    // NOTE: In the future, this is where you would trigger the email sending logic.

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    console.error("Error sending interview invite:", error);
    return NextResponse.json(
      { error: "Failed to send interview invite" },
      { status: 500 },
    );
  }
}
