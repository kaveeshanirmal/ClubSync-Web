import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Fetch clubs where user has executive roles
    const clubs = await prisma.club.findMany({
      where: {
        isDeleted: false,
        members: {
          some: {
            userId: userId,
            role: {
              in: ["president", "secretary", "treasurer", "webmaster"],
            },
            membershipStatus: "active",
          },
        },
      },
      select: {
        id: true,
        name: true,
        motto: true,
        founded: true,
        headquarters: true,
        coverImage: true,
        profileImage: true,
        about: true,
        mission: true,
        values: true,
        avenues: true,
        email: true,
        phone: true,
        website: true,
        googleMapURL: true,
        instagram: true,
        facebook: true,
        linkedIn: true,
        twitter: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        members: {
          where: {
            userId: userId,
          },
          select: {
            role: true,
            membershipStatus: true,
          },
        },
        _count: {
          select: {
            members: {
              where: {
                membershipStatus: { not: "banned" },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Fetch club requests by the user
    const clubRequests = await prisma.clubRequest.findMany({
      where: {
        requestedById: userId,
        requestStatus: {
          in: ["pending", "underReview", "needsMoreInfo"],
        },
      },
      select: {
        id: true,
        clubName: true,
        motto: true,
        founded: true,
        headquarters: true,
        description: true,
        mission: true,
        requestStatus: true,
        createdAt: true,
        updatedAt: true,
        requestedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform clubs data
    const transformedClubs = clubs.map((club) => ({
      id: club.id,
      name: club.name,
      description: club.about || club.mission || "No description available",
      image: club.profileImage,
      memberCount: club._count.members,
      upcomingEvents: 0, // You'll need to calculate this based on your events
      pendingRequests: 0, // You'll need to calculate this based on your requirements
      status: club.isActive ? "active" : "inactive",
      userRole: club.members[0]?.role || "member",
      type: "club" as const,
    }));

    // Transform club requests data
    const transformedClubRequests = clubRequests.map((request) => ({
      id: request.id,
      name: request.clubName,
      description:
        request.description || request.mission || "No description available",
      image: null,
      memberCount: 0,
      upcomingEvents: 0,
      pendingRequests: 0,
      status: request.requestStatus, // Use the actual request status
      userRole: "president", // Assuming the requester will be president
      type: "request" as const,
      requestStatus: request.requestStatus,
    }));

    // Combine and sort by creation date
    const combinedResults = [...transformedClubs, ...transformedClubRequests];

    return NextResponse.json(combinedResults);
  } catch (error) {
    console.error("Error fetching executive clubs:", error);
    return NextResponse.json(
      { error: "Failed to fetch executive clubs" },
      { status: 500 },
    );
  }
}
