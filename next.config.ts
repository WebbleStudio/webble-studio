import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enforce strict TypeScript checks at build time
  typescript: {
    ignoreBuildErrors: false,
  },
  // Log warnings for deprecated features
  reactStrictMode: true,
};

export default nextConfig;
