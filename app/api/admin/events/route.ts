import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Fetch total events
    const totalEvents = await prisma.event.count({
      where: {
        isDeleted: false,
      },
    });

    // Fetch events from last month
    const eventsLastMonth = await prisma.event.count({
      where: {
        isDeleted: false,
        createdAt: {
          lt: lastMonth,
        },
      },
    });

    // Calculate event growth
    const eventGrowth = eventsLastMonth > 0 
      ? ((totalEvents - eventsLastMonth) / eventsLastMonth * 100).toFixed(0)
      : "0";

    // Fetch events this week
    const eventsThisWeek = await prisma.event.count({
      where: {
        isDeleted: false,
        createdAt: {
          gte: lastWeek,
        },
      },
    });

    // Fetch events from previous week
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const eventsPreviousWeek = await prisma.event.count({
      where: {
        isDeleted: false,
        createdAt: {
          gte: twoWeeksAgo,
          lt: lastWeek,
        },
      },
    });

    // Calculate week growth
    const weekGrowth = eventsPreviousWeek > 0
      ? ((eventsThisWeek - eventsPreviousWeek) / eventsPreviousWeek * 100).toFixed(0)
      : "0";

    // Fetch total participants (event registrations)
    const totalParticipants = await prisma.eventRegistration.count();

    // Participants from last month
    const participantsLastMonth = await prisma.eventRegistration.count({
      where: {
        registeredAt: {
          lt: lastMonth,
        },
      },
    });

    // Calculate participant growth
    const participantGrowth = participantsLastMonth > 0
      ? ((totalParticipants - participantsLastMonth) / participantsLastMonth * 100).toFixed(0)
      : "0";

    // Calculate completion rate (events that have ended vs total events)
    const completedEvents = await prisma.event.count({
      where: {
        isDeleted: false,
        endDateTime: {
          lt: now,
        },
      },
    });

    const completionRate = totalEvents > 0
      ? ((completedEvents / totalEvents) * 100).toFixed(0)
      : "0";

    // Previous completion rate (last month)
    const totalEventsLastMonth = eventsLastMonth;
    const completedEventsLastMonth = await prisma.event.count({
      where: {
        isDeleted: false,
        endDateTime: {
          lt: lastMonth,
        },
      },
    });

    const previousCompletionRate = totalEventsLastMonth > 0
      ? (completedEventsLastMonth / totalEventsLastMonth) * 100
      : 0;

    const completionRateChange = (parseFloat(completionRate) - previousCompletionRate).toFixed(0);

    // Fetch event categories distribution
    const categoriesRaw = await prisma.event.groupBy({
      by: ['category'],
      where: {
        isDeleted: false,
      },
      _count: {
        category: true,
      },
    });

    // Map categories to friendly names
    const categoryMap: { [key: string]: string } = {
      workshop: 'Workshops',
      seminar: 'Seminars',
      competition: 'Competitions',
      social: 'Social Events',
      training: 'Training',
      meeting: 'Meetings',
      conference: 'Conferences',
      fundraiser: 'Fundraisers',
      other: 'Other',
    };

    const categories = categoriesRaw.map((cat) => ({
      name: categoryMap[cat.category] || cat.category,
      count: cat._count.category,
      color: getCategoryColor(cat.category),
    })).sort((a, b) => b.count - a.count);

    // Fetch recent events with club info and participant count
    const recentEvents = await prisma.event.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        club: {
          select: {
            name: true,
          },
        },
        registrations: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const formattedRecentEvents = recentEvents.map((event) => {
      const isLive = event.startDateTime <= now && (!event.endDateTime || event.endDateTime >= now);
      const isUpcoming = event.startDateTime > now;
      const status = isLive ? 'Live' : isUpcoming ? 'Upcoming' : 'Completed';

      return {
        id: event.id,
        name: event.title,
        club: event.club.name,
        date: event.startDateTime.toISOString(),
        status,
        attendees: event.registrations.length,
        venue: event.venue,
        category: event.category,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalEvents: {
            value: totalEvents.toString(),
            change: `+${eventGrowth}`,
          },
          eventsThisWeek: {
            value: eventsThisWeek.toString(),
            change: `+${weekGrowth}`,
          },
          totalParticipants: {
            value: formatNumber(totalParticipants),
            change: `+${participantGrowth}`,
          },
          completionRate: {
            value: `${completionRate}%`,
            change: `+${completionRateChange}%`,
          },
        },
        categories,
        recentEvents: formattedRecentEvents,
      },
    });
  } catch (error) {
    console.error("Error fetching admin events data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch events data",
      },
      { status: 500 }
    );
  }
}

// Helper function to get category colors
function getCategoryColor(category: string): string {
  const colorMap: { [key: string]: string } = {
    workshop: 'from-orange-500 to-red-500',
    seminar: 'from-red-500 to-orange-600',
    competition: 'from-orange-600 to-red-600',
    social: 'from-red-600 to-orange-500',
    training: 'from-orange-400 to-red-400',
    meeting: 'from-red-400 to-orange-400',
    conference: 'from-orange-500 to-red-600',
    fundraiser: 'from-red-500 to-orange-500',
    other: 'from-gray-400 to-gray-600',
  };
  return colorMap[category] || 'from-gray-400 to-gray-600';
}

// Helper function to format numbers (e.g., 1234 -> 1.2k)
function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}
