import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/prisma/client';

/**
 * POST /api/events/[eventId]/generate-certificates
 * Generates certificates for all users who attended the event
 * Can only be called by club admins/organizers or system admins
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventId } = await context.params;

    // Fetch event with club info
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        club: true,
        attendances: {
          where: { isAttend: true },
          include: {
            user: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if event has ended
    const eventEndTime = event.endDateTime || event.startDateTime;
    const hasEnded = new Date(eventEndTime) < new Date();

    if (!hasEnded) {
      return NextResponse.json(
        { error: 'Certificates can only be generated after the event has ended' },
        { status: 400 }
      );
    }

    // Verify user has permission (system admin or club member with appropriate role)
    const isSystemAdmin = session.user.role === 'systemAdmin';
    let hasPermission = isSystemAdmin;

    if (!isSystemAdmin) {
      const membership = await prisma.clubMember.findFirst({
        where: {
          clubId: event.clubId,
          userId: session.user.id,
          membershipStatus: 'active',
          role: {
            in: ['president', 'secretary', 'webmaster'],
          },
        },
      });
      hasPermission = !!membership;
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to generate certificates for this event' },
        { status: 403 }
      );
    }

    // Get all attendees who don't have certificates yet
    const attendedUsers = event.attendances;
    
    if (attendedUsers.length === 0) {
      return NextResponse.json(
        { message: 'No attendees found for this event' },
        { status: 200 }
      );
    }

    const generatedCertificates = [];
    const skippedCertificates = [];
    const errors = [];

    // Generate certificates for each attendee
    for (const attendance of attendedUsers) {
      try {
        // Check if certificate already exists
        const existingCertificate = await prisma.certificate.findFirst({
          where: {
            userId: attendance.userId,
            eventId: event.id,
          },
        });

        if (existingCertificate) {
          skippedCertificates.push({
            userId: attendance.userId,
            userName: `${attendance.user.firstName} ${attendance.user.lastName}`,
            reason: 'Certificate already exists',
          });
          continue;
        }

        // Generate unique certificate ID
        const certificateId = `CERT-${event.id.slice(0, 8).toUpperCase()}-${attendance.userId.slice(0, 8).toUpperCase()}-${Date.now()}`;

        // Format event date
        const eventDate = new Date(event.startDateTime).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        // Create certificate record in database
        // Certificate PDF will be generated on-demand from this data
        const certificate = await prisma.certificate.create({
          data: {
            userId: attendance.userId,
            eventId: event.id,
            certificateId,
            userName: `${attendance.user.firstName} ${attendance.user.lastName}`,
            eventName: event.title,
            clubName: event.club.name,
            eventDate: eventDate,
          },
        });

        generatedCertificates.push({
          certificateId: certificate.certificateId,
          userId: attendance.userId,
          userName: certificate.userName,
        });
      } catch (error) {
        console.error(
          `Error generating certificate for user ${attendance.userId}:`,
          error
        );
        errors.push({
          userId: attendance.userId,
          userName: `${attendance.user.firstName} ${attendance.user.lastName}`,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${generatedCertificates.length} certificates`,
      generated: generatedCertificates,
      skipped: skippedCertificates,
      errors: errors.length > 0 ? errors : undefined,
      totalAttendees: attendedUsers.length,
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate certificates',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/events/[eventId]/generate-certificates
 * Get status of certificate generation for an event
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventId } = await context.params;

    // Get event info
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        club: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Get attendance count
    const attendanceCount = await prisma.eventAttendance.count({
      where: {
        eventId,
        isAttend: true,
      },
    });

    // Get certificate count
    const certificateCount = await prisma.certificate.count({
      where: { eventId },
    });

    // Check if event has ended
    const eventEndTime = event.endDateTime || event.startDateTime;
    const hasEnded = new Date(eventEndTime) < new Date();

    // Note: Certificates are now generated on-demand, no URL needed

    return NextResponse.json({
      eventId,
      eventName: event.title,
      clubName: event.club.name,
      hasEnded,
      totalAttendees: attendanceCount,
      certificatesGenerated: certificateCount,
      allGenerated: certificateCount === attendanceCount,
    });
  } catch (error) {
    console.error('Certificate status error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get certificate status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
