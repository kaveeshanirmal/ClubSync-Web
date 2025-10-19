import { prisma } from "@/prisma/client";

export async function GET(
  req: Request,
  context: { params: Promise<{ organizerId: string }> }
) {
  try {
    const params = await context.params; // Await params here
    const { organizerId } = params;

    // First, find all event registrations where this user is an organizer
    const registrations = await prisma.eventRegistration.findMany({
      where: {
        volunteerId: organizerId,
        eventRole: "organizer",
        isDeleted: false
      },
      select: {
        eventId: true
      }
    });
    
    // Extract event IDs
    const eventIds = registrations.map(reg => reg.eventId);
    
    // Now fetch these events
    const events = await prisma.event.findMany({
      where: {
        id: { in: eventIds },
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        description: true,
        startDateTime: true,
        endDateTime: true,
        venue: true,
        category: true,
        maxParticipants: true,
        club: {
          select: {
            name: true, // Get the club name
          },
        },
      },
      orderBy: {
        startDateTime: "desc",
      },
    });
    // Format the response to include registration counts
    const eventsWithCounts = await Promise.all(events.map(async (event) => {
      const registrationsCount = await prisma.eventRegistration.count({
        where: {
          eventId: event.id,
          isDeleted: false
        }
      });
      
      return {
        ...event,
        registeredCount: registrationsCount
      };
    }));
    
    console.log("Organizer events fetched:", eventsWithCounts.length);
    return new Response(JSON.stringify({ 
      events: eventsWithCounts,
      count: eventsWithCounts.length
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch events",
      details: error instanceof Error ? error.message : String(error)
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
