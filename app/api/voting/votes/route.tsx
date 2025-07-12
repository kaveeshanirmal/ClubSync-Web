import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

const voteSchema = z.object({
  electionId: z.number().positive(),
  positionId: z.number().positive(),
  candidateId: z.number().positive(),
  voterId: z.string().min(1), // Add voter identification
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = voteSchema.parse(body);
    const { electionId, positionId, candidateId, voterId } = validatedData;

    // Check if voter already voted for this position
    const existingVote = await prisma.vote.findFirst({
      where: {
        electionId,
        positionId,
        voterId, // Add voterId field to schema
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "Already voted for this position" },
        { status: 409 },
      );
    }

    // Validate election is active and candidate belongs to position
    const election = await prisma.election.findFirst({
      where: {
        id: electionId,
        isActive: true,
        endDate: { gt: new Date() },
      },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found or not active" },
        { status: 404 },
      );
    }

    const vote = await prisma.vote.create({
      data: {
        electionId,
        positionId,
        candidateId,
        voterId,
      },
      select: {
        id: true,
        electionId: true,
        positionId: true,
        candidateId: true,
        createdAt: true,
      },
    });

    return NextResponse.json(vote, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 },
      );
    }
    console.error("Error creating vote:", error);
    return NextResponse.json(
      { error: "Failed to create vote" },
      { status: 500 },
    );
  }
}
