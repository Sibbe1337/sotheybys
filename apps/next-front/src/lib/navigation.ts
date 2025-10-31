/**
 * next-intl Navigation Helpers
 *
 * Provides locale-aware navigation utilities:
 * - Link: Locale-aware Link component
 * - redirect: Locale-aware redirect function
 * - usePathname: Get current pathname without locale prefix
 * - useRouter: Locale-aware router
 *
 * Usage:
 *   import { Link, useRouter, usePathname } from '@/lib/navigation';
 *
 *   <Link href="/kohteet">Properties</Link>
 *   // Automatically becomes /sv/kohteet when locale is 'sv'
 */

import { createNavigation } from 'next-intl/navigation';
import { locales } from '@/i18n/config';
import { pathnames } from '@/i18n/pathnames';

// ✅ LINUS FIX: Use pathname mappings for localized routes
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({ 
    locales, 
    localePrefix: 'always',
    pathnames
  });

/**
 * Backward compatibility helper
 * @deprecated Use Link from '@/lib/navigation' instead
 */
export const LocaleLink = Link;
