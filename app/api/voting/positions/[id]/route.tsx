import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// GET /api/voting/positions/[electionId] - Get position by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const position = await prisma.position.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        electionId: true,
        createdAt: true,
      },
    });

    if (!position) {
      return NextResponse.json(
        { error: "Position not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(position);
  } catch (error) {
    console.error("Error fetching position:", error);
    return NextResponse.json(
      { error: "Failed to fetch position" },
      { status: 500 },
    );
  }
}

// PATCH /api/voting/positions/[electionId] - Update position by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description } = body;

    const updatedPosition = await prisma.position.update({
      where: { id },
      data: {
        name,
        description,
      },
      select: {
        id: true,
        name: true,
        description: true,
        electionId: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedPosition);
  } catch (error) {
    console.error("Error updating position:", error);
    return NextResponse.json(
      { error: "Failed to update position" },
      { status: 500 },
    );
  }
}

// DELETE /api/voting/positions/[electionId] - Delete position by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    await prisma.position.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Position deleted successfully" });
  } catch (error) {
    console.error("Error deleting position:", error);
    return NextResponse.json(
      { error: "Failed to delete position" },
      { status: 500 },
    );
  }
}
