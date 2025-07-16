# SSL Certificate Issue with Dash Platform Testnet

## Problem Description

When connecting to Dash Platform testnet evonodes, you may encounter "Failed to fetch" errors in the browser console. This is not a code issue but rather a browser security restriction.

### Root Cause

1. Testnet evonodes use self-signed SSL certificates
2. Modern browsers block connections to servers with invalid/self-signed certificates
3. This security measure cannot be bypassed from JavaScript code
4. The browser's CORS and mixed content policies further restrict these connections

## Error Symptoms

- `Failed to fetch` errors in browser console
- `net::ERR_CERT_AUTHORITY_INVALID` errors
- CORS policy blocks even when headers are properly configured
- Connection works in Node.js but fails in browser

## Solutions

### 1. Local Proxy Server (Recommended)

Create a local proxy server that accepts self-signed certificates and forwards requests:

```javascript
// proxy-server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');

const app = express();

// Allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Proxy configuration
const proxy = createProxyMiddleware({
  target: 'https://seed-1.testnet.networks.dash.org:3443',
  changeOrigin: true,
  secure: false, // Accept self-signed certificates
  agent: new https.Agent({
    rejectUnauthorized: false
  }),
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.use('/api', proxy);

app.listen(3001, () => {
  console.log('Proxy server running on http://localhost:3001');
});
```

Install dependencies:
```bash
npm install express http-proxy-middleware
```

Run the proxy:
```bash
node proxy-server.js
```

Update your Dash client configuration:
```javascript
const client = new Dash.Client({
  apps: {
    '3DCity': {
      contractId: 'YOUR_CONTRACT_ID'
    }
  },
  network: 'testnet',
  dapiAddresses: ['http://localhost:3001/api']
});
```

### 2. Chrome with Disabled Security (Development Only)

**⚠️ WARNING: Only use this for development. Never browse the internet with these flags enabled.**

#### macOS:
```bash
open -n -a "Google Chrome" --args --disable-web-security --user-data-dir="/tmp/chrome_dev" --ignore-certificate-errors --allow-insecure-localhost
```

#### Windows:
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\tmp\chrome_dev" --ignore-certificate-errors --allow-insecure-localhost
```

#### Linux:
```bash
google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev" --ignore-certificate-errors --allow-insecure-localhost
```

### 3. Official Dash Platform Gateway

Check if Dash provides an official HTTPS gateway for testnet:

```javascript
const client = new Dash.Client({
  apps: {
    '3DCity': {
      contractId: 'YOUR_CONTRACT_ID'
    }
  },
  network: 'testnet',
  // Use official gateway if available
  dapiAddresses: ['https://platform-testnet.dash.org']
});
```

### 4. Reverse Proxy with Valid SSL

Set up nginx with Let's Encrypt certificates:

```nginx
# /etc/nginx/sites-available/dash-proxy
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass https://seed-1.testnet.networks.dash.org:3443;
        proxy_ssl_verify off; # Accept self-signed certificates
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
        
        # Handle OPTIONS requests
        if ($request_method = 'OPTIONS') {
            return 204;
        }
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Install and configure:
```bash
# Install nginx
sudo apt-get install nginx

# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Enable the site
sudo ln -s /etc/nginx/sites-available/dash-proxy /etc/nginx/sites-enabled/
sudo nginx -s reload
```

### 5. Browser Extension Solution

Install a browser extension that allows self-signed certificates (use with caution):

- **Chrome**: "Ignore X-Frame headers" or "CORS Unblock"
- **Firefox**: "CORS Everywhere"

## Best Practices

1. **Production**: Always use proper SSL certificates and official gateways
2. **Development**: Use the local proxy server approach
3. **Testing**: Chrome with disabled security can be useful for quick tests
4. **Security**: Never disable browser security for regular browsing

## Troubleshooting

1. **Check evonode status**: Ensure the testnet node is actually running
   ```bash
   curl -k https://seed-1.testnet.networks.dash.org:3443/status
   ```

2. **Verify proxy is working**:
   ```bash
   curl http://localhost:3001/api/status
   ```

3. **Browser console**: Look for specific error messages about certificates

4. **Network tab**: Check if requests are being blocked by CORS or mixed content policies

## Additional Resources

- [Dash Platform Documentation](https://docs.dash.org/projects/platform/en/stable/)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Chrome: Run with flags](https://www.chromium.org/developers/how-tos/run-chromium-with-flags)