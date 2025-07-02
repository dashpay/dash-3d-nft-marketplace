// Test direct connection to Dash testnet evonodes
export async function testEvonodeConnection() {
  const testnetEvonodes = [
    'https://34.213.23.103:1443',
    'https://18.222.73.100:1443',
    'https://3.26.18.125:1443'
  ];
  
  console.log('=== Testing Evonode Connections ===');
  
  for (const evonode of testnetEvonodes) {
    try {
      console.log(`\nTesting ${evonode}...`);
      
      // Try a simple gRPC-Web request to check connectivity
      const response = await fetch(`${evonode}/org.dash.platform.dapi.v0.Platform/getIdentity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/grpc-web+proto',
          'X-Grpc-Web': '1'
        },
        body: new Uint8Array([]) // Empty request for now
      });
      
      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (response.ok || response.status === 400) {
        console.log(`✅ ${evonode} is reachable`);
      } else {
        console.log(`❌ ${evonode} returned status ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ ${evonode} failed:`, error.message);
    }
  }
}

// Also test if the issue is with the WASM SDK fetch implementation
export async function debugWasmFetch() {
  console.log('\n=== Debugging WASM Fetch ===');
  
  // Check if fetch is available in the environment
  console.log('Global fetch available:', typeof fetch !== 'undefined');
  console.log('Window fetch available:', typeof window?.fetch !== 'undefined');
  
  // The WASM module might be using a different fetch implementation
  // or might need specific polyfills
}