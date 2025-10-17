import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { eventId, eventRole = 'participant' } = body;

    // Validate required fields
    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Validate eventRole
    if (!['participant', 'organizer'].includes(eventRole)) {
      return NextResponse.json(
        { error: "Invalid event role" },
        { status: 400 }
      );
    }

    // Get user by email
    const user = await (prisma.user as any).findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if event exists
    const event = await (prisma.event as any).findUnique({
      where: { id: eventId, isDeleted: false }
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if already registered
    const existingRegistration = await (prisma.eventRegistration as any).findFirst({
      where: {
        eventId,
        volunteerId: user.id
      }
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      );
    }

    // Create event registration
    const registration = await (prisma.eventRegistration as any).create({
      data: {
        eventId,
        volunteerId: user.id,
        eventRole
      }
    });

    // ✨ NEW - Update volunteer stats
    try {
      const pointsToAdd = eventRole === 'organizer' ? 50 : 10;
      const incrementField = eventRole === 'organizer' 
        ? 'eventsOrganized' 
        : 'eventsParticipated';

      await (prisma.volunteerStats as any).upsert({
        where: { 
          userId: user.id 
        },
        update: {
          [incrementField]: { increment: 1 },
          totalPoints: { increment: pointsToAdd }
        },
        create: {
          userId: user.id,
          [incrementField]: 1,
          totalPoints: pointsToAdd
        }
      });

      console.log(`✅ Volunteer stats updated: +${pointsToAdd} points for ${session.user.email}`);
    } catch (statsError) {
      // Log error but don't fail the registration
      console.error('⚠️ Failed to update volunteer stats:', statsError);
    }

    return NextResponse.json({
      message: "Successfully registered for event",
      registration
    });

  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Get registrations for an event or user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");

    if (!eventId && !userId) {
      return NextResponse.json(
        { error: "Either eventId or userId is required" },
        { status: 400 }
      );
    }

    const where: any = {};
    if (eventId) where.eventId = eventId;
    if (userId) where.volunteerId = userId;

    const registrations = await (prisma.eventRegistration as any).findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            startDateTime: true,
            endDateTime: true,
            venue: true
          }
        },
        volunteer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        registeredAt: 'desc'
      }
    });

    return NextResponse.json({
      registrations,
      count: registrations.length
    });

  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
