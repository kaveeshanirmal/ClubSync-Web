import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// GET /api/voting/candidates/[id] - Get candidate by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        vision: true,
        experience: true,
        positionId: true,
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(candidate);
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidate" },
      { status: 500 },
    );
  }
}

// PATCH /api/voting/candidates/[id] - Update candidate by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, image, vision, experience } = body;

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        name,
        image,
        vision,
        experience,
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

    return NextResponse.json(updatedCandidate);
  } catch (error) {
    console.error("Error updating candidate:", error);
    return NextResponse.json(
      { error: "Failed to update candidate" },
      { status: 500 },
    );
  }
}

// DELETE /api/voting/candidates/[id] - Delete candidate
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.candidate.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return NextResponse.json(
      { error: "Failed to delete candidate" },
      { status: 500 },
    );
  }
}
