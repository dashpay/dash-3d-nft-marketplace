# NFT 3D Contract - Simplified Version

## Current Contract Status
The contract has been simplified to focus on essential NFT properties.

### Final Indices:
Only 2 indices for efficient queries:
1. **owner** - Find all NFTs by owner
2. **ownerTransferredAt** - Find NFTs by owner sorted by transfer time

### What was removed:
1. **`creatorId`** - The platform tracks the original creator through the creation transaction
2. **`attributes`** - Removed custom attributes to keep the contract simpler
3. **`price` and `forSale`** - Using platform's native transfer and trade features
4. **Separate transfer document** - Platform tracks transfers automatically

### Current Structure:
- **Core Properties**: name, description, 3D geometry data
- **Visual Properties**: geometry type, colors, editions
- **System Properties**: All managed by platform ($ownerId, $createdAt, etc.)

### Benefits:
1. **Smaller contract** - Less storage cost per NFT
2. **Simpler code** - Fewer fields to manage
3. **Platform native** - Uses built-in transfer/trade features
4. **Future-proof** - Can leverage platform marketplace when available

## To Register:
1. Replace `REPLACE_WITH_YOUR_IDENTITY_ID` in `nft3d-contract.json`
2. Use Dash Platform CLI to register
3. Update `.env` with: `NEXT_PUBLIC_TESTNET_CONTRACT_ID=your_contract_id`

## Example NFT Document:
```json
{
  "name": "Crystal Sphere",
  "description": "A shimmering crystal sphere",
  "geometry3d": "{\"type\":\"parametric\",\"shape\":\"sphere\",\"params\":[1,32,16]}",
  "geometryType": "parametric",
  "colors": ["#00ffff", "#ff00ff"],
  "edition": 1,
  "maxEditions": 10
}
```

System will add: $ownerId, $createdAt, $updatedAt, $transferredAt, etc.