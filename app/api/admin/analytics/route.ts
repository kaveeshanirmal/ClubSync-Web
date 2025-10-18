import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    const now = new Date();
    const monthsToFetch = 6;
    
    // Generate last 6 months data
    const analyticsData = [];

    for (let i = monthsToFetch - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      // Count clubs created up to this month
      const clubs = await prisma.club.count({
        where: {
          isDeleted: false,
          createdAt: {
            lte: endDate,
          },
        },
      });

      // Count events created in this month
      const events = await prisma.event.count({
        where: {
          isDeleted: false,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Count certificates issued up to this month
      const certificates = await prisma.certificate.count({
        where: {
          issuedAt: {
            lte: endDate,
          },
        },
      });

      // Format month name
      const monthName = startDate.toLocaleString('en-US', { month: 'short' });

      analyticsData.push({
        name: monthName,
        clubs,
        events,
        certificates,
      });
    }

    return NextResponse.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics data",
      },
      { status: 500 }
    );
  }
}
