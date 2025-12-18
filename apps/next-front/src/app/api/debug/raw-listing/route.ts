import { NextResponse } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const BASE = process.env.LINEAR_EXTERNAL_BASE ?? 'https://linear-external-api.azurewebsites.net';
const COMPANY = process.env.COMPANY_ID ?? process.env.LINEAR_COMPANY_ID;
const APIKEY = process.env.LINEAR_API_KEY;

export async function GET(req: Request) {
  try {
    if (!COMPANY || !APIKEY) {
      return NextResponse.json({ error: "Missing env vars" }, { status: 500 });
    }

    const u = new URL(req.url);
    const lang = u.searchParams.get("lang") ?? "fi";
    const search = u.searchParams.get("search") ?? "Remmarholmen";
    
    const formattedApiKey = APIKEY.startsWith('LINEAR-API-KEY ') 
      ? APIKEY 
      : `LINEAR-API-KEY ${APIKEY}`;
    
    const r = await fetch(`${BASE}/v2/listings?languages[]=${lang}`, {
      headers: { 
        accept: "application/json", 
        "x-company-id": COMPANY, 
        authorization: formattedApiKey
      },
      cache: "no-store",
    });
    
    const j = await r.json();
    const listings = Array.isArray(j) ? j : j?.data ?? [];
    
    // Find the listing matching search
    const found = listings.find((x: any) => {
      const addr = x.address?.fi?.value || x.address || "";
      return addr.toLowerCase().includes(search.toLowerCase());
    });
    
    if (!found) {
      return NextResponse.json({ 
        error: "Not found", 
        search,
        availableAddresses: listings.slice(0, 10).map((x: any) => x.address?.fi?.value || x.address)
      });
    }
    
    // Extract all keys that might contain coordinates
    const coordKeys = Object.keys(found).filter(k => 
      k.toLowerCase().includes('lat') || 
      k.toLowerCase().includes('lon') || 
      k.toLowerCase().includes('lng') ||
      k.toLowerCase().includes('coord') ||
      k.toLowerCase().includes('location') ||
      k.toLowerCase().includes('geo') ||
      k.toLowerCase().includes('map') ||
      k.toLowerCase().includes('position')
    );
    
    const coordData: Record<string, any> = {};
    for (const k of coordKeys) {
      coordData[k] = found[k];
    }
    
    return NextResponse.json({ 
      search,
      address: found.address,
      coordinateFields: coordData,
      allKeys: Object.keys(found),
      // Show full raw data for inspection
      rawData: found
    }, { 
      headers: { "cache-control": "no-store" }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

