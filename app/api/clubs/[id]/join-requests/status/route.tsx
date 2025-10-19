import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// The getUserIdFromToken function is no longer needed and can be removed.

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Get userId directly from the URL's query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // 2. Check if userId was provided
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required in the query" },
        { status: 400 },
      );
    }

    const clubId = params.id;

    const joinRequest = await prisma.joinRequest.findUnique({
      where: {
        // The unique key in your schema is likely clubId_userId
        clubId_userId: { clubId, userId },
      },
      select: {
        status: true,
      },
    });

    // If no request is found, return an empty status, which is expected
    if (!joinRequest) {
      return NextResponse.json({ status: null });
    }

    // Return the found request status
    return NextResponse.json(joinRequest);
  } catch (error) {
    console.error("Error checking join request status:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 },
    );
  }
}
