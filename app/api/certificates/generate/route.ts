import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/prisma/client';

/**
 * POST /api/certificates/generate
 * Generate certificates for specific users or events
 * Body: { eventId?: string, userIds?: string[], certificateIds?: string[] }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { eventId, userIds, certificateIds } = body;

    // Validate input
    if (!eventId && !certificateIds) {
      return NextResponse.json(
        { error: 'Either eventId or certificateIds must be provided' },
        { status: 400 }
      );
    }

    let certificatesToGenerate: string[] = [];

    if (certificateIds && certificateIds.length > 0) {
      // Generate specific certificates by ID
      certificatesToGenerate = certificateIds;
    } else if (eventId) {
      // Generate certificates for an event
      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }

      // Check permission
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

      // Get certificates for this event
      const certificates = await prisma.certificate.findMany({
        where: {
          eventId,
          ...(userIds && userIds.length > 0 ? { userId: { in: userIds } } : {}),
        },
        select: {
          certificateId: true,
        },
      });

      certificatesToGenerate = certificates.map((c) => c.certificateId);
    }

    if (certificatesToGenerate.length === 0) {
      return NextResponse.json(
        { message: 'No certificates found to generate' },
        { status: 200 }
      );
    }

    // Fetch certificate details
    const certificates = await prisma.certificate.findMany({
      where: {
        certificateId: {
          in: certificatesToGenerate,
        },
      },
      include: {
        user: true,
        event: {
          include: {
            club: true,
          },
        },
      },
    });

    // Return certificate data for client-side generation
    const certificateData = certificates.map((cert) => ({
      certificateId: cert.certificateId,
      userName: cert.userName,
      eventName: cert.eventName,
      clubName: cert.clubName,
      eventDate: cert.eventDate,
      userId: cert.userId,
      eventId: cert.eventId,
    }));

    return NextResponse.json({
      success: true,
      certificates: certificateData,
      message: `Found ${certificateData.length} certificates`,
    });
  } catch (error) {
    console.error('[Certificate Generate] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate certificates',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
