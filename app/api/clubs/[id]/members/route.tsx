import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// GET /api/clubs/[id]/members - Get all members of a specific club
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id: clubId } = params;

    // Verify club exists and is not deleted
    const club = await prisma.club.findFirst({
      where: {
        id: clubId,
        isDeleted: false,
      },
    });

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    // Fetch all club members with user details
    const members = await prisma.clubMember.findMany({
      where: {
        clubId: clubId,
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
      orderBy: [
        { role: "asc" }, // Presidents first, then secretary, etc.
        { joinedAt: "desc" }, // Most recent joiners first within same role
      ],
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching club members:", error);
    return NextResponse.json(
      { error: "Failed to fetch club members" },
      { status: 500 },
    );
  }
}
