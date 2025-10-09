import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// PATCH /api/clubs/[id]/members/[memberId]/role - Update member role
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> },
) {
  try {
    const { id: clubId, memberId } = await params;
    const body = await request.json();
    const { role } = body;

    // Validate role
    const validRoles = [
      "member",
      "president",
      "secretary",
      "treasurer",
      "webmaster",
    ];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be one of: " + validRoles.join(", ") },
        { status: 400 },
      );
    }

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

    // Verify member exists in this club
    const existingMember = await prisma.clubMember.findFirst({
      where: {
        id: memberId,
        clubId: clubId,
      },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: "Member not found in this club" },
        { status: 404 },
      );
    }

    // For executive roles, ensure only one person can hold each position
    if (["president", "secretary", "treasurer", "webmaster"].includes(role)) {
      const existingRoleHolder = await prisma.clubMember.findFirst({
        where: {
          clubId: clubId,
          role: role as any,
          id: { not: memberId }, // Exclude current member
        },
      });

      if (existingRoleHolder) {
        // Demote existing role holder to member
        await prisma.clubMember.update({
          where: { id: existingRoleHolder.id },
          data: { role: "member" },
        });
      }
    }

    // Update the member's role
    const updatedMember = await prisma.clubMember.update({
      where: { id: memberId },
      data: { role: role as any },
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
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("Error updating member role:", error);
    return NextResponse.json(
      { error: "Failed to update member role" },
      { status: 500 },
    );
  }
}
