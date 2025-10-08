import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "api.dicebear.com",
      "images.unsplash.com",
    ],
  },
  experimental: {
    dynamicIO: false,
  },
};

export default nextConfig;
