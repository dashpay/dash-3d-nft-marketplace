// Use the actual WASM SDK from our project
import { loadWasmSdk } from '@/dash-sdk-src/core/WasmLoader';

// Function to test basic WASM SDK connectivity
export async function testWasmConnection() {
  console.log('=== Starting WASM SDK Connection Test ===\n');

  try {
    // Step 1: Load WASM module
    console.log('1. Loading WASM module...');
    const wasm = await loadWasmSdk();
    console.log('✓ WASM module loaded successfully');
    console.log('Available functions:', Object.keys(wasm).filter(k => typeof wasm[k] === 'function').slice(0, 20));
    
    // Step 2: Create SDK Builder
    console.log('\n2. Creating WASM SDK builder...');
    if (!wasm.WasmSdkBuilder) {
      throw new Error('WasmSdkBuilder not found in WASM module');
    }
    
    const builder = wasm.WasmSdkBuilder.new_testnet();
    console.log('✓ Builder created');
    console.log('Builder methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(builder || {})));
    
    // Step 3: Build SDK
    console.log('\n3. Building SDK instance...');
    const sdk = builder.build();
    console.log('✓ SDK built successfully');
    console.log('SDK type:', sdk?.constructor?.name);
    
    // Step 4: Test basic operations
    console.log('\n4. Testing basic operations...');
    await testBasicOperations(wasm, sdk);

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }

  console.log('\n=== Test Complete ===');
}

async function testBasicOperations(wasm: any, sdk: any) {
  try {
    // Test 1: Check if we can get current epoch
    if (typeof wasm.getCurrentEpoch === 'function') {
      console.log('\nTesting getCurrentEpoch...');
      try {
        const epoch = await wasm.getCurrentEpoch(sdk);
        console.log('✓ Current epoch:', epoch);
      } catch (error) {
        console.error('❌ getCurrentEpoch failed:', error);
      }
    }
    
    // Test 2: Try fetching identity balance
    if (typeof wasm.fetchIdentityBalance === 'function') {
      console.log('\nTesting fetchIdentityBalance...');
      try {
        const testIdentityId = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';
        
        // Create FetchOptions if available
        let fetchOptions = null;
        if (wasm.FetchOptions) {
          fetchOptions = new wasm.FetchOptions();
          if (typeof fetchOptions.withProve === 'function') {
            fetchOptions.withProve(true);
          }
        }
        
        const balance = await wasm.fetchIdentityBalance(sdk, testIdentityId, fetchOptions);
        console.log('✓ Balance fetched:', balance);
        
        if (fetchOptions && typeof fetchOptions.free === 'function') {
          fetchOptions.free();
        }
      } catch (error) {
        console.error('❌ fetchIdentityBalance failed:', error);
      }
    }
    
    // Test 3: Check available methods
    console.log('\nAvailable identity methods:', Object.keys(wasm).filter(k => k.includes('identity') || k.includes('Identity')).slice(0, 10));
    console.log('Available fetch methods:', Object.keys(wasm).filter(k => k.includes('fetch')).slice(0, 10));
    
  } catch (error) {
    console.error('❌ Basic operations test failed:', error);
  }
}

// Simplified test without external dependencies
export async function testSimplifiedConnection() {
  console.log('\n=== Testing Simplified Connection ===\n');
  
  try {
    const wasm = await loadWasmSdk();
    console.log('✓ WASM loaded');
    
    // Just try to create and use the SDK
    const builder = wasm.WasmSdkBuilder.new_testnet();
    const sdk = builder.build();
    console.log('✓ SDK created');
    
    // Try the most basic operation
    if (typeof wasm.fetchDataContract === 'function') {
      console.log('\nTrying to fetch contract...');
      const contractId = 'EBioSoFFTDf346ndCMHGmYF8QzgwM8972jG5fL4ndBL7';
      
      try {
        let fetchOptions = null;
        if (wasm.FetchOptions) {
          fetchOptions = new wasm.FetchOptions();
          if (typeof fetchOptions.withProve === 'function') {
            fetchOptions.withProve(true);
          }
        }
        
        const contract = await wasm.fetchDataContract(sdk, contractId, fetchOptions);
        console.log('✓ Contract fetched:', contract);
        
        if (fetchOptions && typeof fetchOptions.free === 'function') {
          fetchOptions.free();
        }
      } catch (error) {
        console.error('❌ Contract fetch failed:', error);
      }
    }
    
  } catch (error) {
    console.error('❌ Simplified test failed:', error);
  }
}