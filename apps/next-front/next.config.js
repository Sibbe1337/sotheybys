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
};

module.exports = nextConfig; 