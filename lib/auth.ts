import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/client";
import { randomAvatar } from "@/utils/randomAvatar";
import bcrypt from "bcryptjs";
import {
  SessionUser,
  GoogleProfile,
  UserDbResult,
  AuthUser,
} from "@/app/types/user";

// Extend the built-in session type
declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
  interface Profile extends GoogleProfile {}
  interface User extends AuthUser {}
}

export const authOptions = {
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
      async authorize(credentials): Promise<AuthUser | null> {
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
            role: user.role,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: any;
      account: any;
      profile?: any;
    }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              firstName: profile?.given_name || "",
              lastName: profile?.family_name || "",
              phone: "",
              password: "",
              image: user.image || randomAvatar() || "",
              emailVerified: true,
            },
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user && user.id) {
        token.id = user.id;
        token.role = user.role;
      }

      if (!token.role && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const user = (await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            phone: true,
            role: true,
          },
        })) as UserDbResult | null;

        if (user) {
          session.user = {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            image: user.image,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            needsProfileCompletion: !user.phone,
          };
        }
      }
      if (session.user && token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
