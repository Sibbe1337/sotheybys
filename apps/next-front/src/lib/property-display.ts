/**
 * Supported language types
 */
export type SupportedLanguage = 'fi' | 'sv' | 'en';

/**
 * Common yes/no synonyms used across listing data sources
 * Updated to include 'ja', true, 1, etc. for better elevator/boolean detection
 */
export const YES_VALUES = new Set(['kyllä', 'ja', 'yes', 'on', 'y', 'true', '1', 'available', 'exists', true, 1]);
export const NO_VALUES = new Set(['ei', 'nej', 'no', 'off', 'false', '0', 'none', false, 0]);

/**
 * Simple translations for yes/no
 */
const YES_TRANSLATIONS: Record<SupportedLanguage, string> = {
  fi: 'Kyllä',
  sv: 'Ja',
  en: 'Yes'
};

const NO_TRANSLATIONS: Record<SupportedLanguage, string> = {
  fi: 'Ei',
  sv: 'Nej',
  en: 'No'
};

/**
 * Simple synchronous translation for common real estate terms.
 * Used as a fallback when a language variant is missing but Finnish exists.
 */
export function quickTranslate(text: string, targetLang: SupportedLanguage): string {
  if (!text || targetLang === 'fi') return text;

  const terms: Record<string, { sv: string; en: string }> = {
    asunto: { sv: 'lägenhet', en: 'apartment' },
    huoneisto: { sv: 'lägenhet', en: 'apartment' },
    kattohuoneisto: { sv: 'takvåning', en: 'penthouse' },
    perheasunto: { sv: 'familjelägenhet', en: 'family apartment' },
    koti: { sv: 'hem', en: 'home' },
    talo: { sv: 'hus', en: 'house' },
    omakotitalo: { sv: 'villa', en: 'detached house' },
    rivitalo: { sv: 'radhus', en: 'townhouse' },
    kerrostalo: { sv: 'flerbostadshus', en: 'apartment building' },
    keittiö: { sv: 'kök', en: 'kitchen' },
    makuuhuone: { sv: 'sovrum', en: 'bedroom' },
    olohuone: { sv: 'vardagsrum', en: 'living room' },
    sauna: { sv: 'bastu', en: 'sauna' },
    parveke: { sv: 'balkong', en: 'balcony' },
    terassi: { sv: 'terrass', en: 'terrace' },
    hissi: { sv: 'hiss', en: 'elevator' },
    kerros: { sv: 'våning', en: 'floor' },
    tontti: { sv: 'tomt', en: 'plot' },
    tontin: { sv: 'tomtens', en: "plot's" },
    taloyhtiö: { sv: 'bostadsrättsförening', en: 'housing company' },
    valoisa: { sv: 'ljus', en: 'bright' },
    tilava: { sv: 'rymlig', en: 'spacious' },
    moderni: { sv: 'modern', en: 'modern' },
    viihtyisä: { sv: 'trivsam', en: 'cozy' },
    rauhallinen: { sv: 'lugn', en: 'peaceful' },
    keskeinen: { sv: 'central', en: 'central' },
    sijainti: { sv: 'läge', en: 'location' },
    palvelut: { sv: 'service', en: 'amenities' },
    liikenneyhteydet: { sv: 'trafikförbindelser', en: 'transport connections' },
    kaupat: { sv: 'affärer', en: 'shops' },
    koulu: { sv: 'skola', en: 'school' },
    meri: { sv: 'havet', en: 'sea' },
    puisto: { sv: 'park', en: 'park' }
  };

  let translated = text;
  for (const [fi, translations] of Object.entries(terms)) {
    const target = targetLang === 'sv' ? translations.sv : translations.en;
    const regex = new RegExp(`\\b${fi}\\b`, 'gi');
    translated = translated.replace(regex, (match) => {
      if (match[0] === match[0].toUpperCase()) {
        return target.charAt(0).toUpperCase() + target.slice(1);
      }
      return target;
    });
  }

  return translated;
}

/**
 * Robust boolean converter with comprehensive YES/NO detection.
 * Returns undefined if value cannot be determined as boolean.
 *
 * @example
 * toBool('Kyllä') // true
 * toBool('ja') // true
 * toBool(1) // true
 * toBool('Ei') // false
 * toBool(null) // undefined
 */
