#!/usr/bin/env node

/**
 * Linear.fi API Test Runner
 * Simple script to test Linear API connection
 */

// Load environment variables
require('dotenv').config();

const { runAllLinearApiTests, quickTest } = require('./src/lib/test-linear-api.ts');

async function main() {
  console.log('🚀 Linear.fi API Test Runner\n');
  
  // Check environment variables
  if (!process.env.LINEAR_API_KEY) {
    console.error('❌ Error: LINEAR_API_KEY environment variable not set');
    console.log('💡 Add your Linear API key to .env.local:');
    console.log('   LINEAR_API_KEY=your_api_key_here');
    process.exit(1);
  }

  if (!process.env.LINEAR_API_URL) {
    console.log('ℹ️  LINEAR_API_URL not set, using default: https://api.linear.fi/v1');
  }

  console.log('🔑 API Key found:', process.env.LINEAR_API_KEY.substring(0, 10) + '...');
  console.log('🌐 API URL:', process.env.LINEAR_API_URL || 'https://api.linear.fi/v1');
  console.log('\n' + '='.repeat(60) + '\n');

  try {
    // Run quick connection test first
    console.log('⚡ Quick connection test...');
    const connectionTest = await quickTest.connection();
    
    if (!connectionTest) {
      console.error('❌ Quick connection test failed');
      process.exit(1);
    }
    
    console.log('✅ Quick connection test passed!\n');
    
    // Run full test suite
    const results = await runAllLinearApiTests();
    
    // Exit with appropriate code
    const allPassed = Object.values(results).every(result => result);
    process.exit(allPassed ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Test runner failed:', error.message);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Run the main function
main(); 