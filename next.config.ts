import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "w875ny1hp4.ufs.sh",
      },
    ],
  }
  /* config options here */
};

export default nextConfig;
