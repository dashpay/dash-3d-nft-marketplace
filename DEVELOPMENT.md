# Development Guide - Co-developing JS SDK and NFT Marketplace

## Overview

This project serves as both:
1. A 3D NFT marketplace application
2. A testing ground for the JS Dash SDK (which has never been tested)

We're developing both simultaneously, fixing SDK issues as we discover them.

## Current Setup

### SDK Integration Approach

Since the JS SDK hasn't been built/published yet, we're using a **wrapper pattern**:

```
NFT App → SDK Wrapper → Mock Implementation
              ↓
        (Will become)
              ↓
         Real JS SDK → WASM → Dash Platform
```

### File Structure

```
src/
├── lib/
│   ├── dash-sdk.ts          # NFT-specific SDK methods
│   └── dash-sdk-wrapper.ts  # Mock SDK implementation
├── dash-sdk-src/            # Symlink to platform/packages/js-dash-sdk/src
└── ...
```

## Development Workflow

### 1. Identify SDK Need
When building a feature, document what SDK method you need:

```typescript
// Example: Need to query NFTs by owner
async getNFTsByOwner(ownerId: string): Promise<NFT3D[]> {
  // SDK NEED: Query documents with filtering
  const documents = await sdk.queryDocuments(contractId, {
    where: [['ownerId', '==', ownerId]]
  });
}
```

### 2. Mock First
Implement a mock in `dash-sdk-wrapper.ts`:

```typescript
async queryDocuments(contractId: string, query: any): Promise<Document[]> {
  // Return mock data matching expected format
  return mockDocuments.filter(/* apply query */);
}
```

### 3. Test the Feature
Make sure the app works with mock data.

### 4. Implement in Real SDK
Once the feature works, implement in the actual SDK:
- Navigate to `platform/packages/js-dash-sdk/`
- Add/fix the actual implementation
- Handle WASM integration if needed

### 5. Update Wrapper
Replace mock with real SDK call when ready.

## SDK Issues Found So Far

### 1. Build Dependencies
- **Issue**: SDK requires `wasm-pack` to build
- **Solution**: Need to either:
  - Install build tools globally
  - Create pre-built WASM modules
  - Implement pure JS fallbacks

### 2. Package Structure
- **Issue**: SDK uses workspace protocol
- **Solution**: Need proper npm packaging

### 3. Missing Methods
Track methods we need to implement:
- [ ] `queryDocuments()` with complex queries
- [ ] `getDocument()` by ID
- [ ] `createDocument()` for NFT minting
- [ ] `updateDocument()` for price changes
- [ ] Identity balance checking

## Testing Checklist

When adding SDK functionality, test:

1. **Format Validation**
   - [ ] Identity IDs (43 chars + =)
   - [ ] Document IDs
   - [ ] Contract IDs

2. **Error Handling**
   - [ ] Network failures
   - [ ] Invalid data
   - [ ] Missing required fields

3. **Performance**
   - [ ] Query response times
   - [ ] WASM initialization
   - [ ] Memory usage

4. **Browser Compatibility**
   - [ ] Chrome/Edge
   - [ ] Firefox
   - [ ] Safari
   - [ ] Mobile browsers

## Running Both Projects

### Terminal 1 - NFT App
```bash
cd dash-3d-nft-marketplace
npm run dev
# http://localhost:3000
```

### Terminal 2 - SDK Development
```bash
cd platform/packages/js-dash-sdk
# Make changes to SDK
npm run build  # When ready to test
```

### Terminal 3 - Platform (if needed)
```bash
cd platform
yarn start  # Local testnet
```

## Common Issues & Solutions

### "Cannot find module"
The SDK isn't built yet. Check:
1. Is the symlink working? `ls -la src/dash-sdk-src`
2. Are TypeScript paths configured?

### "WASM not initialized"
The WASM module needs special handling:
1. Ensure WASM files are copied to public/
2. Initialize before using SDK
3. Handle async loading

### "Identity not found"
Mock data uses specific IDs:
- Demo: `5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx`
- Add more in `dash-sdk-wrapper.ts`

## Next Steps

1. **Immediate**: Get basic queries working
2. **Short-term**: Implement document CRUD
3. **Medium-term**: Add wallet integration
4. **Long-term**: Production-ready SDK packaging

## Contributing Back

When we fix something in the SDK:
1. Document the issue
2. Create a test case
3. Submit PR to platform repo
4. Update this guide

Remember: We're pioneering the SDK usage! Every issue we find and fix helps future developers.