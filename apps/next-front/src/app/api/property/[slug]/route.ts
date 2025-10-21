import { NextResponse } from 'next/server';
import { mapLinearAPIToProperty } from '@/lib/linear-api-to-property-mapper';
import { flattenPropertyForLanguage } from '@/lib/flatten-localized-data';
import aliasesData from '@/config/property-aliases.json';

// Force dynamic rendering as this route uses request.url
export const dynamic = 'force-dynamic';

// ============================================================================
// ENVIRONMENT & CONFIGURATION
// ============================================================================
const BASE = process.env.LINEAR_EXTERNAL_BASE ?? 'https://linear-external-api.azurewebsites.net';
const COMPANY = process.env.COMPANY_ID ?? process.env.LINEAR_COMPANY_ID;
const APIKEY = process.env.LINEAR_API_KEY;

// SLUG ALIASES - for marketing URLs or common variations
const ALIAS_MAP: Record<string, string> = aliasesData.aliases;

/**
 * Normalize slug for consistent lookups
 * Handles: case, accents, spaces, Finnish chars (ä→a, ö→o, å→a)
 */
const normalize = (s: string) =>
  s.trim().toLowerCase()
   .replace(/ä/g, 'a')
   .replace(/ö/g, 'o')
   .replace(/å/g, 'a')
   .normalize("NFKD").replace(/[\u0300-\u036f]/g,"")
   .replace(/\s+/g,"-").replace(/-+/g,"-")
   .replace(/[^a-z0-9-]/g,"")
   .replace(/^-+|-+$/g, '');

/**
 * Fetch JSON from Linear API with proper auth headers
 */
async function fetchJSON(url: string) {
  if (!COMPANY || !APIKEY) {
    throw new Error('Missing LINEAR_COMPANY_ID or LINEAR_API_KEY');
  }
  
  const formattedApiKey = APIKEY.startsWith('LINEAR-API-KEY ') 
    ? APIKEY 
    : `LINEAR-API-KEY ${APIKEY}`;
  
  const r = await fetch(url, {
    headers: { 
      accept: "application/json", 
      "x-company-id": COMPANY, 
      authorization: formattedApiKey
    },
    cache: "no-store",
  });
  
  const text = await r.text();
  const data = text ? JSON.parse(text) : null;
  return { ok: r.ok, status: r.status, data };
}

/**
 * Property Detail API Route
 * 
 * CRITICAL: Resolves slug → ID → details using the SAME listings feed as cards
 * This eliminates slug drift between homepage and detail pages
 */
export async function GET(
  req: Request, 
  { params }: { params: { slug: string } }
) {
  const u = new URL(req.url);
  const lang = (u.searchParams.get("lang") ?? "fi") as 'fi' | 'sv' | 'en';

  try {
    // Step 1: Normalize slug and apply aliases
    const norm = normalize(params.slug);
    const lookupSlug = ALIAS_MAP[norm] ?? norm;
    
    console.log('🔍 Property lookup:', { 
      raw: params.slug, 
      normalized: norm, 
      lookup: lookupSlug,
      lang 
    });

    // Step 2: Resolve slug → ID using the SAME feed as the cards
    const list = await fetchJSON(`${BASE}/v2/listings?languages[]=${lang}`);
    
    if (!list.ok) {
      console.error('❌ Listings upstream error:', list.status);
      return NextResponse.json(
        { success: false, error: "LISTINGS_UPSTREAM", status: list.status },
        { status: 502, headers: { "cache-control": "no-store" }}
      );
    }
    
    const items = Array.isArray(list.data) ? list.data : (list.data?.data ?? []);
    console.log('📋 Listings count:', items.length);
    
    // Try to match by slug or address
           let match = items.find((x: any) => {
             const itemSlug = x.slug ?? x.canonicalSlug ?? '';
             const itemAddr = x.address?.fi?.value || x.address || '';
             const normalizedSlug = normalize(itemSlug);
             const normalizedAddr = normalize(itemAddr);
             
             // Match by slug first, then by address (for properties with missing slugs)
             return (normalizedSlug && normalizedSlug === lookupSlug) || 
                    (normalizedAddr && normalizedAddr === lookupSlug);
           });
    
    if (!match) {
      console.warn('⚠️  No match found. Available addresses:', 
        items.slice(0, 5).map((x: any) => ({
          addr: x.address?.fi?.value || x.address,
          normalized: normalize(x.address?.fi?.value || x.address || '')
        }))
      );
      
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", slug: lookupSlug },
        { status: 404, headers: { "cache-control": "no-store" }}
      );
    }
    
    // CRITICAL: Use 'identifier' (numeric) NOT 'id' (UUID) for detail endpoint
    const matchId = match.identifier?.fi?.value || match.identifier || match.id?.fi?.value || match.id;
    console.log('✅ Match found:', { 
      id: matchId, 
      uuid: match.id,
      identifier: match.identifier,
      address: match.address?.fi?.value || match.address 
    });

    // Step 3: Fetch full details by ID (using numeric identifier)
    const detail = await fetchJSON(`${BASE}/v2/property/${matchId}?languages[]=${lang}`);
    
    if (!detail.ok) {
      console.error('❌ Detail upstream error:', detail.status);
      const code = detail.status === 404 ? 404 : 502;
      return NextResponse.json(
        { success: false, error: "DETAILS_UPSTREAM", status: detail.status },
        { status: code, headers: { "cache-control": "no-store" }}
      );
    }
    
    const raw = detail.data?.data || detail.data;
    if (!raw) {
      console.error('❌ No data in detail response');
      return NextResponse.json(
        { success: false, error: "NO_DATA" },
        { status: 404, headers: { "cache-control": "no-store" }}
      );
    }

    // Step 4: Map to our format & flatten for single language
    console.log('🔄 Mapping Linear API data to property format...');
    const mapped = mapLinearAPIToProperty(raw);
    
    console.log('🔄 Flattening for language:', lang);
    const flattened: any = flattenPropertyForLanguage(mapped, lang);
    
    if (!flattened) {
      console.error('❌ Flatten returned null');
      return NextResponse.json(
        { success: false, error: "FLATTEN_ERROR" },
        { status: 500, headers: { "cache-control": "no-store" }}
      );
    }

    // Step 5: Safe defaults for arrays
    if (!Array.isArray(flattened.images)) flattened.images = [];
    if (!Array.isArray(flattened.photoUrls)) flattened.photoUrls = [];
    
    console.log('✅ Property ready:', {
      address: flattened.streetAddress || flattened.address,
      images: flattened.images.length,
      hasDescription: !!flattened.description
    });

    return NextResponse.json(
      { success: true, data: flattened },
      { status: 200, headers: { "cache-control": "no-store" }}
    );
    
  } catch (e) {
    // Never throw to framework – always return JSON
    console.error('❌ Property API error:', e);
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR", details: e instanceof Error ? e.message : 'Unknown' },
      { status: 500, headers: { "cache-control": "no-store" }}
    );
  }
}
