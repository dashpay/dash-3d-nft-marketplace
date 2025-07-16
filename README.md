# Dash 3D NFT Marketplace

A decentralized 3D NFT marketplace built on Dash Platform. This is a **semi-static** website with no backend - all data is stored on the blockchain and accessed directly from the browser.

## Features

- **3D NFTs**: All NFTs have 3D representations under 3KB
- **Identity-based Login**: Login with your Dash Platform identity ID
- **Direct Blockchain Access**: No backend server needed
- **Compact 3D Formats**: Parametric, voxel, and procedural geometry
- **Real-time Rendering**: Interactive 3D viewer using Three.js

## Architecture

```
Browser → JS Dash SDK → Dash Platform Blockchain
   ↓
Static Files (HTML/JS/CSS)
```

### No Backend Required
- All NFT data stored in Dash Platform data contracts
- Authentication via identity ID (no passwords)
- Direct peer-to-peer transactions
- Can be hosted on any static file server

## 3D Geometry Types

### 1. Parametric (Most Efficient)
```json
{
  "type": "parametric",
  "shape": "sphere",
  "params": [1.5],
  "transforms": [
    { "type": "rotate", "values": [0, 0.5, 0] }
  ]
}
```

### 2. Voxel
```json
{
  "type": "voxel",
  "size": [8, 8, 8],
  "data": "base64encodedvoxeldata..."
}
```

### 3. Procedural
```json
{
  "type": "procedural",
  "seed": 12345,
  "algorithm": "fractal",
  "params": { "iterations": 5 }
}
```

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Visit http://localhost:3000
```

### Production Build

```bash
# Build static files
npm run build

# Files will be in 'out' directory
# Deploy to any static host
```

## Usage

1. **Login**: Enter your Dash Platform identity ID
2. **View Collection**: See your owned 3D NFTs
3. **Browse Marketplace**: Discover NFTs for sale
4. **Interact**: Rotate and zoom 3D models
5. **Purchase**: Buy NFTs directly (requires Dash wallet integration)

## Data Contract Schema

The NFT data contract includes:
- `name`: NFT title
- `geometry3d`: Compact 3D data (<3KB)
- `geometryType`: Type of 3D representation
- `ownerId`: Current owner's identity
- `price`: Sale price in Duffs
- `forSale`: Marketplace listing status

## Security

- **Read-only Operations**: Website only reads from blockchain
- **No Private Keys**: Never handles sensitive data
- **Identity Verification**: All actions require valid identity
- **Immutable History**: All transfers recorded on-chain

## Deployment

This is a static website that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any web server

No backend configuration needed!

## Demo Mode

Click "Try Demo Mode" on the login page to explore with sample data.

## Future Enhancements

- [ ] Wallet integration for purchases
- [ ] NFT minting interface
- [ ] Advanced 3D effects
- [ ] Social features
- [ ] AR/VR support

## License

MIT