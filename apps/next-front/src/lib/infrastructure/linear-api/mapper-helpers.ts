import { LocalizedValue } from '@/lib/domain/property.types';
import { LinearLocalized, LinearListing, LinearNV } from './types';

export const YES = new Set(['kyllä', 'ja', 'yes', 'on', '1', 'true', true, 1]);
export const NO = new Set(['ei', 'nej', 'no', 'off', '0', 'false', false, 0]);

export function lget(src: LinearLocalized, l: 'fi' | 'sv' | 'en'): string {
  if (src == null) return '';
  if (typeof src === 'string') return src || '';
  const v = (src as any)[l];
  if (!v) return '';
  return typeof v === 'string' ? v : (v?.value ?? '');
}

export function lv(src: LinearLocalized | undefined): LocalizedValue {
  return { fi: lget(src, 'fi'), sv: lget(src, 'sv') || undefined, en: lget(src, 'en') || undefined };
}

function textToHtml(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

export function lvHtml(src: LinearLocalized | undefined): LocalizedValue {
  return { fi: textToHtml(lget(src, 'fi')), sv: textToHtml(lget(src, 'sv')), en: textToHtml(lget(src, 'en')) };
}

export function toBool(v: any): boolean | undefined {
  let rawValue = v;
  if (v && typeof v === 'object' && v.fi?.value !== undefined) rawValue = v.fi.value;
  else if (v && typeof v === 'object' && v.fi !== undefined && typeof v.fi === 'string') rawValue = v.fi;
  if (rawValue === null || rawValue === undefined) return undefined;
  const s = String(rawValue).trim().toLowerCase();
  if (YES.has(s) || YES.has(rawValue)) return true;
  if (NO.has(s) || NO.has(rawValue)) return false;
  return undefined;
}

export function pickNV(nv: any, ...keys: string[]) {
  for (const k of keys) {
    if (nv?.[k] != null && nv[k] !== '') return nv[k];
  }
  return undefined;
}

export function parseNum(val: any): number | undefined {
  if (val == null || val === '') return undefined;
  const str = String(val).replace(/[^\d.,]/g, '').replace(',', '.');
  const num = parseFloat(str);
  return Number.isFinite(num) && num > 0 ? num : undefined;
}

export function parseAreaNumber(input: any): number | undefined {
  if (!input) return undefined;
  const s = String(input).replace(/\s+/g, '').replace(/[^\d.,-]/g, '').replace(',', '.');
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function firstNumber(...vals: Array<any>): number | undefined {
  for (const v of vals) {
    const n = typeof v === 'number' ? v : parseAreaNumber(v);
    if (Number.isFinite(n) && (n as number) > 0) return n as number;
  }
  return undefined;
}

function normalizeUnit(u?: string | null): 'SQM' | 'ARE' | 'HECTARE' | undefined {
  if (!u) return undefined;
  const s = String(u).trim().toUpperCase();
  if (s.includes('SQUARE') || s.includes('SQM') || s === 'M2' || s === 'M²') return 'SQM';
  // Check HECTARE before ARE since 'HECTARE'.includes('ARE') === true
  if (s.includes('HECTAR') || s === 'HA') return 'HECTARE';
  if (s.includes('ARE') || s === 'A') return 'ARE';
  return undefined;
}

export function applyUnit(n: number, unit?: string | null, rawText?: string | null): number {
  const nu = normalizeUnit(unit);
  if (nu === 'ARE') return n * 100;
  if (nu === 'HECTARE') return n * 10000;
  const raw = (rawText || '').toLowerCase();
  if (raw.includes(' ha') || raw.endsWith('ha') || raw.includes('hehtaari')) return n * 10000;
  return n;
}

export function normalizeStatus(val: any): 'ACTIVE' | 'SOLD' | 'RESERVED' | undefined {
  const s = String(val || '').toLowerCase();
  if (/myyty|sold|såld/.test(s)) return 'SOLD';
  if (/varattu|reserved|reserverad/.test(s)) return 'RESERVED';
  if (/aktiivinen|active|aktiv/.test(s)) return 'ACTIVE';
  return undefined;
}

/** Try nv fields, then src[field][locale], then src[field]['fi']. Apply optional transform. */
export function resolve(
  src: LinearListing,
  nv: LinearNV,
  locale: 'fi' | 'sv' | 'en',
  fields: string[],
  transform?: (v: any) => any
): any {
  const raw = pickNV(nv, ...fields);
  if (raw != null && raw !== '') return transform ? transform(raw) : raw;
  for (const f of fields) {
    const localeVal = lget(src[f], locale);
    if (localeVal) return transform ? transform(localeVal) : localeVal;
    if (locale !== 'fi') {
      const fiVal = lget(src[f], 'fi');
      if (fiVal) return transform ? transform(fiVal) : fiVal;
    }
  }
  return undefined;
}

/** Like resolve but always uses 'fi' locale (for fields where translation is wrong). */
export function resolveFi(
  src: LinearListing,
  nv: LinearNV,
  fields: string[],
  transform?: (v: any) => any
): any {
  return resolve(src, nv, 'fi', fields, transform);
}

/** Try multiple src fields, return first that has any localized content. */
export function firstLv(src: LinearListing, ...fields: string[]): LocalizedValue {
  for (const f of fields) {
    const value = lv(src[f]);
    if (value.fi || value.sv || value.en) return value;
  }
  return { fi: '', sv: '', en: '' };
}

/** Extract first valid value from multiple locales of a field. */
export function anyLocale(src: LinearLocalized): string | undefined {
  return lget(src, 'en') || lget(src, 'fi') || lget(src, 'sv') || undefined;
}
