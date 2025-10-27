import { getTranslation, type SupportedLanguage } from './property-translations';

/**
 * Common yes/no synonyms used across listing data sources
 */
export const YES_VALUES = new Set(['kyllä', 'on', 'yes', 'y', 'true', '1', 'available', 'exists']);
export const NO_VALUES = new Set(['ei', 'no', 'false', '0', 'none']);

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
  const yesLabel = getTranslation('yes', language);
  const noLabel = getTranslation('no', language);

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
    return language === 'fi' ? value : quickTranslate(value, language);
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
    const localizedCandidate = extractLocalizedString((value as Record<string, unknown>)[language]);
    if (localizedCandidate) {
      return localizedCandidate;
    }

    const finnishCandidate = extractLocalizedString((value as Record<string, unknown>).fi);
    if (finnishCandidate) {
      return language === 'fi' ? finnishCandidate : quickTranslate(finnishCandidate, language);
    }

    const englishCandidate = extractLocalizedString((value as Record<string, unknown>).en);
    if (englishCandidate) {
      return englishCandidate;
    }

    const swedishCandidate = extractLocalizedString((value as Record<string, unknown>).sv);
    if (swedishCandidate) {
      return swedishCandidate;
    }

    const fallback = extractLocalizedString(value);
    if (fallback) {
      return language === 'fi' ? fallback : quickTranslate(fallback, language);
    }
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
