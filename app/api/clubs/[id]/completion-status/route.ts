import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// GET /api/clubs/[id]/completion-status - Check if club details are complete
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clubId } = await params;

    if (!clubId) {
      return NextResponse.json(
        { error: "Club ID is required" },
        { status: 400 }
      );
    }

    // Fetch club data
    const club = await (prisma.club as any).findFirst({
      where: {
        id: clubId,
        isDeleted: false,
      },
    });

    if (!club) {
      return NextResponse.json(
        { error: "Club not found" },
        { status: 404 }
      );
    }

    // Check if essential club details are complete
    const requiredFields = {
      name: club.name,
      motto: club.motto,
      about: club.about,
      mission: club.mission,
      email: club.email,
      phone: club.phone,
      headquarters: club.headquarters,
      profileImage: club.profileImage,
      coverImage: club.coverImage,
    };

    // Count completed fields
    const completedFields = Object.values(requiredFields).filter(
      (field) => field && field.toString().trim() !== ""
    ).length;

    const totalFields = Object.keys(requiredFields).length;
    const completionPercentage = Math.round((completedFields / totalFields) * 100);

    // Consider complete if 80% or more fields are filled
    const isComplete = completionPercentage >= 80;

    return NextResponse.json({
      isComplete,
      completionPercentage,
      completedFields,
      totalFields,
      missingFields: Object.keys(requiredFields).filter(
        (key) => !requiredFields[key as keyof typeof requiredFields] || 
        requiredFields[key as keyof typeof requiredFields].toString().trim() === ""
      ),
    });

  } catch (error) {
    console.error("Error checking club completion status:", error);
    return NextResponse.json(
      { error: "Failed to check completion status" },
      { status: 500 }
    );
  }
}