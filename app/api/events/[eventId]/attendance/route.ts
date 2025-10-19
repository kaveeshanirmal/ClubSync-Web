import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

// GET - Fetch attendance lists
export async function GET(req: Request, context: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await context.params; // Must await params!

  try {
    const attended = await prisma.eventAttendance.findMany({
      where: { eventId },
      include: { user: true },
      orderBy: { attendTime: "asc" }, // sort earliest first
    });

    const registered = await prisma.eventRegistration.findMany({
      where: { 
        eventId,
        eventRole: "participant", // Only include participants, not organizers
        isDeleted: false
      },
      include: { volunteer: true },
    });

    const attendedUserIds = attended.map((a) => a.userId);
    const notAttended = registered
      .filter((r) => !attendedUserIds.includes(r.volunteerId))
      .map((r) => ({
        userId: r.volunteerId,
        userName: `${r.volunteer.firstName} ${r.volunteer.lastName}`,
        role: r.eventRole,
      }));

    // Check if each attended user is a participant or an organizer
    const attendedFormatted = await Promise.all(attended.map(async (a) => {
      // Get registration details to check role
      const registration = await prisma.eventRegistration.findFirst({
        where: {
          eventId,
          volunteerId: a.userId,
          isDeleted: false
        },
        select: {
          eventRole: true
        }
      });
      
      return {
        userId: a.userId,
        userName: `${a.user.firstName} ${a.user.lastName}`,
        arrivedTime: a.attendTime,
        role: registration?.eventRole || 'participant' // Fallback to participant if no registration found
      };
    }));

    return NextResponse.json({
      attended: attendedFormatted,
      notAttended,
    });
  } catch (err) {
    console.error("Attendance fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch attendance data" }, { status: 500 });
  }
}

// POST - Mark attendance
export async function POST(req: Request, context: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await context.params; // Must await params!
  const body = await req.json();
  const { userId } = body;

  try {
    console.log(`🔍 Attendance POST called for event ${eventId} and user ${userId}`);
    
    // First, check if the user is registered as a participant (not an organizer)
    const registration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        volunteerId: userId,
        eventRole: "participant", // Only participants need to mark attendance
        isDeleted: false
      }
    });

    if (!registration) {
      return NextResponse.json({ 
        success: false, 
        message: "User is not registered as a participant for this event or is an organizer" 
      }, { status: 400 });
    }
    
    // Check if attendance is already marked
    const existing = await prisma.eventAttendance.findFirst({
      where: { userId, eventId },
    });
    
    if (existing && existing.isAttend) {
      console.log(`⚠️ Attendance: User ${userId} already marked attendance for event ${eventId}`);
      // Already attended → don't update again
      return NextResponse.json({
        success: false,
        message: "Attendance already marked",
        attendance: existing,
      });
    }
    
    let attendance;
    let shouldUpdateStats = false; // New flag to track if we should update stats

    if (existing) {
      // Only update stats if changing from not attended to attended
      shouldUpdateStats = !existing.isAttend;
      
      attendance = await prisma.eventAttendance.update({
        where: { id: existing.id },
        data: { isAttend: true, attendTime: new Date() },
      });
    } else {
      // New attendance record, definitely update stats
      shouldUpdateStats = true;
      
      attendance = await prisma.eventAttendance.create({
        data: { userId, eventId, isAttend: true, attendTime: new Date() },
      });
    }

    // Update volunteer stats ONLY if attendance status changed
    if (shouldUpdateStats) {
      try {
        const pointsToAdd = 10; // Points for event participation
        
        console.log(`🔄 Attendance: Updating stats for user ${userId} - shouldUpdateStats=${shouldUpdateStats}`);
        
        // First check if this event is already recorded in the event attendance history
        const eventAttendanceCount = await prisma.eventAttendance.count({
          where: {
            userId,
            eventId,
            isAttend: true
          }
        });
        
        console.log(`🔢 Attendance: Event attendance count for this event: ${eventAttendanceCount}`);
        
        // First check the current stats for debugging
        const currentStats = await prisma.volunteerStats.findUnique({
          where: { userId }
        });
        
        console.log(`📊 Attendance: Current stats before update:`, 
          currentStats ? 
            `Events: ${currentStats.eventsParticipated}, Points: ${currentStats.totalPoints}` : 
            'No stats found'
        );
        
        // Count all attended events for this user
        const totalAttendedEventsCount = await prisma.eventAttendance.count({
          where: {
            userId,
            isAttend: true
          }
        });
        
        console.log(`� Attendance: Total attended events in database: ${totalAttendedEventsCount}`);
        
        // Now update the stats with ABSOLUTE values instead of increments
        // This ensures we set the exact count rather than incrementing
        const updatedStats = await prisma.volunteerStats.upsert({
          where: { userId },
          update: {
            // Set the exact count rather than incrementing
            eventsParticipated: totalAttendedEventsCount,
            totalPoints: (totalAttendedEventsCount * 10) + 
              (currentStats?.eventsOrganized || 0) * 15 // Preserve organizer points
          },
          create: {
            userId,
            eventsParticipated: 1,
            eventsOrganized: 0,
            totalPoints: pointsToAdd
          }
        });

        console.log(`✅ Attendance: Volunteer stats updated using EXACT COUNT method: Now at ${updatedStats.eventsParticipated} events, ${updatedStats.totalPoints} points for user ${userId}`);
        
        // Validate the count matches
        if (updatedStats.eventsParticipated !== totalAttendedEventsCount) {
          console.warn(`⚠️ Attendance: Stats mismatch! DB shows ${totalAttendedEventsCount} attended events but stats show ${updatedStats.eventsParticipated}`);
        }
      } catch (statsError) {
        // Log error but don't fail the attendance marking
        console.error('⚠️ Attendance: Failed to update volunteer stats:', statsError);
      }
    } else {
      console.log(`⏭️ Attendance: Skipping stats update for user ${userId} - shouldUpdateStats=${shouldUpdateStats}`);
    }

    return NextResponse.json({ success: true, attendance });
  } catch (err) {
    console.error("Attendance mark error:", err);
    return NextResponse.json({ success: false,  }, { status: 500 });
  }
}
