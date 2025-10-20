import { NextResponse } from 'next/server';
import { listingsCache, ensureCacheInitialized } from '@/lib/listings-cache';
import { getPropertyBySlug } from '@/lib/wordpress';

// Force dynamic rendering as this route uses request.url
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get('lang') || 'fi') as 'fi' | 'sv' | 'en';

    // Initialize cache
    await ensureCacheInitialized();
    
    // Try to get from Linear API cache using new multilingual format
    let foundProperty: any = listingsCache.getMultilingualListingBySlug(slug);
    
    // If not found in Linear API, try WordPress (but this will have different structure)
    // NOTE: WordPress data structure is different from MultilingualPropertyListing
    // Frontend components expecting MultilingualPropertyListing may not work with WP data
    if (!foundProperty) {
      const wpProperty = await getPropertyBySlug(slug);
      if (wpProperty) {
        // TODO: Convert WordPress format to MultilingualPropertyListing format
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
