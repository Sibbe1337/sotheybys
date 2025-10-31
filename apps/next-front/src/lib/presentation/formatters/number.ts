/**
 * NUMBER FORMATTERS
 * 
 * Centralized formatting utilities for currency, area, and calculations.
 * "Hide-if-empty" logic built-in.
 */

export type L = 'fi-FI' | 'sv-SE' | 'en-GB';

export const mapLocale = (l: 'fi' | 'sv' | 'en'): L => 
  (l === 'sv' ? 'sv-SE' : l === 'en' ? 'en-GB' : 'fi-FI');

export const money = (n?: number | null, L: L = 'fi-FI') =>
  typeof n === 'number' ? new Intl.NumberFormat(L, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n) : '';

export const area = (n?: number | null, L: L = 'fi-FI') =>
  typeof n === 'number' && n > 0 ? `${n.toLocaleString(L)} m²` : '';

export const plot = (n?: number | null, L: L = 'fi-FI') => {
  if (typeof n !== 'number' || n <= 0) return '';
  return n >= 10000 ? `${(n / 10000).toLocaleString(L, { maximumFractionDigits: 2 })} ha` : `${n.toLocaleString(L)} m²`;
};

export const perSqm = (price?: number | null, m2?: number | null, L: L = 'fi-FI') =>
  (typeof price === 'number' && typeof m2 === 'number' && m2 > 0) ? `${Math.round(price / m2).toLocaleString(L)} €/m²` : '';

export const nonEmpty = (v: any) => {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v.trim() !== '' && !['Ei ilmoitettu', 'Ej angivet', 'Not specified', 'Uppgift saknas', '—'].includes(v.trim());
  return true;
};

/**
 * Boolean label helper - converts boolean to localized "Yes/No" text
 */
export const boolLabel = (val: boolean | undefined, locale: 'fi' | 'sv' | 'en'): string => {
  if (val === undefined || val === null) return '';
  if (val === true) return locale === 'fi' ? 'Kyllä' : locale === 'sv' ? 'Ja' : 'Yes';
  return locale === 'fi' ? 'Ei' : locale === 'sv' ? 'Nej' : 'No';
};

