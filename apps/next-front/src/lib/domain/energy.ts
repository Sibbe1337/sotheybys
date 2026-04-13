import { Locale } from './property.types';

export type EnergyStatus = 'HAS_CERTIFICATE' | 'NOT_REQUIRED_BY_LAW' | 'EXEMPT_BY_ACT' | null;

/**
 * Normalize energy certificate status from Linear API text
 */
export function normalizeEnergyStatus(txt: string): EnergyStatus {
  const s = (txt || '').toLowerCase();
  if (!s) return null;
  
  // Exempt by act - option 3 in Linear. MUST run before NOT_REQUIRED_BY_LAW
  // because the Swedish/Finnish phrasings both contain "behöver inte" / "ei tarvitse"
  // which would otherwise match option 2's bucket.
  if (/vapautettu|exempt|undantagen|undantaget|energiatodistuslain nojalla|ei.*energiatodistus.*tarvitse|ei tarvitse.*energiatodistus|behöver inte.*energicertifikat|fastigheten behöver inte/.test(s)) {
    return 'EXEMPT_BY_ACT';
  }

  // Not required by law - option 2 in Linear
  if (/ei lain edellytt|ei.*edellyttämää|not required|inget.*lagstadgat|ej.*lagstadgat|no statutory|ingen lagstadgad/.test(s)) {
    return 'NOT_REQUIRED_BY_LAW';
  }
  
  // Has certificate - CHECK THIS LAST to avoid false positives
  // Dennis 2025-11-24: Use word boundaries + check for complete "Kyllä" word
  if (/^\s*kyllä\s*$|^\s*ja\s*$|^\s*yes\s*$|\bkohteella on energiatodistus\b/.test(s)) return 'HAS_CERTIFICATE';
  
  return null;
}

/**
 * Get localized label for energy status
 */
export const energyLabels = {
  fi: {
    HAS_CERTIFICATE: 'Kyllä',
    NOT_REQUIRED_BY_LAW: 'Ei lain edellyttämää energiatodistusta',
    EXEMPT_BY_ACT: 'Energiatodistusta ei vaadita',
    null: 'Ei tietoa'
  },
  sv: {
    HAS_CERTIFICATE: 'Ja',
    NOT_REQUIRED_BY_LAW: 'Inget lagstadgat energicertifikat',
    EXEMPT_BY_ACT: 'Energicertifikat krävs ej',
    null: 'Ingen information'
  },
  en: {
    HAS_CERTIFICATE: 'Yes',
    NOT_REQUIRED_BY_LAW: 'No statutory energy certificate',
    EXEMPT_BY_ACT: 'Energy certificate not required',
    null: 'No information'
  }
} as const;

/**
 * Get label for energy status
 */
export function getEnergyStatusLabel(status: EnergyStatus, locale: Locale): string {
  return energyLabels[locale][status || 'null'] || energyLabels[locale]['null'];
}

