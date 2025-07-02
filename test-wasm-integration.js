#!/usr/bin/env node

// Test WASM SDK integration
async function testWasmIntegration() {
  console.log('Testing WASM SDK integration...\n');
  
  try {
    // Test loading the WASM module directly
    console.log('1. Loading WASM module...');
    const wasm = await import('./src/wasm/wasm_sdk/wasm_sdk.js');
    await wasm.default();
    console.log('✅ WASM module loaded successfully');
    
    // Test creating SDK builder
    console.log('\n2. Creating SDK builder...');
    const builder = wasm.WasmSdkBuilder.new_testnet();
    console.log('✅ SDK builder created');
    
    // Test building SDK
    console.log('\n3. Building SDK instance...');
    const sdk = builder.build();
    console.log('✅ SDK instance created');
    
    // Test available functions
    console.log('\n4. Available WASM functions:');
    const functions = Object.keys(wasm).filter(key => typeof wasm[key] === 'function');
    console.log(`   Found ${functions.length} functions`);
    console.log('   Sample functions:', functions.slice(0, 10).join(', '));
    
    // Test mnemonic generation
    console.log('\n5. Testing mnemonic generation...');
    const mnemonic = wasm.generateMnemonic();
    console.log('✅ Generated mnemonic:', mnemonic.split(' ').slice(0, 3).join(' ') + '...');
    
    console.log('\n✅ All tests passed! WASM SDK is ready to use.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the test
testWasmIntegration();