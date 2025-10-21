#!/usr/bin/env node
/**
 * Find ALL properties in the Linear API cache
 * This helps us understand what slugs actually exist
 */

const path = require('path');

// Import the cache
const cacheModule = require(path.join(__dirname, '../src/lib/listings-cache'));

async function main() {
  try {
    console.log('🔍 Scanning Linear API cache for ALL properties...\n');
    
    // Initialize cache
    await cacheModule.ensureCacheInitialized();
    
    // Get all listings
    const cache = cacheModule.listingsCache;
    const allProperties = cache.getAllListings();
    
    console.log(`✅ Found ${allProperties.length} properties in cache\n`);
    
    // List first 20 with their slugs
    console.log('='.repeat(80));
    console.log('PROPERTY SLUGS (First 20):');
    console.log('='.repeat(80));
    
    allProperties.slice(0, 20).forEach((prop, index) => {
      const address = prop.streetAddress?.fi || prop.streetAddress?.sv || prop.streetAddress?.en || 'No address';
      const slug = prop.slug || 'No slug';
      console.log(`${index + 1}. ${slug}`);
      console.log(`   Address: ${address}`);
      console.log('');
    });
    
    if (allProperties.length > 20) {
      console.log(`... and ${allProperties.length - 20} more properties\n`);
    }
    
    // Save full list to file
    const fs = require('fs');
    const outputPath = path.join(__dirname, '../cache-property-list.json');
    const propertyList = allProperties.map(p => ({
      slug: p.slug,
      streetAddress: p.streetAddress?.fi || p.streetAddress?.sv || p.streetAddress?.en,
      city: p.city?.fi || p.city?.sv || p.city?.en
    }));
    
    fs.writeFileSync(outputPath, JSON.stringify(propertyList, null, 2));
    console.log(`💾 Full property list saved to: ${outputPath}\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

