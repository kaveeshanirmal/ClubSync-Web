import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/client";
import { randomAvatar } from "@/utils/randomAvatar";
import bcrypt from "bcryptjs";

// Extend the built-in session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      needsProfileCompletion?: boolean;
    };
  }

  interface Profile {
    given_name?: string;
    family_name?: string;
  }
}

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.password) {
            throw new Error(
              "Please sign in with Google or reset your password",
            );
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            image: user.image,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error; // NextAuth will handle this and show error to user
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Your existing Google OAuth logic
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              firstName: (profile as { given_name?: string })?.given_name || "",
              lastName:
                (profile as { family_name?: string })?.family_name || "",
              phone: "",
              password: "",
              image: (user.image as string) || (randomAvatar() as string) || "",
              emailVerified: true,
            },
          });
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (user) {
          session.user.id = user.id;
          session.user.needsProfileCompletion = !user.phone;
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
