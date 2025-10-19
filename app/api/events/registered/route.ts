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

    console.log(`Fetching registered events for user: ${userId}`);

    // Get user's registered events
    const registrations = await prisma.eventRegistration.findMany({
      where: {
        volunteerId: userId,
        isDeleted: false,
        event: {
          isDeleted: false // Only include non-deleted events
        }
      },
      include: {
        event: {
          include: {
            club: {
              select: {
                id: true,
                name: true,
                profileImage: true // Using profileImage instead of logoUrl
              }
            },
            addons: true,
            agenda: true,
            resourcePersons: true,
            registrations: {
              where: {
                isDeleted: false
              },
              select: {
                id: true
              }
            }
          }
        }
      }
    });

    console.log(`Found ${registrations.length} registrations`);

    // Check if we found any registrations
    if (!registrations.length) {
      return NextResponse.json({ 
        events: [],
        message: "No registered events found"
      });
    }

    // Also get attendance records for these events
    const eventIds = registrations.map(reg => reg.eventId);
    const attendanceRecords = await prisma.eventAttendance.findMany({
      where: {
        userId: userId,
        eventId: { in: eventIds }
      }
    });

    console.log(`Found ${attendanceRecords.length} attendance records`);

    // Create a map for quick attendance lookup
    const attendanceMap = new Map();
    attendanceRecords.forEach(record => {
      attendanceMap.set(record.eventId, record);
    });

    // Format events to match the /api/events/all endpoint structure
    const events = registrations.map(registration => {
      const event = registration.event;
      const attendance = attendanceMap.get(event.id);
      
      return {
        id: event.id,
        title: event.title,
        subtitle: event.subtitle,
        description: event.description,
        category: event.category,
        venue: event.venue,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        clubId: event.clubId,
        clubName: event.club?.name || "Unknown Club",
        clubLogo: event.club?.profileImage, // Using profileImage
        maxParticipants: event.maxParticipants,
        registeredCount: event.registrations.length,
        addons: event.addons,
        agenda: event.agenda,
        resourcePersons: event.resourcePersons,
        isRegistered: true, // User is definitely registered since this endpoint is filtered
        eventRole: registration.eventRole, // Include the user's role in this event
        hasAttended: attendance ? attendance.isAttend : false,
        attendTime: attendance ? attendance.attendTime : null
      };
    });

    console.log(`Returning ${events.length} formatted events`);

    // Return formatted events
    return NextResponse.json({
      events,
      count: events.length
    });

  } catch (error) {
    console.error("Error fetching registered events:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch registered events",
        details: process.env.NODE_ENV === "development" ? 
          (error instanceof Error ? error.message : String(error)) : 
          undefined
      },
      { status: 500 }
    );
  }
}
