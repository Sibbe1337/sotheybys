#!/usr/bin/env node
/**
 * Debug Remmarholmen 404 Issue
 * This script will help identify why the property works on homepage but 404s on detail page
 */

console.log('🔍 Debugging Remmarholmen 404 Issue\n');
console.log('=' + '='.repeat(79));

// Step 1: Check what slug the homepage is using
console.log('\n📍 STEP 1: Check Homepage PropertyCard Link');
console.log('-'.repeat(80));
console.log('Open browser DevTools and run:');
console.log('');
console.log('  document.querySelectorAll(\'[href*="remmar"]\').forEach(link => {');
console.log('    console.log("Link href:", link.getAttribute("href"));');
console.log('    console.log("Full URL:", link.href);');
console.log('  });');
console.log('');
console.log('Expected output: Should show the exact slug being used');
console.log('');

// Step 2: Check the API with that slug
console.log('\n📍 STEP 2: Test API with Current Running Server');
console.log('-'.repeat(80));
console.log('Run these commands in your terminal:');
console.log('');
console.log('  # Test with various slug formats');
console.log('  curl "http://localhost:3000/api/property/remmarholmen?lang=fi" | jq \'.\'');
console.log('  curl "http://localhost:3000/api/property/Remmarholmen?lang=fi" | jq \'.\'');
console.log('  curl "http://localhost:3000/api/property/remmarholmen-1?lang=fi" | jq \'.\'');
console.log('');
console.log('Look for:');
console.log('  ✓ success: true  → Property found');
console.log('  ✗ success: false, error: "NOT_FOUND" → Property not in cache');
console.log('');

// Step 3: Check server console logs
console.log('\n📍 STEP 3: Check Server Console Logs');
console.log('-'.repeat(80));
console.log('In your terminal where `npm run dev` is running, look for:');
console.log('');
console.log('  🔍 Slug resolution: {');
console.log('    rawSlug: "remmarholmen",');
console.log('    normalizedSlug: "remmarholmen",');
console.log('    resolvedSlug: "remmarholmen-1"  // or whatever alias maps to');
console.log('  }');
console.log('');
console.log('Then look for cache lookup logs:');
console.log('  [ListingsCache] getMultilingualListingBySlug called with: ...');
console.log('');

// Step 4: Check what's actually in the cache
console.log('\n📍 STEP 4: Inspect Cache Contents');
console.log('-'.repeat(80));
console.log('Open browser console and run:');
console.log('');
console.log('  fetch("/api/homepage").then(r => r.json()).then(data => {');
console.log('    const remmar = data.listings?.find(p =>');
console.log('      p.title?.toLowerCase().includes("remmar") ||');
console.log('      p.slug?.toLowerCase().includes("remmar")');
console.log('    );');
console.log('    console.log("Found property:", remmar);');
console.log('    if (remmar) {');
console.log('      console.log("  Title:", remmar.title);');
console.log('      console.log("  Slug:", remmar.slug);');
console.log('      console.log("  ID:", remmar.id);');
console.log('    }');
console.log('  });');
console.log('');

// Step 5: Common issues and solutions
console.log('\n📍 STEP 5: Common Issues & Quick Fixes');
console.log('-'.repeat(80));
console.log('');
console.log('❌ ISSUE A: Property slug doesn\'t match alias');
console.log('   Symptom: Homepage shows "Remmarholmen" but API expects "remmarholmen-1"');
console.log('   Solution: Update src/config/property-aliases.json with correct slug');
console.log('');
console.log('❌ ISSUE B: Cache not initialized');
console.log('   Symptom: API logs show "getMultilingualListingBySlug" returns null');
console.log('   Solution: Restart dev server (cache loads on startup)');
console.log('');
console.log('❌ ISSUE C: Case sensitivity');
console.log('   Symptom: "Remmarholmen" works but "remmarholmen" doesn\'t');
console.log('   Solution: normalizeSlug function should fix this (already implemented)');
console.log('');
console.log('❌ ISSUE D: Alias file not loaded');
console.log('   Symptom: Logs show resolvedSlug === normalizedSlug (no alias applied)');
console.log('   Solution: Check JSON import in route.ts, restart server');
console.log('');

// Step 6: Quick fix commands
console.log('\n📍 STEP 6: Quick Fix Commands');
console.log('-'.repeat(80));
console.log('');
console.log('# Fix 1: Restart dev server (loads aliases + cache)');
console.log('killall node && cd apps/next-front && npm run dev');
console.log('');
console.log('# Fix 2: Check if property exists at all');
console.log('curl "http://localhost:3000/api/homepage" | jq \'.listings[] | select(.title | contains("Remmar"))\'');
console.log('');
console.log('# Fix 3: Test all possible slug variations');
console.log('for slug in remmarholmen Remmarholmen remmarholmen-1 Remmarholmen-1; do');
console.log('  echo "Testing: $slug"');
console.log('  curl -s "http://localhost:3000/api/property/$slug?lang=fi" | jq -r ".success // .error"');
console.log('done');
console.log('');

console.log('\n' + '='.repeat(80));
console.log('✅ NEXT STEPS:');
console.log('');
console.log('1. Run the curl commands above to see if API responds');
console.log('2. Check the server console for "🔍 Slug resolution" logs');
console.log('3. Run browser console commands to see exact slug being used');
console.log('4. Once you find the actual slug, update property-aliases.json');
console.log('5. Restart the dev server');
console.log('');
console.log('Report back with:');
console.log('  • What slug does the homepage link to?');
console.log('  • What does the API return for that slug?');
console.log('  • What do the server logs show?');
console.log('');
console.log('=' + '='.repeat(79) + '\n');

