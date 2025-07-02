# Dash Platform NFT Contract Registration Guide

## Current Situation

We have successfully:
1. ✅ Verified the private key `XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf` matches identity `5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk`
2. ✅ Created a valid NFT contract definition
3. ✅ Generated a contract ID locally: `AyWK6nDVfb8d1ZmkM5MmZZrThbUyWyso1aMeGuuVSfxf`

**Issue**: The Dash SDK requires the identity to be imported into the wallet, not just have the matching private key.

## Solution Options

### Option 1: Use Dash CLI (Recommended)

```bash
# Install Dash CLI globally
npm install -g @dashevo/dash-cli

# Export your credentials
export DASH_IDENTITY_ID="5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk"
export DASH_PRIVATE_KEY="XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf"

# Register the contract
dash contract create \
  --network testnet \
  --identity "$DASH_IDENTITY_ID" \
  --private-key "$DASH_PRIVATE_KEY" \
  --definition contracts/nft3d-contract-final.json
```

### Option 2: Use cURL with Platform API

```bash
# First, sign the contract with your private key
# Then submit it to a Dash Platform node

curl -X POST https://seed-1.testnet.networks.dash.org:1443/platform/v1/contracts \
  -H "Content-Type: application/json" \
  -d @contracts/contract-for-registration.json
```

### Option 3: Import Identity to Wallet First

Create a script to import the identity:

```javascript
// import-identity.js
const Dash = require('dash');

async function importIdentity() {
  const client = new Dash.Client({
    network: 'testnet',
    wallet: {
      mnemonic: null,
      privateKey: 'XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf'
    }
  });

  const account = await client.getWalletAccount();
  
  // This would import the identity if the SDK supported it
  // Currently, identities must be created from the wallet
}
```

### Option 4: Use Python Dash Platform Client

```python
from dash_platform import Client, Identity, Contract

client = Client('testnet')
identity = Identity.from_id('5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk')
contract_def = json.load(open('contracts/nft3d-contract-final.json'))

contract = Contract(contract_def, identity)
contract.sign(private_key='XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf')
contract.broadcast(client)
```

## Contract Details

**Contract Definition**: `contracts/nft3d-contract-final.json`
```json
{
  "nft3d": {
    "type": "object",
    "properties": {
      "name": { "type": "string", "position": 0 },
      "description": { "type": "string", "position": 1 },
      "geometry3d": { "type": "string", "position": 2 },
      "geometryType": { "type": "string", "position": 3 },
      "edition": { "type": "integer", "position": 4 },
      "maxEditions": { "type": "integer", "position": 5 }
    },
    "additionalProperties": false
  }
}
```

## After Registration

Once registered, update your `.env` file:
```
NEXT_PUBLIC_TESTNET_CONTRACT_ID=<your-contract-id>
```

## Technical Background

The issue occurs because:
1. Dash SDK's wallet implementation expects identities to be created FROM the wallet
2. When you provide an existing identity ID with a private key, the SDK can't properly associate them
3. The platform requires cryptographic proof that the private key controls the identity

This is a known limitation of the current SDK version when working with pre-existing identities.