import { NextResponse } from 'next/server';

/**
 * API Proxy for Linear External API
 * 
 * Fixes CORS issues by proxying requests server-side
 * Keeps API keys and company IDs secure (not exposed to browser)
 */

// Mark this route as dynamic (always server-rendered, never static)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BASE = process.env.LINEAR_EXTERNAL_BASE ?? 'https://linear-external-api.azurewebsites.net';
const COMPANY_ID = process.env.COMPANY_ID ?? process.env.LINEAR_COMPANY_ID;
const API_KEY = process.env.LINEAR_API_KEY;

export async function GET(request: Request) {
  try {
    if (!COMPANY_ID) {
      console.error('❌ COMPANY_ID environment variable not set');
      return NextResponse.json(
        { success: false, error: 'Server configuration error: COMPANY_ID missing' },
        { status: 500 }
      );
    }

    if (!API_KEY) {
      console.error('❌ LINEAR_API_KEY environment variable not set');
      return NextResponse.json(
        { success: false, error: 'Server configuration error: LINEAR_API_KEY missing' },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') ?? 'fi';
    
    // Build query params for external API
    const queryParams = new URLSearchParams();
    queryParams.append('languages[]', lang);

    const externalUrl = `${BASE}/v2/listings?${queryParams.toString()}`;
    
    console.log('🔄 Proxying request to:', externalUrl);

    // Format API key - ensure it has the LINEAR-API-KEY prefix
    const formattedApiKey = API_KEY.startsWith('LINEAR-API-KEY ') 
      ? API_KEY 
      : `LINEAR-API-KEY ${API_KEY}`;

    const response = await fetch(externalUrl, {
      headers: {
        'Authorization': formattedApiKey,
        'x-company-id': COMPANY_ID,
        'accept': 'application/json',
      },
      cache: 'no-store',
    });

    const body = await response.text();
    
    if (!response.ok) {
      console.error('❌ External API error:', response.status, body);
    } else {
      console.log('✅ External API success:', response.status);
    }

    return new NextResponse(body, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') ?? 'application/json',
        'cache-control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

