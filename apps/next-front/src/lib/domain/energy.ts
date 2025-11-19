import { Locale } from './property.types';

export type EnergyStatus = 'HAS_CERTIFICATE' | 'NOT_REQUIRED_BY_LAW' | 'EXEMPT_BY_ACT' | null;

/**
 * Normalize energy certificate status from Linear API text
 */
export function normalizeEnergyStatus(txt: string): EnergyStatus {
  const s = (txt || '').toLowerCase();
  if (!s) return null;
  
  // Not required by law - CHECK THIS FIRST before "has certificate"
  if (/ei.*edellytt|not required|inget.*lagstadgat|ej.*lagstadgat|behöver inte/.test(s)) {
    return 'NOT_REQUIRED_BY_LAW';
  }
  
  // Exempt by act
  if (/vapautettu|exempt|undantagen/.test(s)) return 'EXEMPT_BY_ACT';
  
  // Has certificate - CHECK THIS LAST to avoid false positives
  if (/(kyllä|ja|yes|kohteella on|har|has)/.test(s)) return 'HAS_CERTIFICATE';
  
  return null;
}

/**
 * Get localized label for energy status
 */
export const energyLabels = {
  fi: {
    HAS_CERTIFICATE: 'Kyllä',
    NOT_REQUIRED_BY_LAW: 'Ei lain edellyttämää energiatodistusta',
    EXEMPT_BY_ACT: 'Vapautettu energiatodistuslain nojalla',
    null: 'Ei tietoa'
  },
  sv: {
    HAS_CERTIFICATE: 'Ja',
    NOT_REQUIRED_BY_LAW: 'Inget lagstadgat energicertifikat',
    EXEMPT_BY_ACT: 'Undantagen enligt energicertifikatlagen',
    null: 'Ingen information'
  },
  en: {
    HAS_CERTIFICATE: 'Yes',
    NOT_REQUIRED_BY_LAW: 'Not required by law',
    EXEMPT_BY_ACT: 'Exempt by Act',
    null: 'No information'
  }
} as const;

/**
 * Get label for energy status
 */
export function getEnergyStatusLabel(status: EnergyStatus, locale: Locale): string {
  return energyLabels[locale][status || 'null'] || energyLabels[locale]['null'];
}

