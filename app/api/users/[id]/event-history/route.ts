import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch all event attendance records for the user
    const attendanceRecords = await prisma.eventAttendance.findMany({
      where: {
        userId: userId,
      },
      include: {
        event: {
          include: {
            club: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        attendTime: 'desc',
      },
    });

    // Transform attendance data to match frontend interface
    const eventHistory = attendanceRecords.map((record) => {
      const eventDate = new Date(record.event.startDateTime);
      const now = new Date();
      
      // Determine status based on event date
      let status: 'completed' | 'upcoming' | 'cancelled' = 'completed';
      if (eventDate > now) {
        status = 'upcoming';
      }

      return {
        id: record.event.id,
        title: record.event.title,
        subtitle: record.event.subtitle,
        date: record.event.startDateTime,
        endDate: record.event.endDateTime,
        venue: record.event.venue,
        category: record.event.category,
        clubName: record.event.club.name,
        status: status,
        attendanceMarked: record.isAttend,
        attendTime: record.attendTime,
      };
    });

    // Also fetch registered events that haven't been attended yet
    const registrations = await prisma.eventRegistration.findMany({
      where: {
        volunteerId: userId,
        isDeleted: false,
      },
      include: {
        event: {
          include: {
            club: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Filter out events that are already in attendance records
    const attendedEventIds = new Set(attendanceRecords.map(r => r.eventId));
    const registeredEvents = registrations
      .filter(reg => !attendedEventIds.has(reg.eventId))
      .map(reg => {
        const eventDate = new Date(reg.event.startDateTime);
        const now = new Date();
        
        return {
          id: reg.event.id,
          title: reg.event.title,
          subtitle: reg.event.subtitle,
          date: reg.event.startDateTime,
          endDate: reg.event.endDateTime,
          venue: reg.event.venue,
          category: reg.event.category,
          clubName: reg.event.club.name,
          status: eventDate > now ? 'upcoming' : 'completed',
          attendanceMarked: false,
          attendTime: null,
          eventRole: reg.eventRole,
        };
      });

    // Combine and sort by date (most recent first)
    const allEvents = [...eventHistory, ...registeredEvents].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate statistics
    const stats = {
      totalEvents: allEvents.length,
      completed: allEvents.filter(e => e.status === 'completed').length,
      upcoming: allEvents.filter(e => e.status === 'upcoming').length,
      attended: eventHistory.filter(e => e.attendanceMarked).length,
    };

    return NextResponse.json({
      events: allEvents,
      stats: stats,
    });

  } catch (error) {
    console.error("Error fetching event history:", error);
    return NextResponse.json(
      { error: "Failed to fetch event history" },
      { status: 500 }
    );
  }
}
