import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clubId = params.id;

    // Verify user has permission to view this club's requests
    const clubMember = await prisma.clubMember.findFirst({
      where: {
        clubId,
        userId: session.user.id,
        role: {
          in: ["president", "secretary"],
        },
      },
    });

    if (!clubMember) {
      return NextResponse.json(
        {
          error:
            "You don't have permission to view join requests for this club",
        },
        { status: 403 },
      );
    }

    // Fetch join requests with user details
    const joinRequests = await prisma.joinRequest.findMany({
      where: {
        clubId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform to match Applicant interface
    const applicants = joinRequests.map((request) => ({
      id: request.id,
      name: `${request.user.firstName} ${request.user.lastName}`,
      email: request.user.email,
      status: request.status
        .toLowerCase()
        .replace(/([A-Z])/g, " $1")
        .trim() as
        | "pending review"
        | "interview pending"
        | "approved"
        | "declined",
      submittedAt: request.createdAt.toISOString(),
      motivation: request.motivation,
      relevantSkills: request.relevantSkills,
      socialLinks: request.socialLinks,
      userImage: request.user.image,
    }));

    return NextResponse.json(applicants, { status: 200 });
  } catch (error) {
    console.error("Error fetching join requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch join requests" },
      { status: 500 },
    );
  }
}
