#!/usr/bin/env node
/**
 * DATA QUALITY REPORT
 * 
 * Analyzes Linear API data to identify properties with missing information
 * 
 * Usage: 
 *   node scripts/data-quality-report.js
 * 
 * Output:
 *   - Summary of missing fields by category
 *   - Top 5 properties with most missing data
 *   - Actionable recommendations
 */

const https = require('https');

// ============================================================================
// CONFIG
// ============================================================================

// Match the config from linear-api.config.ts
const DEFAULT_LINEAR_API_URL = 'https://linear-external-api.azurewebsites.net';

function getLinearAPIUrl() {
  let url = process.env.NEXT_PUBLIC_LINEAR_API_URL || 
            process.env.LINEAR_API_URL || 
            DEFAULT_LINEAR_API_URL;
  
  // Remove /api suffix if present
  if (url.endsWith('/api')) {
    url = url.slice(0, -4);
  }
  
  return url;
}

function getLinearAPIKey() {
  return process.env.NEXT_PUBLIC_LINEAR_API_KEY || 
         process.env.LINEAR_API_KEY || '';
}

function getLinearCompanyId() {
  return process.env.NEXT_PUBLIC_COMPANY_ID || 
         process.env.COMPANY_ID || 
         process.env.LINEAR_COMPANY_ID || '';
}

const API_URL = getLinearAPIUrl();
const API_KEY = getLinearAPIKey();
const COMPANY_ID = getLinearCompanyId();

// Critical fields to check (grouped by category)
const CRITICAL_FIELDS = {
  'Grundinfo (Basic Info)': {
    fields: ['address.fi', 'city.fi', 'postalCode', 'askPrice'],
    weight: 10 // High importance
  },
  'Byggnadsinformation (Building Info)': {
    fields: ['yearBuilt', 'energyClass', 'heatingSystem', 'ventilationSystem'],
    weight: 8
  },
  'Bolagsinformation (Company Info)': {
    fields: ['housingCooperativeName', 'companyLoans', 'housingCooperativeMortgage'],
    weight: 7,
    onlyForApartments: true
  },
  'Mäklare (Agent Info)': {
    fields: ['agent.name', 'agent.phone', 'agent.email'],
    weight: 10
  },
  'Dimensioner (Dimensions)': {
    fields: ['livingArea', 'roomCount'],
    weight: 9
  }
};

// ============================================================================
// HELPERS
// ============================================================================

function getNestedValue(obj, path) {
  return path.split('.').reduce((curr, key) => {
    if (!curr) return undefined;
    // Handle localized fields
    if (key === 'fi' || key === 'sv' || key === 'en') {
      return curr[key]?.value || curr[key];
    }
    return curr[key];
  }, obj);
}

function isEmpty(value) {
  return value === undefined || 
         value === null || 
         value === '' || 
         (typeof value === 'string' && value.trim() === '') ||
         (typeof value === 'number' && value === 0);
}

function isApartment(property) {
  const type = (property.listingType || '').toUpperCase();
  return ['KERROSTALO', 'FLAT', 'APARTMENT_BUILDING'].includes(type);
}

