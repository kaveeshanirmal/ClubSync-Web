import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface UserJwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export async function GET(request: NextRequest) {
  try {
    let isAuthorized = false;
    const session = await getServerSession();

    if (session) {
      isAuthorized = true;
    } else {
      const authHeader = (await headers()).get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!,
          ) as UserJwtPayload;
          if (decoded) {
            isAuthorized = true;
          }
        } catch {
          return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 401 },
          );
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get("clubId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: Prisma.ElectionWhereInput = {};
    if (clubId) {
      where.clubId = clubId;
    }

    const [elections, total] = await Promise.all([
      prisma.election.findMany({
        where,
        include: {
          club: { select: { id: true, name: true } },
          positions: {
            include: { candidates: true },
            orderBy: { name: "asc" },
          },
          _count: { select: { tokens: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.election.count({ where }),
    ]);

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
    let isAuthorized = false;
    const session = await getServerSession();

    if (session) {
      isAuthorized = true;
    } else {
      const authHeader = (await headers()).get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!,
          ) as UserJwtPayload;
          if (decoded) {
            isAuthorized = true;
          }
        } catch {
          return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 401 },
          );
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
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

      if (body.positions && Array.isArray(body.positions)) {
        for (const position of body.positions) {
          const createdPosition = await tx.position.create({
            data: {
              electionId: newElection.id,
              name: position.name,
              description: position.description,
            },
          });

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

    const completeElection = await prisma.election.findUnique({
      where: { id: election.id },
      include: {
        positions: { include: { candidates: true }, orderBy: { name: "asc" } },
        _count: { select: { tokens: true } },
      },
    });

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
