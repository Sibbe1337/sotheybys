import { NextResponse } from 'next/server';
import { fetchLinearListingsAsUi, fetchTestLinearListingsAsUi } from '@/lib/linear-api-adapter';
import { listingsCache, ensureCacheInitialized } from '@/lib/listings-cache';
import { getPropertyBySlug } from '@/lib/wordpress';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'test';
    const language = (searchParams.get('lang') || 'fi') as 'fi' | 'sv' | 'en';
    
    let foundProperty: any = null;
    
    if (source === 'test') {
      const listings = await fetchTestLinearListingsAsUi();
      foundProperty = listings.find(listing => listing.slug === slug);
    } else if (source === 'linear') {
      const listings = await fetchLinearListingsAsUi();
      foundProperty = listings.find(listing => listing.slug === slug);
    } else if (source === 'cache') {
      // Try cache first
      await ensureCacheInitialized();
      foundProperty = listingsCache.getConvertedListingBySlug(slug, language);
    }
    
    // If not found in Linear/cache, try WordPress
    if (!foundProperty && source === 'cache') {
      const wpProperty = await getPropertyBySlug(slug);
      if (wpProperty) {
        foundProperty = wpProperty;
      }
    }
    
    if (!foundProperty) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property not found'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: foundProperty,
      format: foundProperty.location ? 'ui' : 'wordpress'
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch property',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
