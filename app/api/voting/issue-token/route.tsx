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

    // Check if user already has a voting token for this election
    let existing;
    try {
      existing = await prisma.votingToken.findFirst({
        where: { electionId, issuedTo: userId },
      });
    } catch (dbError) {
      console.error("Database query error (findFirst):", dbError);
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 },
      );
    }

    if (existing) {
      return NextResponse.json({ token: existing.id });
    }

    // Create new voting token
    let newToken;
    try {
      newToken = await prisma.votingToken.create({
        data: {
          electionId,
          issuedTo: userId,
        },
      });
    } catch (dbError) {
      console.error("Database creation error:", dbError);

      return NextResponse.json(
        { error: "Failed to create voting token" },
        { status: 500 },
      );
    }

    return NextResponse.json({ token: newToken.id });
  } catch (err) {
    console.error("Unexpected error in voting token endpoint:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
