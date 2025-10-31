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
  
  const perM2 = (amount / living).toFixed(0);
  return `${perM2} €/m²`;
};

/**
 * Plot Area Formatter with hectare conversion
 * Shows hectares for plots >= 10,000 m²
 */
export const fmtPlotArea = (m2: number | undefined, locale: string = 'fi-FI'): string => {
  if (!m2 || m2 <= 0) return '';
  
  if (m2 >= 10000) {
    const ha = (m2 / 10000).toFixed(2);
    return `${ha} ha`;
  }
  
  // Use standard area formatter for smaller plots
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(m2) + ' m²';
};

