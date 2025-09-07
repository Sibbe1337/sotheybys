/**
 * Linear.fi API Test Script
 * Test the Linear API connection and basic functionality
 */

import linearApi from './linear-api';

export async function testLinearApiConnection() {
  console.log('🔍 Testing Linear.fi API connection...');
  
  try {
    // Test basic connection
    console.log('1. Testing API connection...');
    const isConnected = await linearApi.testConnection();
    
    if (!isConnected) {
      throw new Error('Failed to connect to Linear API');
    }
    console.log('✅ API connection successful');

    // Test API info
    console.log('2. Getting API information...');
    const apiInfo = await linearApi.getApiInfo();
    console.log('✅ API Info:', apiInfo.data);

    // Test properties endpoint
    console.log('3. Testing properties endpoint...');
    const properties = await linearApi.getProperties({ limit: 5 });
    console.log(`✅ Properties endpoint working - found ${properties.data.length} properties`);

    // Test featured properties
    console.log('4. Testing featured properties...');
    const featured = await linearApi.getFeaturedProperties(3);
    console.log(`✅ Featured properties working - found ${featured.data.length} featured properties`);

    // Test agents endpoint
    console.log('5. Testing agents endpoint...');
    const agents = await linearApi.getAgents();
    console.log(`✅ Agents endpoint working - found ${agents.data.length} agents`);

    // Test property types
    console.log('6. Testing property types...');
    const types = await linearApi.getPropertyTypes();
    console.log('✅ Property types:', types.data);

    // Test cities
    console.log('7. Testing cities...');
    const cities = await linearApi.getCities();
    console.log(`✅ Cities endpoint working - found ${cities.data.length} cities`);

    console.log('🎉 All Linear API tests passed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Linear API test failed:', error);
    return false;
  }
}

export async function testLinearApiSearch() {
  console.log('🔍 Testing Linear.fi API search functionality...');
  
  try {
    // Test basic search
    console.log('1. Testing basic property search...');
    const searchResults = await linearApi.searchProperties('Helsinki', {
      propertyType: 'kerrostalo',
      minPrice: 200000,
      maxPrice: 500000,
      minRooms: 2,
      limit: 10
    });
    console.log(`✅ Search working - found ${searchResults.data.length} properties in Helsinki`);

    // Test specific property retrieval
    if (searchResults.data.length > 0) {
      const firstProperty = searchResults.data[0];
      console.log('2. Testing single property retrieval...');
      
      const property = await linearApi.getProperty(firstProperty.id);
      console.log(`✅ Property details retrieved for: ${property.data.title}`);

      // Test property images
      console.log('3. Testing property images...');
      const images = await linearApi.getPropertyImages(firstProperty.id);
      console.log(`✅ Property images - found ${images.data.length} images`);
    }

    console.log('🎉 All Linear API search tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Linear API search test failed:', error);
    return false;
  }
}

export async function testLinearApiLeads() {
  console.log('🔍 Testing Linear.fi API leads functionality...');
  
  try {
    // Test get leads
    console.log('1. Testing get leads...');
    const leads = await linearApi.getLeads();
    console.log(`✅ Leads endpoint working - found ${leads.data.length} leads`);

    // Test create lead (with dummy data)
    console.log('2. Testing create lead...');
    const newLead = await linearApi.createLead({
      propertyId: 'test-property-id',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+358 40 123 4567',
      message: 'Test inquiry from API integration',
      leadType: 'inquiry',
      status: 'new',
      source: 'sothebys-website'
    });
    console.log('✅ Lead created successfully:', newLead.data.id);

    // Test update lead
    if (newLead.data.id) {
      console.log('3. Testing update lead...');
      const updatedLead = await linearApi.updateLead(newLead.data.id, {
        status: 'contacted'
      });
      console.log('✅ Lead updated successfully');
    }

    console.log('🎉 All Linear API leads tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Linear API leads test failed:', error);
    return false;
  }
}

// Main test runner
export async function runAllLinearApiTests() {
  console.log('🚀 Starting comprehensive Linear.fi API tests...\n');

  const results = {
    connection: false,
    search: false,
    leads: false
  };

  // Run connection tests
  results.connection = await testLinearApiConnection();
  console.log('\n' + '='.repeat(50) + '\n');

  // Run search tests
  results.search = await testLinearApiSearch();
  console.log('\n' + '='.repeat(50) + '\n');

  // Run leads tests
  results.leads = await testLinearApiLeads();
  console.log('\n' + '='.repeat(50) + '\n');

  // Summary
  console.log('📊 Test Results Summary:');
  console.log(`Connection Tests: ${results.connection ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Search Tests: ${results.search ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Leads Tests: ${results.leads ? '✅ PASSED' : '❌ FAILED'}`);

  const allPassed = Object.values(results).every(result => result);
  console.log(`\nOverall Result: ${allPassed ? '🎉 ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED'}`);

  return results;
}

// Export for use in debugging
export { linearApi };

// Quick test functions for development
export const quickTest = {
  connection: () => linearApi.testConnection(),
  properties: () => linearApi.getProperties({ limit: 1 }),
  agents: () => linearApi.getAgents(),
  search: (city: string) => linearApi.searchProperties(city, { limit: 5 })
}; 