import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/prisma/client";

// GET endpoint to fetch club details for the complete-details form
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const clubId = params.id;

    // Find the club
    const club = await prisma.club.findUnique({
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

    // Check if user has permission to access this club
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is the club creator or a club admin (president/secretary)
    const isCreator = club.createdById === user.id;
    const clubMember = await prisma.clubMember.findFirst({
      where: {
        clubId: clubId,
        userId: user.id,
        role: {
          in: ['president', 'secretary']
        }
      }
    });

    if (!isCreator && !clubMember && user.role !== 'systemAdmin') {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Transform club data to match the form structure
    const clubDetails = {
      coverImage: club.coverImage || "",
      profileImage: club.profileImage || "",
      socialMedia: {
        facebook: club.facebook || "",
        instagram: club.instagram || "",
        twitter: club.twitter || "",
        linkedIn: club.linkedIn || "",
        website: club.website || "",
      },
      contact: {
        email: club.email || "",
        phone: club.phone || "",
        googleMapURL: club.googleMapURL || "",
        headquarters: club.headquarters || "",
      },
      details: {
        values: club.values || [],
        avenues: club.avenues || [],
        about: club.about || "",
        mission: club.mission || "",
      },
    };

    return NextResponse.json(clubDetails);
  } catch (error) {
    console.error("Error fetching club details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT endpoint to update club details
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const clubId = params.id;
    const body = await request.json();

    // Validate the request body structure
    const { coverImage, profileImage, socialMedia, contact, details } = body;

    if (!socialMedia || !contact || !details) {
      return NextResponse.json(
        { error: "Invalid request body structure" },
        { status: 400 }
      );
    }

    // Find the club
    const club = await prisma.club.findUnique({
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

    // Check if user has permission to update this club
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is the club creator or a club admin (president/secretary)
    const isCreator = club.createdById === user.id;
    const clubMember = await prisma.clubMember.findFirst({
      where: {
        clubId: clubId,
        userId: user.id,
        role: {
          in: ['president', 'secretary']
        }
      }
    });

    if (!isCreator && !clubMember && user.role !== 'systemAdmin') {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Update the club with new details
    const updatedClub = await prisma.club.update({
      where: { id: clubId },
      data: {
        coverImage: coverImage || club.coverImage,
        profileImage: profileImage || club.profileImage,
        facebook: socialMedia.facebook || null,
        instagram: socialMedia.instagram || null,
        twitter: socialMedia.twitter || null,
        linkedIn: socialMedia.linkedIn || null,
        website: socialMedia.website || null,
        email: contact.email || null,
        phone: contact.phone || null,
        googleMapURL: contact.googleMapURL || null,
        headquarters: contact.headquarters || null,
        values: details.values || [],
        avenues: details.avenues || [],
        about: details.about || null,
        mission: details.mission || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Club details updated successfully",
      club: updatedClub,
    });
  } catch (error) {
    console.error("Error updating club details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}