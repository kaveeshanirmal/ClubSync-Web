import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

interface RecentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  lastLogin: Date | null;
  createdAt: Date;
  role: string;
  clubMembers: Array<{
    club: {
      name: string;
    };
  }>;
}

export async function GET(request: NextRequest) {
  try {
    // Check if requesting all activities
    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get('all') === 'true';

    // Get current date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    // Run all queries in parallel for better performance
    const [
      totalUsers,
      usersLastMonth,
      usersThisMonth,
      activeToday,
      activeYesterday,
      clubLeaders,
      clubLeadersLastMonth,
      verifiedUsers,
      totalUsersLastMonth,
      verifiedUsersLastMonth,
      systemAdmins,
      volunteers,
      clubPresidents,
      clubSecretaries,
      clubTreasurers,
      clubMembers,
      recentUsers
    ] = await Promise.all([
      // Total users
      prisma.user.count({
        where: { isActive: true }
      }),
      
      // Users from last month
      prisma.user.count({
        where: {
          isActive: true,
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      
      // Users this month
      prisma.user.count({
        where: {
          isActive: true,
          createdAt: {
            gte: startOfMonth
          }
        }
      }),
      
      // Active users today
      prisma.user.count({
        where: {
          isActive: true,
          lastLogin: {
            gte: startOfToday
          }
        }
      }),
      
      // Active users yesterday
      prisma.user.count({
        where: {
          isActive: true,
          lastLogin: {
            gte: startOfYesterday,
            lt: startOfToday
          }
        }
      }),
      
      // Club leaders
      prisma.user.count({
        where: {
          isActive: true,
          OR: [
            { createdClubs: { some: {} } },
            { clubMembers: { some: { role: { in: ['president', 'secretary', 'treasurer'] } } } }
          ]
        }
      }),
      
      // Club leaders last month
      prisma.user.count({
        where: {
          isActive: true,
          createdAt: {
            lte: endOfLastMonth
          },
          OR: [
            { createdClubs: { some: {} } },
            { clubMembers: { some: { role: { in: ['president', 'secretary', 'treasurer'] } } } }
          ]
        }
      }),
      
      // Verified users
      prisma.user.count({
        where: {
          isActive: true,
          emailVerified: true
        }
      }),
      
      // Total users last month
      prisma.user.count({
        where: {
          isActive: true,
          createdAt: {
            lte: endOfLastMonth
          }
        }
      }),
      
      // Verified users last month
      prisma.user.count({
        where: {
          isActive: true,
          emailVerified: true,
          createdAt: {
            lte: endOfLastMonth
          }
        }
      }),
      
      // System admins
      prisma.user.count({
        where: { isActive: true, role: 'systemAdmin' }
      }),
      
      // Volunteers
      prisma.user.count({
        where: { isActive: true, role: 'volunteer' }
      }),
      
      // Club presidents
      prisma.clubMember.count({
        where: { role: 'president', club: { isActive: true, isDeleted: false } }
      }),
      
      // Club secretaries
      prisma.clubMember.count({
        where: { role: 'secretary', club: { isActive: true, isDeleted: false } }
      }),
      
      // Club treasurers
      prisma.clubMember.count({
        where: { role: 'treasurer', club: { isActive: true, isDeleted: false } }
      }),
      
      // Club members
      prisma.clubMember.count({
        where: { role: 'member', club: { isActive: true, isDeleted: false } }
      }),
      
      // Recent user activities
      prisma.user.findMany({
        where: { isActive: true },
        orderBy: [
          { lastLogin: 'desc' },
          { createdAt: 'desc' }
        ],
        take: fetchAll ? undefined : 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
          lastLogin: true,
          createdAt: true,
          role: true,
          clubMembers: {
            take: 1,
            where: { club: { isActive: true, isDeleted: false } },
            select: {
              club: {
                select: { name: true }
              }
            }
          }
        }
      })
    ]);

    // Calculate percentages and changes after all queries complete
    const userGrowth = usersLastMonth > 0 
      ? (((usersThisMonth - usersLastMonth) / usersLastMonth) * 100).toFixed(1)
      : "0.0";

    const activeTodayChange = activeYesterday > 0
      ? (((activeToday - activeYesterday) / activeYesterday) * 100).toFixed(1)
      : "0.0";

    const clubLeadersChange = clubLeadersLastMonth > 0
      ? (((clubLeaders - clubLeadersLastMonth) / clubLeadersLastMonth) * 100).toFixed(1)
      : "0.0";

    const verifiedPercentage = totalUsers > 0
      ? ((verifiedUsers / totalUsers) * 100).toFixed(0)
      : "0";

    const verifiedPercentageLastMonth = totalUsersLastMonth > 0
      ? ((verifiedUsersLastMonth / totalUsersLastMonth) * 100)
      : 0;

    const verifiedChange = verifiedPercentageLastMonth > 0
      ? (((parseFloat(verifiedPercentage) - verifiedPercentageLastMonth) / verifiedPercentageLastMonth) * 100).toFixed(1)
      : "0.0";

    // Format number helper
    const formatNumber = (num: number): string => {
      if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      }
      return num.toString();
    };

    // Prepare response data
    const data = {
      stats: {
        totalUsers: {
          value: formatNumber(totalUsers),
          change: `${userGrowth.startsWith('-') ? '' : '+'}${userGrowth}%`
        },
        activeToday: {
          value: formatNumber(activeToday),
          change: `${activeTodayChange.startsWith('-') ? '' : '+'}${activeTodayChange}%`
        },
        clubLeaders: {
          value: formatNumber(clubLeaders),
          change: `${clubLeadersChange.startsWith('-') ? '' : '+'}${clubLeadersChange}%`
        },
        verified: {
          value: `${verifiedPercentage}%`,
          change: `${verifiedChange.startsWith('-') ? '' : '+'}${verifiedChange}%`
        }
      },
      roles: [
        {
          name: 'Club Members',
          count: clubMembers,
          color: 'from-red-500 to-orange-500'
        },
        {
          name: 'Club Leaders',
          count: clubPresidents + clubSecretaries + clubTreasurers,
          color: 'from-orange-500 to-red-500'
        },
        {
          name: 'Volunteers',
          count: volunteers,
          color: 'from-red-600 to-orange-600'
        },
        {
          name: 'Admins',
          count: systemAdmins,
          color: 'from-orange-600 to-red-600'
        }
      ].sort((a, b) => b.count - a.count),
      recentActivity: recentUsers.map((user: RecentUser) => {
        const isNewUser = new Date(user.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000;
        const clubName = user.clubMembers[0]?.club.name || 'No Club';
        
        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          action: isNewUser ? 'Joined platform' : 'Last active',
          club: clubName,
          time: user.lastLogin?.toISOString() || user.createdAt.toISOString(),
          avatar: `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`,
          image: user.image,
          role: user.role
        };
      })
    };

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error("Error fetching users data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users data"
      },
      { status: 500 }
    );
  }
}
