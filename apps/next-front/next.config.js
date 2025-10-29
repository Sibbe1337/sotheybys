const withNextIntl = require('next-intl/plugin')(
  // Path to i18n request config
  './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@apollo/client'],
    instrumentationHook: true,
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