import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// GET /api/voting/positions - Get all positions or filter by electionId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get("electionId");

    const whereClause = electionId ? { electionId: electionId } : {};

    const positions = await prisma.position.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        description: true,
        electionId: true,
      },
    });

    return NextResponse.json(positions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      { error: "Failed to fetch positions" },
      { status: 500 },
    );
  }
}

// POST /api/voting/positions - Create new position
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, electionId } = body;

    // Check if position already exists in the election
    const existingPosition = await prisma.position.findFirst({
      where: { name, electionId },
    });

    if (existingPosition) {
      return NextResponse.json(
        { error: "Position with this name already exists in the election" },
        { status: 409 },
      );
    }

    // Create position
    const position = await prisma.position.create({
      data: {
        name,
        description: description || "",
        electionId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        electionId: true,
      },
    });

    return NextResponse.json(position, { status: 201 });
  } catch (error) {
    console.error("Error creating position:", error);
    return NextResponse.json(
      { error: "Failed to create position" },
      { status: 500 },
    );
  }
}
