import { NextResponse } from 'next/server';
import { LinearAPIClient } from '@/lib/infrastructure/linear-api/client';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';
import { GetProperties } from '@/lib/application/get-properties.usecase';
import { PropertyVM } from '@/lib/presentation/property.view-model';
import { log } from '@/lib/logger';

// Force dynamic rendering as this route uses request.url
export const dynamic = 'force-dynamic';

/**
 * GET /api/listings-ui
 * 
 * 🏗️ NEW ARCHITECTURE API
 * Returns properties as card view models (UI-friendly format)
 * 
 * Query params:
 * - lang: 'fi' | 'sv' | 'en' (default: 'fi')
 * 
 * ⚠️ NOTE: This endpoint is equivalent to GET /api/listings?format=card
 * Consider using that instead for consistency
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get('lang') || 'fi') as 'fi' | 'sv' | 'en';
    
    // 🏗️ NEW ARCHITECTURE: Use clean architecture layers
    const apiUrl = process.env.NEXT_PUBLIC_LINEAR_API_URL || process.env.LINEAR_API_URL || '';
    const apiKey = process.env.LINEAR_API_KEY;
    const companyId = process.env.COMPANY_ID || process.env.LINEAR_COMPANY_ID;
    
    const client = new LinearAPIClient(apiUrl, apiKey, companyId);
    const mapper = new LinearToPropertyMapper();
    const getPropertiesUseCase = new GetProperties(client, mapper);
    
    // Fetch properties using the new use case
    const domainProperties = await getPropertiesUseCase.execute(language);
    
    log(`✅ API: Fetched ${domainProperties.length} UI listings via new use case`);
    
    // Transform to card view models (UI-friendly format)
    const listings = domainProperties.map(p => PropertyVM.toCard(p, language));
    
    return NextResponse.json({
      success: true,
      data: listings,
      count: listings.length,
      language,
      format: 'card',
      source: 'clean-architecture'
    });
  } catch (error) {
    console.error('Error fetching UI listings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch listings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
