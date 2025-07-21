import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Debug: Log the token to see its structure
  console.log("Token:", JSON.stringify(token, null, 2));

  const role = token.role;

  // Debug: Log the role value
  console.log("User role:", role, "Type:", typeof role);

  if (pathname.startsWith("/admin") && role !== "systemAdmin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/club-admin") && role !== "clubAdmin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/club-admin/:path*", "/parent/:path*"],
};
