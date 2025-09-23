import { NextResponse } from 'next/server';
import { listingsCache, ensureCacheInitialized } from '@/lib/listings-cache';
import { getPropertyBySlug } from '@/lib/wordpress';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get('lang') || 'fi') as 'fi' | 'sv' | 'en';

    // First try to get from Linear API cache
    await ensureCacheInitialized();
    let foundProperty: any = listingsCache.getConvertedListingBySlug(slug, language);
    
    // If not found in cache, try WordPress
    if (!foundProperty) {
      const wpProperty = await getPropertyBySlug(slug);
      if (wpProperty) {
        // Convert WordPress property to expected format
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
      data: foundProperty
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
