import { NextResponse } from 'next/server';
import { listingsCache, ensureCacheInitialized } from '@/lib/listings-cache';
import { generateSlug } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ensure cache is initialized
    await ensureCacheInitialized();
    
    const listings = listingsCache.getListings();
    
    const debug = listings.map(listing => {
      const address = listing.address?.fi?.value || 'NO ADDRESS';
      const slug = generateSlug(address);
      
      return {
        id: listing.id,
        address,
        slug,
        city: listing.city?.fi?.value,
        state: listing.state?.fi?.value,
      };
    });
    
    return NextResponse.json({
      success: true,
      totalListings: listings.length,
      slugs: debug,
      lookingFor: 'helsinki-kaupunginosa'
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

