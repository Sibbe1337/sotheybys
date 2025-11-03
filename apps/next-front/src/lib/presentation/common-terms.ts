/**
 * COMMON REAL ESTATE TERMS TRANSLATOR
 * 
 * Translates common Finnish real estate terms to Swedish and English
 * Used for technical data that comes from Linear API without localization
 */

type Locale = 'fi' | 'sv' | 'en';

// Boolean values
const BOOLEAN_TRANSLATIONS: Record<string, Record<Locale, string>> = {
  true: { fi: 'Kyllä', sv: 'Ja', en: 'Yes' },
  false: { fi: 'Ei', sv: 'Nej', en: 'No' },
};

// Ownership types
const OWNERSHIP_TRANSLATIONS: Record<string, Record<Locale, string>> = {
  'Oma': { fi: 'Oma', sv: 'Egen', en: 'Own' },
  'Vuokra': { fi: 'Vuokra', sv: 'Hyra', en: 'Rent' },
  'Osaomistus': { fi: 'Osaomistus', sv: 'Delägande', en: 'Partial ownership' },
};

// Heating systems
const HEATING_TRANSLATIONS: Record<string, Record<Locale, string>> = {
  'Kaukolämpö': { fi: 'Kaukolämpö', sv: 'Fjärrvärme', en: 'District heating' },
  'Kaukolämpö ja ilmalämpöpumppu': { fi: 'Kaukolämpö ja ilmalämpöpumppu', sv: 'Fjärrvärme och luftvärmepump', en: 'District heating and air source heat pump' },
  'Maalämpö': { fi: 'Maalämpö', sv: 'Jordvärme', en: 'Geothermal heating' },
  'Maalämpö ja lattialämmitys': { fi: 'Maalämpö ja lattialämmitys', sv: 'Jordvärme och golvvärme', en: 'Geothermal heating and underfloor heating' },
  'Lattialämmitys': { fi: 'Lattialämmitys', sv: 'Golvvärme', en: 'Underfloor heating' },
  'Öljylämmitys': { fi: 'Öljylämmitys', sv: 'Oljeuppvärmning', en: 'Oil heating' },
  'Sähkölämmitys': { fi: 'Sähkölämmitys', sv: 'Eluppvärmning', en: 'Electric heating' },
  'Ilmalämpöpumppu': { fi: 'Ilmalämpöpumppu', sv: 'Luftvärmepump', en: 'Air source heat pump' },
  'Vesikiertoinen lattialämmitys': { fi: 'Vesikiertoinen lattialämmitys', sv: 'Vattenburen golvvärme', en: 'Hydronic underfloor heating' },
};

// Zoning
const ZONING_TRANSLATIONS: Record<string, Record<Locale, string>> = {
  'Asemakaava': { fi: 'Asemakaava', sv: 'Detaljplan', en: 'Detailed plan' },
  'Yleiskaava': { fi: 'Yleiskaava', sv: 'Generalplan', en: 'General plan' },
  'Ranta-asemakaava': { fi: 'Ranta-asemakaava', sv: 'Stranddetaljplan', en: 'Shore detail plan' },
};

// Availability
const AVAILABILITY_TRANSLATIONS: Record<string, Record<Locale, string>> = {
  'Sopimuksen mukaan': { fi: 'Sopimuksen mukaan', sv: 'Enligt överenskommelse', en: 'By agreement' },
  'Heti': { fi: 'Heti', sv: 'Omedelbart', en: 'Immediately' },
  'Välittömästi': { fi: 'Välittömästi', sv: 'Omedelbart', en: 'Immediately' },
};

/**
 * Translate boolean value to locale-specific text
 */
export function translateBoolean(value: boolean | undefined, locale: Locale = 'fi'): string {
  if (value === undefined || value === null) return '—';
  const key = value ? 'true' : 'false';
  return BOOLEAN_TRANSLATIONS[key]?.[locale] || '—';
}

/**
 * Translate common real estate terms
 * Falls back to original text if no translation found
 */
export function translateCommonTerm(text: string | undefined, locale: Locale = 'fi'): string {
  if (!text || text.trim() === '') return '';
  
  const normalized = text.trim();
  
  // Check all translation dictionaries
  const allTranslations = {
    ...OWNERSHIP_TRANSLATIONS,
    ...HEATING_TRANSLATIONS,
    ...ZONING_TRANSLATIONS,
    ...AVAILABILITY_TRANSLATIONS,
  };
  
  // Try exact match first
  if (allTranslations[normalized]) {
    return allTranslations[normalized][locale] || normalized;
  }
  
  // Try case-insensitive match
  const lowerNormalized = normalized.toLowerCase();
  for (const [key, translations] of Object.entries(allTranslations)) {
    if (key.toLowerCase() === lowerNormalized) {
      return translations[locale] || normalized;
    }
  }
  
  // No translation found, return original
  return normalized;
}

/**
 * Translate multiple comma-separated terms
 */
export function translateCommonTerms(text: string | undefined, locale: Locale = 'fi'): string {
  if (!text || text.trim() === '') return '';
  
  // Try translating the whole phrase first (for combined terms like "Maalämpö ja lattialämmitys")
  const wholeTranslation = translateCommonTerm(text, locale);
  if (wholeTranslation !== text) {
    return wholeTranslation;
  }
  
  // If no translation found for the whole phrase, try splitting and translating parts
  const terms = text.split(/[,;]/).map(t => t.trim());
  const translated = terms.map(term => translateCommonTerm(term, locale));
  
  return translated.join(', ');
}

