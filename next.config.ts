import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost:3000", "localhost:3001", "127.0.0.1:3000", "127.0.0.1:3001", "192.168.1.3", "192.168.1.4"],
};

export default nextConfig;
