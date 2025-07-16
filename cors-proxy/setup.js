// Simple CORS proxy for development
// This allows the browser to connect to Dash testnet evonodes

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;

// List of Dash testnet evonodes
const TESTNET_EVONODES = [
  '34.214.48.68:1443',
  '35.166.18.166:1443',
  '50.112.227.38:1443',
  '52.42.202.128:1443',
  '52.12.176.90:1443',
  '44.233.44.95:1443',
  '35.167.145.149:1443',
  '52.34.144.50:1443',
  '44.240.98.102:1443',
  '54.201.32.131:1443',
  '52.10.229.11:1443',
  '52.13.132.146:1443',
  '44.228.242.181:1443',
  '35.82.197.197:1443',
  '52.40.219.41:1443',
  '44.239.39.153:1443',
  '54.149.33.167:1443',
  '35.164.23.245:1443',
  '52.33.28.47:1443',
  '52.43.86.231:1443',
  '52.43.13.92:1443',
  '35.163.144.230:1443',
  '52.89.154.48:1443',
  '52.24.124.162:1443',
  '44.227.137.77:1443',
  '35.85.21.179:1443',
  '54.187.14.232:1443'
];

// Round-robin load balancing
let currentNodeIndex = 0;

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Proxy gRPC-Web requests to testnet evonodes
app.use('/grpc', createProxyMiddleware({
  target: () => {
    const node = TESTNET_EVONODES[currentNodeIndex];
    currentNodeIndex = (currentNodeIndex + 1) % TESTNET_EVONODES.length;
    return `https://${node}`;
  },
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    '^/grpc': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.url} to evonode ${currentNodeIndex}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}));

app.listen(PORT, () => {
  console.log(`CORS proxy server running on http://localhost:${PORT}`);
  console.log(`Proxying requests to ${TESTNET_EVONODES.length} Dash testnet evonodes`);
});

// To run this proxy:
// 1. npm init -y
// 2. npm install express http-proxy-middleware
// 3. node setup.js