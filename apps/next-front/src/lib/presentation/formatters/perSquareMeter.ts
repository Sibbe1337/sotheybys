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
 * Plot Area Formatter - Dennis 2025-11-10: ALWAYS show in hectares for consistency
 * Fixes: Mailatie 12,99 ha → 1,2990 ha (correct), Mellstenintie 3994 m² → 0,3994 ha
 */
export const fmtPlotArea = (m2: number | undefined, locale: string = 'fi-FI'): string => {
  if (!m2 || m2 <= 0) return '';
  
  // Dennis: ALWAYS convert to hectares (m² / 10000)
  const ha = m2 / 10000;
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(ha);
  return `${formatted} ha`;
};

