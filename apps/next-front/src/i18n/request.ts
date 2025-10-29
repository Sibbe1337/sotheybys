import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from './config';

/**
 * Request configuration for next-intl
 *
 * This function is called by next-intl for each request to:
 * 1. Validate the locale
 * 2. Load the appropriate messages file
 */
export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  } as any; // Type assertion needed due to notFound() not being recognized as never-returning
});
