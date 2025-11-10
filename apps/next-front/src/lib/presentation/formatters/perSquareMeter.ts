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
 * Plot Area Formatter - Dennis 2025-11-10: Smart unit based on size
 * < 10 000 m² → show in m²
 * ≥ 10 000 m² → show in ha
 */
export const fmtPlotArea = (m2: number | undefined, locale: string = 'fi-FI'): string => {
  if (!m2 || m2 <= 0) return '';

  // Dennis: Under 10 000 m² → visa i m², annars i ha
  if (m2 < 10000) {
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(m2);
    return `${formatted} m²`;
  }

  // ≥ 10 000 m² → convert to hectares
  const ha = m2 / 10000;
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(ha);
  return `${formatted} ha`;
};

