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
    const search = u.searchParams.get("search") ?? "Heikkiläntie";
    const locale = u.searchParams.get("locale") ?? "fi";
    
    const formattedApiKey = APIKEY.startsWith('LINEAR-API-KEY ') 
      ? APIKEY 
      : `LINEAR-API-KEY ${APIKEY}`;
    
    const r = await fetch(`${BASE}/v2/listings?languages[]=fi&languages[]=sv&languages[]=en`, {
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
    
    // Simulate the extractLinkFromArray logic
    const linksArray = found.links;
    
    const debug = {
      search,
      locale,
      address: found.address?.fi?.value || found.address,
      hasLinksField: !!linksArray,
      linksFieldType: typeof linksArray,
      linksFieldKeys: linksArray ? Object.keys(linksArray) : null,
      linksRaw: linksArray,
    };
    
    // Test extractLinkFromArray logic
    if (linksArray) {
      const localeLinks = linksArray[locale] || linksArray['fi'] || linksArray;
      const actualLinks = localeLinks?.value || localeLinks;
      
      Object.assign(debug, {
        step1_localeLinks_type: typeof localeLinks,
        step1_localeLinks_keys: localeLinks ? Object.keys(localeLinks) : null,
        step2_actualLinks_isArray: Array.isArray(actualLinks),
        step2_actualLinks_length: Array.isArray(actualLinks) ? actualLinks.length : 'N/A',
        step2_actualLinks: actualLinks,
      });
      
      if (Array.isArray(actualLinks)) {
        // Find SIR by pattern
        const foundByPattern = actualLinks.find((link: any) => {
          const url = link?.value || link?.url || link;
          return /sothebysrealty\.com/i.test(url);
        });
        
        // Find SIR by name
        const foundByName = actualLinks.find((link: any) => {
          const linkName = link?.name || link?.key || link?.label || '';
          return linkName.toLowerCase() === 'sir';
        });
        
        Object.assign(debug, {
          result_foundByPattern: foundByPattern,
          result_foundByName: foundByName,
          result_internationalUrl: foundByPattern?.value || foundByName?.value || null
        });
      }
    }
    
    return NextResponse.json(debug, { 
      headers: { "cache-control": "no-store" }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
