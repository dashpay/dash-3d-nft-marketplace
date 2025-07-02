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

// Test page using direct evonodes
const testPage = `
<!DOCTYPE html>
<html>
<head>
    <title>Get Balance - Simple Test</title>
</head>
<body>
    <div id="result"></div>
    <script type="module">
        // List of evonodes we discovered earlier
        const evonodes = [
            'https://52.13.132.146:1443',
            'https://52.89.154.48:1443',
            'https://44.227.137.77:1443',
            'https://52.40.219.41:1443',
            'https://54.149.33.167:1443',
            'https://54.187.14.232:1443',
            'https://52.12.176.90:1443',
            'https://52.34.144.50:1443',
            'https://44.239.39.153:1443'
        ];
        
        let currentEvonodeIndex = 0;
        
        // Override fetch to intercept and redirect
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = typeof args[0] === 'string' ? args[0] : args[0].url;
            console.log('[Fetch] Original URL:', url);
            
            // Check if it's a DAPI call
            if (url && (url.includes('testnet-dapi') || url.includes('mainnet-dapi'))) {
                // Extract the path
                const urlObj = new URL(url);
                const path = urlObj.pathname;
                
                // Round-robin evonode selection
                const evonode = evonodes[currentEvonodeIndex];
                currentEvonodeIndex = (currentEvonodeIndex + 1) % evonodes.length;
                
                const newUrl = evonode + path;
                console.log('[Fetch] Redirected to:', newUrl);
                
                // Create new request with the redirected URL
                const newArgs = [...args];
                newArgs[0] = newUrl;
                
                return originalFetch(...newArgs);
            }
            
            return originalFetch(...args);
        };
        
        async function getBalance() {
            try {
                console.log('Loading WASM SDK...');
                const DashModule = await import('./src/wasm/wasm_sdk/wasm_sdk.js');
                
                // Initialize WASM
                if (typeof DashModule.default === 'function') {
                    await DashModule.default();
                }
                
                console.log('Creating SDK...');
                const builder = DashModule.WasmSdkBuilder.new_testnet();
                const sdk = builder.build();
                
                console.log('Fetching balance for identity:', '${IDENTITY_ID}');
                
                const fetchOptions = new DashModule.FetchOptions();
                fetchOptions.withProve(true);
                
                const identityBalance = await DashModule.fetchIdentityBalance(
                    sdk,
                    '${IDENTITY_ID}',
                    fetchOptions
                );
                
                fetchOptions.free();
                
                const balanceNum = Number(identityBalance);
                const result = {
                    success: true,
                    identityId: '${IDENTITY_ID}',
                    balance: balanceNum,
                    balanceDash: balanceNum / 100000000
                };
                
                console.log('SUCCESS! Balance:', balanceNum, 'duffs');
                window.result = result;
                
                sdk.free();
                
            } catch (error) {
                console.error('Error:', error);
                window.result = { success: false, error: error.message };
            }
            
            document.getElementById('result').textContent = JSON.stringify(window.result, null, 2);
            window.complete = true;
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
  console.log(`\nGetting balance for: ${IDENTITY_ID}\n`);
  console.log('Using fetch interception to redirect deprecated endpoints to evonodes.\n');
  
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
    
    await page.waitForFunction(() => window.complete, { timeout: 60000 });
    
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
    }
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('Timeout or error:', error.message);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(console.error);