import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 1. Clean this up to pass JUST the raw IP strings Next.js wants
  allowedDevOrigins: ['192.168.100.53', '192.168.1.53'],

  env: {
    // 2. Keep this pointing to your Laravel API
    NEXT_PUBLIC_API_URL: "http://192.168.1.53:8000",
  },
}

export default nextConfig;
