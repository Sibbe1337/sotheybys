/**
 * EU Number Utilities
 * Handles European number formats (periods for thousands, comma for decimals)
 * 
 * Examples:
 * - "142.951.999,45 €" → 142951999.45
 * - "1 234 567,89" → 1234567.89
 * - "550,55€/kk" → 550.55
 */

/**
 * Parse European number format to JavaScript number
 * 
 * Handles:
 * - Periods as thousand separators: "142.951.999"
 * - Commas as decimal separators: "999,45"
 * - Currency symbols: "€", "$", "£", "¥"
 * - Space separators: "1 234 567"
 * - Text suffixes: "/kk", "€/kk"
 * 
 * @param value - String or number to parse
 * @returns Parsed number, or 0 if invalid
 */
export function parseEuroNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;

  // Remove all non-numeric characters except comma, period, and minus
  const cleaned = value
    .toString()
    .replace(/[^0-9,.-]/g, '')
    .replace(/\s/g, '');

  // Handle empty string
  if (!cleaned || cleaned === '-') return 0;

  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  let normalized = cleaned;
  
  if (hasComma && hasDot) {
    // Both present: periods are thousands, comma is decimal
    // "142.951.999,45" → "142951999.45"
    normalized = cleaned.replace(/\./g, '').replace(/,/g, '.');
  } else if (hasComma) {
    // Only comma: it's the decimal separator
    // "142951999,45" → "142951999.45"
    normalized = cleaned.replace(/,/g, '.');
  }
  // If only dot: leave as-is (standard format)

  const num = parseFloat(normalized);
  return Number.isFinite(num) ? num : 0;
}

/**
 * Format number as Finnish currency (EUR)
 * 
 * Examples:
 * - 142951999 → "142 951 999 €"
 * - 550.55 → "551 €" (rounded)
 * 
 * @param value - Number or string to format
 * @returns Formatted currency string
 */
export function formatEuroCurrency(value: number | string | undefined | null): string {
  const n = typeof value === 'string' ? parseEuroNumber(value) : (value ?? 0);
  
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Format number with Finnish locale (no currency symbol)
 * 
 * Examples:
 * - 142951999 → "142 951 999"
 * - 550.55 → "550,55"
 * 
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export function formatFinnishNumber(value: number | string | undefined | null, decimals: number = 0): string {
  const n = typeof value === 'string' ? parseEuroNumber(value) : (value ?? 0);
  
  return new Intl.NumberFormat('fi-FI', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

