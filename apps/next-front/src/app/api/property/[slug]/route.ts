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
    const alias = ALIAS_MAP[norm] ?? norm;
    const lookupSlug = normalize(alias);  // ← Normalize AFTER alias to handle Finnish chars
    
    console.log('🔍 Property lookup:', { 
      raw: params.slug, 
      normalized: norm,
      alias: alias,
      lookup: lookupSlug,
      lang 
    });

    // Step 2: Resolve slug → ID using the SAME feed as the cards
    // CRITICAL: Always use lang=fi for slug lookup (same as cache)
    // The requested language is only used for flattening the final data
    const list = await fetchJSON(`${BASE}/v2/listings?languages[]=fi`);
    
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
    
           // Debug: Log the raw match object structure
           console.log('🔍 Raw match object:', JSON.stringify(match, null, 2).substring(0, 1000));
           
           // CRITICAL: Use 'identifier' (numeric) NOT 'id' (UUID) for detail endpoint
           const matchId = match.identifier?.fi?.value || match.identifier || match.id?.fi?.value || match.id;
           const matchDetails = {
             id: matchId, 
             uuid: match.id,
             identifier: match.identifier,
             identifierFi: match.identifier?.fi?.value,
             address: match.address?.fi?.value || match.address,
             slug: match.slug ?? match.canonicalSlug ?? '(empty)'
           };
           console.log('✅ Match found:', matchDetails);
           
           // Diagnostic: Check if matchId is valid
           if (!matchId) {
             console.error('❌ No valid identifier found in match:', matchDetails);
             return NextResponse.json(
               { success: false, error: "NO_IDENTIFIER", details: matchDetails },
               { status: 404, headers: { "cache-control": "no-store" }}
             );
           }

    // Step 3: Use listing data directly (PRIMARY SOURCE)
    // CRITICAL: /v2/listings has ALL fields (districtFree, district, partOfCity)
    // but /v2/property/{id} is missing these location fields
    console.log('✅ Using listing data (contains complete location fields)');
    const raw = match;
    
    if (!raw) {
      console.error('❌ No listing data available');
      return NextResponse.json(
        { 
          success: false, 
          error: "NO_LISTING_DATA", 
          identifier: matchId,
          address: matchDetails.address
        },
        { status: 404, headers: { "cache-control": "no-store" }}
      );
    }

    // Step 4: Map to our format & flatten for single language
    console.log('🔄 Mapping Linear API data to property format...');
    try {
      const mapped = mapLinearAPIToProperty(raw);
      
      // Debug: Check critical fields from Linear API
      console.log('🔍 Linear API Fields (Dennis debug):', {
        // Omistusmuoto (Ownership type)
        ownershipType_fi: raw.ownershipType?.fi?.value,
        ownershipType_obj: raw.ownershipType,
        
        // Hallintamuoto (Housing tenure)
        housingTenure_fi: raw.housingTenure?.fi?.value,
        housingTenure_obj: raw.housingTenure,
        
        // Tontin omistus (Site ownership)
        plotOwnership_fi: raw.plotOwnership?.fi?.value,
        plotOwnership_obj: raw.plotOwnership,
        lotOwnership_fi: (raw as any).lotOwnership?.fi?.value,
        siteOwnershipType_RAW: (raw as any).siteOwnershipType,  // ← Show raw value (might be string!)
        siteOwnershipType_fi: (raw as any).siteOwnershipType?.fi?.value,
        
        // Vesijohto (Water connection)
        waterSystem_fi: raw.waterSystem?.fi?.value,
        waterSystem_obj: raw.waterSystem,
        waterConnection_fi: (raw as any).waterConnection?.fi?.value,
        waterConnection_obj: (raw as any).waterConnection,
        
        // Other rental/property fields
        petsAllowed: raw.nonLocalizedValues?.petsAllowed,
        smokingAllowed: raw.nonLocalizedValues?.smokingAllowed,
        rent: raw.nonLocalizedValues?.rent,
        
        // Check nonLocalizedValues too
        nv_siteOwnershipType: raw.nonLocalizedValues?.siteOwnershipType,
        nv_ownershipType: raw.nonLocalizedValues?.ownershipType,
        nv_housingTenure: raw.nonLocalizedValues?.housingTenure
      });
      
      // Debug: Show ALL keys from raw data to find missing fields
      console.log('🔑 All Linear API keys:', Object.keys(raw).sort());

      // DIAGNOSTIC: Show ALL loan/mortgage/company related fields from Linear API
      console.log('💰 LOAN/MORTGAGE DIAGNOSTIC (all company/loan/mortgage fields):', {
        // Check all possible loan field names
        companyLoans: raw.companyLoans,
        housingCooperativeLoans: raw.housingCooperativeLoans,
        housingCompanyLoans: raw.housingCompanyLoans,
        taloyhtionLainat: raw.taloyhtionLainat,
        taloyhtiönLainat: raw.taloyhtiönLainat,

        // Check all possible loan date field names
        companyLoansDate: raw.companyLoansDate,
        housingCooperativeLoansDate: raw.housingCooperativeLoansDate,
        housingCompanyLoansDate: raw.housingCompanyLoansDate,
        taloyhtionLainanPaivamaara: raw.taloyhtionLainanPaivamaara,

        // Check all mortgage field names
        companyMortgages: raw.companyMortgages,
        housingCooperativeMortgage: raw.housingCooperativeMortgage,
        housingCompanyMortgages: raw.housingCompanyMortgages,
        housingCompanyMortgageDate: raw.housingCompanyMortgageDate,
        taloyhtionKiinnitykset: raw.taloyhtionKiinnitykset,

        // Check nonLocalizedValues too
        nv_companyLoans: raw.nonLocalizedValues?.companyLoans,
        nv_housingCooperativeLoans: raw.nonLocalizedValues?.housingCooperativeLoans,
        nv_companyMortgages: raw.nonLocalizedValues?.companyMortgages
      });

      // Debug: Check if agent exists in mapped data BEFORE flatten
      console.log('🔍 Mapped Agent (before flatten):', {
        address: mapped.streetAddress?.fi || mapped.streetAddress,
        hasAgent: !!mapped.agent,
        agentName: mapped.agent?.name,
        agentPhone: mapped.agent?.phone,
        agentPhotoUrl: mapped.agent?.photo?.sourceUrl,
        estateAgentName: mapped.estateAgentName
      });
      
      console.log('🔄 Flattening for language:', lang);
      const flattened: any = flattenPropertyForLanguage(mapped, lang);
      
      if (!flattened) {
        console.error('❌ Flatten returned null');
        return NextResponse.json(
          { success: false, error: "FLATTEN_ERROR", lang },
          { status: 500, headers: { "cache-control": "no-store" }}
        );
      }

      // Step 5: Safe defaults for arrays
      if (!Array.isArray(flattened.images)) flattened.images = [];
      if (!Array.isArray(flattened.photoUrls)) flattened.photoUrls = [];
      
      // Debug: Check agent data before sending to frontend
      console.log('🔍 API Agent Debug:', {
        address: flattened.streetAddress || flattened.address,
        hasAgent: !!flattened.agent,
        agentName: flattened.agent?.name,
        agentPhoto: flattened.agent?.photo,
        agentPhotoUrl: flattened.agent?.photo?.sourceUrl,
        // Also check old format fields
        estateAgentName: flattened.estateAgentName,
        estateAgentPhone: flattened.estateAgentPhone
      });
      
      console.log('✅ Property ready:', {
        address: flattened.streetAddress || flattened.address,
        images: flattened.images.length,
        hasDescription: !!flattened.description
      });

      return NextResponse.json(
        { success: true, data: flattened },
        { status: 200, headers: { "cache-control": "no-store" }}
      );
    } catch (mappingError) {
      console.error('❌ Error mapping/flattening property data:', mappingError);
      return NextResponse.json(
        { success: false, error: "MAPPING_ERROR", details: mappingError instanceof Error ? mappingError.message : 'Unknown', lang },
        { status: 500, headers: { "cache-control": "no-store" }}
      );
    }
    
  } catch (e) {
    // Never throw to framework – always return JSON
    console.error('❌ Property API error:', e);
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR", details: e instanceof Error ? e.message : 'Unknown' },
      { status: 500, headers: { "cache-control": "no-store" }}
    );
  }
}
