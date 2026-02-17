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

        // WordPress uploads (email signatures, old images etc.)
        { source: '/wp-content/:path*', destination: `${LEGACY_URL}/wp-content/:path*` },

        // Legacy content without locale prefix
        { source: '/esitteet/:path*', destination: `${LEGACY_URL}/esitteet/:path*` },
        { source: '/flowpaper/:path*', destination: `${LEGACY_URL}/flowpaper/:path*` },
        { source: '/3d/:path*', destination: `${LEGACY_URL}/3d/:path*` },
        { source: '/insights/:path*', destination: `${LEGACY_URL}/insights/:path*` },
        { source: '/pdx-images/:path*', destination: `${LEGACY_URL}/pdx-images/:path*` },

        // Luxury Outlook reports (with and without locale prefix)
        { source: '/:locale(fi|sv|en)/2026-luxury-outlook-report/:path*', destination: `${LEGACY_URL}/2026-luxury-outlook-report/:path*` },
        { source: '/:locale(fi|sv|en)/2025-luxury-outlook-report/:path*', destination: `${LEGACY_URL}/2025-luxury-outlook-report/:path*` },
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

        // Language-specific URLs - old WordPress formats served directly (no redirect)
        { source: '/en/listing/:slug', destination: '/en/kohde/:slug' },
        { source: '/sv/saluobjekt/:slug', destination: '/sv/kohde/:slug' },
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
      // ====================================================
      // OLD WORDPRESS URL REDIRECTS
      // Ensures all old links continue to work
      // ====================================================

      // PROPERTY PAGES - only formats not handled by rewrites
      // FI without prefix: /kohde/slug → /fi/kohde/slug
      { source: '/kohde/:slug', destination: '/fi/kohde/:slug', permanent: true },
      // Old /property/ format
      { source: '/property/:slug', destination: '/fi/kohde/:slug', permanent: true },

      // LISTING PAGES - Old WordPress category pages
      // EN: /en/properties/ → /en/kohteet
      { source: '/en/properties', destination: '/en/kohteet', permanent: true },
      { source: '/en/properties/', destination: '/en/kohteet', permanent: true },
      { source: '/en/properties/apartments', destination: '/en/kohteet', permanent: true },
      { source: '/en/properties/real-estates', destination: '/en/kohteet', permanent: true },
      { source: '/en/properties/references', destination: '/en/kohteet', permanent: true },
      { source: '/en/properties/rental-listings', destination: '/en/kohteet/vuokrakohteet', permanent: true },
      { source: '/en/properties/purchase-mandates', destination: '/en/kohteet/ostotoimeksiannot', permanent: true },
      // SV: /sv/objekt/ → /sv/kohteet
      { source: '/sv/objekt', destination: '/sv/kohteet', permanent: true },
      { source: '/sv/objekt/', destination: '/sv/kohteet', permanent: true },
      { source: '/sv/objekt/aktielagenheter', destination: '/sv/kohteet', permanent: true },
      { source: '/sv/objekt/fastigheter', destination: '/sv/kohteet', permanent: true },
      { source: '/sv/objekt/referenser', destination: '/sv/kohteet', permanent: true },
      { source: '/sv/objekt/hyresobjekt', destination: '/sv/kohteet/vuokrakohteet', permanent: true },
      { source: '/sv/objekt/kopuppdrag', destination: '/sv/kohteet/ostotoimeksiannot', permanent: true },
      // FI without prefix
      { source: '/kohteet/osakehuoneistot', destination: '/fi/kohteet', permanent: true },
      { source: '/kohteet/kiinteistot', destination: '/fi/kohteet', permanent: true },
      { source: '/kohteet/referenssit', destination: '/fi/kohteet', permanent: true },

      // STATIC PAGES - Old WordPress page URLs
      // EN pages
      { source: '/en/personnel/:slug', destination: '/en/henkilosto', permanent: true },
      { source: '/en/home-abroad', destination: '/en/kansainvalisesti', permanent: true },
      // SV pages
      { source: '/sv/personal/:slug', destination: '/sv/henkilosto', permanent: true },
      { source: '/sv/yhteydenotto', destination: '/sv/yhteystiedot', permanent: true },
      { source: '/sv/hem-utomlands', destination: '/sv/kansainvalisesti', permanent: true },
      // FI without prefix
      { source: '/henkilosto/:slug', destination: '/fi/henkilosto', permanent: true },
      { source: '/myymassa', destination: '/fi/myymassa', permanent: true },
      { source: '/koti-ulkomailta', destination: '/fi/kansainvalisesti', permanent: true },
    ];
  },
};

module.exports = withNextIntl(nextConfig); 