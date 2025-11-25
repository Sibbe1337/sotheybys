/**
 * Listing Type Localizer
 * 
 * Per spec: "listingType (code) → localized label ('Kerrostalo' → 'Höghus', etc.)"
 * Maps raw Linear API listing type codes to localized labels
 */

import type { Locale, LocalizedValue } from '@/lib/domain/property.types';

/**
 * Mapping of Linear API listing type codes to localized labels
 * Supports both Finnish (KERROSTALO) and English (FLAT) codes from Linear API
 */
const LISTING_TYPE_LABELS: Record<string, LocalizedValue> = {
  // ====== FINNISH CODES (original) ======
  'KERROSTALO': {
    fi: 'Kerrostalo',
    sv: 'Höghus',
    en: 'Apartment Building'
  },
  'OMAKOTITALO': {
    fi: 'Omakotitalo',
    sv: 'Egnahemshus',
    en: 'Detached House'
  },
  'RIVITALO': {
    fi: 'Rivitalo',
    sv: 'Radhus',
    en: 'Townhouse'
  },
  'PARITALO': {
    fi: 'Paritalo',
    sv: 'Parhus',
    en: 'Semi-detached House'
  },
  'LUHTITALO': {
    fi: 'Luhtitalo',
    sv: 'Kedjehus',
    en: 'Terraced House'
  },
  'MÖKKI_TAI_HUVILA': {
    fi: 'Mökki tai huvila',
    sv: 'Stuga eller villa',
    en: 'Cottage or Villa'
  },
  'TONTTI': {
    fi: 'Tontti',
    sv: 'Tomt',
    en: 'Plot'
  },
  'MAATILA': {
    fi: 'Maatila',
    sv: 'Lantgård',
    en: 'Farm'
  },
  'LIIKEHUONEISTO': {
    fi: 'Liikehuoneisto',
    sv: 'Affärslokal',
    en: 'Commercial Property'
  },
  'TOIMISTO': {
    fi: 'Toimisto',
    sv: 'Kontor',
    en: 'Office'
  },
  'TEOLLISUUSKIINTEISTÖ': {
    fi: 'Teollisuuskiinteistö',
    sv: 'Industriegendom',
    en: 'Industrial Property'
  },
  'VARASTO': {
    fi: 'Varasto',
    sv: 'Lager',
    en: 'Warehouse'
  },
  'VUOKRAHUONEISTO': {
    fi: 'Vuokrahuoneisto',
    sv: 'Hyreslägenhet',
    en: 'Rental Apartment'
  },
  'VUOKRATALO': {
    fi: 'Vuokratalo',
    sv: 'Hyreshus',
    en: 'Rental House'
  },
  
  // ====== ENGLISH CODES (Linear API aliases) ======
  'FLAT': {
    fi: 'Kerrostalo',
    sv: 'Höghus',
    en: 'Apartment Building'
  },
  'DETACHED_HOUSE': {
    fi: 'Omakotitalo',
    sv: 'Egnahemshus',
    en: 'Detached House'
  },
  'DETACHEDHOUSE': {
    fi: 'Omakotitalo',
    sv: 'Egnahemshus',
    en: 'Detached House'
  },
  'TOWNHOUSE': {
    fi: 'Rivitalo',
    sv: 'Radhus',
    en: 'Townhouse'
  },
  'SEMI_DETACHED_HOUSE': {
    fi: 'Paritalo',
    sv: 'Parhus',
    en: 'Semi-detached House'
  },
  'PAIRHOUSE': {
    fi: 'Paritalo',
    sv: 'Parhus',
    en: 'Semi-detached House'
  },
  'TERRACED_HOUSE': {
    fi: 'Luhtitalo',
    sv: 'Kedjehus',
    en: 'Terraced House'
  },
  'COTTAGE_OR_VILLA': {
    fi: 'Mökki tai huvila',
    sv: 'Stuga eller villa',
    en: 'Cottage or Villa'
  },
  'PLOT': {
    fi: 'Tontti',
    sv: 'Tomt',
    en: 'Plot'
  },
  'FARM': {
    fi: 'Maatila',
    sv: 'Lantgård',
    en: 'Farm'
  },
  'COMMERCIAL_PROPERTY': {
    fi: 'Liikehuoneisto',
    sv: 'Affärslokal',
    en: 'Commercial Property'
  },
  'OFFICE': {
    fi: 'Toimisto',
    sv: 'Kontor',
    en: 'Office'
  },
  'OFFICE_SPACE': {
    fi: 'Toimistotila',
    sv: 'Kontorslokal',
    en: 'Office Space'
  },
  'INDUSTRIAL_PROPERTY': {
    fi: 'Teollisuuskiinteistö',
    sv: 'Industriegendom',
    en: 'Industrial Property'
  },
  'WAREHOUSE': {
    fi: 'Varasto',
    sv: 'Lager',
    en: 'Warehouse'
  },
  'RENTAL_APARTMENT': {
    fi: 'Vuokrahuoneisto',
    sv: 'Hyreslägenhet',
    en: 'Rental Apartment'
  },
  'RENTAL_HOUSE': {
    fi: 'Vuokratalo',
    sv: 'Hyreshus',
    en: 'Rental House'
  }
};

/**
 * Localize listing type code
 * 
 * @param code - Raw listing type code from Linear API (e.g., "KERROSTALO")
 * @returns LocalizedValue with translations for all locales
 */
export function localizeListingType(code: string | undefined): LocalizedValue {
  if (!code) {
    return { fi: '', sv: undefined, en: undefined };
  }
  
  const normalized = code.toUpperCase().trim();
  const labels = LISTING_TYPE_LABELS[normalized];
  
  if (labels) {
    return labels;
  }
  
  // Fallback: return the code itself in all locales
  // This ensures we always have something to display
  return {
    fi: code,
    sv: code,
    en: code
  };
}

/**
 * Get localized listing type label for a specific locale
 * 
 * @param code - Raw listing type code
 * @param locale - Target locale
 * @returns Localized label string
 */
export function getListingTypeLabel(code: string | undefined, locale: Locale): string {
  const localized = localizeListingType(code);
  return localized[locale] || localized.fi || code || '';
}

