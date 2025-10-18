import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    // Get current date and date from last month for comparison
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Fetch total clubs
    const totalClubs = await prisma.club.count({
      where: {
        isDeleted: false,
      },
    });

    // Fetch clubs from last month for comparison
    const clubsLastMonth = await prisma.club.count({
      where: {
        isDeleted: false,
        createdAt: {
          lt: lastMonth,
        },
      },
    });

    // Calculate club growth percentage
    const clubGrowth = clubsLastMonth > 0 
      ? ((totalClubs - clubsLastMonth) / clubsLastMonth * 100).toFixed(1)
      : "0.0";

    // Fetch active events (events that haven't ended yet)
    const activeEvents = await prisma.event.count({
      where: {
        isDeleted: false,
        endDateTime: {
          gte: now,
        },
      },
    });

    // Fetch active events from last month
    const activeEventsLastMonth = await prisma.event.count({
      where: {
        isDeleted: false,
        endDateTime: {
          gte: lastMonth,
          lt: now,
        },
      },
    });

    // Calculate event growth percentage
    const eventGrowth = activeEventsLastMonth > 0
      ? ((activeEvents - activeEventsLastMonth) / activeEventsLastMonth * 100).toFixed(1)
      : "0.0";

    // Fetch total certificates issued
    const totalCertificates = await prisma.certificate.count();

    // Fetch certificates from last month
    const certificatesLastMonth = await prisma.certificate.count({
      where: {
        issuedAt: {
          lt: lastMonth,
        },
      },
    });

    // Calculate certificate growth percentage
    const certificateGrowth = certificatesLastMonth > 0
      ? ((totalCertificates - certificatesLastMonth) / certificatesLastMonth * 100).toFixed(1)
      : "0.0";

    // Calculate overall growth rate (average of all metrics)
    const overallGrowthRate = (
      (parseFloat(clubGrowth) + parseFloat(eventGrowth) + parseFloat(certificateGrowth)) / 3
    ).toFixed(1);

    // Calculate growth rate change (comparison with previous period)
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
    const clubsTwoMonthsAgo = await prisma.club.count({
      where: {
        isDeleted: false,
        createdAt: {
          lt: twoMonthsAgo,
        },
      },
    });

    const previousGrowthRate = clubsTwoMonthsAgo > 0
      ? ((clubsLastMonth - clubsTwoMonthsAgo) / clubsTwoMonthsAgo * 100)
      : 0;
    
    const growthRateChange = (parseFloat(overallGrowthRate) - previousGrowthRate).toFixed(1);

    // Fetch active users count
    const activeUsers = await prisma.user.count({
      where: {
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalClubs: {
          value: totalClubs,
          change: parseFloat(clubGrowth) >= 0 ? `+${clubGrowth}%` : `${clubGrowth}%`,
          trend: parseFloat(clubGrowth) >= 0 ? "up" : "down",
        },
        activeEvents: {
          value: activeEvents,
          change: parseFloat(eventGrowth) >= 0 ? `+${eventGrowth}%` : `${eventGrowth}%`,
          trend: parseFloat(eventGrowth) >= 0 ? "up" : "down",
        },
        certificatesIssued: {
          value: totalCertificates,
          change: parseFloat(certificateGrowth) >= 0 ? `+${certificateGrowth}%` : `${certificateGrowth}%`,
          trend: parseFloat(certificateGrowth) >= 0 ? "up" : "down",
        },
        growthRate: {
          value: `${overallGrowthRate}%`,
          change: parseFloat(growthRateChange) >= 0 ? `+${growthRateChange}%` : `${growthRateChange}%`,
          trend: parseFloat(growthRateChange) >= 0 ? "up" : "down",
        },
        activeUsers,
        platformHealthScore: Math.min(Math.round(parseFloat(overallGrowthRate) * 5 + 50), 100), // Simple health score calculation
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard statistics",
      },
      { status: 500 }
    );
  }
}
