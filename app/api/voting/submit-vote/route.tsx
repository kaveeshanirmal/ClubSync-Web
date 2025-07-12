import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { votingToken, votes } = body;

    // Validate required fields
    if (!votingToken) {
      return NextResponse.json(
        { error: "Voting token is required" },
        { status: 400 },
      );
    }

    if (!votes || !Array.isArray(votes) || votes.length === 0) {
      return NextResponse.json(
        { error: "Votes array is required and must not be empty" },
        { status: 400 },
      );
    }

    // Validate voting token
    const token = await prisma.votingToken.findUnique({
      where: { id: votingToken },
      include: {
        election: {
          include: {
            positions: {
              include: {
                candidates: true,
              },
            },
          },
        },
      },
    });

    if (!token) {
      return NextResponse.json(
        { error: "Invalid voting token" },
        { status: 401 },
      );
    }

    // Check if token is already used
    if (token.used) {
      return NextResponse.json(
        { error: "Voting token has already been used" },
        { status: 403 },
      );
    }

    // Check if voting period is active
    const now = new Date();
    if (!token.election.votingStart || !token.election.votingEnd) {
      return NextResponse.json(
        { error: "Election voting period not configured" },
        { status: 400 },
      );
    }

    if (now < token.election.votingStart) {
      return NextResponse.json(
        { error: "Voting has not started yet" },
        { status: 403 },
      );
    }

    if (now > token.election.votingEnd) {
      return NextResponse.json(
        { error: "Voting period has ended" },
        { status: 403 },
      );
    }

    // Validate vote structure
    const validationErrors = [];
    const positionIds = new Set();
    const candidateIds = new Set();

    for (const vote of votes) {
      if (!vote.positionId || !vote.candidateId) {
        validationErrors.push("Each vote must have positionId and candidateId");
        continue;
      }

      // Check for duplicate position votes
      if (positionIds.has(vote.positionId)) {
        validationErrors.push(`Multiple votes for position ${vote.positionId}`);
        continue;
      }
      positionIds.add(vote.positionId);

      // Find the position in the election
      const position = token.election.positions.find(
        (p) => p.id === vote.positionId,
      );
      if (!position) {
        validationErrors.push(
          `Position ${vote.positionId} not found in this election`,
        );
        continue;
      }

      // Check if candidate exists in this position
      const candidate = position.candidates.find(
        (c) => c.id === vote.candidateId,
      );
      if (!candidate) {
        validationErrors.push(
          `Candidate ${vote.candidateId} not found in position ${vote.positionId}`,
        );
        continue;
      }

      candidateIds.add(vote.candidateId);
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Vote validation failed", details: validationErrors },
        { status: 400 },
      );
    }

    // Check if user is voting for all required positions
    const allPositions = token.election.positions.map((p) => p.id);
    const votedPositions = Array.from(positionIds) as string[];
    const missingPositions = allPositions.filter(
      (p) => !votedPositions.includes(p),
    );

    if (missingPositions.length > 0) {
      return NextResponse.json(
        {
          error: "Must vote for all positions in the election",
          missingPositions,
        },
        { status: 400 },
      );
    }

    // Check for any existing votes (double-voting prevention)
    const existingVotes = await prisma.vote.findMany({
      where: {
        electionId: token.electionId,
        positionId: { in: votedPositions },
      },
    });

    if (existingVotes.length > 0) {
      console.warn(
        `Potential double-voting attempt detected for election ${token.electionId}`,
      );
      // Note: This is a weak check since we don't link votes to users
      // In a real system, you might want additional fraud detection
    }

    // Create all votes and mark token as used in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create all votes
      const createdVotes = await Promise.all(
        votes.map((vote) =>
          tx.vote.create({
            data: {
              electionId: token.electionId,
              positionId: vote.positionId,
              candidateId: vote.candidateId,
            },
          }),
        ),
      );

      // Mark token as used
      await tx.votingToken.update({
        where: { id: votingToken },
        data: { used: true },
      });

      return createdVotes;
    });

    // Log successful vote submission (without revealing vote details)
    console.log(
      `Vote submitted successfully for election ${token.electionId}, token ${votingToken}`,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Vote submitted successfully",
        votesCount: result.length,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Unexpected error in vote submission endpoint:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
