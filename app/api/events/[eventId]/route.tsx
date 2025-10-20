import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";

// Helper to format time strings for the GET response
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// GET - Fetch a single event with all relations for the detail page
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> },
) {
  try {
    const params = await context.params;
    const { eventId } = params;
    
    const event = await prisma.event.findUniqueOrThrow({
      where: { id: eventId, isDeleted: false },
      include: {
        club: true,
        addons: true,
        agenda: { orderBy: { startTime: "asc" } },
        resourcePersons: true,
        _count: {
          select: { registrations: true },
        },
      },
    });

    // Map Prisma data to the frontend's 'Event' interface
    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description || "No description provided.",
      longDescription:
        event.description || "No detailed description available.",
      date: event.startDateTime.toISOString().split("T")[0],
      time: formatTime(event.startDateTime),
      endTime: event.endDateTime ? formatTime(event.endDateTime) : undefined,
      location: event.venue || "To be announced",
      venue: event.club?.name || "Unknown Venue",
      address: event.club?.headquarters || "No address specified",
      coverImage: event.club?.coverImage || undefined,
      category: event.category,
      maxCapacity: event.maxParticipants || undefined,
      registeredCount: event._count.registrations,
      isPaid: false, // Defaulting as schema has no price field
      price: 0,
      organizer: {
        id: event.club.id,
        name: event.club.name,
        type: "club" as const,
        image: event.club.profileImage || undefined,
        contact: {
          email: event.club.email || undefined,
          phone: event.club.phone || undefined,
          website: event.club.website || undefined,
        },
      },
      tags: event.addons.flatMap((addon) => addon.tags),
      requirements: event.addons.flatMap((addon) => addon.requirements),
      benefits: event.addons.flatMap((addon) => addon.receivables),
      agenda: event.agenda.map((item) => ({
        time: `${formatTime(item.startTime)} - ${formatTime(item.endTime)}`,
        activity: item.agendaTitle,
        description: item.agendaDescription || undefined,
      })),
      speakers: event.resourcePersons.map((person) => ({
        name: person.name,
        title: person.designation || "Speaker",
        bio: person.about || undefined,
        image: person.profileImg || undefined,
      })),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };

    return NextResponse.json({ event: formattedEvent });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    console.error("Failed to fetch event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update an event and its nested relations
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> },
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const {
      title,
      subtitle,
      category,
      description,
      startDateTime,
      endDateTime,
      venue,
      maxParticipants,
      // Nested relations data
      addons,
      agenda,
      resourcePersons,
    } = body;

    // Use a transaction with increased timeout to ensure all updates succeed or fail together
    const updatedEvent = await prisma.$transaction(
      async (tx) => {
        // 1. Delete existing nested data in parallel for better performance
        await Promise.all([
          tx.eventAddon.deleteMany({ where: { eventId: params.eventId } }),
          tx.eventAgenda.deleteMany({ where: { eventId: params.eventId } }),
          tx.eventResourcePerson.deleteMany({
            where: { eventId: params.eventId },
          }),
        ]);

        // 2. Update the main event record
        const event = await tx.event.update({
          where: { id: params.eventId },
          data: {
            title,
            subtitle: subtitle || null,
            category,
            description: description || null,
            startDateTime: new Date(startDateTime),
            endDateTime: endDateTime ? new Date(endDateTime) : null,
            venue: venue || null,
            maxParticipants: maxParticipants
              ? parseInt(maxParticipants, 10)
              : null,
            // 3. Re-create the nested data from the form's current state
            addons: {
              create: addons.map((addon: any) => ({
                receivables: addon.receivables,
                requirements: addon.requirements,
                tags: addon.tags,
              })),
            },
            agenda: {
              create: agenda.map((item: any) => ({
                startTime: new Date(item.startTime),
                endTime: new Date(item.endTime),
                agendaTitle: item.agendaTitle,
                agendaDescription: item.agendaDescription,
              })),
            },
            resourcePersons: {
              create: resourcePersons.map((person: any) => ({
                name: person.name,
                designation: person.designation,
                about: person.about,
                profileImg: person.profileImg,
              })),
            },
          },
          include: {
            club: true,
            addons: true,
            agenda: true,
            resourcePersons: true,
          },
        });
        return event;
      },
      {
        maxWait: 10000, // Maximum time to wait to acquire a connection (10 seconds)
        timeout: 15000, // Maximum time for the transaction to complete (15 seconds)
      }
    );

    return NextResponse.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    
    // Provide more detailed error message
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2028') {
        return NextResponse.json(
          { 
            error: "Transaction timeout - the update took too long. Please try again.",
            details: error.message 
          },
          { status: 408 },
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 },
    );
  }
}

// DELETE - Soft delete an event using Prisma Client
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> },
) {
  try {
    const params = await context.params;
    await prisma.event.update({
      where: {
        id: params.eventId,
      },
      data: {
        isDeleted: true,
      },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
