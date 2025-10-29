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

import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from '@/i18n/config';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix: 'as-needed' });

/**
 * Backward compatibility helper
 * @deprecated Use Link from '@/lib/navigation' instead
 */
export const LocaleLink = Link;
