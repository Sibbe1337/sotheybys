import { Locale, LocalizedValue } from './property.types';

/**
 * PLACEHOLDERS for missing translations (per spec requirement)
 */
const MISSING_TRANSLATION_PLACEHOLDERS = {
  fi: 'Tieto puuttuu',
  sv: 'Uppgift saknas',
  en: 'Information unavailable'
} as const;

/**
 * STRICT locale picker - NO silent fallback to Finnish (per spec)
 * Returns requested locale value or placeholder if missing
 * Use this for content fields where strict translation is required
 */
export function lpickStrict(
  lv: LocalizedValue | undefined,
  locale: Locale
): string {
  if (!lv) return '';
  const value = lv[locale];
  if (!value || value.trim() === '') {
    // Return locale-specific placeholder (NOT fi fallback)
    return MISSING_TRANSLATION_PLACEHOLDERS[locale];
  }
  return value;
}

/**
 * Pick localized value WITH fallback to Finnish (for backwards compatibility)
 * Use this ONLY for critical fields like title/address where FI fallback is acceptable
 * @deprecated Prefer lpickStrict for new code per spec requirements
 */
export function lpick<T extends string | undefined>(
  lv: LocalizedValue<T> | undefined,
  locale: Locale
): string {
  if (!lv) return '';
  return (lv[locale] ?? lv.fi ?? '') || '';
}

/**
 * Pick with explicit fallback control
 * For cases where we want FI fallback for titles but strict for content
 */
export function lpickWithFallback(
  lv: LocalizedValue | undefined,
  locale: Locale,
  allowFiFallback: boolean = true
): string {
  if (!lv) return '';
  const value = lv[locale];
  
  if (!value || value.trim() === '') {
    if (allowFiFallback) {
      return lv.fi || '';
    } else {
      return MISSING_TRANSLATION_PLACEHOLDERS[locale];
    }
  }
  
  return value;
}

/**
 * Pick localized value with missing data indicator
 */
export function lpickWithIndicator(
  lv: LocalizedValue | undefined,
  locale: Locale
): { value: string; isMissing: boolean } {
  if (!lv) return { value: '', isMissing: true };
  
  const requested = lv[locale];
  if (requested && requested.trim() !== '') {
    return { value: requested, isMissing: false };
  }
  
  const fallback = lv.fi;
  return {
    value: fallback || MISSING_TRANSLATION_PLACEHOLDERS[locale],
    isMissing: true
  };
}

/**
 * Get placeholder text for missing translation
 */
export function getPlaceholder(locale: Locale): string {
  return MISSING_TRANSLATION_PLACEHOLDERS[locale];
}

