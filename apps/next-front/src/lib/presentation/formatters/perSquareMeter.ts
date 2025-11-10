/**
 * Per Square Meter Formatter
 * Calculates and formats price per square meter
 */

export const fmtPerM2 = (
  amount: number | undefined,
  living: number | undefined,
  locale: string = 'fi-FI'
): string => {
  if (amount == null || !living || living <= 0) return '';
  
  const perM2 = Math.round(amount / living);
  return `${perM2.toLocaleString(locale)} €/m²`;
};

/**
 * Plot Area Formatter with hectare conversion
 * Shows hectares for plots >= 10,000 m² OR values < 100 (already in ha from Linear)
 * Dennis 2025-11-10: Use comma (,) for decimals in Swedish/Finnish
 */
export const fmtPlotArea = (m2: number | undefined, locale: string = 'fi-FI'): string => {
  if (!m2 || m2 <= 0) return '';
  
  // Dennis 2025-11-10: If value < 100, it's ALREADY in hectares from Linear
  // Example: Mailatie has 0.1299 ha, NOT 0.1299 m²
  if (m2 < 100) {
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(m2);
    return `${formatted} ha`;
  }
  
  // Large values (>= 10000 m²) → convert to ha
  if (m2 >= 10000) {
    const ha = m2 / 10000;
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(ha);
    return `${formatted} ha`;
  }
  
  // Medium values (100-9999 m²) → show in m²
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(m2) + ' m²';
};

