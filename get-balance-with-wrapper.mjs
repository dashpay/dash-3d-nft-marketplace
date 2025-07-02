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

// Test page using the wrapper
const testPage = `
<!DOCTYPE html>
<html>
<head>
    <title>Get Balance - With Wrapper</title>
</head>
<body>
    <div id="result"></div>
    <script type="module">
        async function getBalance() {
            try {
                console.log('Loading WASM SDK with wrapper...');
                const { WasmSdkWrapper } = await import('./src/lib/wasm-sdk-wrapper.js');
                
                console.log('Creating wrapped SDK for testnet...');
                const wrapper = new WasmSdkWrapper('testnet');
                await wrapper.initialize();
                
                const sdk = wrapper.getSdk();
                console.log('SDK ready');
                
                console.log('Fetching balance for identity:', '${IDENTITY_ID}');
                const { fetchIdentityBalance, FetchOptions } = await import('./src/wasm/wasm_sdk/wasm_sdk.js');
                
                const fetchOptions = new FetchOptions();
                fetchOptions.withProve(true);
                
                const identityBalance = await fetchIdentityBalance(
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
                
                // Clean up
                wrapper.cleanup();
                
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
          'ts': 'application/typescript',
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
    console.error('Error:', error.message);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(console.error);