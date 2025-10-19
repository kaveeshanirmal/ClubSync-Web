import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { requestId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = params;

    // Fetch the core join request and verify its existence
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: {
        // Include the user to get their ID and basic info
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
      },
    });

    if (!joinRequest) {
      return NextResponse.json(
        { error: "Join request not found" },
        { status: 404 },
      );
    }

    // Security Check: Verify the logged-in user is an admin of the requested club
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

    // Now, fetch all the supplementary volunteering data for that user
    const volunteerStats = await prisma.volunteerStats.findUnique({
      where: { userId: joinRequest.user.id },
    });

    const eventHistory = await prisma.eventRegistration.findMany({
      where: {
        volunteerId: joinRequest.user.id,
      },
      include: {
        event: {
          select: {
            title: true,
            startDateTime: true,
          },
        },
      },
      orderBy: {
        event: {
          startDateTime: "desc",
        },
      },
      take: 5, // Limit to the 5 most recent events to keep it concise
    });

    // Combine all data into a single response object
    const profileData = {
      joinRequest: {
        motivation: joinRequest.motivation,
        relevantSkills: joinRequest.relevantSkills,
        socialLinks: joinRequest.socialLinks,
      },
      user: joinRequest.user,
      stats: volunteerStats || {
        totalPoints: 0,
        eventsParticipated: 0,
        eventsOrganized: 0,
      },
      eventHistory: eventHistory.map((reg) => ({
        title: reg.event.title,
        date: reg.event.startDateTime,
      })),
    };

    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error("Error fetching applicant profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch applicant profile" },
      { status: 500 },
    );
  }
}
