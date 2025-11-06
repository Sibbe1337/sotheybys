/**
 * Water Fee Formatting
 * PDF spec s.6: Format water fees correctly (€/month/person, not €/m²)
 */

import type { Locale } from '@/lib/domain/property.types';

/**
 * Format water fee based on unit type
 * @param amount - Numeric amount
 * @param unit - Unit type (per_person_month, per_month, per_consumption, etc.)
 * @param locale - Locale for formatting
 */
export function formatWaterFee(
  amount?: number,
  unit?: 'per_person_month' | 'per_month' | 'per_consumption' | 'included' | string,
  locale: Locale = 'fi'
): string {
  if (!amount || amount === 0) {
    // Check if included in other costs
    if (unit === 'included') {
      return locale === 'sv' 
        ? 'Ingår i avgiften' 
        : locale === 'en' 
        ? 'Included in fee' 
        : 'Sisältyy vastikkeeseen';
    }
    return '';
  }

  const localeStr = locale === 'sv' ? 'sv-SE' : locale === 'en' ? 'en-GB' : 'fi-FI';
  const formattedAmount = new Intl.NumberFormat(localeStr, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  }).format(amount);

  // Format based on unit
  switch (unit) {
    case 'per_person_month':
      return locale === 'sv' 
        ? `${formattedAmount}/månad/person` 
        : locale === 'en' 
        ? `${formattedAmount}/month/person` 
        : `${formattedAmount}/kk/hlö`;
    
    case 'per_month':
      return locale === 'sv' 
        ? `${formattedAmount}/månad` 
        : locale === 'en' 
        ? `${formattedAmount}/month` 
        : `${formattedAmount}/kk`;
    
    case 'per_consumption':
      return locale === 'sv' 
        ? 'Enligt förbrukning' 
        : locale === 'en' 
        ? 'According to consumption' 
        : 'Kulutuksen mukaan';
    
    case 'included':
      return locale === 'sv' 
        ? 'Ingår i avgiften' 
        : locale === 'en' 
        ? 'Included in fee' 
        : 'Sisältyy vastikkeeseen';
    
    default:
      // Default to per month if unit is unknown
      return locale === 'sv' 
        ? `${formattedAmount}/månad` 
        : locale === 'en' 
        ? `${formattedAmount}/month` 
        : `${formattedAmount}/kk`;
  }
}

