import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/prisma/client";

// Helper function to check if user has club officer permission
async function checkClubOfficerPermission(clubId: string, userEmail: string) {
  try {
    // Get user from email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return { hasPermission: false, error: "User not found" };
    }

    // Check if user is system admin (can access all clubs)
    if (user.role === "systemAdmin") {
      return { hasPermission: true, user };
    }

    // Check if user is a club officer (president, secretary, treasurer, webmaster)
    const clubMember = await prisma.clubMember.findFirst({
      where: {
        clubId: clubId,
        userId: user.id,
        membershipStatus: "active", // Only active members
        role: {
          in: ["president", "secretary", "treasurer", "webmaster"],
        },
      },
      include: {
        club: true,
        user: true,
      },
    });

    if (!clubMember) {
      return {
        hasPermission: false,
        error:
          "Access denied. Only club officers (President, Secretary, Treasurer, Webmaster) can access meeting minutes.",
      };
    }

    return { hasPermission: true, user, clubMember };
  } catch (error) {
    console.error("Error checking club officer permission:", error);
    return {
      hasPermission: false,
      error: "Error checking permissions",
    };
  }
}

// GET /api/clubs/[id]/minutes/[minuteId] - Get specific meeting minute
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; minuteId: string }> },
) {
  try {
    const { id, minuteId } = await params;
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const clubId = id;

    // Check if user has club officer permission
    const permissionCheck = await checkClubOfficerPermission(
      clubId,
      session.user.email,
    );
    if (!permissionCheck.hasPermission) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 },
      );
    }

    // Get the specific meeting minute
    const meetingMinute = await prisma.meetingMinute.findFirst({
      where: {
        id: minuteId,
        clubId: clubId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!meetingMinute) {
      return NextResponse.json(
        { error: "Meeting minute not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(meetingMinute);
  } catch (error) {
    console.error("Error fetching meeting minute:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/clubs/[id]/minutes/[minuteId] - Update meeting minute
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; minuteId: string }> },
) {
  try {
    const { id, minuteId } = await params;
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const clubId = id;

    // Check if user has club officer permission
    const permissionCheck = await checkClubOfficerPermission(
      clubId,
      session.user.email,
    );
    if (!permissionCheck.hasPermission) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      title,
      content,
      meetingDate,
      attendeesCount,
      attendees,
      attachments,
      status,
    } = body;

    // Validate required fields
    if (!title || !meetingDate) {
      return NextResponse.json(
        { error: "Title and meeting date are required" },
        { status: 400 },
      );
    }

    // Check if the meeting minute exists and belongs to the club
    const existingMeetingMinute = await prisma.meetingMinute.findFirst({
      where: {
        id: minuteId,
        clubId: clubId,
      },
    });

    if (!existingMeetingMinute) {
      return NextResponse.json(
        { error: "Meeting minute not found" },
        { status: 404 },
      );
    }

    // Update the meeting minute
    const updatedMeetingMinute = await prisma.meetingMinute.update({
      where: { id: minuteId },
      data: {
        title,
        content: content || null,
        meetingDate: new Date(meetingDate),
        attendeesCount: attendeesCount || 0,
        attendees: attendees || [],
        attachments: attachments || [],
        status: status || existingMeetingMinute.status,
        updatedAt: new Date(),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Meeting minute updated successfully",
      meetingMinute: updatedMeetingMinute,
    });
  } catch (error) {
    console.error("Error updating meeting minute:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
