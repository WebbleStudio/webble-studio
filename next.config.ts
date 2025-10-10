import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },

  // Image optimization - Ottimizzato per Vercel
  images: {
    formats: ['image/webp'], // Solo WebP per ridurre costi
    deviceSizes: [640, 828, 1200, 1920], // Ridotto da 8 a 4 dimensioni
    imageSizes: [16, 32, 64, 128, 256], // Ridotto da 8 a 5 dimensioni
    minimumCacheTTL: 31536000, // 1 anno per immagini statiche
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lvgdhhfbvbvpuxjgasbk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Ottimizzazioni per ridurre costi Vercel
    unoptimized: false,
    loader: 'default',
  },

  // Bundle analyzer (enable for analysis)
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },

  // Ottimizzazioni per PageSpeed Insights
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Compression
  compress: true,

  // Powering optimizations
  poweredByHeader: false,

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
