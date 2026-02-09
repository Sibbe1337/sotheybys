import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import HomePageClient from './HomePageClient';
import { fetchSaleProperties } from '@/lib/server/fetch-properties';

// Use Static Generation with ISR - page is pre-built and cached
// Revalidates every 5 minutes in the background
export const dynamic = 'force-static';
export const revalidate = 30; // Regenerate every 30 seconds
export const dynamicParams = false;

/**
 * Generate static params for all locales
 * This ensures all locale homepage routes are pre-rendered at build time
 * CRITICAL: This must be here to force Vercel to generate /fi, /sv, /en routes
 */
export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

/**
 * Server Component wrapper for the homepage
 * Pre-rendered at build time with ISR for fast loading
 */
export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  // ✅ SERVER: Fetch properties at build time (cached with ISR)
  const properties = await fetchSaleProperties(locale as Locale);
  
  // No Suspense needed - page is pre-rendered
  return <HomePageClient locale={locale as Locale} initialProperties={properties} />;
}
