import { NextRequest, NextResponse } from 'next/server';
import { mapLinearAPIToProperty } from '@/lib/linear-api-to-property-mapper';

export const dynamic = 'force-dynamic';

/**
 * Demo endpoint to show property data mapped to multilingual types
 * Access at: /api/property-types-demo?lang=fi
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lang = (searchParams.get('lang') || 'fi') as 'fi' | 'en' | 'sv';

  try {
    // Fetch from Linear API
    const response = await fetch(
      `https://ca-externalapi-test-weu-001.livelyrock-4a193af6.westeurope.azurecontainerapps.io/v2/listings?languages[]=${lang}`,
      {
        headers: {
          'Authorization': `LINEAR-API-KEY ${process.env.LINEAR_API_KEY || '086bc46d-da01-444b-86b3-50710d4c5cf5'}`,
          'X-Company-Id': process.env.LINEAR_COMPANY_ID || '',
          'Accept': 'application/json',
        },
        next: { revalidate: 600 }, // Cache for 10 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Linear API error: ${response.status}`);
    }

    const linearListings = await response.json();

    // Convert first listing to our property format
    if (linearListings && linearListings.length > 0) {
      const firstListing = linearListings[0];
      const mappedProperty = mapLinearAPIToProperty(firstListing);

      return NextResponse.json({
        success: true,
        message: 'Property data successfully mapped to multilingual types',
        language: lang,
        totalListings: linearListings.length,
        sample: {
          original: firstListing,
          mapped: mappedProperty,
        },
        allMapped: linearListings.map(mapLinearAPIToProperty),
      });
    }

    return NextResponse.json({
      success: false,
      message: 'No listings found',
    }, { status: 404 });

  } catch (error) {
    console.error('Error in property-types-demo:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

