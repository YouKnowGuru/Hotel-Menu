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
    "*.local",
    "192.168.1.*",
    "192.168.0.*",
    "192.168.8.*",
    "10.0.0.*",
    "10.0.1.*",
    "172.16.*",
    "172.17.*",
    "192.168.1.5",
    "192.168.8.83",
    "localhost",
    "127.0.0.1",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
