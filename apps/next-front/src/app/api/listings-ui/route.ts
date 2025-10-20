import { NextResponse } from 'next/server';
import { fetchLinearListingsAsUi, fetchTestLinearListingsAsUi } from '@/lib/linear-api-adapter';
import { listingsCache, ensureCacheInitialized } from '@/lib/listings-cache';
import { flattenPropertyForLanguage } from '@/lib/flatten-localized-data';

// Force dynamic rendering as this route uses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'cache'; // Default to cache (multilingual)
    const language = (searchParams.get('lang') || 'fi') as 'fi' | 'sv' | 'en';
    
    let listings;
    
    if (source === 'cache') {
      // Use cached multilingual format with proper price parsing
      await ensureCacheInitialized();
      const multilingualListings = listingsCache.getMultilingualListings();
      
      // Flatten each listing to the requested language
      listings = multilingualListings.map(listing => 
        flattenPropertyForLanguage(listing, language)
      );
      
      console.log(`✅ Flattened ${listings.length} UI listings for language: ${language}`);
      
      return NextResponse.json({
        success: true,
        data: listings,
        count: listings.length,
        source: 'cache-multilingual',
        format: 'flattened',
        language
      });
    } else if (source === 'test') {
      listings = await fetchTestLinearListingsAsUi();
    } else if (source === 'linear') {
      listings = await fetchLinearListingsAsUi();
    } else {
      listings = await fetchTestLinearListingsAsUi();
    }
    
    return NextResponse.json({
      success: true,
      data: listings,
      count: listings.length,
      source,
      format: 'ui'
    });
  } catch (error) {
    console.error('Error fetching UI listings:', error);
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
