import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/dashboard/projects", destination: "/projects", permanent: true },
      { source: "/dashboard/brand-kit", destination: "/brand-kit", permanent: true },
      { source: "/dashboard/settings", destination: "/settings", permanent: true },
      { source: "/dashboard/profile", destination: "/profile", permanent: true },
      { source: "/dashboard/editor/new", destination: "/editor/new", permanent: true },
      { source: "/dashboard/editor/:id", destination: "/editor/:id", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  allowedDevOrigins: [
    "192.168.1.5",
    "192.168.1.5:3000",
    "192.168.8.83",
    "192.168.8.83:3000",
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
