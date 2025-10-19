"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define our token payload interface
interface TokenPayload extends JwtPayload {
  userId?: string;
  id?: string;
  email?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication token required" },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    
    // Verify token
    let userId;
    try {
      // This is a simplified version - in production, use a proper token verification
      // You might want to use your existing token verification logic
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as TokenPayload;
      userId = decoded.userId || decoded.id; // Adjust based on your token payload structure
      
      if (!userId) {
        throw new Error("User ID not found in token");
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get request body
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
        { error: "Invalid event role. Must be 'participant' or 'organizer'" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId, isDeleted: false }
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found or has been deleted" },
        { status: 404 }
      );
    }

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        volunteerId: user.id,
        isDeleted: false
      }
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      );
    }

    // Check if event is at capacity
    if (event.maxParticipants) {
      const registrationsCount = await prisma.eventRegistration.count({
        where: {
          eventId,
          isDeleted: false
        }
      });

      if (registrationsCount >= event.maxParticipants) {
        return NextResponse.json(
          { error: "Event has reached maximum capacity" },
          { status: 400 }
        );
      }
    }

    // Create event registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        volunteerId: user.id,
        eventRole
      }
    });

    // Update volunteer stats only for organizers, as participants will be updated on attendance
    if (eventRole === 'organizer') {
      try {
        const pointsToAdd = 20; // Points for organizing an event (updated from 15 to 20)
        
        await prisma.volunteerStats.upsert({
          where: { 
            userId: user.id 
          },
          update: {
            eventsOrganized: { increment: 1 },
            totalPoints: { increment: pointsToAdd }
          },
          create: {
            userId: user.id,
            eventsParticipated: 0,
            eventsOrganized: 1,
            totalPoints: pointsToAdd
          }
        });

        console.log(`✅ Registration: Organizer stats updated: +${pointsToAdd} points for user ${user.id}`);
      } catch (statsError) {
        // Log error but don't fail the registration
        console.error('⚠️ Registration: Failed to update organizer stats:', statsError);
      }
    }

    // Return success response with registration details
    return NextResponse.json({
      success: true,
      message: "Successfully registered for event",
      data: {
        registration: {
          id: registration.id,
          eventId: registration.eventId,
          eventRole: registration.eventRole,
          registeredAt: registration.registeredAt
        },
        event: {
          id: event.id,
          title: event.title,
          startDateTime: event.startDateTime,
          venue: event.venue
        },
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error registering for event (mobile):", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to register for event",
        details: process.env.NODE_ENV === "development" ? 
          (error instanceof Error ? error.message : String(error)) : 
          undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check registration status
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication token required" },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    
    // Verify token
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as TokenPayload;
      userId = decoded.userId || decoded.id;
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get event ID from query params
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Check registration status
    const registration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        volunteerId: userId,
        isDeleted: false
      },
      include: {
        event: {
          select: {
            title: true,
            startDateTime: true,
            venue: true
          }
        }
      }
    });

    return NextResponse.json({
      isRegistered: !!registration,
      registration: registration || null
    });

  } catch (error) {
    console.error("Error checking registration status (mobile):", error);
    return NextResponse.json(
      { error: "Failed to check registration status" },
      { status: 500 }
    );
  }
}
