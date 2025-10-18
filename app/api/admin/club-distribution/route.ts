import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    // Get total number of clubs for percentage calculation
    const totalClubs = await prisma.club.count({
      where: {
        isDeleted: false,
      },
    });

    if (totalClubs === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        totalClubs: 0,
      });
    }

    // Get club distribution by type from approved club requests
    const clubsByType = await prisma.clubRequest.groupBy({
      by: ['clubType'],
      where: {
        requestStatus: 'approved',
        approvedClubId: {
          not: null,
        },
      },
      _count: {
        clubType: true,
      },
    });

    // Map club type names to display names
    const typeDisplayNames: { [key: string]: string } = {
      academic: "Academic",
      sports: "Sports",
      cultural: "Cultural",
      volunteer: "Volunteer",
      professional: "Professional",
      hobby: "Hobby",
      other: "Other",
    };

    // Color palette for different club types
    const colorPalette: { [key: string]: string } = {
      academic: "#f97316",      // Orange
      sports: "#ef4444",        // Red
      cultural: "#fb923c",      // Light Orange
      volunteer: "#f87171",     // Light Red
      professional: "#fbbf24",  // Yellow
      hobby: "#fdba74",         // Peach
      other: "#fca5a5",         // Pink
    };

    // Transform data for frontend
    const distributionData = clubsByType
      .map((item) => {
        const count = item._count.clubType;
        const percentage = totalClubs > 0 ? ((count / totalClubs) * 100).toFixed(1) : "0";
        const type = item.clubType;
        
        return {
          name: typeDisplayNames[type] || type.charAt(0).toUpperCase() + type.slice(1),
          value: parseFloat(percentage),
          count,
          color: colorPalette[type] || "#9ca3af",
        };
      })
      .sort((a, b) => b.count - a.count); // Sort by count descending

    // Find the leading category
    const leadingCategory = distributionData.length > 0 ? distributionData[0] : null;

    return NextResponse.json({
      success: true,
      data: distributionData,
      totalClubs,
      leadingCategory: leadingCategory ? {
        name: leadingCategory.name,
        percentage: leadingCategory.value,
        count: leadingCategory.count,
      } : null,
    });
  } catch (error) {
    console.error("Error fetching club distribution:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch club distribution data",
      },
      { status: 500 }
    );
  }
}
