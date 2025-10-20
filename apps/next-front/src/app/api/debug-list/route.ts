import { NextResponse } from 'next/server';
import { listingsCache, ensureCacheInitialized } from '@/lib/listings-cache';
import { generateSlug } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureCacheInitialized();
    const listings = listingsCache.getListings();
    
    const properties = listings.map(listing => {
      const address = listing.address?.fi?.value || 'NO ADDRESS';
      const city = listing.city?.fi?.value || '';
      const slug = generateSlug(address);
      
      return {
        address,
        city,
        slug,
        url: `/property/${slug}`,
        price: listing.nonLocalizedValues?.askPrice,
      };
    });
    
    return NextResponse.json({
      success: true,
      count: properties.length,
      properties,
      note: 'These are all available property URLs'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
