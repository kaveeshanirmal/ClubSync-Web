import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// Interfaces to match incoming JSON body
interface EventAddonInput {
  receivables: string[];
  requirements: string[];
  tags: string[];
}

interface EventAgendaInput {
  startTime: string;
  endTime: string;
  agendaTitle: string;
  agendaDescription: string;
}

interface EventResourcePersonInput {
  name: string;
  designation: string;
  about: string;
  profileImg: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      clubId,
      category,
      description,
      startDateTime,
      endDateTime,
      venue,
      eventOrganizerId, // This is now the User ID for the organizer
      maxParticipants,
      addons,
      agenda,
      resourcePersons,
    } = body;

    // --- 1. Validation ---
    if (!title || !clubId || !startDateTime || !category) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (title, clubId, category, startDateTime)",
        },
        { status: 400 },
      );
    }

    // --- 2. Data Transformation for Nested Writes (Prisma) ---
    const preparedAddons = (addons || []).map((addon: EventAddonInput) => ({
      receivables: addon.receivables || [],
      requirements: addon.requirements || [],
      tags: addon.tags || [],
    }));

    const preparedAgenda = (agenda || []).map((item: EventAgendaInput) => ({
      startTime: new Date(item.startTime),
      endTime: new Date(item.endTime),
      agendaTitle: item.agendaTitle,
      agendaDescription: item.agendaDescription,
    }));

    const preparedResourcePersons = (resourcePersons || []).map(
      (person: EventResourcePersonInput) => ({
        name: person.name,
        designation: person.designation,
        about: person.about,
        profileImg: person.profileImg,
      }),
    );

    // --- 3. Prepare the main event data object ---
    const eventData: any = {
      title,
      subtitle: subtitle || null,
      clubId,
      category,
      description: description || null,
      startDateTime: new Date(startDateTime),
      endDateTime: endDateTime ? new Date(endDateTime) : null,
      venue: venue || null,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
      addons: { create: preparedAddons },
      agenda: { create: preparedAgenda },
      resourcePersons: { create: preparedResourcePersons },
    };

    // --- 4. Conditionally add the organizer's registration ---
    // If an eventOrganizerId is provided, create a registration for them
    // with the 'organizer' role as part of the same transaction.
    if (eventOrganizerId) {
      eventData.registrations = {
        create: {
          volunteerId: eventOrganizerId,
          eventRole: "organizer", // Set the role explicitly
        },
      };
    }

    // --- 5. Create Event with all nested relations ---
    const newEvent = await prisma.event.create({
      data: eventData,
      include: {
        club: true,
        addons: true,
        agenda: true,
        resourcePersons: true,
        registrations: true, // Include registrations in the response
      },
    });
    
    // --- 6. Update volunteer stats for the organizer ---
    if (eventOrganizerId) {
      try {
        const pointsToAdd = 20; // Points for organizing an event (increased from 15)
        
        await prisma.volunteerStats.upsert({
          where: { 
            userId: eventOrganizerId 
          },
          update: {
            eventsOrganized: { increment: 1 },
            totalPoints: { increment: pointsToAdd }
          },
          create: {
            userId: eventOrganizerId,
            eventsParticipated: 0,
            eventsOrganized: 1,
            totalPoints: pointsToAdd
          }
        });

        console.log(`✅ Event Creation: Organizer stats updated: +${pointsToAdd} points for user ${eventOrganizerId}`);
      } catch (statsError) {
        // Log error but don't fail the event creation
        console.error('⚠️ Event Creation: Failed to update organizer stats:', statsError);
      }
    }

    return NextResponse.json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// The GET function remains the same.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get("clubId");

    if (!clubId) {
      return NextResponse.json(
        { error: "Club ID is required" },
        { status: 400 },
      );
    }

    const events = await prisma.event.findMany({
      where: {
        clubId,
        isDeleted: false,
      },
      include: {
        registrations: {
          select: {
            id: true,
          },
        },
        addons: true,
        agenda: true,
        resourcePersons: true,
      },
      orderBy: {
        startDateTime: "desc",
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
