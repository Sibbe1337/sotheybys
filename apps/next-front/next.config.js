const withNextIntl = require('next-intl/plugin')(
  // Path to i18n request config
  './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@apollo/client'],
    instrumentationHook: true,
    optimizeCss: true, // ✅ LINUS: Optimize CSS bundle
    optimizePackageImports: ['lucide-react', '@vis.gl/react-google-maps'], // ✅ Tree-shaking
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
    // Only add rewrites if WordPress URL is configured
    if (process.env.WORDPRESS_URL) {
      return [
        {
          source: '/wp-admin/:path*',
          destination: `${process.env.WORDPRESS_URL}/wp-admin/:path*`,
        },
      ];
    }
    return [];
  },
  async redirects() {
    return [
      // Redirect old /property/ routes to /kohde/
      {
        source: '/property/:slug',
        destination: '/kohde/:slug',
        permanent: true,
      },
      // Redirect Swedish /objekt/ to /kohteet/
      {
        source: '/sv/objekt',
        destination: '/sv/kohteet',
        permanent: true,
      },
      {
        source: '/sv/objekt/:path*',
        destination: '/sv/kohteet/:path*',
        permanent: true,
      },
      // Redirect English /properties/ to /kohteet/
      {
        source: '/en/properties',
        destination: '/en/kohteet',
        permanent: true,
      },
      {
        source: '/en/properties/:path*',
        destination: '/en/kohteet/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig); 