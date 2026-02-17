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
    const LEGACY_URL = 'https://legacy.sothebysrealty.fi';

    const rewrites = {
      beforeFiles: [
        // Legacy content with locale prefix - strip locale, files are at root
        { source: '/:locale(fi|sv|en)/esitteet/:path*', destination: `${LEGACY_URL}/esitteet/:path*` },
        { source: '/:locale(fi|sv|en)/flowpaper/:path*', destination: `${LEGACY_URL}/flowpaper/:path*` },
        { source: '/:locale(fi|sv|en)/3d/:path*', destination: `${LEGACY_URL}/3d/:path*` },
        { source: '/:locale(fi|sv|en)/insights/:path*', destination: `${LEGACY_URL}/insights/:path*` },

        // Legacy content without locale prefix
        { source: '/esitteet/:path*', destination: `${LEGACY_URL}/esitteet/:path*` },
        { source: '/flowpaper/:path*', destination: `${LEGACY_URL}/flowpaper/:path*` },
        { source: '/3d/:path*', destination: `${LEGACY_URL}/3d/:path*` },
        { source: '/insights/:path*', destination: `${LEGACY_URL}/insights/:path*` },
        { source: '/pdx-images/:path*', destination: `${LEGACY_URL}/pdx-images/:path*` },

        // Luxury Outlook reports
        { source: '/2026-luxury-outlook-report/:path*', destination: `${LEGACY_URL}/2026-luxury-outlook-report/:path*` },
        { source: '/2025-luxury-outlook-report/:path*', destination: `${LEGACY_URL}/2025-luxury-outlook-report/:path*` },
        { source: '/luxury-outlook-2023/:path*', destination: `${LEGACY_URL}/luxury-outlook-2023/:path*` },
        { source: '/ssir-luxury-outlook-2023/:path*', destination: `${LEGACY_URL}/ssir-luxury-outlook-2023/:path*` },

        // Marketing materials
        { source: '/global-media-2024/:path*', destination: `${LEGACY_URL}/global-media-2024/:path*` },
        { source: '/global-media-2025/:path*', destination: `${LEGACY_URL}/global-media-2025/:path*` },
        { source: '/global-media-plan-2023/:path*', destination: `${LEGACY_URL}/global-media-plan-2023/:path*` },
        { source: '/global-property-search-ad-unit-2023/:path*', destination: `${LEGACY_URL}/global-property-search-ad-unit-2023/:path*` },
        { source: '/gps-ad-unit-2024/:path*', destination: `${LEGACY_URL}/gps-ad-unit-2024/:path*` },
        { source: '/gps-ad-unit-2025/:path*', destination: `${LEGACY_URL}/gps-ad-unit-2025/:path*` },
        { source: '/the-playbook-2024/:path*', destination: `${LEGACY_URL}/the-playbook-2024/:path*` },
        { source: '/the-playbook-2025/:path*', destination: `${LEGACY_URL}/the-playbook-2025/:path*` },
        { source: '/the-distinction-2023/:path*', destination: `${LEGACY_URL}/the-distinction-2023/:path*` },

        // Seasonal & special pages
        { source: '/merry-christmas-2025/:path*', destination: `${LEGACY_URL}/merry-christmas-2025/:path*` },
        { source: '/seasonal-greetings-2023/:path*', destination: `${LEGACY_URL}/seasonal-greetings-2023/:path*` },
        { source: '/tahtitorninkatu-16/:path*', destination: `${LEGACY_URL}/tahtitorninkatu-16/:path*` },
        { source: '/kotisivut.xml', destination: `${LEGACY_URL}/kotisivut.xml` },

        // Language-specific URLs
        { source: '/sv/objekt/:slug', destination: '/sv/kohde/:slug' },
        { source: '/en/properties/:slug', destination: '/en/kohde/:slug' },
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