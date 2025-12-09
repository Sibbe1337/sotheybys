const withNextIntl = require('next-intl/plugin')(
  // Path to i18n request config
  './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Performance: Enable React Compiler for faster re-renders (Next.js 14+)
  reactStrictMode: true,
  
  // ✅ Performance: Enable compression
  compress: true,
  
  // ✅ Performance: Generate ETags for caching
  generateEtags: true,
  
  experimental: {
    serverComponentsExternalPackages: ['@apollo/client'],
    instrumentationHook: true,
    // 🔥 DISABLED: These cause "t is not a constructor" error on Vercel
    // optimizeCss: true,
    // optimizePackageImports: ['lucide-react', '@vis.gl/react-google-maps'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // ✅ LINUS: Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // ✅ Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // ✅ Cache images for 30 days
  },
  async rewrites() {
    const rewrites = {
      beforeFiles: [
        // ✅ LINUS FIX: Language-specific URLs
        // Swedish: /sv/objekt → /sv/kohde
        {
          source: '/sv/objekt/:slug',
          destination: '/sv/kohde/:slug',
        },
        // English: /en/properties → /en/kohde
        {
          source: '/en/properties/:slug',
          destination: '/en/kohde/:slug',
        },
      ],
      afterFiles: [],
    };

    // Add WordPress rewrites if configured
    if (process.env.WORDPRESS_URL) {
      rewrites.afterFiles.push({
        source: '/wp-admin/:path*',
        destination: `${process.env.WORDPRESS_URL}/wp-admin/:path*`,
      });
    }

    return rewrites;
  },
  async redirects() {
    return [
      // Redirect old /property/ routes to /kohde/
      {
        source: '/property/:slug',
        destination: '/kohde/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig); 