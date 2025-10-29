import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from './config';

// Static imports for messages - more reliable on Vercel
import fiMessages from '../../messages/fi.json';
import svMessages from '../../messages/sv.json';
import enMessages from '../../messages/en.json';

const messages = {
  fi: fiMessages,
  sv: svMessages,
  en: enMessages
};

/**
 * Request configuration for next-intl
 *
 * This function is called by next-intl for each request to:
 * 1. Validate the locale
 * 2. Load the appropriate messages file
 * 
 * ⚠️ NEVER throw notFound() here - it causes NEXT_NOT_FOUND errors
 * Instead, fall back to default locale
 */
export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale parameter is valid
  // If not, fall back to default locale (NEVER throw notFound())
  let validLocale: Locale = locale as Locale;
  
  if (!locale || !locales.includes(locale as Locale)) {
    console.warn(`Invalid locale requested: ${locale}, falling back to ${defaultLocale}`);
    validLocale = defaultLocale;
  }

  return {
    locale: validLocale,
    messages: messages[validLocale]
  };
});
