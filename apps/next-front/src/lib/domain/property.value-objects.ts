import { log } from '@/lib/logger';

/**
 * Parse Euro amount with Unicode-safe space handling
 * Handles: NBSP (U+00A0), thin space, regular space, etc.
 * 
 * Common space characters:
 * - \u0020 (regular space)
 * - \u00A0 (non-breaking space / NBSP)
 * - \u2009 (thin space)
 * - \u202F (narrow no-break space)
 */
export function parseEuro(input: any): number {
  if (input == null || input === '') return 0;
  
  const original = String(input);
  const s = original
    .replace(/[\u0020\u00A0\u2009\u202F\u2000-\u200B]/g, '') // Remove all common space characters
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3,})/g, '')     // Remove thousand separators
    .replace(',', '.');                // Decimal comma → dot
  
  const n = Number(s);
  
  if (!Number.isFinite(n)) {
    log('⚠️ parseEuro failed:', { input: original, cleaned: s });
    return 0;
  }
  
  return n;
}

export class Price {
  constructor(readonly value: number) {
    if (value < 0) throw new Error('Price cannot be negative');
  }

  static create(input: any): Price {
    return new Price(parseEuro(input));
  }

  format(locale: string = 'fi-FI'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(this.value);
  }
}

export class Area {
  constructor(readonly value: number) {
    if (value < 0) throw new Error('Area cannot be negative');
  }

  static create(input: any): Area {
    const cleaned = String(input || '')
      .replace(/[\u0020\u00A0\u2009\u202F\u2000-\u200B]/g, '') // Remove all common space characters
      .replace(/[^\d.,]/g, '')
      .replace(',', '.');
    const num = parseFloat(cleaned);
    return new Area(Number.isFinite(num) ? num : 0);
  }

  format(locale: string = 'fi-FI'): string {
    return `${this.value.toLocaleString(locale)} m²`;
  }
}

