/**
 * Flatten MultilingualPropertyListing to single-language format
 * 
 * This ensures NO LocalizedString objects reach the client,
 * preventing React error #31 "object with keys {fi, en, sv}"
 */

import { MultilingualPropertyListing, LocalizedString, SupportedLanguage } from './property-types-multilang';
import { parseEuroNumber } from './number-eu';

type FlattenedProperty = {
  [K in keyof MultilingualPropertyListing]: MultilingualPropertyListing[K] extends LocalizedString
    ? string  // Convert LocalizedString to string
    : MultilingualPropertyListing[K];
};

// List of fields that should be numeric (not strings)
const NUMERIC_FIELDS = [
  'salesPrice', 'debtPart', 'unencumberedSalesPrice', 'maintenanceFee',
  'financingFee', 'totalFee', 'waterFee', 'electricityCost', 'heatingCost',
  'propertyTax', 'livingArea', 'totalArea', 'volume', 'siteArea', 'lotArea',
  'yearOfBuilding', 'constructionYear', 'numberOfFloors', 'floorCount',
  'rentIncome', 'cleaningCost', 'companyLoans', 'companyIncome',
  'totalApartments', 'totalBusinessSpaces', 'annualLease'
];

/**
 * Flatten all LocalizedString fields to single language
 * and ensure numeric fields are properly typed
 */
export function flattenPropertyForLanguage(
  property: MultilingualPropertyListing,
  language: SupportedLanguage
): FlattenedProperty {
  const flattened: any = {};

  for (const [key, value] of Object.entries(property)) {
    // Check if value is a LocalizedString object
    if (value && typeof value === 'object' && ('fi' in value || 'en' in value || 'sv' in value)) {
      // Extract string for the specified language
      const localizedValue = value as LocalizedString;
      flattened[key] = localizedValue[language] || localizedValue['fi'] || '';
      
      console.log(`📝 Flattened ${key}:`, {
        original: localizedValue,
        flattened: flattened[key],
        type: typeof flattened[key]
      });
    } else if (NUMERIC_FIELDS.includes(key)) {
      // Ensure numeric fields are numbers, not strings
      flattened[key] = parseEuroNumber(value);
      
      // Warn about NaN values
      if (value != null && flattened[key] === 0 && value !== 0 && value !== '0') {
        console.warn(`⚠️  Numeric field ${key} parsed to 0 from value:`, value);
      }
    } else {
      // Keep non-LocalizedString values as-is
      flattened[key] = value;
    }
  }

  // CRITICAL: Map field names for frontend compatibility
  // Frontend expects different field names than our internal schema
  if (flattened.salesPrice != null) {
    flattened.price = flattened.salesPrice;
  }
  if (flattened.unencumberedSalesPrice != null) {
    flattened.debtFreePrice = flattened.unencumberedSalesPrice;
  }
  if (flattened.streetAddress != null) {
    flattened.address = flattened.streetAddress;
  }
  if (flattened.heading != null) {
    flattened.freeTextTitle = flattened.heading;
  }
  if (flattened.floorLocation != null) {
    flattened.floor = flattened.floorLocation;
  }

  return flattened as FlattenedProperty;
}

