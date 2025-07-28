import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clubId = params.id;

    // Verify club exists and user has access
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { id: true, name: true, isActive: true },
    });

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    if (!club.isActive) {
      return NextResponse.json(
        { error: "Club is not active" },
        { status: 403 },
      );
    }

    // Fetch elections with all related data
    const elections = await prisma.election.findMany({
      where: {
        clubId: clubId,
      },
      include: {
        positions: {
          include: {
            candidates: true,
          },
        },
        _count: {
          select: {
            tokens: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to match the frontend interface
    const transformedElections = elections.map((election) => ({
      id: election.id,
      title: election.title,
      subtitle: election.subtitle,
      description: election.description,
      year: election.year,
      votingStart: election.votingStart.toISOString(),
      votingEnd: election.votingEnd.toISOString(),
      positions: election.positions.map((position) => ({
        id: position.id,
        name: position.name,
        description: position.description,
        candidates: position.candidates.map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          image: candidate.image,
          vision: candidate.vision,
          experience: candidate.experience,
        })),
      })),
      _count: {
        tokens: election._count.tokens,
      },
    }));

    return NextResponse.json(transformedElections);
  } catch (error) {
    console.error("Error fetching elections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clubId = params.id;
    const body = await request.json();

    // Validate required fields
    const { title, year, votingStart, votingEnd, positions } = body;

    if (!title || !year || !votingStart || !votingEnd) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify club exists and is active
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { id: true, isActive: true },
    });

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    if (!club.isActive) {
      return NextResponse.json(
        { error: "Club is not active" },
        { status: 403 },
      );
    }

    // Validate dates
    const startDate = new Date(votingStart);
    const endDate = new Date(votingEnd);

    if (startDate >= endDate) {
      return NextResponse.json(
        { error: "Voting start date must be before end date" },
        { status: 400 },
      );
    }

    // Create election with positions and candidates in a transaction
    const election = await prisma.$transaction(async (tx) => {
      const newElection = await tx.election.create({
        data: {
          clubId,
          title,
          subtitle: body.subtitle,
          description: body.description,
          year,
          votingStart: startDate,
          votingEnd: endDate,
        },
      });

      // Create positions and candidates if provided
      if (positions && Array.isArray(positions)) {
        for (const position of positions) {
          const createdPosition = await tx.position.create({
            data: {
              electionId: newElection.id,
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

      return newElection;
    });

    // Fetch the complete election data to return
    const completeElection = await prisma.election.findUnique({
      where: { id: election.id },
      include: {
        positions: {
          include: {
            candidates: true,
          },
        },
        _count: {
          select: {
            tokens: true,
          },
        },
      },
    });

    return NextResponse.json(completeElection, { status: 201 });
  } catch (error) {
    console.error("Error creating election:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
