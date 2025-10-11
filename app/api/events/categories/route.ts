import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
  try {
    // Get distinct categories from events that are not deleted
    const categories = await prisma.event.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    // Extract category values and filter out null/undefined
    const categoryList = categories
      .map(event => event.category)
      .filter(category => category)
      .sort();

    return NextResponse.json({
      categories: categoryList
    });

  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
