import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/client";
import { CreateUserRequest } from "@/app/types/user";
import { createUserSchema } from "@/lib/validations/user";

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json();

    const validatedData = createUserSchema.parse(body);
    const { firstName, lastName, email, phone, password, image } =
      validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        image: image || "",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
