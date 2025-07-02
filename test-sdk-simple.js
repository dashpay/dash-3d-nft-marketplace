#!/usr/bin/env node

/**
 * Simple test for SDK import without WASM
 * This tests if our wrapper compiles and can be imported
 */

async function testSDKImport() {
  console.log('🧪 Testing SDK Import...\n');

  try {
    // Test 1: Import the SDK wrapper
    console.log('1️⃣ Testing SDK wrapper import...');
    const { createDashSDK } = await import('./src/lib/dash-sdk-wrapper.ts');
    console.log('✅ SDK wrapper imported successfully');

    // Test 2: Create SDK instance
    console.log('2️⃣ Testing SDK instance creation...');
    const sdk = createDashSDK({
      network: 'testnet'
    });
    console.log('✅ SDK instance created successfully');

    // Test 3: Check SDK properties
    console.log('3️⃣ Testing SDK properties...');
    console.log('   - Network:', sdk.getNetwork());
    console.log('   - Initialized:', sdk.isInitialized());
    console.log('✅ SDK properties accessible');

    console.log('\n🎉 All import tests passed!');
    console.log('\nNote: Actual functionality requires WASM build');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testSDKImport().catch(console.error);
}

module.exports = { testSDKImport };