#!/usr/bin/env node

/**
 * Field Validation Report Generator
 * Analyzes all properties and reports field completeness
 */

const PDX_REQUIRED_FIELDS = [
  // Hero/Basic (8 fields)
  'streetAddress', 'postalCode', 'city', 'region', 'apartmentType', 
  'ownershipType', 'floorLocation', 'numberOfFloors',
  
  // Price Info (9 fields)
  'salesPrice', 'debtPart', 'unencumberedSalesPrice', 'maintenanceFee',
  'financingFee', 'totalFee', 'waterFee', 'propertyTax', 'paymentMethod',
  
  // Energy (3 fields)
  'energyClass', 'energyCertificate', 'heatingSystem',
  
  // Building (6 fields)
  'buildingMaterial', 'roofType', 'condition', 'sauna', 'balcony', 'yearOfBuilding',
  
  // Property/Site (7 fields)
  'siteArea', 'siteOwnershipType', 'zoningSituation', 'buildingRights',
  'propertyId', 'leaseTerm', 'annualLease',
  
  // Housing Company (6 fields)
  'housingCompanyName', 'businessId', 'managerName', 'propertyMaintenance',
  'numberOfShares', 'redemptionClauseFlats',
  
  // Equipment (4 fields)
  'kitchenEquipment', 'bathroomEquipment', 'floorMaterial', 'storageSpace',
  
  // Location (3 fields)
  'windowDirection', 'services', 'beachRights',
  
  // Media (4 fields)
  'photoUrls', 'floorPlanUrl', 'brochureUrl', 'videoUrl',
  
  // Agent (4 fields)
  'estateAgentName', 'estateAgentPhone', 'estateAgentEmail', 'listingOffice'
];

async function generateReport() {
  try {
    // Fetch all listings from API
    const apiUrl = process.argv[2] || process.env.API_URL || 'https://next-front-lzmrq6h4m-kodaren1338-gmailcoms-projects.vercel.app/api/listings?lang=fi';
    
    console.log(`📊 Fetching listings from: ${apiUrl}\n`);
    
    const response = await fetch(apiUrl);
    const result = await response.json();
    const listings = result.data || [];
    
    console.log(`✅ Found ${listings.length} properties\n`);
    console.log('═'.repeat(80));
    console.log('\n📋 FIELD COMPLETENESS REPORT\n');
    console.log('═'.repeat(80));
    
    // Analyze each property
    const propertyReports = listings.map(property => {
      const populated = PDX_REQUIRED_FIELDS.filter(field => {
        const value = property[field];
        if (value === null || value === undefined || value === '') return false;
        if (typeof value === 'object' && Object.keys(value).length === 0) return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      });
      
      const missing = PDX_REQUIRED_FIELDS.filter(field => {
        const value = property[field];
        if (value === null || value === undefined || value === '') return true;
        if (typeof value === 'object' && Object.keys(value).length === 0) return true;
        if (Array.isArray(value) && value.length === 0) return true;
        return false;
      });
      
      const coverage = Math.round((populated.length / PDX_REQUIRED_FIELDS.length) * 100);
      
      return {
        address: property.streetAddress || 'Unknown',
        city: property.city || '',
        populated: populated.length,
        missing: missing.length,
        coverage,
        missingFields: missing,
        property
      };
    });
    
    // Sort by coverage (best first)
    propertyReports.sort((a, b) => b.coverage - a.coverage);
    
    // Print summary
    propertyReports.forEach((report, index) => {
      const coverageBar = '█'.repeat(Math.floor(report.coverage / 5)) + '░'.repeat(20 - Math.floor(report.coverage / 5));
      console.log(`\n${index + 1}. ${report.address}, ${report.city}`);
      console.log(`   Coverage: ${coverageBar} ${report.coverage}% (${report.populated}/${PDX_REQUIRED_FIELDS.length})`);
      if (report.missing > 0 && report.missing <= 10) {
        console.log(`   Missing: ${report.missingFields.slice(0, 5).join(', ')}${report.missingFields.length > 5 ? '...' : ''}`);
      }
    });
    
    // Print statistics
    const avgCoverage = Math.round(propertyReports.reduce((sum, r) => sum + r.coverage, 0) / propertyReports.length);
    const bestProperty = propertyReports[0];
    const worstProperty = propertyReports[propertyReports.length - 1];
    
    console.log('\n' + '═'.repeat(80));
    console.log('\n📈 STATISTICS\n');
    console.log(`Average Coverage: ${avgCoverage}%`);
    console.log(`Best Property: ${bestProperty.address} (${bestProperty.coverage}%)`);
    console.log(`Worst Property: ${worstProperty.address} (${worstProperty.coverage}%)`);
    console.log(`Total Properties: ${listings.length}`);
    console.log(`Total Fields: ${PDX_REQUIRED_FIELDS.length}`);
    
    // Count field usage across all properties
    console.log('\n' + '═'.repeat(80));
    console.log('\n🔍 FIELD USAGE ACROSS ALL PROPERTIES\n');
    
    const fieldUsage = {};
    PDX_REQUIRED_FIELDS.forEach(field => {
      const count = listings.filter(p => {
        const value = p[field];
        if (value === null || value === undefined || value === '') return false;
        if (typeof value === 'object' && Object.keys(value).length === 0) return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      }).length;
      
      fieldUsage[field] = {
        count,
        percentage: Math.round((count / listings.length) * 100)
      };
    });
    
    // Show least populated fields (opportunities for improvement)
    const leastPopulated = Object.entries(fieldUsage)
      .sort((a, b) => a[1].count - b[1].count)
      .slice(0, 10);
    
    console.log('❌ Least Populated Fields (Top 10):');
    leastPopulated.forEach(([field, stats]) => {
      const bar = '█'.repeat(Math.floor(stats.percentage / 5)) + '░'.repeat(20 - Math.floor(stats.percentage / 5));
      console.log(`   ${field.padEnd(25)} ${bar} ${stats.percentage}% (${stats.count}/${listings.length})`);
    });
    
    console.log('\n' + '═'.repeat(80));
    console.log('\n✅ Report generated successfully!\n');
    
  } catch (error) {
    console.error('❌ Error generating report:', error);
    process.exit(1);
  }
}

generateReport();

