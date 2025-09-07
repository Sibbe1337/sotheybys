/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export configuration for Cloudflare Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Base path if needed
  basePath: '',
  
  // Trailing slash for static export
  trailingSlash: true,
  
  experimental: {
    serverComponentsExternalPackages: ['@apollo/client'],
  },
  
  // Disable features not compatible with static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

