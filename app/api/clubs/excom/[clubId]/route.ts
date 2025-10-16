"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { clubId: string } }
) {
  try {
    const clubId = params.clubId;

    // Fetch executive committee members for the club
    const excomMembers = await prisma.excomMember.findMany({
      where: {
        clubId: clubId,
        isDeleted: false // Only fetch non-deleted ExCom members
      },
      select: {
        id: true,
        name: true,
        position: true,
        image: true,
        businessEmail: true,
        businessMobile: true,
        about: true,
        memberSince: true
      },
      orderBy: {
        // Order by position (assuming certain positions are more important)
        position: 'asc'
      }
    });

    if (!excomMembers || excomMembers.length === 0) {
      return NextResponse.json(
        { 
          message: "No executive committee members found for this club",
          excomMembers: []
        },
        { status: 200 }
      );
    }

    // Format the response
    const formattedExcom = excomMembers.map(member => ({
      id: member.id,
      role: member.position,
      name: member.name,
      email: member.businessEmail || "",
      photo: member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || '')}&background=FFEDD5&color=EA580C&size=128`
    }));

    return NextResponse.json(
      {
        excomMembers: formattedExcom
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching executive committee members:", error);
    return NextResponse.json(
      { error: "Failed to fetch executive committee members" },
      { status: 500 }
    );
  }
}
