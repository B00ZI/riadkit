import type { NextConfig } from "next";

const nextConfig: NextConfig =

{
  /* config options here */
  allowedDevOrigins: ['192.168.100.53'],

  env: {
    NEXT_PUBLIC_API_URL: "http://192.168.100.53:8000",
  },

}
export default nextConfig;
