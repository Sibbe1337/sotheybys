// Quick script to check cache
const { listingsCache, ensureCacheInitialized } = require('./src/lib/listings-cache.ts');

async function checkCache() {
  await ensureCacheInitialized();
  const listings = listingsCache.getAllListings();
  console.log('Total listings in cache:', listings.length);
  
  // Show first few slugs
  listings.slice(0, 5).forEach(listing => {
    const addr = listing.address?.fi?.value || 'NO ADDRESS';
    console.log('Address:', addr);
    console.log('Generated slug:', generateSlug(addr));
    console.log('---');
  });
}

checkCache();
