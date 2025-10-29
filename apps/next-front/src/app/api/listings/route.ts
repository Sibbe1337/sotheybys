import { NextResponse } from 'next/server';
import { LinearAPIClient } from '@/lib/infrastructure/linear-api/client';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';
import { GetProperties } from '@/lib/application/get-properties.usecase';
import { PropertyVM } from '@/lib/presentation/property.view-model';
import { log } from '@/lib/logger';

// Force dynamic rendering as this route uses request.url
export const dynamic = 'force-dynamic';

/**
 * GET /api/listings
 * 
 * 🏗️ NEW ARCHITECTURE API
 * Returns properties using Clean Architecture use cases
 * 
 * Query params:
 * - lang: 'fi' | 'sv' | 'en' (default: 'fi')
 * - format: 'domain' | 'card' | 'detail' (default: 'card')
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get('lang') || 'fi') as 'fi' | 'sv' | 'en';
    const format = searchParams.get('format') || 'card';

    // 🏗️ NEW ARCHITECTURE: Use clean architecture layers
    const apiUrl = process.env.NEXT_PUBLIC_LINEAR_API_URL || process.env.LINEAR_API_URL || '';
    const apiKey = process.env.LINEAR_API_KEY;
    
    const client = new LinearAPIClient(apiUrl, apiKey);
    const mapper = new LinearToPropertyMapper();
    const getPropertiesUseCase = new GetProperties(client, mapper);
    
    // Fetch properties using the new use case
    const domainProperties = await getPropertiesUseCase.execute(language);
    
    log(`✅ API: Fetched ${domainProperties.length} properties via new use case`);

    // Transform based on requested format
    let data;
    
    if (format === 'domain') {
      // Return raw domain models
      data = domainProperties;
    } else if (format === 'detail') {
      // Return detailed view models
      data = domainProperties.map(p => PropertyVM.toDetail(p, language));
    } else {
      // Default: Return card view models
      data = domainProperties.map(p => PropertyVM.toCard(p, language));
    }

    const response = NextResponse.json({
      success: true,
      count: data.length,
      language,
      format,
      data
    });
    
    // Cache for 5 minutes
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    
    return response;
  } catch (error) {
    console.error('Error fetching listings:', error);
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

/**
 * POST /api/listings
 * 
 * ⚠️ DEPRECATED: Cache sync no longer needed with new architecture
 * Returns success for backward compatibility
 */
export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Cache sync deprecated - new architecture fetches directly',
    deprecated: true
  });
}
