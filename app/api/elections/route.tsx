import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get("clubId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (clubId) {
      where.clubId = clubId;
    }

    // Fetch elections with pagination
    const [elections, total] = await Promise.all([
      prisma.election.findMany({
        where,
        include: {
          club: {
            select: {
              id: true,
              name: true,
            },
          },
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
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.election.count({ where }),
    ]);

    // Transform dates for frontend
    const transformedElections = elections.map((election) => ({
      ...election,
      votingStart: election.votingStart.toISOString(),
      votingEnd: election.votingEnd.toISOString(),
    }));

    return NextResponse.json({
      elections: transformedElections,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const { clubId, title, year, votingStart, votingEnd } = body;

    if (!clubId || !title || !year || !votingStart || !votingEnd) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: clubId, title, year, votingStart, votingEnd",
        },
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

    if (startDate < new Date()) {
      return NextResponse.json(
        { error: "Voting start date cannot be in the past" },
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
      if (body.positions && Array.isArray(body.positions)) {
        for (const position of body.positions) {
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

    return NextResponse.json(transformedElection, { status: 201 });
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
