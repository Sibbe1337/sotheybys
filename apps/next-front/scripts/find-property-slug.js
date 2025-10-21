#!/usr/bin/env node
/**
 * Find Property Slug Helper
 * Usage: node scripts/find-property-slug.js <search-term>
 * Example: node scripts/find-property-slug.js remmar
 */

const fs = require('fs');
const path = require('path');

const searchTerm = process.argv[2];

if (!searchTerm) {
  console.error('Usage: node scripts/find-property-slug.js <search-term>');
  console.error('Example: node scripts/find-property-slug.js remmar');
  process.exit(1);
}

console.log(`🔍 Searching for properties matching: "${searchTerm}"\n`);

// Try to find the cache file
const possibleCachePaths = [
  path.join(process.cwd(), '.cache', 'listings.json'),
  path.join(process.cwd(), 'cache', 'listings.json'),
  path.join(process.cwd(), '.next', 'cache', 'listings.json'),
];

let cacheData = null;
let cacheFile = null;

for (const cachePath of possibleCachePaths) {
  if (fs.existsSync(cachePath)) {
    try {
      cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      cacheFile = cachePath;
      break;
    } catch (err) {
      console.error(`Failed to read ${cachePath}:`, err.message);
    }
  }
}

if (!cacheData) {
  console.error('❌ Could not find cache file. Tried:');
  possibleCachePaths.forEach(p => console.error(`   - ${p}`));
  console.error('\nRun the dev server first to generate cache:');
  console.error('   npm run dev');
  process.exit(1);
}

console.log(`✓ Found cache: ${cacheFile}\n`);

// Search through properties
const matches = [];
const searchLower = searchTerm.toLowerCase();

if (Array.isArray(cacheData.properties)) {
  cacheData.properties.forEach(prop => {
    const slug = prop.slug || '';
    const title = prop.title || '';
    const address = prop.address || prop.streetAddress || '';
    
    if (
      slug.toLowerCase().includes(searchLower) ||
      title.toLowerCase().includes(searchLower) ||
      address.toLowerCase().includes(searchLower)
    ) {
      matches.push({
        slug,
        title,
        address,
        type: prop.propertyType || prop.apartmentType || 'unknown'
      });
    }
  });
} else if (typeof cacheData === 'object') {
  // Handle different cache formats
  Object.entries(cacheData).forEach(([key, prop]) => {
    if (typeof prop === 'object' && prop !== null) {
      const slug = prop.slug || key || '';
      const title = prop.title || '';
      const address = prop.address || prop.streetAddress || '';
      
      if (
        slug.toLowerCase().includes(searchLower) ||
        title.toLowerCase().includes(searchLower) ||
        address.toLowerCase().includes(searchLower)
      ) {
        matches.push({
          slug,
          title,
          address,
          type: prop.propertyType || prop.apartmentType || 'unknown'
        });
      }
    }
  });
}

if (matches.length === 0) {
  console.log('❌ No properties found matching:', searchTerm);
  console.log('\nTry:');
  console.log('  1. Different search term');
  console.log('  2. Checking if property exists in Linear API');
  console.log('  3. Refreshing cache: rm -rf .cache && npm run dev');
  process.exit(0);
}

console.log(`✓ Found ${matches.length} matching propert${matches.length === 1 ? 'y' : 'ies'}:\n`);

matches.forEach((match, i) => {
  console.log(`${i + 1}. ${match.title || '(no title)'}`);
  console.log(`   Slug:    ${match.slug}`);
  console.log(`   Address: ${match.address || '(no address)'}`);
  console.log(`   Type:    ${match.type}`);
  console.log('');
});

console.log('To add an alias, edit: src/config/property-aliases.json');
console.log('Example:');
console.log('  "your-alias": "' + matches[0].slug + '"');
console.log('');
console.log('Then restart the dev server.');

