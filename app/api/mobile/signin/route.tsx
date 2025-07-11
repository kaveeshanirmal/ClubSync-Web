import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { randomAvatar } from "@/utils/randomAvatar";

const JWT_SECRET = process.env.JWT_SECRET || "A92ksLmf20DLz8n7BvZxtuQp49Fsm2wYZERyKcmH4IOT5eMQNvXxqAYTKPfDl6a1";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { email, password, googleToken } = await req.json();

    // Google Sign-In
    if (googleToken) {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload?.email) {
        return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
      }

      let user = await prisma.user.findUnique({ where: { email: payload.email } });
      
      if (!user) {
        // Create new user from Google
        user = await prisma.user.create({
          data: {
            email: payload.email,
            firstName: payload.given_name || "",
            lastName: payload.family_name || "",
            phone: "",
            password: "",
            image: payload.picture || randomAvatar(),
            emailVerified: true,
          },
        });
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          name: `${user.firstName} ${user.lastName}` 
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return NextResponse.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: `${user.firstName} ${user.lastName}` 
        }, 
        token 
      });
    }

    // Email/Password Sign-In
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ user: payload, token });
  } catch (error) {
    console.error("Mobile signin error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}