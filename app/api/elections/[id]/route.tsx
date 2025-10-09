import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: electionId } = await params;

    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        club: true,
        positions: {
          include: {
            candidates: true,
          },
          orderBy: { name: "asc" },
        },
        _count: {
          select: {
            tokens: true,
          },
        },
      },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 },
      );
    }

    // Transform dates to ISO strings for frontend
    const transformedElection = {
      ...election,
      votingStart: election.votingStart.toISOString(),
      votingEnd: election.votingEnd.toISOString(),
    };

    return NextResponse.json(transformedElection);
  } catch (error) {
    console.error("Error fetching election:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const electionId = (await params).id;
    const body = await request.json();

    // Verify election exists
    const existingElection = await prisma.election.findUnique({
      where: { id: electionId },
      include: { club: true },
    });

    if (!existingElection) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 },
      );
    }

    // Check if voting has started (prevent major changes to active elections)
    const now = new Date();
    const hasStarted = now >= existingElection.votingStart;

    if (hasStarted && (body.votingStart || body.votingEnd)) {
      return NextResponse.json(
        { error: "Cannot modify voting dates after election has started" },
        { status: 400 },
      );
    }

    // Validate dates if provided
    const votingStart = body.votingStart
      ? new Date(body.votingStart)
      : existingElection.votingStart;
    const votingEnd = body.votingEnd
      ? new Date(body.votingEnd)
      : existingElection.votingEnd;

    if (votingStart >= votingEnd) {
      return NextResponse.json(
        { error: "Voting start date must be before end date" },
        { status: 400 },
      );
    }

    // Update election in a transaction
    const updatedElection = await prisma.$transaction(async (tx) => {
      // Update basic election details
      const election = await tx.election.update({
        where: { id: electionId },
        data: {
          title: body.title || existingElection.title,
          subtitle:
            body.subtitle !== undefined
              ? body.subtitle
              : existingElection.subtitle,
          description:
            body.description !== undefined
              ? body.description
              : existingElection.description,
          year: body.year || existingElection.year,
          votingStart,
          votingEnd,
        },
      });

      // Update positions and candidates if provided and election hasn't started
      if (body.positions && !hasStarted) {
        // Delete existing positions and candidates
        await tx.candidate.deleteMany({
          where: {
            position: {
              electionId: electionId,
            },
          },
        });

        await tx.position.deleteMany({
          where: { electionId: electionId },
        });

        // Create new positions and candidates
        for (const position of body.positions) {
          const createdPosition = await tx.position.create({
            data: {
              electionId: electionId,
              name: position.name,
              description: position.description,
            },
          });

          // Create candidates for this position
          if (position.candidates && Array.isArray(position.candidates)) {
            for (const candidate of position.candidates) {
              await tx.candidate.create({
                data: {
                  positionId: createdPosition.id,
                  name: candidate.name,
                  image: candidate.image || "",
                  vision: candidate.vision,
                  experience: candidate.experience,
                },
              });
            }
          }
        }
      }

      return election;
    });

    // Fetch the complete updated election data
    const completeElection = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        positions: {
          include: {
            candidates: true,
          },
          orderBy: { name: "asc" },
        },
        _count: {
          select: {
            tokens: true,
          },
        },
      },
    });

    // Transform dates for frontend
    const transformedElection = {
      ...completeElection,
      votingStart: completeElection!.votingStart.toISOString(),
      votingEnd: completeElection!.votingEnd.toISOString(),
    };

    return NextResponse.json(transformedElection);
  } catch (error) {
    console.error("Error updating election:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const electionId = (await params).id;

    // Verify election exists
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: { club: true },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 },
      );
    }

    // Check if voting is active (prevent deletion of active elections)
    const now = new Date();
    if (now >= election.votingStart && now <= election.votingEnd) {
      return NextResponse.json(
        { error: "Cannot delete an active election" },
        { status: 400 },
      );
    }

    // Delete in correct order due to foreign key constraints
    await prisma.$transaction(async (tx) => {
      // Delete votes first
      await tx.vote.deleteMany({
        where: { electionId: electionId },
      });

      // Delete voting tokens
      await tx.votingToken.deleteMany({
        where: { electionId: electionId },
      });

      // Delete candidates
      await tx.candidate.deleteMany({
        where: {
          position: {
            electionId: electionId,
          },
        },
      });

      // Delete positions
      await tx.position.deleteMany({
        where: { electionId: electionId },
      });

      // Finally delete the election
      await tx.election.delete({
        where: { id: electionId },
      });
    });

    return NextResponse.json({ message: "Election deleted successfully" });
  } catch (error) {
    console.error("Error deleting election:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
