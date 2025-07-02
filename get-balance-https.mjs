#!/usr/bin/env node
import puppeteer from 'puppeteer';
import { createServer } from 'https';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IDENTITY_ID = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';

// Generate self-signed certificate for HTTPS
function generateCert() {
  try {
    execSync(`openssl req -x509 -newkey rsa:2048 -keyout /tmp/key.pem -out /tmp/cert.pem -days 1 -nodes -subj "/CN=localhost" 2>/dev/null`);
    return {
      key: readFileSync('/tmp/key.pem'),
      cert: readFileSync('/tmp/cert.pem')
    };
  } catch (error) {
    console.error('Failed to generate certificate:', error.message);
    return null;
  }
}

// Test page
const testPage = `
<!DOCTYPE html>
<html>
<head>
    <title>Get Balance</title>
</head>
<body>
    <div id="result"></div>
    <script type="module">
        const EVONODES = [
            'https://52.13.132.146:1443',
            'https://52.89.154.48:1443',
            'https://44.227.137.77:1443',
            'https://52.40.219.41:1443',
            'https://54.149.33.167:1443'
        ];
        
        let evonodeIndex = 0;
        const originalFetch = window.fetch;
        
        window.fetch = function(...args) {
            let url = typeof args[0] === 'string' ? args[0] : args[0].url;
            const options = args[1] || {};
            
            if (url && (url.includes('testnet-dapi') || url.includes('mainnet-dapi'))) {
                const urlObj = new URL(url);
                const path = urlObj.pathname;
                const evonode = EVONODES[evonodeIndex % EVONODES.length];
                evonodeIndex++;
                url = evonode + path;
                
                if (typeof args[0] === 'string') {
                    args[0] = url;
                } else {
                    args[0] = new Request(url, args[0]);
                }
                
                if (!options.headers) options.headers = {};
                options.headers['Content-Type'] = 'application/grpc-web+proto';
                options.headers['X-Grpc-Web'] = '1';
                args[1] = options;
            }
            
            return originalFetch(...args);
        };
        
        async function getBalance() {
            try {
                const DashModule = await import('./src/wasm/wasm_sdk/wasm_sdk.js');
                
                if (typeof DashModule.default === 'function') {
                    await DashModule.default();
                }
                
                const builder = DashModule.WasmSdkBuilder.new_testnet();
                const sdk = builder.build();
                
                const fetchOptions = new DashModule.FetchOptions();
                if (fetchOptions.withProve) {
                    fetchOptions.withProve(true);
                }
                
                const balance = await DashModule.fetchIdentityBalance(
                    sdk,
                    '${IDENTITY_ID}',
                    fetchOptions
                );
                
                const result = {
                    success: true,
                    balance: Number(balance),
                    balanceDash: Number(balance) / 100000000
                };
                
                window.result = result;
                document.getElementById('result').textContent = JSON.stringify(result);
                
                fetchOptions.free();
                sdk.free();
                
            } catch (error) {
                window.result = { success: false, error: error.message };
                document.getElementById('result').textContent = JSON.stringify(window.result);
            }
            
            window.complete = true;
        }
        
        getBalance();
    </script>
</body>
</html>
`;

// Start HTTPS server
function startServer(cert) {
  return new Promise((resolve) => {
    const server = createServer(cert, (req, res) => {
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
        
        res.writeHead(200, { 'Content-Type': contentType });
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

async function getBalance() {
  console.log(`Getting balance for: ${IDENTITY_ID}\n`);
  
  const cert = generateCert();
  if (!cert) {
    console.error('Failed to generate certificate');
    return;
  }
  
  const { server, port } = await startServer(cert);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
  });
  
  const page = await browser.newPage();
  
  // Ignore certificate errors
  await page.setBypassCSP(true);
  
  try {
    await page.goto(`https://localhost:${port}/`, { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    await page.waitForFunction(() => window.complete, { timeout: 30000 });
    
    const result = await page.evaluate(() => window.result);
    
    if (result.success) {
      console.log('✅ Balance fetched successfully!\n');
      console.log(`Identity: ${IDENTITY_ID}`);
      console.log(`Balance: ${result.balance} duffs`);
      console.log(`Balance: ${result.balanceDash} DASH`);
    } else {
      console.log('❌ Failed to fetch balance');
      console.log('Error:', result.error);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
    server.close();
  }
}

getBalance().catch(console.error);