/**
 * Flatten MultilingualPropertyListing to single-language format
 * 
 * This ensures NO LocalizedString objects reach the client,
 * preventing React error #31 "object with keys {fi, en, sv}"
 */

import { MultilingualPropertyListing, LocalizedString, SupportedLanguage } from './property-types-multilang';

type FlattenedProperty = {
  [K in keyof MultilingualPropertyListing]: MultilingualPropertyListing[K] extends LocalizedString
    ? string  // Convert LocalizedString to string
    : MultilingualPropertyListing[K];
};

/**
 * Flatten all LocalizedString fields to single language
 */
export function flattenPropertyForLanguage(
  property: MultilingualPropertyListing,
  language: SupportedLanguage
): FlattenedProperty {
  const flattened: any = {};

  for (const [key, value] of Object.entries(property)) {
    // Check if value is a LocalizedString object
    if (value && typeof value === 'object' && ('fi' in value || 'en' in value || 'sv' in value)) {
      // Extract string for the specified language
      const localizedValue = value as LocalizedString;
      flattened[key] = localizedValue[language] || localizedValue['fi'] || '';
      
      console.log(`📝 Flattened ${key}:`, {
        original: localizedValue,
        flattened: flattened[key],
        type: typeof flattened[key]
      });
    } else {
      // Keep non-LocalizedString values as-is
      flattened[key] = value;
    }
  }

  return flattened as FlattenedProperty;
}

