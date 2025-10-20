import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client"; // adjust path if needed

// GET /api/clubs/[clubId]/overview
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const clubId = params.id;

  try {
    // 1️ Get total members
    const memberCount = await prisma.clubMember.count({
      where: { clubId, membershipStatus: "active" },
    });

    // Get upcoming events (events whose startDateTime is in the future)
    const events = await prisma.event.findMany({
      where: {
        clubId,
        startDateTime: { gt: new Date() },
        isDeleted: false,
      },
      select: { id: true, startDateTime: true },
    });
    const upcomingEvents = events.filter(e => new Date(e.startDateTime) > new Date()).length;

    // 3️ Get pending requests (join requests that are still pending)
    const pendingRequests = await prisma.joinRequest.count({
      where: { clubId, status: "pendingReview" },
    });

    //  Return overview summary
    return NextResponse.json({
      memberCount,
      upcomingEvents,
      pendingRequests,
    });
  } catch (error) {
    console.error("Error fetching overview data:", error);
    return NextResponse.json(
      { error: "Failed to fetch overview data" },
      { status: 500 }
    );
  }
}
