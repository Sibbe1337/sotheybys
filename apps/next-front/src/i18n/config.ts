/**
 * i18n Configuration
 *
 * Defines supported locales and default locale for next-intl
 */

export type Locale = 'fi' | 'sv' | 'en';

export const locales: Locale[] = ['fi', 'sv', 'en'];

export const defaultLocale: Locale = 'fi';

export const localeNames: Record<Locale, string> = {
  fi: 'Suomi',
  sv: 'Svenska',
  en: 'English'
};

export const localeLabels: Record<Locale, string> = {
  fi: 'FI',
  sv: 'SV',
  en: 'EN'
};
