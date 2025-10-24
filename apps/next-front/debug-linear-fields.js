/**
 * DEBUG SCRIPT: Show all fields from Linear API for a specific property
 * 
 * Usage: node debug-linear-fields.js mailatie-3
 */

const propertySlug = process.argv[2] || 'mailatie-3';

const BASE = process.env.LINEAR_EXTERNAL_BASE ?? 'https://linear-external-api.azurewebsites.net';
const COMPANY = process.env.COMPANY_ID ?? process.env.LINEAR_COMPANY_ID;
const APIKEY = process.env.LINEAR_API_KEY;

if (!COMPANY || !APIKEY) {
  console.error('❌ Missing LINEAR_COMPANY_ID or LINEAR_API_KEY in .env');
  process.exit(1);
}

const formattedApiKey = APIKEY.startsWith('LINEAR-API-KEY ') 
  ? APIKEY 
  : `LINEAR-API-KEY ${APIKEY}`;

/**
 * Normalize slug for consistent lookups
 */
const normalize = (s) =>
  s.trim().toLowerCase()
   .replace(/ä/g, 'a')
   .replace(/ö/g, 'o')
   .replace(/å/g, 'a')
   .normalize("NFKD").replace(/[\u0300-\u036f]/g,"")
   .replace(/\s+/g,"-").replace(/-+/g,"-")
   .replace(/[^a-z0-9-]/g,"")
   .replace(/^-+|-+$/g, '');

async function debugLinearFields() {
  try {
    console.log('🔍 Fetching property:', propertySlug);
    console.log('');
    
    // Step 1: Get listings to find property ID
    const listingsUrl = `${BASE}/v2/listings?languages[]=fi`;
    console.log('📡 Fetching listings from:', listingsUrl);
    
    const listingsResponse = await fetch(listingsUrl, {
      headers: { 
        accept: "application/json", 
        "x-company-id": COMPANY, 
        authorization: formattedApiKey
      }
    });
    
    if (!listingsResponse.ok) {
      console.error('❌ Listings request failed:', listingsResponse.status);
      process.exit(1);
    }
    
    const listingsData = await listingsResponse.json();
    const items = Array.isArray(listingsData) ? listingsData : (listingsData?.data ?? []);
    
    console.log('✅ Found', items.length, 'listings');
    console.log('');
    
    // Step 2: Find property by slug
    const lookupSlug = normalize(propertySlug);
    const match = items.find(item => {
      const addr = item.address?.fi?.value || item.address || '';
      return normalize(addr) === lookupSlug;
    });
    
    if (!match) {
      console.error('❌ Property not found:', propertySlug);
      console.log('Available properties:');
      items.forEach(item => {
        const addr = item.address?.fi?.value || item.address || '';
        console.log('  -', addr, '→', normalize(addr));
      });
      process.exit(1);
    }
    
    // Extract ID - it might be an object or a string
    const propertyId = match.id?.fi?.value || match.id?.value || match.id;
    
    console.log('✅ Found property:', match.address?.fi?.value || match.address);
    console.log('   ID:', propertyId);
    console.log('');
    
    // Step 3: Use listing data directly (same as production code)
    // The /v2/listings endpoint already contains ALL fields
    console.log('✅ Using listing data directly (contains all fields)');
    console.log('');
    
    const raw = match;
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔍 DENNIS DEBUG: Critical Fields from Linear API');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    
    // Check Omistusmuoto (Ownership type)
    console.log('1️⃣ OMISTUSMUOTO (Ownership type):');
    console.log('   ownershipType?.fi?.value:', raw.ownershipType?.fi?.value);
    console.log('   ownershipType object:', JSON.stringify(raw.ownershipType, null, 2));
    console.log('');
    
    // Check Hallintamuoto (Housing tenure)
    console.log('2️⃣ HALLINTAMUOTO (Housing tenure):');
    console.log('   housingTenure?.fi?.value:', raw.housingTenure?.fi?.value);
    console.log('   housingTenure object:', JSON.stringify(raw.housingTenure, null, 2));
    console.log('');
    
    // Check Tontin omistus (Site ownership)
    console.log('3️⃣ TONTIN OMISTUS (Site ownership):');
    console.log('   plotOwnership?.fi?.value:', raw.plotOwnership?.fi?.value);
    console.log('   plotOwnership object:', JSON.stringify(raw.plotOwnership, null, 2));
    console.log('   lotOwnership?.fi?.value:', raw.lotOwnership?.fi?.value);
    console.log('   siteOwnershipType?.fi?.value:', raw.siteOwnershipType?.fi?.value);
    console.log('');
    
    // Check Vesijohto (Water connection)
    console.log('4️⃣ VESIJOHTO (Water connection):');
    console.log('   waterSystem?.fi?.value:', raw.waterSystem?.fi?.value);
    console.log('   waterSystem object:', JSON.stringify(raw.waterSystem, null, 2));
    console.log('   waterConnection?.fi?.value:', raw.waterConnection?.fi?.value);
    console.log('');
    
    // Check Energiatodistus
    console.log('5️⃣ ENERGIATODISTUS (Energy certificate):');
    console.log('   listingHasEnergyCertificate?.fi?.value:', raw.listingHasEnergyCertificate?.fi?.value);
    console.log('   energyCertificateUrl:', raw.energyCertificateUrl);
    console.log('');
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔑 ALL AVAILABLE KEYS FROM LINEAR API:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log(Object.keys(raw).sort().join('\n'));
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ Debug complete!');
    console.log('═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

debugLinearFields();

