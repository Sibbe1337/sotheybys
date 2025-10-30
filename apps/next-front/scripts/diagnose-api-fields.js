#!/usr/bin/env node
/**
 * DIAGNOSTIC: Check what fields actually exist in Linear API response
 */

const https = require('https');

// Config
const API_URL = process.env.LINEAR_API_URL || 'https://linear-external-api.azurewebsites.net';
const API_KEY = process.env.LINEAR_API_KEY || '';
const COMPANY_ID = process.env.COMPANY_ID || '180';

// Fields we're looking for
const FIELDS_TO_CHECK = [
  'fundingCharge',
  'housingCooperativeMortgage',
  'housingTenure',
  'hasBalcony',
  'energyClass',
  'maintenanceCharge',
  'waterCharge',
  'sauna',
  'lotOwnership',
  'release',
  'completeYear',
  'housingCooperativeElevator'
];

function fetchFromLinear(url) {
  return new Promise((resolve, reject) => {
    const formattedApiKey = API_KEY.startsWith('LINEAR-API-KEY ') 
      ? API_KEY 
      : `LINEAR-API-KEY ${API_KEY}`;
    
    const headers = {
      'Authorization': formattedApiKey,
      'Accept': 'application/json',
      'x-company-id': COMPANY_ID
    };

    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error(`Failed to parse JSON: ${err.message}`));
        }
      });
    }).on('error', reject);
  });
}

function getFieldValue(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (!current) return undefined;
    current = current[part];
  }
  
  return current;
}

async function diagnose() {
  console.log('\n🔍 LINEAR API FIELD DIAGNOSTIC\n');
  console.log('═'.repeat(80));
  
  try {
    const url = `${API_URL}/v2/listings?languages[]=fi`;
    const response = await fetchFromLinear(url);
    
    let properties = [];
    if (Array.isArray(response)) {
      properties = response;
    } else if (response?.data?.[0]?.listings) {
      properties = response.data[0].listings;
    } else if (response?.listings) {
      properties = response.listings;
    } else if (response?.data && Array.isArray(response.data)) {
      properties = response.data;
    }
    
    console.log(`✅ Fetched ${properties.length} properties\n`);
    console.log('═'.repeat(80));
    
    // Check each property
    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];
      const address = prop.address?.fi?.value || prop.address?.sv?.value || 'Unknown';
      const city = prop.city?.fi?.value || prop.city?.sv?.value || '';
      
      console.log(`\n${i + 1}. ${address}${city ? ` (${city})` : ''}`);
      console.log('─'.repeat(80));
      
      for (const fieldName of FIELDS_TO_CHECK) {
        const value = prop[fieldName];
        const nv = prop.nonLocalizedValues || {};
        const nvValue = nv[fieldName];
        
        let status = '❌';
        let detail = 'Missing';
        
        if (value !== undefined && value !== null) {
          // Check if it has .fi.value structure
          if (value.fi?.value !== undefined && value.fi?.value !== null) {
            status = '✅';
            detail = `${value.fi.value}`;
          } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            status = '✅';
            detail = `${value}`;
          } else {
            status = '⚠️';
            detail = 'Present but null/empty';
          }
        } else if (nvValue !== undefined && nvValue !== null) {
          status = '✅';
          detail = `${nvValue} (in nonLocalizedValues)`;
        }
        
        console.log(`  ${status} ${fieldName.padEnd(30)} ${detail}`);
      }
    }
    
    console.log('\n' + '═'.repeat(80));
    console.log('\n✅ DIAGNOSTIC COMPLETE!\n');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
}

diagnose().catch(console.error);

