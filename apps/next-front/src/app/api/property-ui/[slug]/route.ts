import { NextResponse } from 'next/server';
import { LinearAPIClient } from '@/lib/infrastructure/linear-api/client';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';
import { GetPropertyBySlug } from '@/lib/application/get-property-by-slug.usecase';
import { PropertyVM } from '@/lib/presentation/property.view-model';
import { getLinearAPIUrl, getLinearAPIKey, getLinearCompanyId } from '@/lib/config/linear-api.config';
import { log } from '@/lib/logger';

// Force dynamic rendering as this route uses request.url
export const dynamic = 'force-dynamic';

/**
 * GET /api/property-ui/[slug]
 * 
 * 🏗️ NEW ARCHITECTURE API
 * Returns a single property using Clean Architecture use case
 * 
 * Query params:
 * - lang: 'fi' | 'sv' | 'en' (default: 'fi')
 * - format: 'domain' | 'card' | 'detail' (default: 'detail')
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get('lang') || 'fi') as 'fi' | 'sv' | 'en';
    const format = searchParams.get('format') || 'detail';
    
      // 🏗️ NEW ARCHITECTURE: Use clean architecture layers with fallback config
      const apiUrl = getLinearAPIUrl();
      const apiKey = getLinearAPIKey();
      const companyId = getLinearCompanyId();
      
      const client = new LinearAPIClient(apiUrl, apiKey, companyId);
    const mapper = new LinearToPropertyMapper();
    const getPropertyUseCase = new GetPropertyBySlug(client, mapper);
    
    // Fetch property using the new use case
    const domainProperty = await getPropertyUseCase.execute(slug, language);
    
    if (!domainProperty) {
      log(`Property not found: ${slug}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Property not found'
        },
        { status: 404 }
      );
    }
    
    log(`✅ API: Fetched property via new use case: ${domainProperty.address.fi}`);
    
    // Transform based on requested format
    let data;
    
    if (format === 'domain') {
      data = domainProperty;
    } else if (format === 'card') {
      data = PropertyVM.toCard(domainProperty, language);
    } else {
      // Default: Return detailed view model
      data = PropertyVM.toDetail(domainProperty, language);
    }
    
    return NextResponse.json({
      success: true,
      slug,
      language,
      format,
      data
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
