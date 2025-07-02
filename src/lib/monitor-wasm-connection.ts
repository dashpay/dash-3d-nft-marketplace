// Monitor WASM SDK connection attempts
export function setupConnectionMonitoring() {
  // Override fetch to see what URLs are being called
  const originalFetch = window.fetch;
  let requestCount = 0;
  
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    requestCount++;
    let url: string;
    
    // Extract URL properly from Request object or string
    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof URL) {
      url = input.toString();
    } else if (input instanceof Request) {
      url = input.url;
    } else {
      url = 'Unknown URL type';
    }
    
    // Only log non-Next.js internal requests
    if (!url.includes('__nextjs')) {
      console.log(`[Fetch #${requestCount}] Attempting connection to:`, url);
      console.log(`[Fetch #${requestCount}] Method:`, init?.method || (input instanceof Request ? input.method : 'GET'));
      console.log(`[Fetch #${requestCount}] Headers:`, init?.headers || (input instanceof Request ? Object.fromEntries(input.headers.entries()) : {}));
    }
    
    try {
      const response = await originalFetch.call(this, input, init);
      console.log(`[Fetch #${requestCount}] ✅ Success! Status:`, response.status);
      return response;
    } catch (error) {
      console.error(`[Fetch #${requestCount}] ❌ Failed:`, error.message);
      console.error(`[Fetch #${requestCount}] Error type:`, error.constructor.name);
      
      // Try to understand the error better
      if (error.message.includes('Failed to fetch')) {
        console.error(`[Fetch #${requestCount}] This could be due to:`);
        console.error('  1. SSL certificate not trusted (self-signed)');
        console.error('  2. Network error (unreachable host/port)');
        console.error('  3. CORS (if error mentions CORS)');
        console.error(`  4. Wrong port - trying to connect to: ${url}`);
      }
      
      throw error;
    }
  };
  
  console.log('🔍 Connection monitoring enabled - all fetch requests will be logged');
}

// Test direct connection to the working evonode
export async function testDirectConnection() {
  console.log('\n=== Testing Direct Connection to Working Evonode ===');
  
  const endpoints = [
    'https://52.13.132.146:1443',      // gRPC-Web (standard)
    'https://52.13.132.146:3000',      // Platform gRPC  
    'https://52.13.132.146:3010',      // Platform gRPC-Web
    'https://52.13.132.146:9000',      // JSON-RPC (from logs)
    'https://52.13.132.146:443',       // Standard HTTPS
    'https://52.13.132.146:26658',     // Tenderdash RPC
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\nTesting ${endpoint}...`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      });
      
      console.log(`✅ Reachable! Status: ${response.status}`);
      
      // Try to read response
      try {
        const text = await response.text();
        console.log(`Response preview: ${text.substring(0, 100)}...`);
      } catch (e) {
        console.log('Could not read response body');
      }
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
  }
}