import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { randomUUID } from "crypto";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const clubRequest = await prisma.clubRequest.findUnique({
      where: { id: (await params).id },
      include: {
        requestedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!clubRequest) {
      return NextResponse.json(
        { error: "Club request not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(clubRequest);
  } catch (error) {
    console.error("Error fetching club request:", error);
    return NextResponse.json(
      { error: "Failed to fetch club request" },
      { status: 500 },
    );
  }
}

// PUT /api/club-requests/[id] - Update club request status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { requestStatus, adminComments } = body;

    if (!requestStatus) {
      return NextResponse.json(
        { error: "Request status is required" },
        { status: 400 },
      );
    }

    // If request is approved, create a new club
    if (requestStatus === "approved") {
      const clubRequest = await prisma.clubRequest.findUnique({
        where: { id },
        select: {
          clubName: true,
          motto: true,
          clubType: true,
          description: true,
          mission: true,
          headquarters: true,
          clubLogo: true,
          constitutionDoc: true,
          requestedById: true,
        },
      });

      if (!clubRequest) {
        return NextResponse.json(
          { error: "Club request not found" },
          { status: 404 },
        );
      }

      // Create a new club based on the request
      const newClub = await prisma.club.create({
        data: {
          name: clubRequest.clubName,
          motto: clubRequest.motto,
          about: clubRequest.description,
          mission: clubRequest.mission,
          headquarters: clubRequest.headquarters,
          profileImage: clubRequest.clubLogo,
          constitution: clubRequest.constitutionDoc,
          isActive: true,
          createdById: clubRequest.requestedById,
        },
      });

      // Automatically add the requester as president of the new club
      // First, let's try to create a member entry
      try {
        await prisma.$executeRaw`
          INSERT INTO club_members (id, "clubId", "userId", role, "membershipStatus", "joinedAt")
          VALUES (${randomUUID()}, ${newClub.id}, ${clubRequest.requestedById}, 'president', 'active', ${new Date()})
        `;
      } catch (memberError) {
        console.error("Error creating club member:", memberError);
        // Continue even if member creation fails
      }

      // Update the club request with approved status and club reference
      const updatedRequest = await prisma.clubRequest.update({
        where: { id },
        data: {
          requestStatus,
          adminComments: adminComments || "Request approved",
          approvedClubId: newClub.id,
        },
      });

      return NextResponse.json(updatedRequest);
    } else {
      // Just update the request status
      const updatedRequest = await prisma.clubRequest.update({
        where: { id },
        data: {
          requestStatus,
          adminComments: adminComments || undefined,
        },
      });

      return NextResponse.json(updatedRequest);
    }
  } catch (error) {
    console.error("Error updating club request:", error);
    return NextResponse.json(
      { error: "Failed to update club request" },
      { status: 500 },
    );
  }
}
