"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const eventId = params.eventId;

    // Fetch event with related club details
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        registrations: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Format the response
    return NextResponse.json(
      {
        event: {
          ...event,
          registeredCount: event.registrations.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}
