import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
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

async function authorizeRequest() {
  const session = await getServerSession();
  if (session) return true;

  const authHeader = (await headers()).get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as UserJwtPayload;
      return !!decoded;
    } catch {
      return false;
    }
  }
  return false;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    if (!(await authorizeRequest())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: electionId } = params;
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        club: true,
        positions: { include: { candidates: true }, orderBy: { name: "asc" } },
        _count: { select: { tokens: true } },
      },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 },
      );
    }

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
  { params }: { params: { id: string } },
) {
  try {
    if (!(await authorizeRequest())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: electionId } = params;
    const body = await request.json();
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

    const now = new Date();
    const hasStarted = now >= existingElection.votingStart;

    if (hasStarted && (body.votingStart || body.votingEnd)) {
      return NextResponse.json(
        { error: "Cannot modify voting dates after election has started" },
        { status: 400 },
      );
    }

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

    await prisma.$transaction(async (tx) => {
      await tx.election.update({
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

      if (body.positions && !hasStarted) {
        await tx.candidate.deleteMany({
          where: { position: { electionId: electionId } },
        });
        await tx.position.deleteMany({ where: { electionId: electionId } });

        for (const position of body.positions) {
          const createdPosition = await tx.position.create({
            data: {
              electionId: electionId,
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
    });

    const completeElection = await prisma.election.findUnique({
      where: { id: electionId },
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
  { params }: { params: { id: string } },
) {
  try {
    if (!(await authorizeRequest())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: electionId } = params;
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

    const now = new Date();
    if (now >= election.votingStart && now <= election.votingEnd) {
      return NextResponse.json(
        { error: "Cannot delete an active election" },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.vote.deleteMany({ where: { electionId: electionId } });
      await tx.votingToken.deleteMany({ where: { electionId: electionId } });
      await tx.candidate.deleteMany({
        where: { position: { electionId: electionId } },
      });
      await tx.position.deleteMany({ where: { electionId: electionId } });
      await tx.election.delete({ where: { id: electionId } });
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
