/**
 * SERVER ACTIONS - Property Data Fetching
 * 
 * Consolidates duplicated data fetching patterns from 4 different pages
 * Single source of truth for all property data fetching
 * 
 * BEFORE: ~120 lines duplicated across 4 pages
 * AFTER: ~30 lines in one place
 * 
 * Usage:
 * ```typescript
 * import { fetchSaleProperties } from '@/lib/server/fetch-properties';
 * 
 * export default async function Page({ params }) {
 *   const properties = await fetchSaleProperties(params.locale);
 *   return <Component properties={properties} />;
 * }
 * ```
 */

'use server';

import { LinearAPIClient } from '@/lib/infrastructure/linear-api/client';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';
import { GetProperties } from '@/lib/application/get-properties.usecase';
import { getLinearAPIUrl, getLinearAPIKey, getLinearCompanyId } from '@/lib/config/linear-api.config';
import type { Locale, Property } from '@/lib/domain/property.types';
import { log } from '@/lib/logger';

/**
 * Initialize Linear API client and use case
 * Internal helper - not exported
 */
function createGetPropertiesUseCase() {
  const client = new LinearAPIClient(
    getLinearAPIUrl(),
    getLinearAPIKey(),
    getLinearCompanyId()
  );
  const mapper = new LinearToPropertyMapper();
  return new GetProperties(client, mapper);
}

/**
 * Fetch all properties from Linear API
 * Base function used by all other fetch functions
 */
export async function fetchAllProperties(locale: Locale): Promise<Property[]> {
  try {
    const useCase = createGetPropertiesUseCase();
    const properties = await useCase.execute(locale);
    
    log(`✅ [fetchAllProperties] Fetched ${properties.length} properties for locale: ${locale}`);
    
    return properties;
  } catch (error) {
    log(`❌ [fetchAllProperties] Error:`, error);
    console.error('Error fetching properties:', error);
    return [];
  }
}

/**
 * Fetch sale properties (exclude rentals)
 * Used by: homepage, /kohteet
 */
export async function fetchSaleProperties(locale: Locale): Promise<Property[]> {
  const all = await fetchAllProperties(locale);
  const sales = all.filter(p => !p.meta.rent || p.meta.rent === 0);
  
  log(`✅ [fetchSaleProperties] Filtered ${sales.length} sale properties (excluded rentals)`);
  
  // Sort by price (most expensive first - premium branding)
  sales.sort((a, b) => b.pricing.debtFree - a.pricing.debtFree);
  
  return sales;
}

/**
 * Fetch rental properties (has rent value)
 * Used by: /kohteet/vuokrakohteet
 */
export async function fetchRentalProperties(locale: Locale): Promise<Property[]> {
  const all = await fetchAllProperties(locale);
  const rentals = all.filter(p => p.meta.rent && p.meta.rent > 0);
  
  log(`✅ [fetchRentalProperties] Found ${rentals.length} rental properties`);
  
  // Sort by rent (most expensive first - premium branding)
  rentals.sort((a, b) => (b.meta.rent || 0) - (a.meta.rent || 0));
  
  return rentals;
}

/**
 * Fetch sold properties (status === 'SOLD')
 * Used by: /kohteet/referenssit
 */
export async function fetchSoldProperties(locale: Locale): Promise<Property[]> {
  const all = await fetchAllProperties(locale);
  const sold = all.filter(p => p.meta.status === 'SOLD');
  
  log(`✅ [fetchSoldProperties] Found ${sold.length} sold properties (references)`);
  
  // Sort by price (most expensive first - premium branding)
  sold.sort((a, b) => b.pricing.debtFree - a.pricing.debtFree);
  
  return sold;
}

