/**
 * Property Detail Page Translations
 * 
 * Simple utility for accessing property translations in client components
 * Per spec: All labels must come from i18n JSON files
 */

import type { Locale } from '../domain/property.types';

import fiMessages from '../../../messages/fi.json';
import svMessages from '../../../messages/sv.json';
import enMessages from '../../../messages/en.json';

const messages = {
  fi: fiMessages,
  sv: svMessages,
  en: enMessages
};

type PropertyMessages = typeof fiMessages.property;

/**
 * Get property translation by key path
 * e.g., t('tabs.overview', 'fi') => "Yleiskatsaus"
 */
export function t(key: string, locale: Locale): string {
  const parts = key.split('.');
  let value: any = messages[locale].property;
  
  for (const part of parts) {
    value = value?.[part];
    if (value === undefined) {
      console.warn(`Translation key not found: property.${key} for locale ${locale}`);
      return key; // Fallback to key itself
    }
  }
  
  return typeof value === 'string' ? value : key;
}

/**
 * Get tab label
 */
export function getTabLabel(tabId: string, locale: Locale): string {
  return t(`tabs.${tabId}`, locale);
}

/**
 * Get section label
 */
export function getSectionLabel(sectionId: string, locale: Locale): string {
  return t(`sections.${sectionId}`, locale);
}

/**
 * Get field label
 */
export function getFieldLabel(fieldId: string, locale: Locale): string {
  return t(`fields.${fieldId}`, locale);
}

/**
 * Get all tab labels for a locale - DIFFERENTIATED BY OBJECT TYPE
 * ✅ DENNIS SPEC: Properties have different tab labels than apartments
 */
export function getAllTabs(locale: Locale, isProperty: boolean = false, isRental: boolean = false): Array<[string, string]> {
  if (isProperty) {
    // ✅ DENNIS SPEC: Fastigheter (Properties/Estates)
    // apartment tab = "Kiinteistötiedot" (Property Information)
    // company tab = "Rakennustiedot" (Building Facts)
    // NO "other" tab for properties
    return [
      ['overview', getTabLabel('overview', locale)],
      ['apartment', locale === 'sv' ? 'Fastighetsinformation' : locale === 'en' ? 'Property Information' : 'Kiinteistötiedot'],
      ['company', locale === 'sv' ? 'Byggfakta' : locale === 'en' ? 'Building Facts' : 'Rakennustiedot'],
      ['costs', getTabLabel('costs', locale)],
      ['documents', getTabLabel('documents', locale)],
      ['map', getTabLabel('map', locale)]
    ];
  } else if (isRental) {
    // ✅ DENNIS SPEC: Rental properties
    return [
      ['overview', getTabLabel('overview', locale)],
      ['apartment', locale === 'sv' ? 'Lägenhetsuppgifter' : locale === 'en' ? 'Apartment Details' : 'Huoneistotiedot'],
      ['company', locale === 'sv' ? 'Husbolagsuppgifter' : locale === 'en' ? 'Housing Company' : 'Taloyhtiötiedot'],
      ['costs', getTabLabel('costs', locale)],
      ['other', locale === 'sv' ? 'Hyresuppgifter' : locale === 'en' ? 'Rental Terms' : 'Vuokratiedot'],
      ['documents', getTabLabel('documents', locale)],
      ['map', getTabLabel('map', locale)]
    ];
  } else {
    // ✅ DENNIS SPEC: Apartments
    return [
      ['overview', getTabLabel('overview', locale)],
      ['apartment', getTabLabel('apartment', locale)],
      ['company', getTabLabel('company', locale)],
      ['costs', getTabLabel('costs', locale)],
      ['other', getTabLabel('other', locale)],
      ['documents', getTabLabel('documents', locale)],
      ['map', getTabLabel('map', locale)]
    ];
  }
}

