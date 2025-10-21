import { NextResponse } from 'next/server';
import { listingsCache, ensureCacheInitialized } from '@/lib/listings-cache';
import { getPropertyBySlug } from '@/lib/wordpress';
import { flattenPropertyForLanguage } from '@/lib/flatten-localized-data';
import { generateSlug } from '@/lib/utils';
import aliasesData from '@/config/property-aliases.json';

// Force dynamic rendering as this route uses request.url
export const dynamic = 'force-dynamic';

// ============================================================================
// SLUG NORMALIZATION & ALIAS MAPPING
// ============================================================================
const ALIAS_MAP: Record<string, string> = aliasesData.aliases;

/**
 * Normalizes a slug for consistent lookup
 * CRITICAL: Uses the same generateSlug() function as the cache to ensure consistency
 * This fixes the slug resolution issue documented in memory:9241337
 */
function normalizeSlug(s: string): string {
  return generateSlug(s);
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const rawSlug = params.slug;
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get('lang') || 'fi') as 'fi' | 'sv' | 'en';

    // Normalize slug and apply alias mapping
    const normalizedSlug = normalizeSlug(rawSlug);
    const resolvedSlug = ALIAS_MAP[normalizedSlug] || normalizedSlug;

    console.log('🔍 Slug resolution:', { rawSlug, normalizedSlug, resolvedSlug });

    // Initialize cache
    await ensureCacheInitialized();
    
    // Try 1: Get from Linear API cache using resolved slug
    let foundProperty: any = listingsCache.getMultilingualListingBySlug(resolvedSlug);
    
    // Try 2: If normalized slug is different, try that too
    if (!foundProperty && normalizedSlug !== resolvedSlug) {
      foundProperty = listingsCache.getMultilingualListingBySlug(normalizedSlug);
    }
    
    // Try 3: If still not found, try original slug (case-sensitive fallback)
    if (!foundProperty && rawSlug !== resolvedSlug) {
      foundProperty = listingsCache.getMultilingualListingBySlug(rawSlug);
    }
    
    // Try 4: WordPress fallback (different data structure)
    if (!foundProperty) {
      const wpProperty = await getPropertyBySlug(resolvedSlug);
      if (wpProperty) {
        // TODO: Convert WordPress format to MultilingualPropertyListing format
        foundProperty = wpProperty;
      }
    }

    // Graceful 404 - no NEXT_NOT_FOUND crash
    if (!foundProperty) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'NOT_FOUND',
          slug: rawSlug,
          normalized: normalizedSlug,
          resolved: resolvedSlug
        },
        { 
          status: 404,
          headers: { 'Cache-Control': 'no-store, max-age=0' }
        }
      );
    }

    // Debug: Log field types to identify LocalizedString objects being returned as primitives
    console.log('🔍 API Response Debug:', {
      hasHeading: !!foundProperty.heading,
      headingType: typeof foundProperty.heading,
      headingValue: foundProperty.heading,
      hasPostalCode: !!foundProperty.postalCode,
      postalCodeType: typeof foundProperty.postalCode,
      postalCodeValue: foundProperty.postalCode,
      hasEnergyClass: !!foundProperty.energyClass,
      energyClassType: typeof foundProperty.energyClass,
      energyClassValue: foundProperty.energyClass,
    });

    // CRITICAL FIX: Flatten all LocalizedString objects to single language
    // This prevents React error #31 by ensuring no {fi, en, sv} objects reach the client
    console.log('🔄 Flattening LocalizedString objects for language:', language);
    const flattened: any = flattenPropertyForLanguage(foundProperty, language);
    
    if (!flattened) {
      console.error('❌ flattenPropertyForLanguage returned null/undefined');
      return NextResponse.json(
        { 
          success: false, 
          error: 'FLATTEN_ERROR',
          slug: rawSlug,
          details: 'Property data could not be flattened'
        },
        { 
          status: 500,
          headers: { 'Cache-Control': 'no-store, max-age=0' }
        }
      );
    }
    
    console.log('✅ All LocalizedString objects flattened to strings');

    // IMAGE PIPELINE HARDENING: Always default to arrays to prevent 500 errors
    if (!Array.isArray(flattened.images)) flattened.images = [];
    if (!Array.isArray(flattened.photoUrls)) flattened.photoUrls = [];

    const response = NextResponse.json({
      success: true,
      data: flattened
    });
    
    // Prevent aggressive caching that can hide image updates
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    
    return response;
  } catch (error) {
    console.error('Error fetching property:', error);
    // Don't bubble NEXT_NOT_FOUND; return controlled 500 JSON
    return NextResponse.json(
      { 
        success: false, 
        error: 'SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      }
    );
  }
}
