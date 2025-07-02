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

// Create test page that uses our wrapper
const testPage = `
<!DOCTYPE html>
<html>
<head>
    <title>Get Identity Balance</title>
</head>
<body>
    <h1>Fetching Identity Balance...</h1>
    <div id="result"></div>
    
    <script type="module">
        const TESTNET_EVONODES = [
            'https://52.13.132.146:1443',
            'https://52.89.154.48:1443',
            'https://44.227.137.77:1443',
            'https://52.40.219.41:1443',
            'https://54.149.33.167:1443',
        ];
        
        let evonodeIndex = 0;
        const originalFetch = window.fetch;
        
        // Install fetch interceptor
        window.fetch = function(...args) {
            let url = typeof args[0] === 'string' ? args[0] : args[0].url;
            const options = args[1] || {};
            
            if (url && (url.includes('testnet-dapi') || url.includes('mainnet-dapi'))) {
                const originalUrl = url;
                const urlObj = new URL(url);
                const path = urlObj.pathname;
                
                const evonode = TESTNET_EVONODES[evonodeIndex % TESTNET_EVONODES.length];
                evonodeIndex++;
                
                url = evonode + path;
                console.log('Redirecting: ' + originalUrl + ' → ' + url);
                
                if (typeof args[0] === 'string') {
                    args[0] = url;
                } else {
                    args[0] = new Request(url, args[0]);
                }
                
                // Add gRPC-Web headers
                if (!options.headers) {
                    options.headers = {};
                }
                options.headers['Content-Type'] = 'application/grpc-web+proto';
                options.headers['X-Grpc-Web'] = '1';
                
                args[1] = options;
            }
            
            return originalFetch(...args);
        };
        
        async function getBalance() {
            try {
                console.log('Loading WASM SDK...');
                const DashModule = await import('./src/wasm/wasm_sdk/wasm_sdk.js');
                
                console.log('Initializing WASM...');
                if (typeof DashModule.default === 'function') {
                    await DashModule.default();
                } else if (typeof DashModule.initSync === 'function') {
                    DashModule.initSync();
                }
                
                console.log('Creating SDK...');
                const builder = DashModule.WasmSdkBuilder.new_testnet();
                const sdk = builder.build();
                
                console.log('Fetching balance for identity: ${IDENTITY_ID}');
                
                const fetchOptions = new DashModule.FetchOptions();
                if (typeof fetchOptions.withProve === 'function') {
                    fetchOptions.withProve(true);
                    console.log('Proved mode: ENABLED');
                }
                
                const startTime = Date.now();
                
                try {
                    const balance = await DashModule.fetchIdentityBalance(
                        sdk,
                        '${IDENTITY_ID}',
                        fetchOptions
                    );
                    
                    const elapsed = Date.now() - startTime;
                    console.log('Network call completed in ' + elapsed + 'ms');
                    
                    if (balance !== undefined && balance !== null) {
                        const balanceNum = Number(balance);
                        const dashAmount = balanceNum / 100000000;
                        
                        const result = {
                            identityId: '${IDENTITY_ID}',
                            balance: balanceNum,
                            balanceDuffs: balanceNum,
                            balanceDash: dashAmount,
                            success: true
                        };
                        
                        console.log('Balance: ' + balanceNum + ' duffs (' + dashAmount + ' DASH)');
                        
                        document.getElementById('result').textContent = JSON.stringify(result);
                        window.balanceResult = result;
                    } else {
                        window.balanceResult = { success: false, error: 'Balance is null/undefined' };
                    }
                } catch (error) {
                    console.error('Error:', error);
                    window.balanceResult = { success: false, error: error.message };
                } finally {
                    fetchOptions.free();
                }
                
                sdk.free();
                window.testComplete = true;
                
            } catch (error) {
                console.error('Fatal error:', error);
                window.balanceResult = { success: false, error: error.message };
                window.testComplete = true;
            }
        }
        
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
      
      let filePath = join(__dirname, parsedUrl.pathname);
      
      try {
        const content = readFileSync(filePath);
        const ext = filePath.split('.').pop();
        const contentType = {
          'js': 'application/javascript',
          'mjs': 'application/javascript',
          'wasm': 'application/wasm',
        }[ext] || 'application/octet-stream';
        
        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
        });
        res.end(content);
      } catch (err) {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    
    server.listen(0, () => {
      const port = server.address().port;
      resolve({ server, port });
    });
  });
}

async function getIdentityBalance() {
  console.log(`\nFetching balance for identity: ${IDENTITY_ID}\n`);
  
  const { server, port } = await startServer();
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Capture console logs
  page.on('console', msg => {
    const text = msg.text();
    if (!text.includes('Failed to load resource') && !text.includes('Access to fetch')) {
      console.log(`[Browser]: ${text}`);
    }
  });
  
  page.on('pageerror', error => {
    console.error('[Page Error]:', error.message);
  });
  
  try {
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'domcontentloaded' });
    
    // Wait for completion
    await page.waitForFunction(() => window.testComplete, { timeout: 60000 });
    
    // Get result
    const result = await page.evaluate(() => window.balanceResult);
    
    if (result.success) {
      console.log('\n✅ SUCCESS!\n');
      console.log('Identity ID:', result.identityId);
      console.log('Balance:', result.balanceDuffs, 'duffs');
      console.log('Balance:', result.balanceDash, 'DASH');
    } else {
      console.log('\n❌ FAILED\n');
      console.log('Error:', result.error);
    }
    
  } catch (error) {
    console.error('\nError:', error.message);
  } finally {
    await browser.close();
    server.close();
  }
}

getIdentityBalance().catch(console.error);