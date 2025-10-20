import { NextResponse } from 'next/server';
import { listingsCache } from '@/lib/listings-cache';
import { fetchLinearListings, fetchTestLinearListings } from '@/lib/linear-api-adapter';
import { flattenPropertyForLanguage } from '@/lib/flatten-localized-data';

// Force dynamic rendering as this route uses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'multilingual'; // Default to multilingual
    const language = (searchParams.get('lang') || 'fi') as 'fi' | 'sv' | 'en';
    const source = searchParams.get('source') || 'cache';

    let listings;

    if (source === 'cache') {
      // Get from cache
      const status = listingsCache.getStatus();
      
      // Ensure cache is initialized
      if (status.listingsCount === 0 || status.needsRefresh) {
        await listingsCache.syncListings();
      }
      
      if (format === 'multilingual') {
        // NEW: Get multilingual format and flatten for requested language
        const multilingualListings = listingsCache.getMultilingualListings();
        
        // Flatten each listing to the requested language
        listings = multilingualListings.map(listing => {
          const flattened: any = flattenPropertyForLanguage(listing, language);
          
          // IMAGE PIPELINE HARDENING: Always default to arrays to prevent 500 errors
          if (!Array.isArray(flattened.images)) flattened.images = [];
          if (!Array.isArray(flattened.photoUrls)) flattened.photoUrls = [];
          
          return flattened;
        });
        
        console.log(`✅ Flattened ${listings.length} listings for language: ${language}`);
      } else if (format === 'wordpress') {
        listings = listingsCache.getWordPressFormattedListings(language);
      } else {
        listings = listingsCache.getListings();
      }
    } else if (source === 'test') {
      // Get from test API directly
      listings = await fetchTestLinearListings();
    } else {
      // Get from production API directly
      listings = await fetchLinearListings();
    }

    const response = NextResponse.json({
      success: true,
      count: listings.length,
      source,
      format,
      language,
      data: listings
    });
    
    // Prevent aggressive caching that can hide image updates
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    
    return response;
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch listings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Trigger a manual sync
export async function POST() {
  try {
    await listingsCache.syncListings();
    const status = listingsCache.getStatus();
    
    return NextResponse.json({
      success: true,
      message: 'Sync completed',
      status
    });
  } catch (error) {
    console.error('Error syncing listings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to sync listings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
