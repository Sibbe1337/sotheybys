import { Locale } from './property.types';

export type EnergyStatus = 'HAS_CERTIFICATE' | 'NOT_REQUIRED_BY_LAW' | 'EXEMPT_BY_ACT' | null;

/**
 * Normalize energy certificate status from Linear API text
 */
export function normalizeEnergyStatus(txt: string): EnergyStatus {
  const s = (txt || '').toLowerCase();
  if (!s) return null;
  
  // Not required by law - CHECK THIS FIRST before "has certificate"
  // Dennis 2025-11-24: Finnish patterns for "not required"
  if (/ei.*edellytt|ei.*tarvita|ei tarvitse|not required|inget.*lagstadgat|ej.*lagstadgat|behöver inte|fastigheten behöver inte/.test(s)) {
    return 'NOT_REQUIRED_BY_LAW';
  }
  
  // Exempt by act
  if (/vapautettu|exempt|undantagen|undantaget/.test(s)) return 'EXEMPT_BY_ACT';
  
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
    NOT_REQUIRED_BY_LAW: 'No statutory energy certificate',
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

