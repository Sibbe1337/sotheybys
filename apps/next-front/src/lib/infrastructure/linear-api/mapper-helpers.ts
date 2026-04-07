/**
 * MAPPER HELPERS
 *
 * Generic helper functions used by the Linear API → Property mapper.
 * Includes boolean parsing, localized value extraction, number/area parsing,
 * and text conversion utilities.
 */

import { LocalizedValue } from '@/lib/domain/property.types';
import { log } from '@/lib/logger';
import { LinearLocalized } from './types';

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
  return {
    fi: lget(src, 'fi'),
    sv: lget(src, 'sv') || undefined,
    en: lget(src, 'en') || undefined
  };
}

// LINUS FIX: Convert plain text line breaks to HTML paragraphs
export function textToHtml(text: string | undefined | null): string {
  if (!text) return '';

  // Split by double line breaks (paragraphs) or single line breaks
  const paragraphs = text
    .split(/\n\n+/) // Split on double+ line breaks (paragraph separators)
    .map(para => para.trim())
    .filter(para => para.length > 0)
    .map(para => {
      // Within each paragraph, replace single line breaks with <br>
      const withBreaks = para.replace(/\n/g, '<br>');
      return `<p>${withBreaks}</p>`;
    });

  return paragraphs.join('');
}

// LINUS FIX: Apply textToHtml to LocalizedValue
export function lvHtml(src: LinearLocalized | undefined): LocalizedValue {
  return {
    fi: textToHtml(lget(src, 'fi')),
    sv: textToHtml(lget(src, 'sv')),
    en: textToHtml(lget(src, 'en')),
  };
}

export function toBool(v: any): boolean | undefined {
  // ✅ FIX: Extract value from localized object structure
  let rawValue = v;

  // Handle localized object: { fi: { key: '...', value: 'Kyllä', category: '...' } }
  if (v && typeof v === 'object' && v.fi?.value !== undefined) {
    rawValue = v.fi.value;
  }
  // Handle LinearLocalized: { fi: 'Kyllä', sv: 'Ja', en: 'Yes' }
  else if (v && typeof v === 'object' && v.fi !== undefined && typeof v.fi === 'string') {
    rawValue = v.fi;
  }

  if (rawValue === null || rawValue === undefined) return undefined;

  const s = String(rawValue).trim().toLowerCase();
  if (YES.has(s) || YES.has(rawValue)) return true;
  if (NO.has(s) || NO.has(rawValue)) return false;

  log('⚠️ Unrecognized boolean value:', v);
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

// LINUS FIX: Robust area number parsing (handles "2 400 m²" → 2400)
export function parseAreaNumber(input: any): number | undefined {
  if (!input) return undefined;
  const s = String(input).replace(/\s+/g, '').replace(/[^\d.,-]/g, '').replace(',', '.');
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

// LINUS FIX: Get first valid number from multiple sources
export function firstNumber(...vals: Array<any>): number | undefined {
  for (const v of vals) {
    const n = typeof v === 'number' ? v : parseAreaNumber(v);
    if (Number.isFinite(n) && (n as number) > 0) return n as number;
  }
  return undefined;
}

// LINUS FIX: Unit-aware area conversion
// Dennis 2025-11-10: VIKTIGT! Kolla HECTARE FÖRST annars matchar 'HECTARE' på 'ARE'!
export function normalizeUnit(u?: string | null): 'SQM'|'ARE'|'HECTARE'|undefined {
  if (!u) return undefined;
  const s = String(u).trim().toUpperCase();
  if (s.includes('SQUARE') || s.includes('SQM') || s === 'M2' || s === 'M²') return 'SQM';
  // Dennis: Check HECTARE before ARE! ('HECTARE'.includes('ARE') === true)
  if (s.includes('HECTAR') || s === 'HA') return 'HECTARE';
  if (s.includes('ARE') || s === 'A') return 'ARE';
  return undefined;
}

export function applyUnit(n: number, unit?: string | null, rawText?: string | null): number {
  const nu = normalizeUnit(unit);
  if (nu === 'ARE') return n * 100;
  if (nu === 'HECTARE') return n * 10000;
  // Fallback: localized string contains 'ha'
  const raw = (rawText || '').toLowerCase();
  if (raw.includes(' ha') || raw.endsWith('ha') || raw.includes('hehtaari')) return n * 10000;
  return n; // default m²
}

export function normalizeStatus(val: any): 'ACTIVE' | 'SOLD' | 'RESERVED' | undefined {
  const s = String(val || '').toLowerCase();
  if (/myyty|sold|såld/.test(s)) return 'SOLD';
  if (/varattu|reserved|reserverad/.test(s)) return 'RESERVED';
  if (/aktiivinen|active|aktiv/.test(s)) return 'ACTIVE';
  return undefined;
}
