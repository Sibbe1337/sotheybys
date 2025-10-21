import { NextResponse } from 'next/server';
import { listingsCache, ensureCacheInitialized } from '@/lib/listings-cache';
import { generateSlug } from '@/lib/utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to show all cached listings and their generated slugs
 * Helps diagnose slug resolution issues
 */
export async function GET() {
  try {
    await ensureCacheInitialized();
    
    const listings = listingsCache.getListings();
    
    const debugInfo = listings.map(listing => {
      const address = listing.address?.fi?.value;
      const slug = address ? generateSlug(address) : null;
      
      return {
        identifier: listing.identifier?.fi?.value || listing.identifier,
        address: address,
        generatedSlug: slug,
        status: listing.status?.fi?.value,
      };
    });
    
    return NextResponse.json({
      success: true,
      totalListings: listings.length,
      listings: debugInfo,
      note: 'Use these exact slugs in URLs: /property/{generatedSlug}'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

