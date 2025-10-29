/**
 * Fee formatting utilities
 * Phase 3: Formatting monthly fees with locale support
 */

export const fmtFee = (n: number | undefined, locale = 'fi-FI'): string => {
  if (n == null || n === 0) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  }).format(n) + '/kk';
};

export const fmtFeeWithoutSuffix = (n: number | undefined, locale = 'fi-FI'): string => {
  if (n == null || n === 0) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  }).format(n);
};

/**
 * Calculate total monthly fees
 */
export const calculateTotalFees = (fees: {
  maintenance?: number;
  financing?: number;
  water?: number;
  heating?: number;
  electricity?: number;
  parking?: number;
  sauna?: number;
}): number => {
  return (
    (fees.maintenance || 0) +
    (fees.financing || 0) +
    (fees.water || 0) +
    (fees.heating || 0) +
    (fees.electricity || 0) +
    (fees.parking || 0) +
    (fees.sauna || 0)
  );
};

