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
 * Shows hectares for plots >= 10,000 m²
 * Dennis 2025-11-10: Use comma (,) for decimals in Swedish/Finnish
 */
export const fmtPlotArea = (m2: number | undefined, locale: string = 'fi-FI'): string => {
  if (!m2 || m2 <= 0) return '';
  
  if (m2 >= 10000) {
    const ha = m2 / 10000;
    // Dennis: Use locale formatting for comma/period in decimals
    // Ex: 320,84 ha (Swedish/Finnish) vs 320.84 ha (English)
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(ha);
    return `${formatted} ha`;
  }
  
  // Use standard area formatter for smaller plots
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(m2) + ' m²';
};

