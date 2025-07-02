#!/usr/bin/env node
import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IDENTITY_ID = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';

// Test page
const testPage = `
<!DOCTYPE html>
<html>
<head>
    <title>Get Balance - Fixed SDK</title>
</head>
<body>
    <div id="result"></div>
    <script type="module">
        async function getBalance() {
            try {
                console.log('Loading WASM SDK...');
                const DashModule = await import('./src/wasm/wasm_sdk/wasm_sdk.js');
                
                // Initialize WASM
                if (typeof DashModule.default === 'function') {
                    await DashModule.default();
                }
                
                console.log('Creating DapiClientConfig for testnet...');
                // Create a custom DapiClient configuration
                const dapiConfig = new DashModule.DapiClientConfig('testnet');
                
                // Add modern evonodes as endpoints
                const evonodes = [
                    'https://52.13.132.146:1443',
                    'https://52.89.154.48:1443',
                    'https://44.227.137.77:1443',
                    'https://52.40.219.41:1443',
                    'https://54.149.33.167:1443'
                ];
                
                // Clear any default endpoints and add our evonodes
                evonodes.forEach(evonode => {
                    dapiConfig.addEndpoint(evonode);
                    console.log('Added endpoint:', evonode);
                });
                
                // Configure timeout and retries
                dapiConfig.setTimeout(30000);
                dapiConfig.setRetries(3);
                
                console.log('Current endpoints:', dapiConfig.endpoints);
                
                // Create DapiClient with our configuration
                console.log('Creating DapiClient...');
                const dapiClient = new DashModule.DapiClient(dapiConfig);
                
                // Now create the SDK builder
                console.log('Creating SDK builder...');
                const builder = DashModule.WasmSdkBuilder.new_testnet();
                
                // Try to use with_context_provider if available
                if (typeof builder.with_context_provider === 'function' && DashModule.WasmContext) {
                    console.log('Attempting to create WasmContext...');
                    // This might not work, but worth trying
                    try {
                        const context = new DashModule.WasmContext();
                        builder.with_context_provider(context);
                        console.log('Context provider set');
                    } catch (e) {
                        console.log('Could not create WasmContext:', e.message);
                    }
                }
                
                const sdk = builder.build();
                console.log('SDK built');
                
                // Try using the dapiClient directly if possible
                let identityBalance;
                
                // First try using the SDK's built-in method
                try {
                    console.log('Fetching balance using SDK...');
                    const fetchOptions = new DashModule.FetchOptions();
                    if (fetchOptions.withProve) {
                        fetchOptions.withProve(true);
                    }
                    
                    identityBalance = await DashModule.fetchIdentityBalance(
                        sdk,
                        '${IDENTITY_ID}',
                        fetchOptions
                    );
                    
                    fetchOptions.free();
                    console.log('Balance fetched via SDK');
                } catch (error) {
                    console.log('SDK method failed:', error.message);
                    
                    // Try using DapiClient directly
                    if (typeof dapiClient.getIdentity === 'function') {
                        console.log('Trying DapiClient.getIdentity...');
                        try {
                            const identity = await dapiClient.getIdentity('${IDENTITY_ID}');
                            identityBalance = identity?.balance;
                            console.log('Balance fetched via DapiClient');
                        } catch (e) {
                            console.log('DapiClient method failed:', e.message);
                        }
                    }
                }
                
                // Process result
                if (identityBalance !== undefined && identityBalance !== null) {
                    const balanceNum = Number(identityBalance);
                    const result = {
                        success: true,
                        identityId: '${IDENTITY_ID}',
                        balance: balanceNum,
                        balanceDash: balanceNum / 100000000
                    };
                    
                    console.log('SUCCESS! Balance:', balanceNum, 'duffs');
                    window.result = result;
                } else {
                    window.result = { 
                        success: false, 
                        error: 'Could not fetch balance - SDK is using deprecated endpoints' 
                    };
                }
                
                // Clean up
                sdk.free();
                dapiClient.free();
                
            } catch (error) {
                console.error('Fatal error:', error);
                window.result = { success: false, error: error.message };
            }
            
            document.getElementById('result').textContent = JSON.stringify(window.result, null, 2);
            window.complete = true;
        }
        
        // Override fetch to log what's happening
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = typeof args[0] === 'string' ? args[0] : args[0].url;
            console.log('Fetch called:', url);
            
            // If it's calling old endpoints, we know the SDK isn't using our config
            if (url && url.includes('testnet-dapi')) {
                console.warn('SDK is still using deprecated endpoints!');
            }
            
            return originalFetch(...args);
        };
        
        getBalance();
    </script>
</body>
</html>
`;

// Start server
function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url);
      
      if (parsedUrl.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(testPage);
        return;
      }
      
      const filePath = join(__dirname, parsedUrl.pathname);
      
      try {
        const content = readFileSync(filePath);
        const ext = filePath.split('.').pop();
        const contentType = {
          'js': 'application/javascript',
          'wasm': 'application/wasm',
        }[ext] || 'application/octet-stream';
        
        res.writeHead(200, { 
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    
    server.listen(0, () => {
      resolve({ server, port: server.address().port });
    });
  });
}

async function main() {
  console.log(`\nAttempting to get balance for: ${IDENTITY_ID}\n`);
  
  const { server, port } = await startServer();
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Capture console logs
  page.on('console', msg => {
    const text = msg.text();
    if (!text.includes('Failed to load resource')) {
      console.log(`[Browser]: ${text}`);
    }
  });
  
  try {
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'domcontentloaded' });
    
    await page.waitForFunction(() => window.complete, { timeout: 30000 });
    
    const result = await page.evaluate(() => window.result);
    
    console.log('\n' + '='.repeat(50));
    if (result.success) {
      console.log('✅ SUCCESS!\n');
      console.log(`Identity: ${result.identityId}`);
      console.log(`Balance: ${result.balance} duffs`);
      console.log(`Balance: ${result.balanceDash} DASH`);
    } else {
      console.log('❌ FAILED\n');
      console.log('Error:', result.error);
      console.log('\nThe WASM SDK is compiled with hardcoded endpoints.');
      console.log('Even with DapiClientConfig, it still uses deprecated URLs.');
      console.log('The only solution is to intercept fetch calls (WasmSdkWrapper).');
    }
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(console.error);