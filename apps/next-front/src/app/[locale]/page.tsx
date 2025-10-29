import { Suspense } from 'react';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import HomePageClient from './HomePageClient';

// Force static generation for all locales
export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300;

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
 * Handles static generation while delegating rendering to client component
 */
export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
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
      <HomePageClient locale={locale as Locale} />
    </Suspense>
  );
}
