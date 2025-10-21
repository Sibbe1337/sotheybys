import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Test endpoint to verify Linear API connectivity
 * 
 * ⚠️ SECURITY: Remove this endpoint in production or add authentication!
 */
export async function GET() {
  const BASE = process.env.LINEAR_EXTERNAL_BASE ?? 'https://linear-external-api.azurewebsites.net';
  const COMPANY_ID = process.env.COMPANY_ID ?? process.env.LINEAR_COMPANY_ID;
  const API_KEY = process.env.LINEAR_API_KEY;
  
  const result: any = {
    timestamp: new Date().toISOString(),
    config: {
      BASE,
      COMPANY_ID_set: !!COMPANY_ID,
      API_KEY_set: !!API_KEY,
      API_KEY_hasPrefix: API_KEY?.startsWith('LINEAR-API-KEY '),
    },
    tests: []
  };
  
  if (!COMPANY_ID || !API_KEY) {
    result.error = 'Missing required environment variables';
    result.missing = {
      COMPANY_ID: !COMPANY_ID,
      LINEAR_API_KEY: !API_KEY
    };
    return NextResponse.json(result, { status: 500 });
  }
  
  // Test 1: Fetch listings with Finnish language
  try {
    const formattedApiKey = API_KEY.startsWith('LINEAR-API-KEY ') 
      ? API_KEY 
      : `LINEAR-API-KEY ${API_KEY}`;
    
    const url = `${BASE}/v2/listings?languages[]=fi`;
    
    result.tests.push({
      name: 'Listings API (Finnish)',
      url,
      headers: {
        'Authorization': `${formattedApiKey.substring(0, 20)}...`,
        'x-company-id': `${COMPANY_ID.substring(0, 4)}****`,
        'accept': 'application/json'
      }
    });
    
    const response = await fetch(url, {
      headers: {
        'Authorization': formattedApiKey,
        'x-company-id': COMPANY_ID,
        'accept': 'application/json',
      },
      cache: 'no-store',
    });
    
    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
    
    result.tests[0].result = {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      data: responseData,
      listingsCount: Array.isArray(responseData?.data) ? responseData.data.length : 0
    };
    
    if (response.ok && Array.isArray(responseData?.data)) {
      result.tests[0].sample = responseData.data.slice(0, 2).map((listing: any) => ({
        identifier: listing.identifier?.fi?.value,
        address: listing.address?.fi?.value,
        hasFloorPlan: !!listing.floorPlanUrl || (listing.floorPlanUrls && listing.floorPlanUrls.length > 0),
        hasBrochure: !!listing.brochureUrl,
        hasCoords: !!listing.coordinates || (listing.latitude && listing.longitude)
      }));
    }
    
  } catch (error) {
    result.tests[0].error = error instanceof Error ? error.message : 'Unknown error';
  }
  
  return NextResponse.json(result, {
    headers: {
      'cache-control': 'no-store, max-age=0'
    }
  });
}

