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
    const rows = (Array.isArray(j) ? j : j?.data ?? []).map((x: any) => ({
      id: x.id?.fi?.value || x.id,
      slug: x.slug ?? x.canonicalSlug ?? "",
      addr: x.address?.fi?.value || x.address || "",
      identifier: x.identifier?.fi?.value || x.identifier
    }));
    
    return NextResponse.json({ 
      count: rows.length, 
      rows 
    }, { 
      headers: { "cache-control": "no-store" }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

