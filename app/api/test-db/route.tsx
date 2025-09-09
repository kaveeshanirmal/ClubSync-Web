import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.$connect();

    // Test a simple query
    const userCount = await prisma.user.count();

    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      userCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
