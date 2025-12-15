import { NextResponse } from 'next/server';
import { LinearApiClient } from '@/lib/infrastructure/linear-api/client';
import { LinearPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';

/**
 * Debug endpoint to check Swedish translations from Linear API
 * GET /api/debug/translations
 */
export async function GET() {
  try {
    const client = new LinearApiClient();
    const rawListings = await client.getListings();
    const mapper = new LinearPropertyMapper();
    
    // Map properties for each locale
    const results = await Promise.all(
      rawListings.slice(0, 5).map(async (listing: any) => {
        const propertyFi = await mapper.map(listing, 'fi');
        const propertySv = await mapper.map(listing, 'sv');
        const propertyEn = await mapper.map(listing, 'en');
        
        return {
          id: propertyFi.id,
          slug: propertyFi.slug,
          address: {
            fi: propertyFi.address.fi,
            sv: propertyFi.address.sv,
            en: propertyFi.address.en,
          },
          city: {
            fi: propertyFi.city.fi,
            sv: propertyFi.city.sv,
            en: propertyFi.city.en,
          },
          description: {
            fi: propertyFi.description?.fi?.substring(0, 100) || null,
            sv: propertyFi.description?.sv?.substring(0, 100) || null,
            en: propertyFi.description?.en?.substring(0, 100) || null,
            hasSv: !!propertyFi.description?.sv,
            hasEn: !!propertyFi.description?.en,
          },
          descriptionTitle: {
            fi: propertyFi.descriptionTitle?.fi || null,
            sv: propertyFi.descriptionTitle?.sv || null,
            en: propertyFi.descriptionTitle?.en || null,
            hasSv: !!propertyFi.descriptionTitle?.sv,
            hasEn: !!propertyFi.descriptionTitle?.en,
          },
          apartmentType: {
            fi: propertyFi.meta.apartmentType?.fi || null,
            sv: propertyFi.meta.apartmentType?.sv || null,
            en: propertyFi.meta.apartmentType?.en || null,
          },
          listingTypeLabel: {
            fi: propertyFi.meta.listingTypeLabel?.fi || null,
            sv: propertyFi.meta.listingTypeLabel?.sv || null,
            en: propertyFi.meta.listingTypeLabel?.en || null,
          },
          rawLinearData: {
            freeText: {
              fi: listing.freeText?.fi?.substring?.(0, 50) || listing.freeText?.fi?.value?.substring?.(0, 50) || null,
              sv: listing.freeText?.sv?.substring?.(0, 50) || listing.freeText?.sv?.value?.substring?.(0, 50) || null,
              en: listing.freeText?.en?.substring?.(0, 50) || listing.freeText?.en?.value?.substring?.(0, 50) || null,
            },
            freeTextTitle: {
              fi: listing.freeTextTitle?.fi?.value || listing.freeTextTitle?.fi || null,
              sv: listing.freeTextTitle?.sv?.value || listing.freeTextTitle?.sv || null,
              en: listing.freeTextTitle?.en?.value || listing.freeTextTitle?.en || null,
            },
          }
        };
      })
    );

    // Summary
    const summary = {
      totalChecked: results.length,
      withSwedishDescription: results.filter(r => r.description.hasSv).length,
      withEnglishDescription: results.filter(r => r.description.hasEn).length,
      withSwedishTitle: results.filter(r => r.descriptionTitle.hasSv).length,
      withEnglishTitle: results.filter(r => r.descriptionTitle.hasEn).length,
    };

    return NextResponse.json({
      success: true,
      summary,
      properties: results,
    });
  } catch (error) {
    console.error('Translation debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

