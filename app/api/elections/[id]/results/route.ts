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
        positions: {
          include: {
            candidates: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 },
      );
    }

    if (new Date() < election.votingEnd) {
      return NextResponse.json(
        {
          error:
            "Election results are not yet available. Voting is still in progress.",
        },
        { status: 403 },
      );
    }

    const results = await Promise.all(
      election.positions.map(async (position) => {
        const candidatesWithVotes = await Promise.all(
          position.candidates.map(async (candidate) => {
            const voteCount = await prisma.vote.count({
              where: {
                candidateId: candidate.id,
                positionId: position.id,
                electionId: electionId,
              },
            });
            return {
              id: candidate.id,
              name: candidate.name,
              image: candidate.image,
              voteCount,
            };
          }),
        );
        return {
          positionId: position.id,
          positionName: position.name,
          candidates: candidatesWithVotes.sort(
            (a, b) => b.voteCount - a.voteCount,
          ),
        };
      }),
    );

    const totalVotesCast = await prisma.vote.count({ where: { electionId } });

    return NextResponse.json({
      electionTitle: election.title,
      totalVotesCast,
      results,
    });
  } catch (error) {
    console.error("Error fetching election results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
