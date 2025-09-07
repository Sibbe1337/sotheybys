#!/usr/bin/env node

/**
 * Linear API Test - Using actual Linear API endpoints
 * Based on documentation from Linear support
 */

require('dotenv').config({ path: '.env.local' });

async function testLinearAPI() {
  console.log('🚀 Linear API Connection Test');
  console.log('📧 Documentation: https://ca-externalapi-test-weu-001.livelyrock-4a193af6.westeurope.azurecontainerapps.io/api#/\n');
  
  const apiKey = process.env.LINEAR_API_KEY;
  const companyId = process.env.LINEAR_COMPANY_ID;
  const baseUrl = process.env.LINEAR_API_URL;

  console.log('🔑 API Key:', apiKey?.substring(0, 30) + '...');
  console.log('🏢 Company ID:', companyId);
  console.log('🌐 Base URL:', baseUrl);
  console.log('\n' + '='.repeat(60) + '\n');

  // Test with the test API key first
  const testApiKey = 'LINEAR-API-KEY 086bc46d-da01-444b-86b3-50710d4c5cf5';
  
  try {
    console.log('1. Testing with test API key...');
    const testResponse = await fetch(`${baseUrl}/v2/listings?languages[]=fi`, {
      headers: {
        'authorization': testApiKey,
        'Accept': 'application/json',
      }
    });

    console.log('Test API Response Status:', testResponse.status);
    
    if (testResponse.ok) {
      const data = await testResponse.json();
      console.log('✅ Test API working! Found', Array.isArray(data) ? data.length : 0, 'listings');
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('\nSample listing structure:');
        const sample = data[0];
        console.log('- ID:', sample.id);
        console.log('- Name:', sample.name?.fi);
        console.log('- Address:', sample.address?.fi);
        console.log('- City:', sample.city?.fi);
        console.log('- Price:', sample.askPrice?.fi?.value);
      }
    }
  } catch (error) {
    console.error('❌ Test API Error:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test with Snellman Sotheby's API key
  try {
    console.log('2. Testing with Snellman Sotheby\'s API key...');
    
    // Try /v2/listings endpoint
    const listingsResponse = await fetch(`${baseUrl}/v2/listings?languages[]=fi&company_id=${companyId}`, {
      headers: {
        'authorization': apiKey,
        'Accept': 'application/json',
      }
    });

    console.log('Listings Response Status:', listingsResponse.status);
    const listingsData = await listingsResponse.json();
    
    if (listingsResponse.ok && Array.isArray(listingsData)) {
      console.log('✅ Found', listingsData.length, 'listings for company', companyId);
    } else {
      console.log('Response:', JSON.stringify(listingsData, null, 2));
    }

    // Try /performance endpoint
    console.log('\n3. Testing /performance endpoint...');
    const perfResponse = await fetch(`${baseUrl}/v2/listings/performance?company_id=${companyId}&languages[]=fi`, {
      headers: {
        'authorization': apiKey,
        'Accept': 'application/json',
      }
    });

    console.log('Performance Response Status:', perfResponse.status);
    const perfData = await perfResponse.json();
    
    if (perfResponse.ok) {
      console.log('✅ Performance endpoint response:', JSON.stringify(perfData).substring(0, 200) + '...');
    } else {
      console.log('Response:', JSON.stringify(perfData, null, 2));
    }

  } catch (error) {
    console.error('❌ Snellman API Error:', error.message);
  }

  console.log('\n📝 Summary:');
  console.log('- Use /v2/listings/performance for nightly full sync');
  console.log('- Use /v2/listings/updated for continuous updates (every 10 min)');
  console.log('- Note: Snellman listings might not be activated for website publishing yet');
}

// Run the test
testLinearAPI().catch(console.error);
