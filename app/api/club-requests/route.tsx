import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let whereClause: any = {};

    if (status) {
      whereClause.requestStatus = status;
    }

    const clubRequests = await prisma.clubRequest.findMany({
      where: whereClause,
      select: {
        id: true,
        clubName: true,
        motto: true,
        clubType: true,
        clubCategory: true,
        founded: true,
        description: true,
        mission: true,
        university: true,
        headquarters: true,
        designation: true,
        idProofDocument: true,
        constitutionDoc: true,
        approvalLetter: true,
        clubLogo: true,
        requestStatus: true,
        adminComments: true,
        createdAt: true,
        updatedAt: true,
        requestedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(clubRequests);
  } catch (error) {
    console.error("Error fetching club requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch club requests" },
      { status: 500 }
    );
  }
}
