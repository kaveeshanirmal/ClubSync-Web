import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/prisma/client';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { eventId, userId, certificateData } = body;

    // Validate required fields
    if (!eventId || !userId || !certificateData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user has access (either it's their own certificate or they're an admin)
    if (session.user.id !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        club: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findFirst({
      where: {
        userId,
        eventId,
      },
    });

    if (existingCertificate) {
      return NextResponse.json(
        { error: 'Certificate already exists for this user and event' },
        { status: 409 }
      );
    }

    // Generate unique certificate ID
    const certificateId = `CERT-${Date.now()}-${userId.slice(0, 8).toUpperCase()}`;

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
        userId,
        eventId,
        certificateId,
        userName: `${user.firstName} ${user.lastName}`,
        eventName: event.title,
        clubName: event.club.name,
        eventDate: eventDate,
      },
    });

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's certificates
    const certificates = await prisma.certificate.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        issuedAt: 'desc',
      },
      include: {
        event: {
          include: {
            club: true,
          },
        },
      },
    });

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Fetch certificates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}
