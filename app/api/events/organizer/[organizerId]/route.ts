import { prisma } from "@/prisma/client";

export async function GET(
  req: Request,
  context: { params: Promise<{ organizerId: string }> }
) {
  try {
    const params = await context.params; // Await params here
    const { organizerId } = params;

    const events = await prisma.event.findMany({
      where: {
        eventOrganizerId: organizerId, // Fetch only events organized by this user
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
    console.log("Events fetched:", events);
    return new Response(JSON.stringify(events), { status: 200 });
    
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch events" }), { status: 500 });
  }
}
