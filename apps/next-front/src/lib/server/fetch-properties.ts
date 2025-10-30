/**
 * SERVER ACTIONS - Property Data Fetching
 * 
 * Consolidates duplicated data fetching patterns from 4 different pages
 * Single source of truth for all property data fetching
 * 
 * BEFORE: ~120 lines duplicated across 4 pages
 * AFTER: ~30 lines in one place
 * 
 * FEATURES:
 * - In-memory caching (5 min TTL)
 * - Automatic cache invalidation
 * - Filtering (sale, rental, sold)
 * - Sorting (price, rent)
 * - Comprehensive logging
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
 * IN-MEMORY CACHE
 * Simple caching layer to reduce API calls
 * TTL: 5 minutes (matches revalidate time)
 */
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheEntry {
  data: Property[];
  timestamp: number;
  locale: Locale;
}

let cache: CacheEntry | null = null;

/**
 * Check if cache is valid
 */
function isCacheValid(locale: Locale): boolean {
  if (!cache) return false;
  if (cache.locale !== locale) return false;
  
  const now = Date.now();
  const age = now - cache.timestamp;
  const isValid = age < CACHE_TTL;
  
  if (!isValid) {
    log(`🗑️ [Cache] Expired (age: ${Math.round(age / 1000)}s)`);
  }
  
  return isValid;
}

/**
 * Invalidate cache (useful for manual cache busting)
 */
export async function invalidateCache() {
  cache = null;
  log('🗑️ [Cache] Manually invalidated');
}

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
 * Fetch all properties from Linear API (with caching)
 * Base function used by all other fetch functions
 * 
 * Cache strategy:
 * - Check cache first
 * - If valid and same locale, return cached data
 * - Otherwise, fetch fresh data and update cache
 */
export async function fetchAllProperties(locale: Locale): Promise<Property[]> {
  // Check cache first
  if (isCacheValid(locale)) {
    log(`✅ [Cache HIT] Returning ${cache!.data.length} cached properties for locale: ${locale}`);
    return cache!.data;
  }
  
  log(`🔄 [Cache MISS] Fetching fresh data for locale: ${locale}`);
  
  try {
    const useCase = createGetPropertiesUseCase();
    const properties = await useCase.execute(locale);
    
    // Update cache
    cache = {
      data: properties,
      timestamp: Date.now(),
      locale
    };
    
    log(`✅ [fetchAllProperties] Fetched ${properties.length} properties and updated cache`);
    
    return properties;
  } catch (error) {
    log(`❌ [fetchAllProperties] Error:`, error);
    console.error('Error fetching properties:', error);
    
    // Return stale cache if available (fallback)
    if (cache && cache.locale === locale) {
      log(`⚠️ [Cache FALLBACK] Returning stale cache (${cache.data.length} properties)`);
      return cache.data;
    }
    
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

