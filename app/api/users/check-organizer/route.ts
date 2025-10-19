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

/**
 * GET - Check if the authenticated user is an organizer for any events
 * 
 * This endpoint checks if the logged-in user is registered as an organizer for any events
 * by querying the eventRegistration table for entries with eventRole = "organizer"
 * 
 * @returns {Object} Response with isOrganizer status and list of events
 */
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

    // Query the database to check if user is an organizer for any events
    const organizerEvents = await prisma.eventRegistration.findMany({
      where: {
        volunteerId: userId,
        eventRole: "organizer",
        isDeleted: false
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            description: true,
            startDateTime: true,
            endDateTime: true,
            venue: true,
            category: true,
            maxParticipants: true,
            clubId: true,
            club: {
              select: {
                name: true,
                profileImage: true
              }
            },
            _count: {
              select: {
                registrations: {
                  where: {
                    isDeleted: false
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        registeredAt: "desc"
      }
    });

    // Format the events for the response
    const formattedEvents = organizerEvents.map(reg => ({
      id: reg.event.id,
      title: reg.event.title,
      subtitle: reg.event.subtitle,
      description: reg.event.description,
      startDateTime: reg.event.startDateTime,
      endDateTime: reg.event.endDateTime,
      venue: reg.event.venue,
      category: reg.event.category,
      maxParticipants: reg.event.maxParticipants,
      registeredCount: reg.event._count.registrations,
      club: {
        id: reg.event.clubId,
        name: reg.event.club.name,
        profileImage: reg.event.club.profileImage
      }
    }));

    // If user is an organizer for at least one event
    const isOrganizer = organizerEvents.length > 0;
    
    // Return the result to the client
    return NextResponse.json({
      isOrganizer,
      events: formattedEvents
    });
    
  } catch (error) {
    console.error("Error checking organizer status:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to check organizer status",
        details: process.env.NODE_ENV === "development" ? 
          (error instanceof Error ? error.message : String(error)) : 
          undefined
      },
      { status: 500 }
    );
  }
}
