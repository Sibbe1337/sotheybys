import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

/**
 * next-intl Middleware
 *
 * Handles:
 * - Locale detection from URL path (/fi/, /sv/, /en/)
 * - Automatic redirects based on Accept-Language header
 * - Locale prefix management
 * - Preserves query parameters and hash fragments
 */
export default createMiddleware({
  // All supported locales
  locales,

  // Default locale (Finnish)
  defaultLocale,

  // Locale detection strategy
  localeDetection: true,

  // Prefix for default locale
  // Set to 'as-needed' so /fi/ is optional (root path can be Finnish)
  // Or use 'always' to require /fi/ prefix for Finnish pages too
  localePrefix: 'as-needed'
});

export const config = {
  // Match all routes except:
  // - API routes
  // - Static files (_next/static)
  // - Image optimization (_next/image)
  // - Favicon and other public files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
