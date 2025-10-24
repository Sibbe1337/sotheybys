/**
 * DEBUG SCRIPT: Show ALL fields with actual values from Linear API
 */

const propertySlug = process.argv[2] || 'mailatie-3';

const BASE = process.env.LINEAR_EXTERNAL_BASE ?? 'https://linear-external-api.azurewebsites.net';
const COMPANY = process.env.COMPANY_ID ?? process.env.LINEAR_COMPANY_ID;
const APIKEY = process.env.LINEAR_API_KEY;

if (!COMPANY || !APIKEY) {
  console.error('❌ Missing LINEAR_COMPANY_ID or LINEAR_API_KEY');
  process.exit(1);
}

const formattedApiKey = APIKEY.startsWith('LINEAR-API-KEY ') 
  ? APIKEY 
  : `LINEAR-API-KEY ${APIKEY}`;

const normalize = (s) =>
  s.trim().toLowerCase()
   .replace(/ä/g, 'a')
   .replace(/ö/g, 'o')
   .replace(/å/g, 'a')
   .normalize("NFKD").replace(/[\u0300-\u036f]/g,"")
   .replace(/\s+/g,"-").replace(/-+/g,"-")
   .replace(/[^a-z0-9-]/g,"")
   .replace(/^-+|-+$/g, '');

async function debugAllFields() {
  try {
    // Step 1: Get listings
    const listingsUrl = `${BASE}/v2/listings?languages[]=fi`;
    const listingsResponse = await fetch(listingsUrl, {
      headers: { 
        accept: "application/json", 
        "x-company-id": COMPANY, 
        authorization: formattedApiKey
      }
    });
    
    const listingsData = await listingsResponse.json();
    const items = Array.isArray(listingsData) ? listingsData : (listingsData?.data ?? []);
    
    // Step 2: Find property
    const lookupSlug = normalize(propertySlug);
    const match = items.find(item => {
      const addr = item.address?.fi?.value || item.address || '';
      return normalize(addr) === lookupSlug;
    });
    
    if (!match) {
      console.error('❌ Property not found:', propertySlug);
      process.exit(1);
    }
    
    console.log('✅ Found property:', match.address?.fi?.value || match.address);
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 ALL FIELDS WITH ACTUAL VALUES:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    
    // Function to extract value from field
    const extractValue = (field) => {
      if (field === null || field === undefined) return null;
      if (typeof field === 'string' || typeof field === 'number' || typeof field === 'boolean') return field;
      if (field?.fi?.value !== undefined) return field.fi.value;
      if (field?.value !== undefined) return field.value;
      if (typeof field === 'object' && !Array.isArray(field)) return JSON.stringify(field);
      if (Array.isArray(field) && field.length > 0) return JSON.stringify(field);
      return null;
    };
    
    // Show all fields with values
    const allKeys = Object.keys(match).sort();
    let count = 0;
    
    for (const key of allKeys) {
      const value = extractValue(match[key]);
      if (value !== null && value !== '' && value !== '[]' && value !== '{}') {
        count++;
        console.log(`${count}. ${key}:`);
        console.log(`   ${value}`);
        console.log('');
      }
    }
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ Found ${count} fields with values`);
    console.log('═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

debugAllFields();

