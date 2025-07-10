import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userId = decoded.id;

    const { electionId } = await req.json();

    // Check if already has a token
    const existing = await prisma.votingToken.findFirst({
      where: { electionId, issuedTo: userId },
    });

    if (existing) {
      return NextResponse.json({ token: existing.id });
    }

    const newToken = await prisma.votingToken.create({
      data: {
        electionId,
        issuedTo: userId,
      },
    });

    return NextResponse.json({ token: newToken.id });
  } catch (err) {
    console.error("Token issue error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
