import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true, // Disabled for Vercel compatibility
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.example.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'visithaiti.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dancingpandas.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'discover-ht-production.up.railway.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'discover-ht-production.up.railway.app',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
