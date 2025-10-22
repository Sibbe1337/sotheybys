import { MetadataRoute } from 'next';

/**
 * Robots.txt Generator
 * Tells search engines what they can and cannot crawl
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sothebysrealty.fi';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // Don't index API routes
          '/admin/',         // Don't index admin pages
          '/_next/',         // Don't index Next.js internals
          '/debug/',         // Don't index debug pages
          '/debug-data/',    // Don't index debug data pages
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/debug/', '/debug-data/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/debug/', '/debug-data/'],
        crawlDelay: 0,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