export function toBool(v: any): boolean | undefined {
  if (v === null || v === undefined) return undefined;

  // Direct boolean/number check
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') {
    if (v === 1) return true;
    if (v === 0) return false;
    return undefined;
  }

  // String check
  if (typeof v === 'string') {
    const normalized = v.trim().toLowerCase();
    if (YES_VALUES.has(normalized) || YES_VALUES.has(v)) return true;
    if (NO_VALUES.has(normalized) || NO_VALUES.has(v)) return false;
  }

  // Check if the value itself is in the sets (handles true/false/1/0)
  if (YES_VALUES.has(v)) return true;
  if (NO_VALUES.has(v)) return false;

  return undefined;
}

/**
 * Format a value as Euro if it's numeric, otherwise return as text.
 * Useful for fields that can be either amount or description.
 *
 * @example
 * formatEuroMaybe('2 kuukauden vuokra') // '2 kuukauden vuokra'
 * formatEuroMaybe(1000) // '1 000 €'
 * formatEuroMaybe('1000') // '1 000 €'
 */
export function formatEuroMaybe(v: any): string {
  const numericValue = parseEuroAmount(v);
  if (numericValue != null) {
    return formatEuroLabel(numericValue);
  }
  // Return as text if not numeric
  if (v != null && typeof v === 'string' && v.trim()) {
    return v.trim();
  }
  return '—';
}

export function isTruthyFlag(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (YES_VALUES.has(normalized)) return true;
    if (NO_VALUES.has(normalized)) return false;
  }
  return false;
}

export function parseEuroAmount(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const normalized = value
      .replace(/\s/g, '')
      .replace(/€/g, '')
      .replace(/,/g, '.')
      .replace(/[^0-9.\-]/g, '');
    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function formatBooleanLabel(value: unknown, language: SupportedLanguage): string {
  const yesLabel = YES_TRANSLATIONS[language];
  const noLabel = NO_TRANSLATIONS[language];

  if (value == null || (typeof value === 'string' && value.trim() === '')) {
    return '—';
  }

  if (isTruthyFlag(value)) {
    return yesLabel;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (NO_VALUES.has(normalized)) {
      return noLabel;
    }
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? yesLabel : noLabel;
  }

  return noLabel;
}

export function formatEuroLabel(value: number | null): string {
  if (value == null) return '—';
  const hasDecimals = Math.abs(value % 1) > 0;
  return `${value.toLocaleString('fi-FI', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0
  })} €`;
}

/**
 * Format date in Finnish format (DD.MM.YYYY)
 * Handles Date objects, ISO strings, and already formatted strings
 *
 * @example
 * formatDateFiLike('2025-05-04') // '4.5.2025'
 * formatDateFiLike('04.05.2025') // '04.05.2025' (already Finnish format)
 * formatDateFiLike(new Date(2025, 4, 4)) // '4.5.2025'
 */
export function formatDateFiLike(src: any): string {
  if (!src) return '';

  // If it's already a Date object
  if (src instanceof Date) {
    return src.toLocaleDateString('fi-FI');
  }

  const s = String(src).trim();
  if (!s) return '';

  // Check if it's an ISO date (YYYY-MM-DD format)
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (isoMatch) {
    const date = new Date(s);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('fi-FI');
    }
  }

  // If it's already in Finnish format (DD.MM.YYYY) or other format, return as-is
  return s;
}

export function pickFirstNonEmpty<T>(...values: T[]): T | null {
  for (const value of values) {
    if (value == null) continue;
    if (typeof value === 'string') {
      if (value.trim() !== '') return value;
      continue;
    }
    if (Array.isArray(value)) {
      if (value.length > 0) return value;
      continue;
    }
    return value;
  }
  return null;
}

export function getEnergyCertificateMessage(status: string | undefined, language: SupportedLanguage): string {
  if (!status) return '';

  const messages: Record<string, { fi: string; sv: string; en: string }> = {
    'Ei lain edellyttämää energiatodistusta': {
      fi: 'Ei lain edellyttämää energiatodistusta',
      sv: 'Inte lagstadgad energicertifikat',
      en: 'Not legally required energy certificate'
    },
    'Kohteella ei energiatodistuslain nojalla tarvitse olla energiatodistusta': {
      fi: 'Kohteella ei energiatodistuslain nojalla tarvitse olla energiatodistusta',
      sv: 'Objektet behöver inte ha energicertifikat enligt lagen',
      en: 'Property does not require an energy certificate by law'
    }
  };

  if (messages[status]) {
    return messages[status][language];
  }

  return '';
}

