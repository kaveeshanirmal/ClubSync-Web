import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/app/auth/Provider";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import ConditionalFooter from "@/components/ConditionalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ClubSync - Club Management Platform",
    template: "%s | ClubSync",
  },
  description:
    "ClubSync is a comprehensive platform for managing university and community clubs, events, elections, and member engagement. Join clubs, discover events, and connect with people",
  keywords: [
    "university",
    "Community",
    "clubs",
    "events",
    "student",
    "campus",
    "management",
    "elections",
    "volunteer",
  ],
  authors: [{ name: "ClubSync Team" }],
  creator: "ClubSync",
  publisher: "ClubSync",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ClubSync",
    title: "ClubSync - Club Management Platform",
    description:
      "Comprehensive platform for managing university and community clubs, events, and student engagement.",
    images: [
      {
        url: "/og-image.png", // 1200x630 custom image
        width: 1200,
        height: 630,
        alt: "ClubSync - Club Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClubSync - Club Management Platform",
    description:
      "Comprehensive platform for managing university and community clubs, events, and student engagement.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ConditionalNavbar />
          {children}
          <ConditionalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
