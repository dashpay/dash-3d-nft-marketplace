# Dash Platform Testnet Endpoints

## Current Issue

The WASM SDK is configured to use IP addresses for testnet evonodes:
- `https://34.213.23.103:1443`
- `https://18.222.73.100:1443`
- etc.

These IPs likely have self-signed SSL certificates that browsers reject.

## Potential Solutions

### 1. Official Dash Testnet Endpoints

Check if Dash provides official testnet endpoints with proper domain names:
- Look for endpoints like `testnet.dash.org` or `testnet-grpc.dash.org`
- These would have valid SSL certificates

### 2. Use gRPC-Web Gateway

Some platforms provide a gRPC-Web gateway that handles SSL properly:
- This acts as a proxy between browser and gRPC services
- Would have a proper domain name and valid SSL

### 3. Platform-Specific Configuration

The WASM SDK might have configuration for:
- Skipping SSL verification (development only)
- Using specific endpoints
- Configuring transport options

## Next Steps

1. Research official Dash documentation for browser-compatible testnet endpoints
2. Check if the WASM SDK has configuration options we're missing
3. Contact Dash Platform team about browser access to testnet

## Temporary Workaround

For immediate development, you can:
1. Visit each IP in your browser and accept the certificate warning
2. This *might* allow the WASM SDK to connect (browser-dependent)
3. This is NOT a production solution

## Important Note

This is NOT a code issue - it's an infrastructure/configuration issue with how Dash testnet is set up for browser access.