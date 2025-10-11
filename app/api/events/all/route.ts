import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Optional query parameters for filtering
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    let whereClause: any = {
      isDeleted: false,
    };

    // Filter by active status (you can add this logic based on dates)
    if (isActive !== null) {
      whereClause.isActive = isActive === "true";
    }

    // Filter by category
    if (category && category !== "") {
      whereClause.category = category;
    }

    // Search functionality
    if (search && search.trim() !== "") {
      whereClause.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          venue: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          club: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    // Fetch events with related data
    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where: whereClause,
        include: {
          club: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            }
          },
          registrations: {
            select: {
              id: true,
            }
          }
        },
        orderBy: {
          startDateTime: "asc" // Show upcoming events first
        },
        skip,
        take: limit,
      }),
      prisma.event.count({
        where: whereClause,
      })
    ]);

    // Transform the data to match your frontend interface
    const transformedEvents = events.map(event => {
      const startDate = new Date(event.startDateTime);
      
      return {
        id: event.id,
        title: event.title,
        subtitle: event.subtitle,
        description: event.description,
        date: startDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        time: startDate.toTimeString().slice(0, 5), // Format: HH:MM
        location: event.venue,
        venue: event.venue,
        category: event.category,
        maxCapacity: event.maxParticipants,
        registeredCount: event.registrations.length,
        isActive: startDate > new Date(), // Event is active if it's in the future
        isPaid: false, // Add this field to your schema if needed
        price: null, // Add this field to your schema if needed
        organizer: {
          id: event.club.id,
          name: event.club.name,
          type: "club" as const,
        },
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      events: transformedEvents,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      }
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
