import { NextResponse } from 'next/server';
import { listingsCache, ensureCacheInitialized } from '@/lib/listings-cache';
import { getPropertyBySlug } from '@/lib/wordpress';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // First try to get from Linear API cache
    await ensureCacheInitialized();
    let foundProperty: any = listingsCache.getConvertedListingBySlug(slug, 'fi');
    
    // If not found in cache, try WordPress
    if (!foundProperty) {
      const wpProperty = await getPropertyBySlug(slug);
      if (wpProperty) {
        foundProperty = wpProperty;
      }
    }

    // Return debug information
    return NextResponse.json({
      success: true,
      slug,
      found: !!foundProperty,
      hasAcfRealEstate: !!foundProperty?.acfRealEstate,
      hasProperty: !!foundProperty?.acfRealEstate?.property,
      propertyKeys: foundProperty?.acfRealEstate?.property ? Object.keys(foundProperty.acfRealEstate.property) : [],
      sampleData: foundProperty?.acfRealEstate?.property ? {
        address: foundProperty.acfRealEstate.property.address,
        city: foundProperty.acfRealEstate.property.city,
        area: foundProperty.acfRealEstate.property.area,
        price: foundProperty.acfRealEstate.property.price,
        description: foundProperty.acfRealEstate.property.description,
        rooms: foundProperty.acfRealEstate.property.rooms,
        propertyType: foundProperty.acfRealEstate.property.propertyType
      } : null,
      fullData: foundProperty
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to debug property',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
