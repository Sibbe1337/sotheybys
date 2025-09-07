#!/usr/bin/env node

/**
 * Linear API Real Test - Using actual Linear API endpoints
 * Based on information from Kalle Harjunpää, Linear Country Manager
 * 
 * API Documentation: https://linear-external-api.azurewebsites.net/api#/
 * Recommended endpoints:
 * - v2/listings/performance (once per night, all objects)
 * - v2/listings/update (every 5 minutes, updated/deleted objects)
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

async function testLinearRealAPI() {
  console.log('🚀 Linear API Real Connection Test');
  console.log('📧 Based on information from Kalle Harjunpää\n');
  
  // Check environment variables
  if (!process.env.LINEAR_API_KEY) {
    console.error('❌ Error: LINEAR_API_KEY environment variable not set');
    return false;
  }

  if (!process.env.LINEAR_COMPANY_ID) {
    console.error('❌ Error: LINEAR_COMPANY_ID environment variable not set');
    return false;
  }

  console.log('🔑 API Key found:', process.env.LINEAR_API_KEY.substring(0, 20) + '...');
  console.log('🌐 API URL:', process.env.LINEAR_API_URL);
  console.log('🏢 Company ID:', process.env.LINEAR_COMPANY_ID);
  console.log('\n' + '='.repeat(60) + '\n');

  const baseUrl = process.env.LINEAR_API_URL;
  const apiKey = process.env.LINEAR_API_KEY;
  const companyId = process.env.LINEAR_COMPANY_ID;

  const headers = {
    'Authorization': `${apiKey}`, // Linear API format: "LINEAR-API-KEY <key>" (no Bearer)
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    // Test 1: API Root/Health
    console.log('1. 🔍 Testing API root endpoint...');
    try {
      const rootResponse = await fetch(`${baseUrl}`, { headers });
      console.log('API root response status:', rootResponse.status, rootResponse.statusText);
      
      if (rootResponse.ok) {
        const rootData = await rootResponse.text();
        console.log('✅ API root accessible');
        if (rootData.length > 0 && rootData.length < 500) {
          console.log('Response preview:', rootData.substring(0, 200));
        }
      }
    } catch (error) {
      console.log('⚠️ API root endpoint error:', error.message);
    }

    // Test 2: Performance Endpoint (recommended once per night)
    console.log('\n2. 🏠 Testing v2/listings/performance endpoint (all objects)...');
    try {
      const performanceUrl = `${baseUrl}/v2/listings/performance`;
      console.log('Request URL:', performanceUrl);
      
      const performanceResponse = await fetch(performanceUrl, { 
        headers: {
          ...headers,
          'X-Company-Id': companyId
        }
      });
      
      console.log('Performance response status:', performanceResponse.status, performanceResponse.statusText);
      
      if (performanceResponse.ok) {
        const performanceData = await performanceResponse.json();
        console.log('✅ Performance endpoint working!');
        console.log('Response type:', typeof performanceData);
        
        if (Array.isArray(performanceData)) {
          console.log('📊 Found', performanceData.length, 'listings');
          if (performanceData.length > 0) {
            console.log('📋 First listing preview:', {
              id: performanceData[0].id || 'N/A',
              title: performanceData[0].title || performanceData[0].name || 'N/A',
              price: performanceData[0].price || 'N/A',
              city: performanceData[0].city || performanceData[0].location || 'N/A'
            });
          }
        } else if (performanceData && typeof performanceData === 'object') {
          console.log('📊 Response object keys:', Object.keys(performanceData));
          if (performanceData.data && Array.isArray(performanceData.data)) {
            console.log('📊 Found', performanceData.data.length, 'listings in data array');
          }
        }
      } else if (performanceResponse.status === 401) {
        console.log('❌ Authentication failed - check API key');
        return false;
      } else if (performanceResponse.status === 403) {
        console.log('❌ Access forbidden - check company ID or permissions');
        return false;
      } else {
        const errorText = await performanceResponse.text();
        console.log('⚠️ Performance endpoint error:', errorText.substring(0, 300));
      }
    } catch (error) {
      console.log('❌ Network error accessing performance endpoint:', error.message);
    }

    // Test 3: Update Endpoint (recommended every 5 minutes)
    console.log('\n3. 🔄 Testing v2/listings/update endpoint (updated objects)...');
    try {
      const updateUrl = `${baseUrl}/v2/listings/update`;
      console.log('Request URL:', updateUrl);
      
      const updateResponse = await fetch(updateUrl, { 
        headers: {
          ...headers,
          'X-Company-Id': companyId
        }
      });
      
      console.log('Update response status:', updateResponse.status, updateResponse.statusText);
      
      if (updateResponse.ok) {
        const updateData = await updateResponse.json();
        console.log('✅ Update endpoint working!');
        console.log('Response type:', typeof updateData);
        
        if (Array.isArray(updateData)) {
          console.log('📊 Found', updateData.length, 'updated listings');
        } else if (updateData && typeof updateData === 'object') {
          console.log('📊 Update response keys:', Object.keys(updateData));
          if (updateData.updated && Array.isArray(updateData.updated)) {
            console.log('📊 Updated listings:', updateData.updated.length);
          }
          if (updateData.deleted && Array.isArray(updateData.deleted)) {
            console.log('📊 Deleted listings:', updateData.deleted.length);
          }
        }
      } else {
        const errorText = await updateResponse.text();
        console.log('⚠️ Update endpoint error:', errorText.substring(0, 300));
      }
    } catch (error) {
      console.log('❌ Network error accessing update endpoint:', error.message);
    }

    // Test 4: Check if there are other available endpoints
    console.log('\n4. 🔍 Testing other common endpoints...');
    
    const testEndpoints = [
      '/v2/listings',
      '/listings',
      '/companies',
      '/agents',
      '/v1/listings'
    ];

    for (const endpoint of testEndpoints) {
      try {
        const testUrl = `${baseUrl}${endpoint}`;
        const testResponse = await fetch(testUrl, { 
          headers: {
            ...headers,
            'X-Company-Id': companyId
          }
        });
        
        console.log(`   ${endpoint}: ${testResponse.status} ${testResponse.statusText}`);
        
        if (testResponse.ok) {
          console.log(`   ✅ ${endpoint} is available`);
        }
      } catch (error) {
        console.log(`   ❌ ${endpoint}: ${error.message}`);
      }
    }

    console.log('\n🎉 Linear API connectivity test completed!');
    console.log('\n📝 Summary and Next Steps:');
    console.log('• Use v2/listings/performance for full data sync (once per night)');
    console.log('• Use v2/listings/update for incremental updates (every 5 minutes)');
    console.log('• API Documentation: https://linear-external-api.azurewebsites.net/api#/');
    console.log('• Contact Kalle Harjunpää for production credentials when ready');
    
    return true;

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return false;
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Run the test
testLinearRealAPI()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  }); 