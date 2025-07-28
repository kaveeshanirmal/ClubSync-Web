import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { OAuth2Client } from "google-auth-library";
import { randomAvatar } from "@/utils/randomAvatar";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
    }

    // Find or create user in DB
    let user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          firstName: payload.given_name || "",
          lastName: payload.family_name || "",
          phone: "",
          password: "",
          image: payload.picture || randomAvatar() || "",
          emailVerified: true,
        },
      });
    }

    // Optionally: generate your own session/JWT here and return it
    // For now, just return user info
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        role: user.role,
      },
      // token: ...
    });
  } catch (error) {
    console.error("Mobile Google Sign-In error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
} 