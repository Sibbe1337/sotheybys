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

export async function GET(request: Request) {
  try {
    if (!COMPANY_ID) {
      console.error('❌ COMPANY_ID environment variable not set');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
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

    const response = await fetch(externalUrl, {
      headers: {
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

