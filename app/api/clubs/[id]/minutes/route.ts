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

// GET /api/clubs/[id]/minutes - Get all meeting minutes for a club
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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

    // Get all meeting minutes for the club
    const meetingMinutes = await prisma.meetingMinute.findMany({
      where: {
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
            name: true,
          },
        },
      },
      orderBy: {
        meetingDate: "desc",
      },
    });

    return NextResponse.json(meetingMinutes);
  } catch (error) {
    console.error("Error fetching meeting minutes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/clubs/[id]/minutes - Create new meeting minute
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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

    // Verify the club exists
    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
        isDeleted: false,
      },
    });

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    // Create the meeting minute
    const meetingMinute = await prisma.meetingMinute.create({
      data: {
        clubId: clubId,
        title,
        content: content || null,
        meetingDate: new Date(meetingDate),
        attendeesCount: attendeesCount || 0,
        attendees: attendees || [],
        attachments: attachments || [],
        status: status || "draft",
        createdById: permissionCheck.user!.id,
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
      message: "Meeting minute created successfully",
      meetingMinute,
    });
  } catch (error) {
    console.error("Error creating meeting minute:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
