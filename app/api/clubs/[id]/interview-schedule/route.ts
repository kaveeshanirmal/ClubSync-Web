import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/client";

// GET: Fetch the interview schedule URL
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

    // Verify user has permission
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
        { error: "You don't have permission to access this club" },
        { status: 403 },
      );
    }

    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { interviewScheduleUrl: true },
    });

    return NextResponse.json(
      { interviewScheduleUrl: club?.interviewScheduleUrl || null },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching interview schedule URL:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview schedule URL" },
      { status: 500 },
    );
  }
}

// POST/PUT: Save or update the interview schedule URL
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clubId = params.id;
    const { interviewScheduleUrl } = await request.json();

    // Validate URL format
    if (!interviewScheduleUrl || typeof interviewScheduleUrl !== "string") {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 },
      );
    }

    // Basic URL validation
    try {
      new URL(interviewScheduleUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    // Verify user has permission
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
        { error: "You don't have permission to update this club" },
        { status: 403 },
      );
    }

    // Update the club with the new URL
    const updatedClub = await prisma.club.update({
      where: { id: clubId },
      data: { interviewScheduleUrl },
      select: { interviewScheduleUrl: true },
    });

    return NextResponse.json(
      {
        message: "Interview schedule URL saved successfully",
        interviewScheduleUrl: updatedClub.interviewScheduleUrl,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving interview schedule URL:", error);
    return NextResponse.json(
      { error: "Failed to save interview schedule URL" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
