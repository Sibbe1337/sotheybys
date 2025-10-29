import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from './config';

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
 */
export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: messages[locale as Locale]
  };
});
