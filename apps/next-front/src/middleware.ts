import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import { pathnames } from './i18n/pathnames';

/**
 * next-intl Middleware
 *
 * Handles:
 * - Locale detection from URL path (/fi/, /sv/, /en/)
 * - Automatic redirects based on Accept-Language header
 * - Locale prefix management
 * - Preserves query parameters and hash fragments
 * - Pathname mappings for localized routes
 */
export default createMiddleware({
  // All supported locales
  locales,

  // Default locale (Finnish) - ALWAYS default to Finnish, ignore browser language
  defaultLocale,

  // Locale detection disabled - always use Finnish as default
  localeDetection: false,

  // Prefix for default locale - ALWAYS to force Vercel to generate all /fi, /sv, /en routes
  localePrefix: 'always',
  
  // ✅ LINUS FIX: Pathname mappings for localized routes
  pathnames
});

export const config = {
  // Match all routes except:
  // - / (root - Christmas landing page)
  // - /api/* (API routes)
  // - /_next/* (Next.js internals)
  // - Static files (*.*)
  // - Legacy content paths (esitteet, flowpaper, reports, marketing, etc.)
  matcher: ['/((?!api|_next|.*\\..*|esitteet|flowpaper|3d|insights|pdx-images|2026-luxury-outlook-report|2025-luxury-outlook-report|luxury-outlook-2023|ssir-luxury-outlook-2023|global-media-2024|global-media-2025|global-media-plan-2023|global-property-search-ad-unit-2023|gps-ad-unit-2024|gps-ad-unit-2025|the-playbook-2024|the-playbook-2025|the-distinction-2023|merry-christmas-2025|seasonal-greetings-2023|tahtitorninkatu-16|kotisivut\\.xml)(?!$).*)']
}
