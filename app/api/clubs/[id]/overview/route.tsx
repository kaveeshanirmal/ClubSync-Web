import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client"; // adjust path if needed

// GET /api/clubs/[clubId]/overview
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: clubId } = await params;

  try {
    // Fetch all data in parallel
    const [
      memberCount,
      events,
      pendingRequests,
      recentMembers,
      recentEvents,
      recentJoinRequests,
      recentCertificates,
    ] = await Promise.all([
      // 1️⃣ Get total members (all statuses except banned)
      prisma.clubMember.count({
        where: { 
          clubId,
          membershipStatus: { not: "banned" }
        },
      }),

      // 2️⃣ Get upcoming events
      prisma.event.findMany({
        where: {
          clubId,
          startDateTime: { gt: new Date() },
          isDeleted: false,
        },
        select: { id: true, startDateTime: true },
      }),

      // 3️⃣ Get pending requests count
      prisma.joinRequest.count({
        where: { clubId, status: "pendingReview" },
      }),

      // 4️⃣ Recent member joins (last 10, all statuses except banned)
      prisma.clubMember.findMany({
        where: {
          clubId,
          membershipStatus: { not: "banned" },
        },
        select: {
          id: true,
          joinedAt: true,
          membershipStatus: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { joinedAt: "desc" },
        take: 10,
      }),

      // 5️⃣ Recent events (last 10)
      prisma.event.findMany({
        where: {
          clubId,
          isDeleted: false,
        },
        select: {
          id: true,
          title: true,
          startDateTime: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),

      // 6️⃣ Recent join requests (last 10)
      prisma.joinRequest.findMany({
        where: {
          clubId,
          status: "pendingReview",
        },
        select: {
          id: true,
          createdAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),

      // 7️⃣ Recent certificates/service letters (last 10)
      prisma.certificate.findMany({
        where: {
          event: {
            clubId,
          },
        },
        select: {
          id: true,
          userName: true,
          eventName: true,
          issuedAt: true,
        },
        orderBy: { issuedAt: "desc" },
        take: 10,
      }),
    ]);

    const upcomingEvents = events.filter(e => new Date(e.startDateTime) > new Date()).length;

    // Create unified activity feed
    const activities: Array<{
      id: string;
      type: 'member_join' | 'event_scheduled' | 'join_request' | 'certificate_issued';
      title: string;
      description: string;
      timestamp: string;
    }> = [];

    // Add member joins
    recentMembers.forEach(member => {
      const userName = `${member.user.firstName} ${member.user.lastName}`;
      activities.push({
        id: member.id,
        type: 'member_join',
        title: `New member joined - ${userName}`,
        description: `Member count increased to ${memberCount}`,
        timestamp: member.joinedAt.toISOString(),
      });
    });

    // Add scheduled events
    recentEvents.forEach(event => {
      const eventDate = new Date(event.startDateTime);
      const isUpcoming = eventDate > new Date();
      activities.push({
        id: event.id,
        type: 'event_scheduled',
        title: `Event "${event.title}" ${isUpcoming ? 'scheduled' : 'completed'}`,
        description: isUpcoming 
          ? `Scheduled for ${eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
          : `Held on ${eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
        timestamp: event.createdAt.toISOString(),
      });
    });

    // Add join requests
    recentJoinRequests.forEach(request => {
      const userName = `${request.user.firstName} ${request.user.lastName}`;
      activities.push({
        id: request.id,
        type: 'join_request',
        title: `Join request from ${userName}`,
        description: 'Pending review and approval',
        timestamp: request.createdAt.toISOString(),
      });
    });

    // Add certificate issuances (service letters)
    recentCertificates.forEach(cert => {
      activities.push({
        id: cert.id,
        type: 'certificate_issued',
        title: `Service letter request from ${cert.userName}`,
        description: 'Pending review and approval',
        timestamp: cert.issuedAt.toISOString(),
      });
    });

    // Sort by timestamp (most recent first) and take top 5
    const recentActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    // Return overview summary with activities
    return NextResponse.json({
      memberCount,
      upcomingEvents,
      pendingRequests,
      recentActivities,
    });
  } catch (error) {
    console.error("Error fetching overview data:", error);
    return NextResponse.json(
      { error: "Failed to fetch overview data" },
      { status: 500 }
    );
  }
}
