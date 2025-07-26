import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
  const params = await context.params;
  const { eventId } = params;

  try {
    const attended = await prisma.eventAttendance.findMany({
      where: { eventId: eventId, isAttend: true },  // <-- eventId as string
      select: {
        userId: true,
        attendTime: true,
        user: { select: { firstName: true, lastName: true } },
      },
    });

    const notAttended = await prisma.eventAttendance.findMany({
      where: { eventId: eventId, isAttend: false },  // <-- eventId as string
      select: {
        userId: true,
        user: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({
      attended: attended.map((a) => ({
        userId: a.userId,
        userName: `${a.user.firstName} ${a.user.lastName}`,
        arrivedTime: a.attendTime,
      })),
      notAttended: notAttended.map((a) => ({
        userId: a.userId,
        userName: `${a.user.firstName} ${a.user.lastName}`,
      })),
    });
  } catch (error) {
    console.error('GET attendance error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
  const params = await context.params;
  const { eventId } = params;

  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId' },
        { status: 400 }
      );
    }

    await prisma.eventAttendance.upsert({
      where: {
        userId_eventId: {
          userId: Number(userId),  // convert userId to number if Int in schema
          eventId: eventId,        // eventId stays string
        },
      },
      update: { isAttend: true, attendTime: new Date() },
      create: {
        userId: Number(userId),
        eventId: eventId,
        isAttend: true,
        attendTime: new Date(),
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('POST attendance error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
