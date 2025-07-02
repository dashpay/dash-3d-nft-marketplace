// Test connection to the working evonode with valid SSL
export async function testWorkingEvonode() {
  const workingEvonode = '52.13.132.146';
  
  console.log('=== Testing Working Evonode ===');
  console.log(`Testing ${workingEvonode} with valid SSL certificate`);
  
  // Test different ports
  const ports = [
    1443,  // gRPC-Web port (what WASM SDK likely uses)
    9000,  // JSON-RPC API port shown in logs
    443,   // Standard HTTPS
    3000,  // Platform gRPC
    3010,  // Platform gRPC-Web
  ];
  
  for (const port of ports) {
    const url = `https://${workingEvonode}:${port}`;
    console.log(`\nTesting ${url}...`);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': '*/*'
        }
      });
      
      console.log(`✅ ${url} responded with status: ${response.status}`);
      console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
      
    } catch (error) {
      console.log(`❌ ${url} failed: ${error.message}`);
    }
  }
  
  // Test gRPC-Web endpoint specifically
  console.log('\n=== Testing gRPC-Web endpoint ===');
  try {
    const grpcUrl = `https://${workingEvonode}:1443/org.dash.platform.dapi.v0.Platform/getIdentity`;
    const response = await fetch(grpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/grpc-web+proto',
        'X-Grpc-Web': '1'
      },
      body: new Uint8Array([])
    });
    
    console.log(`gRPC-Web response: ${response.status}`);
  } catch (error) {
    console.log(`gRPC-Web failed: ${error.message}`);
  }
}

// List of evonodes - let's check if this list is outdated
export const CURRENT_TESTNET_EVONODES = [
  '34.213.23.103:1443',
  '18.222.73.100:1443',
  '3.26.18.125:1443',
  '54.218.89.18:1443',
  '52.29.235.106:1443',
  '52.220.43.200:1443',
  '34.229.167.67:1443',
  '52.12.165.131:1443',
  '3.137.176.148:1443',
  '54.176.210.161:1443',
  '52.53.184.183:1443',
  '13.244.52.73:1443',
  '52.47.121.64:1443',
  '18.159.167.119:1443',
  '52.90.250.137:1443',
  '13.49.254.63:1443',
  '3.101.109.150:1443',
  '13.125.137.138:1443',
  '3.37.189.47:1443',
  '18.136.231.76:1443',
  '35.178.165.174:1443',
  '34.241.219.240:1443',
  '35.90.145.236:1443',
  '54.171.26.131:1443',
  '52.62.0.83:1443',
  '13.238.149.205:1443',
  '18.219.234.123:1443',
  // Add the working one
  '52.13.132.146:1443'
];

console.log(`Note: 52.13.132.146 was NOT in the original list of testnet evonodes`);