#!/usr/bin/env node

/**
 * Build Guard: Assert Locale Routes Prerendered
 * 
 * Per spec: "Make it impossible to 404 locales"
 * This script runs after build and verifies that all locale routes exist.
 * Breaks the build if locale routes are missing.
 * 
 * Usage:
 *   npm run build && node scripts/assert-locales.js
 * 
 * Or add to package.json:
 *   "postbuild": "node scripts/assert-locales.js"
 */

const fs = require('fs');
const path = require('path');

const LOCALES = ['fi', 'sv', 'en'];
const OUT_DIR = path.join(__dirname, '../.next');

/**
 * Check if a file or directory exists
 */
function exists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Find all .html files recursively in a directory
 */
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Main validation
 */
function main() {
  console.log('🔍 [Build Guard] Checking locale prerendering...\n');
  
  // Check if .next directory exists
  if (!exists(OUT_DIR)) {
    console.error('❌ [Build Guard] .next directory not found!');
    console.error('   Run "npm run build" first.');
    process.exit(1);
  }
  
  // Check server pages directory
  const serverPagesDir = path.join(OUT_DIR, 'server/pages');
  if (!exists(serverPagesDir)) {
    console.error('❌ [Build Guard] server/pages directory not found!');
    process.exit(1);
  }
  
  let errors = [];
  let warnings = [];
  
  // Critical routes that MUST exist for each locale
  const criticalRoutes = [
    '', // Homepage (/)
    '/kohteet', // Properties list
  ];
  
  // Check each locale
  LOCALES.forEach(locale => {
    console.log(`\n📍 Checking locale: ${locale}`);
    
    const localeDir = path.join(serverPagesDir, locale);
    
    if (!exists(localeDir)) {
      errors.push(`Locale directory missing: ${locale}`);
      console.error(`  ❌ Directory not found: ${localeDir}`);
      return;
    }
    
    // Check critical routes
    criticalRoutes.forEach(route => {
      const routePath = route === '' ? 'index.html' : `${route.slice(1)}.html`;
      const fullPath = path.join(localeDir, routePath);
      
      if (!exists(fullPath)) {
        errors.push(`Missing route for ${locale}: ${route || '/'}`);
        console.error(`  ❌ Missing: ${route || '/'}`);
      } else {
        console.log(`  ✅ Found: ${route || '/'}`);
      }
    });
    
    // Count total HTML files for this locale
    const htmlFiles = findHtmlFiles(localeDir);
    console.log(`  📄 Total pages: ${htmlFiles.length}`);
    
    if (htmlFiles.length === 0) {
      warnings.push(`No HTML files found for locale: ${locale}`);
    }
  });
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Build Guard Summary\n');
  
  if (errors.length === 0) {
    console.log('✅ All locale routes are properly prerendered!');
    console.log(`✅ ${LOCALES.length} locales validated: ${LOCALES.join(', ')}`);
    
    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      warnings.forEach(w => console.log(`   - ${w}`));
    }
    
    console.log('\n🎉 Build Guard: PASSED\n');
    process.exit(0);
  } else {
    console.error('❌ Locale prerendering validation FAILED!\n');
    console.error('Errors:');
    errors.forEach(e => console.error(`   - ${e}`));
    
    console.error('\n💡 Fix by ensuring:');
    console.error('   1. All locale pages have generateStaticParams()');
    console.error('   2. dynamic="force-static" is set');
    console.error('   3. dynamicParams=false is set');
    console.error('   4. Build completes without errors');
    
    console.error('\n❌ Build Guard: FAILED\n');
    process.exit(1);
  }
}

// Run
try {
  main();
} catch (error) {
  console.error('❌ [Build Guard] Unexpected error:', error.message);
  process.exit(1);
}
