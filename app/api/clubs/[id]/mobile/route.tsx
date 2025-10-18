import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get("detailed") === "true";
    const clubId = params.id;

    const selectFields: any = {
      id: true,
      name: true,
      motto: true,
      profileImage: true,
      coverImage: true,
      about: true,
      instagram: true,
      facebook: true,
      linkedIn: true,
      twitter: true,
      _count: {
        select: {
          members: {
            where: { membershipStatus: "active" },
          },
        },
      },
    };

    if (detailed) {
      Object.assign(selectFields, {
        mission: true,
        values: true,
        avenues: true,
        email: true,
        phone: true,
        website: true,
        googleMapURL: true,
        founded: true,
        headquarters: true,
      });
    }

    const club = await prisma.club.findUnique({
      where: { id: clubId, isDeleted: false },
      select: selectFields,
    });

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    return NextResponse.json(club);
  } catch (error) {
    console.error("Error fetching club details:", error);
    return NextResponse.json(
      { error: "Failed to fetch club details" },
      { status: 500 },
    );
  }
}
