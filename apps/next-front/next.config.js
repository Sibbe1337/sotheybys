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
      { protocol: 'https', hostname: 'images.linear.fi' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'sothebysrealty.fi' },
      { protocol: 'https', hostname: '*.sothebysrealty.fi' },
      { protocol: 'https', hostname: 'd33xsej2pkrh3b.cloudfront.net' },
      { protocol: 'https', hostname: '*.youtube.com' },
      { protocol: 'https', hostname: '*.vimeocdn.com' },
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

        // WordPress uploads, email signatures, old images etc.
        { source: '/wp-content/:path*', destination: `${LEGACY_URL}/wp-content/:path*` },
        { source: '/email/:path*', destination: `${LEGACY_URL}/email/:path*` },

        // Legacy content without locale prefix
        { source: '/esitteet/:path*', destination: `${LEGACY_URL}/esitteet/:path*` },
        { source: '/flowpaper/:path*', destination: `${LEGACY_URL}/flowpaper/:path*` },
        { source: '/3d/:path*', destination: `${LEGACY_URL}/3d/:path*` },
        { source: '/insights/:path*', destination: `${LEGACY_URL}/insights/:path*` },
        { source: '/pdx-images/:path*', destination: `${LEGACY_URL}/pdx-images/:path*` },

        // FlowPaper/marketing/seasonal pages handled via redirects below (relative path issues)
        { source: '/kotisivut.xml', destination: `${LEGACY_URL}/kotisivut.xml` },

        // Language-specific URLs - old WordPress formats served directly (no redirect)
        // Property detail pages
        { source: '/en/listing/:slug', destination: '/en/kohde/:slug' },
        { source: '/sv/saluobjekt/:slug', destination: '/sv/kohde/:slug' },
        // Listing pages
        { source: '/en/properties', destination: '/en/kohteet' },
        { source: '/en/properties/', destination: '/en/kohteet' },
        { source: '/sv/objekt', destination: '/sv/kohteet' },
        { source: '/sv/objekt/', destination: '/sv/kohteet' },
        // Subcategory pages
        { source: '/en/properties/:slug', destination: '/en/kohde/:slug' },
        { source: '/sv/objekt/:slug', destination: '/sv/kohde/:slug' },
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
    const LEGACY_REDIRECT = 'https://legacy.sothebysrealty.fi';
    return [
      // ====================================================
      // FLOWPAPER / LEGACY CONTENT → redirect to legacy server
      // (FlowPaper uses relative paths, rewrites break CSS/JS loading)
      // ====================================================
      // Marketing materials 2026
      { source: '/global-media-2026/:path*', destination: `${LEGACY_REDIRECT}/global-media-2026/:path*`, permanent: false },
      { source: '/listing-presentation-2026/:path*', destination: `${LEGACY_REDIRECT}/listing-presentation-2026/:path*`, permanent: false },
      { source: '/buyers-guide-2026/:path*', destination: `${LEGACY_REDIRECT}/buyers-guide-2026/:path*`, permanent: false },
      { source: '/gps-ad-unit-2026/:path*', destination: `${LEGACY_REDIRECT}/gps-ad-unit-2026/:path*`, permanent: false },
      { source: '/the-playbook-2026/:path*', destination: `${LEGACY_REDIRECT}/the-playbook-2026/:path*`, permanent: false },
      // Marketing materials 2023-2025
      { source: '/global-media-2024/:path*', destination: `${LEGACY_REDIRECT}/global-media-2024/:path*`, permanent: false },
      { source: '/global-media-2025/:path*', destination: `${LEGACY_REDIRECT}/global-media-2025/:path*`, permanent: false },
      { source: '/global-media-plan-2023/:path*', destination: `${LEGACY_REDIRECT}/global-media-plan-2023/:path*`, permanent: false },
      { source: '/global-property-search-ad-unit-2023/:path*', destination: `${LEGACY_REDIRECT}/global-property-search-ad-unit-2023/:path*`, permanent: false },
      { source: '/gps-ad-unit-2024/:path*', destination: `${LEGACY_REDIRECT}/gps-ad-unit-2024/:path*`, permanent: false },
      { source: '/gps-ad-unit-2025/:path*', destination: `${LEGACY_REDIRECT}/gps-ad-unit-2025/:path*`, permanent: false },
      { source: '/the-playbook-2024/:path*', destination: `${LEGACY_REDIRECT}/the-playbook-2024/:path*`, permanent: false },
      { source: '/the-playbook-2025/:path*', destination: `${LEGACY_REDIRECT}/the-playbook-2025/:path*`, permanent: false },
      { source: '/the-distinction-2023/:path*', destination: `${LEGACY_REDIRECT}/the-distinction-2023/:path*`, permanent: false },
      // Luxury Outlook reports
      { source: '/2026-luxury-outlook-report/:path*', destination: `${LEGACY_REDIRECT}/2026-luxury-outlook-report/:path*`, permanent: false },
      { source: '/2025-luxury-outlook-report/:path*', destination: `${LEGACY_REDIRECT}/2025-luxury-outlook-report/:path*`, permanent: false },
      { source: '/luxury-outlook-2023/:path*', destination: `${LEGACY_REDIRECT}/luxury-outlook-2023/:path*`, permanent: false },
      { source: '/ssir-luxury-outlook-2023/:path*', destination: `${LEGACY_REDIRECT}/ssir-luxury-outlook-2023/:path*`, permanent: false },
      // Seasonal & special pages
      { source: '/merry-christmas-2025/:path*', destination: `${LEGACY_REDIRECT}/merry-christmas-2025/:path*`, permanent: false },
      { source: '/seasonal-greetings-2023/:path*', destination: `${LEGACY_REDIRECT}/seasonal-greetings-2023/:path*`, permanent: false },
      { source: '/tahtitorninkatu-16/:path*', destination: `${LEGACY_REDIRECT}/tahtitorninkatu-16/:path*`, permanent: false },
      // Privacy policy - now a Next.js page, redirect old formats
      { source: '/tietosuojaseloste', destination: '/fi/tietosuojaseloste', permanent: true },
      { source: '/en/privacy-policy', destination: '/en/tietosuojaseloste', permanent: true },

      // ====================================================
      // OLD WORDPRESS URL REDIRECTS
      // Ensures all old links continue to work
      // ====================================================

      // PROPERTY PAGES - only formats not handled by rewrites
      // FI without prefix: /kohde/slug → /fi/kohde/slug
      { source: '/kohde/:slug', destination: '/fi/kohde/:slug', permanent: true },
      // Old /property/ format
      { source: '/property/:slug', destination: '/fi/kohde/:slug', permanent: true },
      // Short URL: /slug → /fi/kohde/slug (for window signs, print materials etc.)
      { source: '/listing/:slug', destination: '/fi/kohde/:slug', permanent: true },

      // LISTING PAGES - old subcategories that don't exist as separate pages
      { source: '/en/properties/apartments', destination: '/en/properties', permanent: true },
      { source: '/en/properties/real-estates', destination: '/en/properties', permanent: true },
      { source: '/en/properties/references', destination: '/en/properties', permanent: true },
      { source: '/sv/objekt/aktielagenheter', destination: '/sv/objekt', permanent: true },
      { source: '/sv/objekt/fastigheter', destination: '/sv/objekt', permanent: true },
      { source: '/sv/objekt/referenser', destination: '/sv/objekt', permanent: true },
      // FI without prefix
      { source: '/kohteet/osakehuoneistot', destination: '/fi/kohteet', permanent: true },
      { source: '/kohteet/kiinteistot', destination: '/fi/kohteet', permanent: true },
      { source: '/kohteet/referenssit', destination: '/fi/kohteet', permanent: true },

      // STATIC PAGES - Old WordPress page URLs
      // EN pages
      { source: '/en/personnel/:slug', destination: '/en/personnel', permanent: true },
      { source: '/en/home-abroad', destination: '/en/international', permanent: true },
      // SV pages
      { source: '/sv/personal/:slug', destination: '/sv/personal', permanent: true },
      { source: '/sv/yhteydenotto', destination: '/sv/kontakt', permanent: true },
      { source: '/sv/hem-utomlands', destination: '/sv/internationellt', permanent: true },
      // FI pages without locale prefix
      { source: '/henkilosto/:slug', destination: '/fi/henkilosto', permanent: true },
      { source: '/henkilosto', destination: '/fi/henkilosto', permanent: true },
      { source: '/myymassa', destination: '/fi/myymassa', permanent: true },
      { source: '/koti-ulkomailta', destination: '/fi/kansainvalisesti', permanent: true },
      { source: '/kohteet', destination: '/fi/kohteet', permanent: true },
      { source: '/yritys', destination: '/fi/yritys', permanent: true },
      { source: '/yhteystiedot', destination: '/fi/ota-yhteytta', permanent: true },
      { source: '/ota-yhteytta', destination: '/fi/ota-yhteytta', permanent: true },
      { source: '/kansainvalisesti', destination: '/fi/kansainvalisesti', permanent: true },
    ];
  },
};

module.exports = withNextIntl(nextConfig); 