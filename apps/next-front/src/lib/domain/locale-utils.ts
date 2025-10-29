import { Locale, LocalizedValue } from './property.types';

/**
 * Pick localized value with strict fallback policy
 * Returns requested locale, falls back to fi, or empty string
 */
export function lpick<T extends string | undefined>(
  lv: LocalizedValue<T> | undefined,
  locale: Locale
): string {
  if (!lv) return '';
  return (lv[locale] ?? lv.fi ?? '') || '';
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
  if (requested) return { value: requested, isMissing: false };
  
  const fallback = lv.fi;
  return {
    value: fallback || '',
    isMissing: !fallback
  };
}

