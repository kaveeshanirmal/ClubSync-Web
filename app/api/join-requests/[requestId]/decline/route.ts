import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { requestId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = params;

    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
    });

    if (!joinRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Security check...
    const clubMember = await prisma.clubMember.findFirst({
      where: {
        clubId: joinRequest.clubId,
        userId: session.user.id,
        role: { in: ["president", "secretary"] },
      },
    });

    if (!clubMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Just update the status
    const updatedRequest = await prisma.joinRequest.update({
      where: { id: requestId },
      data: { status: "declined" },
    });

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    console.error("Error declining request:", error);
    return NextResponse.json(
      { error: "Failed to decline request" },
      { status: 500 },
    );
  }
}