function extractLocalizedString(input: unknown): string {
  if (input == null) return '';
  if (typeof input === 'string') return input.trim();
  if (typeof input === 'number') return input.toString();
  if (typeof input === 'boolean') return input ? 'true' : 'false';
  if (Array.isArray(input)) {
    return input.map(extractLocalizedString).filter(Boolean).join(', ');
  }
  if (typeof input === 'object') {
    const value = (input as Record<string, unknown>).value;
    if (value != null) return extractLocalizedString(value);
    const label = (input as Record<string, unknown>).label;
    if (label != null) return extractLocalizedString(label);
    const text = (input as Record<string, unknown>).text;
    if (text != null) return extractLocalizedString(text);
    const rendered = (input as Record<string, unknown>).rendered;
    if (rendered != null) return extractLocalizedString(rendered);
  }
  return '';
}

export function getLocalizedText(value: unknown, language: SupportedLanguage): string {
  if (value == null || value === '') {
    return '';
  }

  if (typeof value === 'string') {
    // For plain strings, only translate if language is fi
    // sv/en should NOT get fi content translated
    return language === 'fi' ? value : '';
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'boolean') {
    return formatBooleanLabel(value, language);
  }

  if (Array.isArray(value)) {
    return value.map((item) => getLocalizedText(item, language)).filter(Boolean).join(', ');
  }

  if (typeof value === 'object') {
    // ONLY return the requested language, NO fi-fallback for sv/en
    const localizedCandidate = extractLocalizedString((value as Record<string, unknown>)[language]);
    if (localizedCandidate) {
      return localizedCandidate;
    }

    // If we're looking for fi and it exists, return it
    if (language === 'fi') {
      const finnishCandidate = extractLocalizedString((value as Record<string, unknown>).fi);
      if (finnishCandidate) {
        return finnishCandidate;
      }
    }

    // No fallback - return empty if requested language is missing
    // UI will handle this with "Uppgift saknas" or auto-translate banner
  }

  return '';
}

/**
 * Picks the first non-empty value from a list of possible field keys.
 * Supports multilingual fields with language-specific subkeys.
 *
 * @example
 * pick(data, ['floor', 'kerros'], 'fi') // Returns first non-empty value
 * pick(data, ['description_fi', 'description'], 'fi')
 */
export function pick(obj: any, keys: string[], language: SupportedLanguage): string | null {
  if (!obj || !keys || keys.length === 0) return null;

  for (const key of keys) {
    // Try direct key
    const directValue = obj[key];
    if (directValue != null) {
      // If it's an object with language keys, try to extract
      if (typeof directValue === 'object' && !Array.isArray(directValue)) {
        const langValue = directValue[language]?.value ?? directValue[language];
        if (langValue != null && String(langValue).trim() !== '') {
          return String(langValue).trim();
        }
      }
      // If it's a plain value
      if (typeof directValue === 'string' && directValue.trim() !== '') {
        return directValue.trim();
      }
      if (typeof directValue === 'number') {
        return String(directValue);
      }
    }

    // Try language-specific key (e.g., key_fi, key_sv)
    const langSpecificKey = `${key}_${language}`;
    const langValue = obj[langSpecificKey];
    if (langValue != null) {
      const strValue = String(langValue).trim();
      if (strValue !== '') return strValue;
    }
  }

  return null;
}

/**
 * Returns "missing information" text in the specified language
 */
export function missing(language: SupportedLanguage): string {
  const messages = {
    fi: 'Tieto puuttuu',
    sv: 'Uppgift saknas',
    en: 'Information unavailable'
  };
  return messages[language];
}

/**
 * Converts a value to Yes/No in the specified language.
 * Returns null if the value cannot be determined.
 *
 * @example
 * yn(true, 'fi') // 'Kyllä'
 * yn('yes', 'sv') // 'Ja'
 * yn('ei', 'en') // 'No'
 */
export function yn(value: any, language: SupportedLanguage): string | null {
  const yesLabel = { fi: 'Kyllä', sv: 'Ja', en: 'Yes' }[language];
  const noLabel = { fi: 'Ei', sv: 'Nej', en: 'No' }[language];

  if (value == null) return null;

  // Boolean
  if (typeof value === 'boolean') {
    return value ? yesLabel : noLabel;
  }

  // Number
  if (typeof value === 'number') {
    return value > 0 ? yesLabel : noLabel;
  }

  // String
  if (typeof value === 'string') {
    const normalized = value.toLowerCase().trim();

    // Yes values
    if (['1', 'true', 'yes', 'ja', 'kyllä', 'on'].includes(normalized)) {
      return yesLabel;
    }

    // No values
    if (['0', 'false', 'no', 'nej', 'ei', 'off'].includes(normalized)) {
      return noLabel;
    }
  }

  return null;
}
