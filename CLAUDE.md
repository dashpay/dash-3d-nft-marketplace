# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The **Dash 3D NFT Marketplace** is a decentralized, semi-static 3D NFT marketplace built on Dash Platform. It's unique in that it has **no backend server** - all data is stored directly on the Dash Platform blockchain and accessed via WebAssembly (WASM) SDK in the browser.

### Key Characteristics
- **Semi-static architecture**: Next.js static export that can be deployed anywhere
- **Direct blockchain access**: No intermediary servers or APIs
- **3D NFT focus**: All NFTs have compact 3D representations under 3KB
- **Identity-based auth**: Uses Dash Platform identity IDs (no passwords)
- **Pure frontend**: All logic runs in the browser via WASM

## Technology Stack

### Core Framework
- **Next.js 15.3.4** with static export (`output: 'export'`)
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Zustand** for state management

### 3D Rendering
- **Three.js 0.177.0** for 3D engine
- **@react-three/fiber** and **@react-three/drei** for React integration
- Supports parametric, voxel, and procedural geometry types

### Blockchain Integration
- **Dash Platform JS SDK** (custom wrapper at `/src/lib/dash-sdk-wrapper.ts`)
- **WASM SDK** at `/src/wasm/wasm_sdk/` for browser-native blockchain access
- **Contract ID**: `EBioSoFFTDf346ndCMHGmYF8QzgwM8972jG5fL4ndBL7` (testnet)

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Login/landing page
│   │   ├── gallery/page.tsx   # Main NFT gallery
│   │   ├── nft/[id]/page.tsx  # Individual NFT view
│   │   └── layout.tsx         # Root layout with LogView
│   ├── components/
│   │   ├── NFT3DViewer.tsx    # Core 3D rendering component
│   │   ├── ConnectionDebugger.tsx # Network debugging tool
│   │   ├── NetworkToggle.tsx   # Mainnet/testnet switcher
│   │   └── LogView.tsx        # Debug logging overlay
│   ├── lib/
│   │   ├── dash-sdk.ts        # High-level NFT operations
│   │   └── dash-sdk-wrapper.ts # WASM SDK wrapper
│   ├── store/
│   │   └── useStore.ts        # Zustand global state
│   ├── types/
│   │   └── nft.ts            # TypeScript definitions
│   └── wasm/                 # WebAssembly SDK files
├── contracts/                # Dash Platform data contracts
├── public/                   # Static assets
└── [various config/docs]
```

## Architecture Patterns

### 1. Semi-Static Architecture
```
Browser → Static Files → WASM SDK → Dash Platform Blockchain
```

The entire application compiles to static HTML/CSS/JS that can be hosted anywhere. No server-side rendering or API endpoints needed.

### 2. State Management (Zustand)
Located at `/src/store/useStore.ts`:
- **Network state**: mainnet/testnet switching
- **Authentication**: identity ID and login status
- **NFT data**: user's NFTs and marketplace listings
- **UI state**: loading, errors, selected NFT

Key actions:
- `login(identityId)`: Validates and authenticates user
- `setNetwork(network)`: Switches between mainnet/testnet
- `setUserNFTs(nfts)`: Updates user's NFT collection

### 3. 3D Rendering Pipeline
The `NFT3DViewer` component handles three geometry types:

**Parametric** (50-200 bytes):
```typescript
{
  type: "parametric",
  shape: "torus", 
  params: [2, 0.5, 16, 8],
  transforms: [{ type: "rotate", values: [0, 0.7, 0] }]
}
```

**Voxel** (500-2000 bytes):
- 8x8x8 grids with run-length encoding
- Base64 encoded voxel data

**Procedural** (100-500 bytes):
- Mathematical formulas and L-systems
- Seed-based generation for consistency

### 4. Blockchain Integration
The SDK wrapper (`/src/lib/dash-sdk-wrapper.ts`) provides:
- **Identity verification**: `verifyIdentity(id)`
- **Document queries**: `queryDocuments(contractId, query)`
- **NFT operations**: `getNFTsByOwner()`, `getNFTById()`
- **Platform state**: Connection status and block info

## Critical Files to Understand

### `/src/store/useStore.ts`
Global state management with network switching, authentication, and NFT data. Key for understanding app flow.

### `/src/lib/dash-sdk.ts`
High-level NFT operations that abstract blockchain complexity. Main interface for NFT CRUD operations.

### `/src/components/NFT3DViewer.tsx`
Core 3D rendering logic. Handles all three geometry types and Three.js integration.

### `/src/app/page.tsx` (Login)
Entry point with identity validation, network selection, and authentication flow.

### `/src/app/gallery/page.tsx`
Main application interface showing owned NFTs and marketplace browsing.

## Development Considerations

### 1. No Backend Dependency
- All data comes from Dash Platform blockchain
- No database, no API endpoints, no server-side code
- Can be deployed to any static hosting (GitHub Pages, Netlify, etc.)

### 2. Network Configuration
- **Testnet**: Default for development
- **Mainnet**: Production environment
- Network switching clears authentication state
- Contract IDs differ between networks

### 3. WASM SDK Integration
- Requires WebAssembly support in browser
- SDK initialization is async and critical
- All queries use "proved" fetching (verified blockchain data)
- Connection issues often relate to evonode availability

### 4. 3D Constraints
- **3KB limit** on geometry data (blockchain storage cost)
- Emphasis on mathematical/parametric representations
- WebGL rendering in browser via Three.js
- Interactive controls with OrbitControls

## Common Debugging

### Connection Issues
- Check `ConnectionDebugger` component output
- Verify evonode endpoints are accessible
- Ensure WASM SDK is properly initialized
- SSL certificate issues on testnet IPs

### Authentication Problems
- Identity ID must be 44 base58 characters
- Format: `5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk`
- Network switching invalidates existing authentication
- Demo identity available for testing

### 3D Rendering Issues
- Geometry JSON must be valid and under 3KB
- Three.js errors often relate to invalid parameters
- WebGL context issues on older devices

## Environment Variables
```bash
NEXT_PUBLIC_TESTNET_CONTRACT_ID=EBioSoFFTDf346ndCMHGmYF8QzgwM8972jG5fL4ndBL7
```

## Build Commands
```bash
npm run dev          # Development server with Turbopack (using mocks)
npm run build        # Static export to 'out' directory
npm run test         # Jest test suite
npm run test:coverage # Coverage report
```

## Mock Development Mode

**Current Status: MOCKED** - The application is configured to use mocked data for UI development.

### Mock Files
- `/src/lib/mock-data.ts` - Sample NFT data with all 3D geometry types
- `/src/lib/dash-sdk-wrapper-mock.ts` - Mocked SDK wrapper with fake async responses
- `/src/lib/*-mock.ts` - Mocked connection testing utilities

### Mock Identity System
- **Default Identity**: `5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk`
- **Authentication**: Always succeeds with valid 44-character base58 ID
- **Sample NFTs**: 6 pre-loaded NFTs across different geometry types

### Switching Back to Real SDK
To return to real blockchain integration:
1. Update imports in `/src/lib/dash-sdk.ts` from `-mock` to original files
2. Update imports in `/src/components/ConnectionDebugger.tsx`
3. Rebuild WASM SDK dependencies
4. Configure real contract IDs in environment variables

## Key Dependencies
- `dash`: Dash Platform SDK
- `three` + `@react-three/fiber`: 3D rendering
- `zustand`: State management
- `next`: Static site generation
- Custom WASM SDK for blockchain access

## Contract Schema
NFT documents contain:
- `name`: Display name
- `description`: Optional description
- `geometry3d`: JSON string with 3D data (<3KB)
- `geometryType`: 'parametric' | 'voxel' | 'procedural'
- `colors`: Array of hex color codes
- System fields: `$ownerId`, `$createdAt`, `$transferredAt`

## Common Development Tasks

### Commands
```bash
# Development with live reload (uses mocked data)
npm run dev

# Build static export for deployment
npm run build

# Run linter
npm run lint

# Run all tests
npm run test

# Run tests with watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Run real WASM integration tests (no mocks)
npm run test -- --config jest.real.config.js

# Run a single test file
npm run test -- src/test/dpns.test.ts
```

### Testing Configuration
- Default tests use mocked data for faster development
- Real integration tests: `jest.real.config.js` (use for blockchain testing)
- Coverage tests: `jest.coverage.config.js` (focuses on SDK source)
- Test timeout for network calls: 60 seconds

### Deployment
```bash
# Build static files
npm run build

# Output will be in 'out' directory
# Deploy entire 'out' directory to any static hosting service
```

## Testing Approach
- Real blockchain integration (no mocks)
- Identity-based test scenarios
- 3D geometry validation
- Cross-browser WebGL compatibility
- WASM module loading/initialization

This architecture enables a fully decentralized NFT marketplace with no infrastructure costs, combining cutting-edge 3D web technologies with blockchain permanence.