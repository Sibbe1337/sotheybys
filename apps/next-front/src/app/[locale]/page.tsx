import { Suspense } from 'react';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import type { Property } from '@/lib/domain/property.types';
import HomePageClient from './HomePageClient';
import { fetchSaleProperties } from '@/lib/server/fetch-properties';

// Use ISR (Incremental Static Regeneration) instead of force-static
// This allows data fetching at runtime, not just build time
export const revalidate = 300; // Regenerate every 5 minutes
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
 * Fetches properties on server-side (avoids CORS issues)
 * Passes data as props to client component
 */
export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  // ✅ SERVER ACTION: Fetch sale properties (no CORS, no duplication)
  const properties = await fetchSaleProperties(locale as Locale);
  
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <HomePageClient locale={locale as Locale} initialProperties={properties} />
    </Suspense>
  );
}
