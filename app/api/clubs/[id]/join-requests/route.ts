import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import jwt from "jsonwebtoken";

function getUserIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clubId = params.id;
    const body = await request.json();
    const { motivation, relevantSkills, socialLinks } = body;

    // Check if already a member
    const existingMember = await prisma.clubMember.findUnique({
      where: {
        clubId_userId: { clubId, userId },
      },
    });

    if (existingMember) {
      return NextResponse.json({ error: "Already a member" }, { status: 400 });
    }

    // Check if request already exists
    const existingRequest = await prisma.joinRequest.findUnique({
      where: {
        clubId_userId: { clubId, userId },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "Request already submitted" },
        { status: 400 },
      );
    }

    const joinRequest = await prisma.joinRequest.create({
      data: {
        clubId,
        userId,
        motivation: motivation || null,
        relevantSkills: relevantSkills || [],
        socialLinks: socialLinks || [],
        status: "pendingReview",
      },
    });

    return NextResponse.json(joinRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating join request:", error);
    return NextResponse.json(
      { error: "Failed to create join request" },
      { status: 500 },
    );
  }
}
