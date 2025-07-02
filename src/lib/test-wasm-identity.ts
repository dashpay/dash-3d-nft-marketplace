// Test script to verify WASM identity fetching
import { loadWasmSdk } from '@/wasm/wasm_sdk';

export async function testWasmIdentityFetch(identityId: string) {
  console.log('=== Testing WASM Identity Fetch ===');
  console.log('Identity ID:', identityId);
  
  try {
    // Load WASM module
    const wasm = await loadWasmSdk();
    console.log('WASM module loaded');
    
    // Create SDK instance
    console.log('Creating WASM SDK instance...');
    const builder = wasm.WasmSdkBuilder.new_testnet();
    const sdk = builder.build();
    console.log('SDK created');
    
    // Test 1: Try direct identity fetch without options
    console.log('\n--- Test 1: Direct fetch without options ---');
    try {
      if (typeof wasm.fetchIdentity === 'function') {
        const identity = await wasm.fetchIdentity(sdk, identityId);
        console.log('Success! Identity:', identity);
        return identity;
      } else {
        console.warn('fetchIdentity function not available');
      }
    } catch (error) {
      console.error('Test 1 failed:', error.message);
    }
    
    // Test 2: Try with minimal FetchOptions
    console.log('\n--- Test 2: Fetch with minimal options ---');
    try {
      if (wasm.FetchOptions && typeof wasm.fetchIdentity === 'function') {
        const options = new wasm.FetchOptions();
        console.log('FetchOptions created');
        
        const identity = await wasm.fetchIdentity(sdk, identityId, options);
        console.log('Success! Identity:', identity);
        
        // Clean up
        options.free();
        return identity;
      }
    } catch (error) {
      console.error('Test 2 failed:', error.message);
    }
    
    // Test 3: Try fetchIdentityUnproved
    console.log('\n--- Test 3: fetchIdentityUnproved ---');
    try {
      if (typeof wasm.fetchIdentityUnproved === 'function') {
        const identity = await wasm.fetchIdentityUnproved(sdk, identityId);
        console.log('Success! Identity (unproved):', identity);
        return identity;
      } else {
        console.warn('fetchIdentityUnproved not available');
      }
    } catch (error) {
      console.error('Test 3 failed:', error.message);
    }
    
    // Test 4: Check available fetch methods
    console.log('\n--- Available fetch methods ---');
    const fetchMethods = Object.keys(wasm).filter(k => k.startsWith('fetch'));
    console.log('Fetch methods:', fetchMethods.slice(0, 20));
    
    // Clean up SDK
    if (sdk && typeof sdk.free === 'function') {
      sdk.free();
    }
    
  } catch (error) {
    console.error('Test failed:', error);
    console.error('Stack:', error.stack);
  }
  
  return null;
}