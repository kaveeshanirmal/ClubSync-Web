import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { 
  calculateBadgeLevel, 
  calculatePoints, 
  getBadge, 
  getNextBadge,
  calculateProgress 
} from "@/app/lib/volunteerUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await (prisma.user as any).findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Try to get existing stats
    let stats = await (prisma.volunteerStats as any).findUnique({
      where: { userId }
    });

    // If no stats exist, calculate from EventRegistration history
    if (!stats) {
      const registrations = await (prisma.eventRegistration as any).findMany({
        where: { volunteerId: userId },
        select: {
          eventRole: true
        }
      });

      const participated = registrations.filter(
        (r: any) => r.eventRole === 'participant'
      ).length;
      
      const organized = registrations.filter(
        (r: any) => r.eventRole === 'organizer'
      ).length;
      
      const points = calculatePoints(participated, organized);

      // Create stats record
      stats = await (prisma.volunteerStats as any).create({
        data: {
          userId,
          eventsParticipated: participated,
          eventsOrganized: organized,
          totalPoints: points
        }
      });
    }

    // Calculate derived data
    const totalEvents = stats.eventsParticipated + stats.eventsOrganized;
    const badge = getBadge(totalEvents);
    const nextBadge = getNextBadge(badge.level);
    const progress = calculateProgress(totalEvents);

    // Return response
    return NextResponse.json({
      success: true,
      data: {
        totalPoints: stats.totalPoints,
        eventsParticipated: stats.eventsParticipated,
        eventsOrganized: stats.eventsOrganized,
        totalEvents,
        badge,
        nextBadge,
        progress
      }
    });

  } catch (error) {
    console.error("Error fetching volunteer stats:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch volunteer stats" 
      },
      { status: 500 }
    );
  }
}
