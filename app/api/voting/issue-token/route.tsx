import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "A92ksLmf20DLz8n7BvZxtuQp49Fsm2wYZERyKcmH4IOT5eMQNvXxqAYTKPfDl6a1";

export async function POST(req: NextRequest) {
  try {
    // Check for authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract and verify JWT token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Token not provided" },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const userId = decoded.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 },
      );
    }

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

    const { electionId } = body;
    if (!electionId) {
      return NextResponse.json(
        { error: "electionId is required" },
        { status: 400 },
      );
    }

    // Check election timing and token generation eligibility
    const election = await prisma.election.findUnique({
      where: { id: electionId },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 },
      );
    }

    const now = new Date();

    // Check if voting period is active
    if (!election.votingStart || !election.votingEnd) {
      return NextResponse.json(
        { error: "Election voting period not configured" },
        { status: 400 },
      );
    }

    if (now < election.votingStart) {
      return NextResponse.json(
        { error: "Voting has not started yet" },
        { status: 403 },
      );
    }

    if (now > election.votingEnd) {
      return NextResponse.json(
        { error: "Voting period has ended" },
        { status: 403 },
      );
    }

    // Check if user already has a voting token for this election
    const existing = await prisma.votingToken.findFirst({
      where: { electionId, issuedTo: userId },
    });

    if (existing) {
      // Check if the existing token is still valid (not used and not expired)
      if (existing.used) {
        return NextResponse.json(
          { error: "Voting token already used" },
          { status: 403 },
        );
      }

      if (existing.expiresAt < now) {
        // Token expired - only allow renewal if voting period is still active
        // (which we already checked above)
        await prisma.votingToken.delete({ where: { id: existing.id } });
      } else {
        // Token is still valid
        return NextResponse.json({ token: existing.id });
      }
    }

    // Create new voting token

    const newToken = await prisma.votingToken.create({
      data: {
        electionId,
        issuedTo: userId,
      },
    });

    return NextResponse.json({ token: newToken.id });
  } catch (err) {
    console.error("Unexpected error in voting token endpoint:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
