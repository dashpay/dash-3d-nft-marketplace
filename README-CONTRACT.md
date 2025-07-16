# NFT 3D Marketplace - Contract Registration

## Contract File
The NFT contract definition is located at: `contracts/nft3d-contract.json`

**IMPORTANT**: Before registering, you need to replace `"ownerId": "REPLACE_WITH_YOUR_IDENTITY_ID"` with your actual identity ID.

## Contract Features
The contract uses Dash Platform's built-in document features:
- **documentsMutable**: false (NFTs cannot be edited after creation)
- **canBeDeleted**: true (NFTs can be deleted by owner)
- **transferable**: 1 (NFTs can be transferred between identities)
- **tradeMode**: 1 (NFTs can be traded on the platform)

### `nft3d` Document Properties
- **name**: NFT name (required)
- **description**: NFT description
- **geometry3d**: 3D geometry data in JSON format, max 3KB (required)
- **geometryType**: Type of geometry - "parametric", "voxel", or "procedural" (required)
- **colors**: Array of hex color codes (max 10)
- **edition**: Edition number for series
- **maxEditions**: Maximum editions for limited series

### System Properties (automatically managed)
- **$ownerId**: Current owner's identity ID
- **$createdAt**: Creation timestamp
- **$updatedAt**: Last update timestamp
- **$transferredAt**: Last transfer timestamp (required)
- **$transferredAtBlockHeight**: Platform block height at transfer (required)
- **$transferredAtCoreBlockHeight**: Core block height at transfer (required)

## Indices
- **owner**: Query NFTs by current owner
- **ownerTransferredAt**: Query NFTs by owner and transfer time

## Registration Steps
1. Install Dash Platform tools if not already installed
2. Update the ownerId in the contract file
3. Register the contract:
   ```bash
   # Using dash-cli or platform tools
   dash-cli platform contracts create contracts/nft3d-contract.json
   ```
4. Save the returned contract ID
5. Update the contract ID in the application code

## CORS/Transport Error Issue
The "Failed to fetch" error you're seeing is due to browser CORS restrictions when trying to connect to Dash testnet evonodes from a web browser.

### Solutions:
1. **Use a CORS proxy** (for development):
   - Set up a local proxy server that adds CORS headers
   - Configure the SDK to use the proxy endpoint

2. **Run a local Dash Platform node** with CORS enabled

3. **Use the SDK in a Node.js backend** instead of directly in the browser

4. **Wait for official Dash Platform web endpoints** with proper CORS configuration

For now, the SDK initialization works, but actual network requests fail due to CORS. The contract registration should still work from command line tools.