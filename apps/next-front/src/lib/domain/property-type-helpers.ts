/**
 * Property Type Detection Helpers
 * 
 * Per Dennis spec: Different layouts for Apartments vs Properties vs Rentals
 * 
 * Apartments: KERROSTALO, FLAT
 * Properties: OMAKOTITALO, RIVITALO, PARITALO, DETACHED_HOUSE, TOWNHOUSE, etc.
 * Rentals: Any property with rent > 0
 */

import type { Property } from './property.types';

/**
 * Apartment codes (Asunnot)
 * These use apartment-specific layout with company/building info
 */
const APARTMENT_CODES = new Set([
  'KERROSTALO',
  'FLAT',
  'APARTMENT_BUILDING'
]);

/**
 * Property/Estate codes (Kiinteistöt)
 * These use property-specific layout with property tax
 */
const PROPERTY_CODES = new Set([
  'OMAKOTITALO',
  'DETACHED_HOUSE',
  'DETACHEDHOUSE',
  'RIVITALO',
  'TOWNHOUSE',
  'PARITALO',
  'SEMI_DETACHED_HOUSE',
  'LUHTITALO',
  'TERRACED_HOUSE',
  'MÖKKI_TAI_HUVILA',
  'COTTAGE_OR_VILLA',
  'TONTTI',
  'PLOT',
  'MAATILA',
  'FARM',
  'VUOKRATALO',
  'RENTAL_HOUSE'
]);

/**
 * Check if property is an apartment (KERROSTALO/FLAT)
 * Apartments show: company info, company loans, housing cooperative details
 */
export function isApartment(property: Property): boolean {
  const code = (property.meta.typeCode || '').toUpperCase();
  return APARTMENT_CODES.has(code);
}

/**
 * Check if property is a house/estate (OMAKOTITALO/DETACHED_HOUSE etc.)
 * Properties show: property tax, plot info, building details
 */
export function isProperty(property: Property): boolean {
  const code = (property.meta.typeCode || '').toUpperCase();
  return PROPERTY_CODES.has(code);
}

/**
 * Check if property is a rental
 * Rentals have different layout with rental terms, deposit, etc.
 */
export function isRental(property: Property): boolean {
  return !!property.rental && (property.rental.monthlyRent || 0) > 0;
}

/**
 * Get property category for layout selection
 */
export function getPropertyCategory(property: Property): 'apartment' | 'property' | 'rental' | 'unknown' {
  if (isRental(property)) return 'rental';
  if (isApartment(property)) return 'apartment';
  if (isProperty(property)) return 'property';
  return 'unknown';
}

/**
 * Check if property tax should be shown
 * Per spec: ONLY for properties, NOT for apartments
 */
export function shouldShowPropertyTax(property: Property): boolean {
  return isProperty(property) && !isApartment(property);
}

/**
 * Check if company/housing cooperative info should be shown
 * Per spec: ONLY for apartments
 */
export function shouldShowCompanyInfo(property: Property): boolean {
  return isApartment(property);
}