function fetchFromLinear(url) {
  return new Promise((resolve, reject) => {
    // Format API key like the LinearAPIClient does
    const formattedApiKey = API_KEY.startsWith('LINEAR-API-KEY ') 
      ? API_KEY 
      : `LINEAR-API-KEY ${API_KEY}`;
    
    const headers = {
      'Authorization': formattedApiKey,
      'Accept': 'application/json'
    };
    
    // Add company ID header if provided
    if (COMPANY_ID) {
      headers['x-company-id'] = COMPANY_ID;
    }

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
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }
        
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (err) {
          reject(new Error(`Failed to parse JSON: ${err.message}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// ============================================================================
// MAIN ANALYSIS
// ============================================================================

async function analyzeDataQuality() {
  console.log('\n🔍 DATA QUALITY ANALYSIS');
  console.log('═'.repeat(80));
  
  // Validate configuration
  if (!API_KEY) {
    console.error('❌ ERROR: Linear API key is not set!');
    console.error('\nSet one of these environment variables:');
    console.error('  - NEXT_PUBLIC_LINEAR_API_KEY');
    console.error('  - LINEAR_API_KEY');
    console.error('\nIn .env.local file or export in terminal\n');
    process.exit(1);
  }
  
  if (!COMPANY_ID) {
    console.error('❌ ERROR: Company ID is not set!');
    console.error('\nSet one of these environment variables:');
    console.error('  - NEXT_PUBLIC_COMPANY_ID');
    console.error('  - COMPANY_ID');
    console.error('  - LINEAR_COMPANY_ID');
    console.error('\nIn .env.local file or export in terminal\n');
    process.exit(1);
  }
  
  console.log(`📡 Fetching data from Linear API...`);
  console.log(`🔗 API URL: ${API_URL}`);
  console.log(`🔗 Company ID: ${COMPANY_ID.substring(0, 8)}...`);
  console.log(`🔑 API Key: ${API_KEY.substring(0, 15)}...\n`);

  try {
    // Fetch all properties using the same endpoint format as LinearAPIClient
    const url = `${API_URL}/v2/listings?languages[]=fi`;
    const response = await fetchFromLinear(url);
    
    // Handle various response formats (matching LinearAPIClient logic)
    let properties = [];
    
    if (Array.isArray(response)) {
      properties = response;
    } else if (response?.data?.[0]?.listings) {
      properties = response.data[0].listings;
    } else if (response?.listings) {
      properties = response.listings;
    } else if (response?.data && Array.isArray(response.data)) {
      properties = response.data;
    } else {
      throw new Error('Unexpected API response format');
    }
    
    if (!Array.isArray(properties) || properties.length === 0) {
      throw new Error(`No properties found in response. Got: ${JSON.stringify(response).substring(0, 200)}`);
    }

    console.log(`✅ Fetched ${properties.length} properties\n`);
    console.log('═'.repeat(80));

    // Analyze each category
    const categoryResults = {};
    const propertyScores = properties.map(property => {
      const problems = [];
      let totalMissingWeight = 0;

      for (const [categoryName, config] of Object.entries(CRITICAL_FIELDS)) {
        // Skip apartment-only fields for non-apartments
        if (config.onlyForApartments && !isApartment(property)) {
          continue;
        }

        let missingInCategory = 0;
        const missingFields = [];

        for (const field of config.fields) {
          const value = getNestedValue(property, field);
          if (isEmpty(value)) {
            missingInCategory++;
            missingFields.push(field);
            totalMissingWeight += config.weight;
          }
        }

        if (missingInCategory > 0) {
          problems.push({
            category: categoryName,
            missing: missingFields,
            count: missingInCategory
          });

          // Track category statistics
          if (!categoryResults[categoryName]) {
            categoryResults[categoryName] = {
              total: 0,
              problematic: 0,
              examples: []
            };
          }
          categoryResults[categoryName].total++;
          categoryResults[categoryName].problematic++;
          
          if (categoryResults[categoryName].examples.length < 3) {
            const address = getNestedValue(property, 'address.fi') || 
                          getNestedValue(property, 'address.sv') || 
                          'Okänd adress';
            categoryResults[categoryName].examples.push({
              address,
              id: property.id,
              missing: missingFields
            });
          }
        }
      }

      const address = getNestedValue(property, 'address.fi') || 
                     getNestedValue(property, 'address.sv') || 
                     'Okänd adress';

      return {
        id: property.id,
        address,
        city: getNestedValue(property, 'city.fi') || '',
        type: property.listingType || 'Unknown',
        problems,
        missingWeight: totalMissingWeight,
        missingCount: problems.reduce((sum, p) => sum + p.count, 0)
      };
    });

    // ========================================================================
    // PRINT RESULTS
    // ========================================================================

    console.log('\n📊 RESULTAT PER KATEGORI\n');
    
    for (const [categoryName, stats] of Object.entries(categoryResults)) {
      const percentage = ((stats.problematic / properties.length) * 100).toFixed(1);
      
      console.log(`📁 ${categoryName}`);
      console.log(`   ⚠️  ${stats.problematic}/${properties.length} objekt saknar data (${percentage}%)`);
      
      if (stats.examples.length > 0) {
        console.log(`   🔴 Exempel:`);
        stats.examples.forEach(ex => {
          console.log(`      • ${ex.address}`);
          console.log(`        Saknar: ${ex.missing.join(', ')}`);
        });
      }
      console.log('');
    }

    console.log('═'.repeat(80));

    // Find worst properties
    const worst = propertyScores
      .filter(p => p.missingCount > 0)
      .sort((a, b) => b.missingWeight - a.missingWeight)
      .slice(0, 10);

    console.log('\n🔴 TOP 10 OBJEKT MED MEST SAKNAD DATA\n');
    
    worst.forEach((prop, i) => {
      console.log(`${i + 1}. ${prop.address} (${prop.city})`);
      console.log(`   Typ: ${prop.type}`);
      console.log(`   📊 Saknar ${prop.missingCount} kritiska fält (weight: ${prop.missingWeight})`);
      console.log(`   🔍 Linear ID: ${prop.id}`);
      
      if (prop.problems.length > 0) {
        console.log(`   Kategorier med problem:`);
        prop.problems.forEach(prob => {
          console.log(`      • ${prob.category}: ${prob.missing.join(', ')}`);
        });
      }
      console.log('');
    });

    console.log('═'.repeat(80));

    // Calculate overall score
    const totalFields = properties.length * Object.values(CRITICAL_FIELDS)
      .reduce((sum, cat) => sum + cat.fields.length, 0);
    const missingFields = propertyScores.reduce((sum, p) => sum + p.missingCount, 0);
    const completeness = ((1 - (missingFields / totalFields)) * 100).toFixed(1);

    console.log('\n📈 ÖVERGRIPANDE KVALITET\n');
    console.log(`   Totalt antal objekt: ${properties.length}`);
    console.log(`   Objekt med komplett data: ${properties.length - worst.length}`);
    console.log(`   Objekt med saknad data: ${worst.length}`);
    console.log(`   Data completeness score: ${completeness}%`);
    console.log('');

    // Quality rating
    let rating = '';
    if (completeness >= 90) rating = '🟢 EXCELLENT';
    else if (completeness >= 75) rating = '🟡 GOOD';
    else if (completeness >= 60) rating = '🟠 NEEDS IMPROVEMENT';
    else rating = '🔴 POOR';

    console.log(`   Betyg: ${rating}\n`);

    console.log('═'.repeat(80));
    
    // Recommendations
    console.log('\n💡 REKOMMENDATIONER\n');
    console.log('1. 🎯 PRIORITERA: Fixa de 5 värsta objekten först (störst impact)');
    console.log('');
    console.log('2. 📝 BULK EDIT: För vanliga saknade fält (t.ex. energiklass), använd:');
    console.log('   - Exportera alla objekt från Linear till CSV');
    console.log('   - Fyll i saknade värden i Excel/Google Sheets');
    console.log('   - Importera tillbaka till Linear');
    console.log('');
    console.log('3. 🔍 LINEAR.FI: Logga in på https://linear.fi/admin');
    console.log('   - Sök objekt med ID (t.ex. första objektet ovan)');
    console.log('   - Fyll i saknad information');
    console.log('   - Spara och verifiera');
    console.log('');
    console.log('4. ✅ VERIFIERA: Kör detta script igen efter ändringar');
    console.log('   node scripts/data-quality-report.js');
    console.log('');
    console.log('5. 🎯 MÅL: Sikta på >90% completeness inom 2 veckor');
    console.log('');

    // Export option
    console.log('═'.repeat(80));
    console.log('\n📤 EXPORTERA DATA\n');
    console.log('För att exportera full rapport till JSON:');
    console.log('   node scripts/data-quality-report.js > report.json');
    console.log('');

    console.log('═'.repeat(80));
    console.log('\n✅ ANALYS KLAR!\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Kontrollera att .env.local innehåller:');
    console.error('   - NEXT_PUBLIC_LINEAR_API_URL');
    console.error('   - NEXT_PUBLIC_LINEAR_API_KEY');
    console.error('   - NEXT_PUBLIC_LINEAR_COMPANY_ID');
    console.error('');
    console.error('2. Verifiera att API-nyckeln är giltig');
    console.error('3. Kontrollera internet-anslutning\n');
    process.exit(1);
  }
}

// ============================================================================
// RUN
// ============================================================================

if (require.main === module) {
  // Load environment variables from .env.local
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '..', '.env.local');
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=:#]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  } catch (err) {
    // Ignore errors, env vars might be set another way
  }

  analyzeDataQuality();
}

module.exports = { analyzeDataQuality };

