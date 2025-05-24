import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.openocean.finance",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
