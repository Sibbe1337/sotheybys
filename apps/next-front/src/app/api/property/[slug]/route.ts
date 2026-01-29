import { NextResponse } from 'next/server';
import { LinearAPIClient } from '@/lib/infrastructure/linear-api/client';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';
import { GetPropertyBySlug } from '@/lib/application/get-property-by-slug.usecase';
import { getLinearAPIUrl, getLinearAPIKey, getLinearCompanyId } from '@/lib/config/linear-api.config';
import { log } from '@/lib/logger';

// Force dynamic rendering as this route uses request.url
export const dynamic = 'force-dynamic';

/**
 * Property Detail API Route (NEW ARCHITECTURE)
 * 
 * 🏗️ Uses Clean Architecture use case
 * Returns property domain model converted to legacy format for backward compatibility
 * 
 * Query params:
 * - lang: 'fi' | 'sv' | 'en' (default: 'fi')
 * 
 * ⚠️ NOTE: This endpoint is deprecated. Use GET /api/property-ui/[slug] instead
 */
export async function GET(
  req: Request, 
  { params }: { params: { slug: string } }
) {
  const u = new URL(req.url);
  const lang = (u.searchParams.get("lang") ?? "fi") as 'fi' | 'sv' | 'en';

  try {
    // 🏗️ NEW ARCHITECTURE: Use Clean Architecture use case with fallback config
    const apiUrl = getLinearAPIUrl();
    const apiKey = getLinearAPIKey();
    const companyId = getLinearCompanyId();
    
    const client = new LinearAPIClient(apiUrl, apiKey, companyId);
    const mapper = new LinearToPropertyMapper();
    const getPropertyUseCase = new GetPropertyBySlug(client, mapper);
    
    // Fetch property using the new use case
    const domainProperty = await getPropertyUseCase.execute(params.slug, lang);
    
    if (!domainProperty) {
      log(`Property not found: ${params.slug}`);
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", slug: params.slug },
        { status: 404, headers: { "cache-control": "no-store" }}
      );
    }
    
    log(`✅ API: Fetched property via new use case: ${domainProperty.address.fi}`);
    
    // Transform domain model to legacy flattened format for backward compatibility
    const flattened = {
      slug: domainProperty.slug,
      title: domainProperty.address[lang] || domainProperty.address.fi,
      streetAddress: domainProperty.address[lang] || domainProperty.address.fi,
      address: domainProperty.address[lang] || domainProperty.address.fi,
      city: domainProperty.city[lang] || domainProperty.city.fi,
      description: domainProperty.description?.[lang] || domainProperty.description?.fi || '',
      salesPrice: domainProperty.pricing.sales,
      debtPart: domainProperty.pricing.debt,
      unencumberedSalesPrice: domainProperty.pricing.debtFree,
      maintenanceFee: domainProperty.fees.maintenance || 0,
      financingFee: domainProperty.fees.financing || 0,
      waterFee: domainProperty.fees.water || 0,
      livingArea: domainProperty.dimensions.living,
      rooms: domainProperty.dimensions.rooms,
      bedrooms: domainProperty.dimensions.bedrooms?.toString() || '',
      bathrooms: domainProperty.dimensions.bathrooms?.toString() || '',
      propertyType: domainProperty.meta.apartmentType?.[lang] || domainProperty.meta.apartmentType?.fi || '',
      status: domainProperty.meta.status,
      images: domainProperty.media.images.map(img => img.url),
      photoUrls: domainProperty.media.images.map(img => img.url),
      agent: domainProperty.agent ? {
        name: domainProperty.agent.name,
        phone: domainProperty.agent.phone,
        email: domainProperty.agent.email,
        photo: domainProperty.agent.photoUrl ? {
          sourceUrl: domainProperty.agent.photoUrl
        } : undefined
      } : undefined,
      estateAgentName: domainProperty.agent?.name || '',
      estateAgentPhone: domainProperty.agent?.phone || '',
      estateAgentEmail: domainProperty.agent?.email || '',
      // Dennis 2025-01-29: Include international URL for Global Listing button
      internationalUrl: domainProperty.internationalUrl || null,
      biddingUrl: domainProperty.pricing.biddingUrl || null
    };
    
    return NextResponse.json(
      { success: true, data: flattened },
      { status: 200, headers: { "cache-control": "public, max-age=300, stale-while-revalidate=600" }}
    );
  } catch (e) {
    console.error('❌ Property API error:', e);
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR", details: e instanceof Error ? e.message : 'Unknown' },
      { status: 500, headers: { "cache-control": "no-store" }}
    );
  }
}
