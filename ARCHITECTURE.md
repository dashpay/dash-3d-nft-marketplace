# 3D NFT Marketplace Architecture

## Overview

This is a **semi-static** NFT marketplace with no backend server. All data lives on the Dash Platform blockchain and is accessed directly from the browser.

## How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│   User Browser  │────▶│  Static Website  │────▶│  Dash Platform  │
│                 │     │  (HTML/JS/CSS)   │     │   Blockchain    │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                                                  │
        │                   JS SDK (WASM)                  │
        └──────────────────────────────────────────────────┘
```

## Key Components

### 1. **Frontend (Static Files)**
- Next.js generates static HTML/CSS/JS
- Three.js renders 3D NFTs in browser
- No server-side rendering needed

### 2. **JS Dash SDK**
- Runs entirely in the browser
- WebAssembly for performance
- Direct P2P connection to Dash nodes

### 3. **Data Contracts**
- NFT metadata stored on-chain
- 3D geometry data (<3KB limit)
- Transfer history immutable

## 3D Data Storage

### Why 3KB Limit?
- Blockchain storage is expensive
- Forces creative, efficient 3D representations
- Ensures fast loading times

### Compact 3D Formats

#### Parametric (50-200 bytes)
```javascript
{
  type: "parametric",
  shape: "torus",
  params: [2, 0.5, 16, 8],
  transforms: [{
    type: "rotate",
    values: [0, 0.7, 0]
  }]
}
```

#### Voxel (500-2000 bytes)
- 8x8x8 grid = 512 voxels
- Run-length encoding
- Color palette compression

#### Procedural (100-500 bytes)
- Mathematical formulas
- L-systems for trees
- Fractal algorithms

## Authentication Flow

```
1. User enters Identity ID
   └─▶ Format: 43 chars + "="
   
2. SDK validates ID format
   └─▶ No blockchain query yet
   
3. User accepted, store in localStorage
   └─▶ No private keys stored!
   
4. Query NFTs owned by Identity
   └─▶ Direct blockchain read
```

## Security Model

### What We DON'T Store
- ❌ Private keys
- ❌ Passwords  
- ❌ Personal data
- ❌ Payment info

### What We DO
- ✅ Read public blockchain data
- ✅ Validate data signatures
- ✅ Display NFT ownership
- ✅ Cache data locally

## Deployment

Since this is static:

1. **Build**: `npm run build`
2. **Upload**: Copy files to any web server
3. **Done**: No database, no API, no config

Can deploy to:
- GitHub Pages (free)
- Netlify (free tier)
- AWS S3 + CloudFront
- Any static host

## Cost Analysis

| Traditional NFT Marketplace | Our Approach |
|----------------------------|--------------|
| Server: $50-500/month | Static hosting: $0-10/month |
| Database: $20-200/month | Blockchain: $0 (read-only) |
| CDN: $10-100/month | Included in hosting |
| Security: Constant worry | Sleep peacefully |

## Performance

- **Initial Load**: ~200KB (gzipped)
- **3D Models**: <3KB each
- **Blockchain Queries**: Cached locally
- **Rendering**: 60 FPS (GPU accelerated)

## Limitations

1. **Read-Only**: Can't mint NFTs (yet)
2. **No Wallet**: Purchase requires external wallet
3. **3KB Limit**: Complex models need compression
4. **Identity Only**: No username/password auth

## Future Possibilities

- WebRTC for P2P trading
- IPFS for larger 3D models
- AR/VR viewing modes
- Social features via data contracts