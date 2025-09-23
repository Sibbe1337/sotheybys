import { NextResponse } from 'next/server';
import { fetchLinearListingsAsUi, fetchTestLinearListingsAsUi } from '@/lib/linear-api-adapter';
import { listingsCache, ensureCacheInitialized } from '@/lib/listings-cache';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'test'; // Default to test API
    const language = (searchParams.get('lang') || 'fi') as 'fi' | 'sv' | 'en';
    
    let listings;
    
    if (source === 'test') {
      listings = await fetchTestLinearListingsAsUi();
    } else if (source === 'linear') {
      listings = await fetchLinearListingsAsUi();
    } else if (source === 'cache') {
      // Use cached WordPress format and convert
      await ensureCacheInitialized();
      const wpListings = listingsCache.getWordPressFormattedListings(language);
      // For now, return WordPress format until we fully migrate
      return NextResponse.json({
        success: true,
        data: wpListings,
        count: wpListings.length,
        source: 'cache-wordpress',
        format: 'wordpress'
      });
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
