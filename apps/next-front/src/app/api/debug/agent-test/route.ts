import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASE = process.env.LINEAR_EXTERNAL_BASE ?? 'https://linear-external-api.azurewebsites.net';
const COMPANY_ID = process.env.COMPANY_ID ?? process.env.LINEAR_COMPANY_ID;
const API_KEY = process.env.LINEAR_API_KEY;

async function fetchJSON(url: string) {
  if (!COMPANY_ID || !API_KEY) {
    throw new Error('Missing LINEAR_COMPANY_ID or LINEAR_API_KEY');
  }
  
  const formattedApiKey = API_KEY.startsWith('LINEAR-API-KEY ') 
    ? API_KEY 
    : `LINEAR-API-KEY ${API_KEY}`;
  
  const r = await fetch(url, {
    headers: { 
      accept: "application/json", 
      "x-company-id": COMPANY_ID, 
      authorization: formattedApiKey
    },
    cache: "no-store",
  });
  
  const text = await r.text();
  const data = text ? JSON.parse(text) : null;
  return { ok: r.ok, status: r.status, data };
}

export async function GET() {
  try {
    // Fetch listings
    const list = await fetchJSON(`${BASE}/v2/listings?languages[]=fi`);
    
    if (!list.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch listings', status: list.status },
        { status: 502 }
      );
    }
    
    const items = Array.isArray(list.data) ? list.data : (list.data?.data ?? []);
    const first = items[0];
    
    if (!first) {
      return NextResponse.json({ error: 'No listings found' }, { status: 404 });
    }
    
    // Show raw realtor data from Linear API
    const rawRealtor = first.realtor;
    
    // Apply our transformation (from linear-api-complete-converter.ts)
    const transformedAgent = rawRealtor ? {
      name: rawRealtor.name || null,
      phone: rawRealtor.tel || null,
      email: rawRealtor.email || null,
      photo: rawRealtor.avatar ? {
        sourceUrl: rawRealtor.avatar,
        altText: rawRealtor.name || 'Agent photo'
      } : null
    } : null;
    
    return NextResponse.json({
      success: true,
      property: first.address?.fi?.value || first.address,
      rawRealtor,
      transformedAgent,
      verification: {
        hasAvatar: !!rawRealtor?.avatar,
        hasTransformedPhoto: !!transformedAgent?.photo,
        photoSourceUrl: transformedAgent?.photo?.sourceUrl,
        willDisplayInPropertyCard: !!(transformedAgent?.photo?.sourceUrl),
        willDisplayInPropertyDetail: !!(transformedAgent?.photo?.sourceUrl)
      }
    });
    
  } catch (e) {
    console.error('❌ Agent debug error:', e);
    return NextResponse.json(
      { error: 'Server error', details: e instanceof Error ? e.message : 'Unknown' },
      { status: 500 }
    );
  }
}

