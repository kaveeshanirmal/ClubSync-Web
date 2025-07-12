import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// GET /api/voting/candidates - Get all candidates or filter by electionId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get("electionId");

    let whereClause = {};

    if (electionId) {
      whereClause = {
        position: {
          electionId: electionId,
        },
      };
    }

    const candidates = await prisma.candidate.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        image: true,
        vision: true,
        experience: true,
        positionId: true,
      },
    });

    return NextResponse.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 },
    );
  }
}

// POST /api/voting/candidates - Create new candidate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, image, vision, experience, positionId } = body;

    const candidate = await prisma.candidate.create({
      data: {
        name,
        image: image || "",
        vision: vision || "",
        experience: experience || "",
        positionId,
      },
      select: {
        id: true,
        name: true,
        image: true,
        vision: true,
        experience: true,
        positionId: true,
      },
    });

    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json(
      { error: "Failed to create candidate" },
      { status: 500 },
    );
  }
}
