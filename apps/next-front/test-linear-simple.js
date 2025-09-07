#!/usr/bin/env node

/**
 * Linear.fi API Simple Test - JavaScript Version
 * Tests basic API connection without TypeScript compilation
 */

// Load environment variables
require('dotenv').config();

async function testLinearConnection() {
  console.log('🚀 Linear.fi API Simple Connection Test\n');
  
  // Check environment variables
  if (!process.env.LINEAR_API_KEY) {
    console.error('❌ Error: LINEAR_API_KEY environment variable not set');
    console.log('💡 Add your Linear API key to .env.local:');
    console.log('   LINEAR_API_KEY=your_api_key_here');
    return false;
  }

  console.log('🔑 API Key found:', process.env.LINEAR_API_KEY.substring(0, 10) + '...');
  console.log('🌐 API URL:', process.env.LINEAR_API_URL || 'https://api.linear.fi/v1');
  console.log('\n' + '='.repeat(50) + '\n');

  const baseUrl = process.env.LINEAR_API_URL || 'https://api.linear.fi/v1';
  const apiKey = process.env.LINEAR_API_KEY;

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Sothebys-Linear-Integration/1.0',
    'Accept': 'application/json',
  };

  try {
    // Test 1: Health check
    console.log('1. 🔍 Testing API health endpoint...');
    try {
      const healthResponse = await fetch(`${baseUrl}/health`, { headers });
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('✅ Health check passed:', healthData);
      } else {
        console.log('⚠️ Health endpoint returned:', healthResponse.status, healthResponse.statusText);
      }
    } catch (error) {
      console.log('⚠️ Health endpoint not available (this might be normal)');
    }

    // Test 2: API Info
    console.log('\n2. 📊 Testing API info endpoint...');
    try {
      const infoResponse = await fetch(`${baseUrl}/info`, { headers });
      if (infoResponse.ok) {
        const infoData = await infoResponse.json();
        console.log('✅ API Info:', infoData);
      } else {
        console.log('⚠️ API info endpoint returned:', infoResponse.status, infoResponse.statusText);
      }
    } catch (error) {
      console.log('⚠️ API info endpoint not available (this might be normal)');
    }

    // Test 3: Properties endpoint
    console.log('\n3. 🏠 Testing properties endpoint...');
    try {
      const propertiesResponse = await fetch(`${baseUrl}/kohteet?limit=1`, { headers });
      console.log('Properties response status:', propertiesResponse.status, propertiesResponse.statusText);
      
      if (propertiesResponse.ok) {
        const propertiesData = await propertiesResponse.json();
        console.log('✅ Properties endpoint working! Found data:', {
          dataType: typeof propertiesData,
          hasData: propertiesData && propertiesData.data,
          dataLength: propertiesData.data ? propertiesData.data.length : 'unknown'
        });
      } else if (propertiesResponse.status === 401) {
        console.log('❌ Authentication failed - check your API key');
        return false;
      } else if (propertiesResponse.status === 404) {
        console.log('⚠️ Properties endpoint not found - check API URL or endpoint path');
      } else {
        const errorText = await propertiesResponse.text();
        console.log('⚠️ Properties endpoint error:', errorText);
      }
    } catch (error) {
      console.log('❌ Network error accessing properties:', error.message);
      return false;
    }

    // Test 4: Agents endpoint
    console.log('\n4. 👥 Testing agents endpoint...');
    try {
      const agentsResponse = await fetch(`${baseUrl}/agentit?limit=1`, { headers });
      console.log('Agents response status:', agentsResponse.status, agentsResponse.statusText);
      
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json();
        console.log('✅ Agents endpoint working! Found data:', {
          dataType: typeof agentsData,
          hasData: agentsData && agentsData.data,
          dataLength: agentsData.data ? agentsData.data.length : 'unknown'
        });
      } else if (agentsResponse.status === 404) {
        console.log('⚠️ Agents endpoint not found - this might be normal');
      }
    } catch (error) {
      console.log('⚠️ Error accessing agents endpoint:', error.message);
    }

    console.log('\n🎉 Basic connectivity test completed!');
    console.log('\n📝 Next steps:');
    console.log('1. If you see 401 errors, check your LINEAR_API_KEY');
    console.log('2. If you see 404 errors, verify the API endpoints with Linear.fi documentation');
    console.log('3. If connectivity works, you can proceed with the full integration');
    
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
testLinearConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  }); 