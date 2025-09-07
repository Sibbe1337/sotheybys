/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration for Cloudflare Pages
  output: 'standalone',
  
  experimental: {
    serverComponentsExternalPackages: ['@apollo/client'],
    instrumentationHook: true,
  },
  
  images: {
    // Cloudflare Pages doesn't support Next.js Image Optimization API
    // so we need to use unoptimized images or a custom loader
    unoptimized: true,
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
  
  // Disable features not supported on Cloudflare Pages
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Skip linting and type checking for Cloudflare deployment
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
};

module.exports = nextConfig;
