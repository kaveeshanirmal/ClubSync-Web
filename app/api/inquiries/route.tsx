import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function POST(req: NextRequest) {
  const { userId, subject, type, message } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        inquirerName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        subject,
        type,
        message,
        role: user.role === "volunteer" || user.role === "clubAdmin" ? user.role : "guest"
      }
    });

    return NextResponse.json(inquiry, { status: 200 });
  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}