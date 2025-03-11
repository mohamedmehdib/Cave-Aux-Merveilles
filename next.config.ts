import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['gmxsyvfhpixazdblqetd.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gmxsyvfhpixazdblqetd.supabase.co',
        pathname: '/storage/v1/object/public/product-images/**',
      },
    ],
  },
};

export default nextConfig;
