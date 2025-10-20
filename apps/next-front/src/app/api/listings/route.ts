import { NextResponse } from 'next/server';
import { listingsCache } from '@/lib/listings-cache';
import { fetchLinearListings, fetchTestLinearListings } from '@/lib/linear-api-adapter';

// Force dynamic rendering as this route uses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'wordpress';
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
      
      if (format === 'wordpress') {
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

    return NextResponse.json({
      success: true,
      count: listings.length,
      source,
      format,
      language,
      data: listings
    });
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
