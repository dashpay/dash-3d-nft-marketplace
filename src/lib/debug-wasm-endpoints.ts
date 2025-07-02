// Debug script to understand WASM SDK endpoint configuration
import { loadWasmSdk } from '@/wasm/wasm_sdk';

export async function debugWasmEndpoints() {
  console.log('=== Debugging WASM SDK Endpoints ===');
  
  try {
    const wasm = await loadWasmSdk();
    
    // Create testnet builder
    const builder = wasm.WasmSdkBuilder.new_testnet();
    console.log('\nTestnet builder created');
    
    // Check available methods
    const builderProto = Object.getPrototypeOf(builder);
    const builderMethods = Object.getOwnPropertyNames(builderProto);
    console.log('\nBuilder methods:', builderMethods);
    
    // Look for endpoint-related methods
    const endpointMethods = builderMethods.filter(m => 
      m.includes('address') || 
      m.includes('endpoint') || 
      m.includes('node') ||
      m.includes('url') ||
      m.includes('host')
    );
    console.log('\nEndpoint-related methods:', endpointMethods);
    
    // Build SDK and check its configuration
    const sdk = builder.build();
    console.log('\nSDK built');
    
    // Check SDK methods
    const sdkProto = Object.getPrototypeOf(sdk);
    const sdkMethods = Object.getOwnPropertyNames(sdkProto);
    console.log('\nSDK methods:', sdkMethods.slice(0, 20));
    
    // Look for configuration or endpoint methods
    const configMethods = sdkMethods.filter(m => 
      m.includes('config') || 
      m.includes('endpoint') || 
      m.includes('address') ||
      m.includes('node')
    );
    console.log('\nConfiguration-related methods:', configMethods);
    
    // Clean up
    if (sdk.free) sdk.free();
    if (builder.free) builder.free();
    
  } catch (error) {
    console.error('Debug failed:', error);
  }
}

// Also create a function to test if we can intercept fetch calls
export function monitorFetchCalls() {
  const originalFetch = window.fetch;
  
  window.fetch = async function(...args) {
    console.log('WASM SDK fetch call:', {
      url: args[0],
      options: args[1]
    });
    
    try {
      const response = await originalFetch.apply(this, args);
      console.log('Fetch response:', response.status);
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };
  
  console.log('Fetch monitoring enabled - will log all fetch calls');
}