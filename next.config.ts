import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  cacheMaxMemorySize: 10000000,
  images: {
    // unoptimized: true,
    domains: ["img.clerk.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "static-cdn.jtvnw.net",
      },
      {
        protocol: "https",
        hostname: "images.igdb.com",
      },
      {
        protocol: "https",
        hostname: "revenant.lyrica.systems",
      },
    ],
  },
}

export default nextConfig
