# Contract Registration Instructions

## Contract Details
- **Identity ID**: 5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk
- **Private Key**: XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf
- **Contract File**: contracts/nft3d-contract.json

## Registration Methods

### Method 1: Using Dash SDK CLI (Recommended)

```bash
# Install Dash SDK CLI if not already installed
npm install -g @dashpay/sdk-cli

# Set your identity credentials
export DASH_IDENTITY_ID="5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk"
export DASH_PRIVATE_KEY="XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf"

# Register the contract
dash-cli contracts create \
  --network testnet \
  --identity-id "$DASH_IDENTITY_ID" \
  --private-key "$DASH_PRIVATE_KEY" \
  --contract-file contracts/nft3d-contract.json
```

### Method 2: Using Node.js Script

Create a file `register-contract.js`:

```javascript
const Dash = require('dash');

async function registerContract() {
  const client = new Dash.Client({
    network: 'testnet',
    wallet: {
      mnemonic: null, // We'll use private key instead
      privateKey: 'XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf'
    }
  });

  const identity = await client.platform.identities.get('5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk');
  
  const contractDefinition = require('./contracts/nft3d-contract.json');
  
  const contract = await client.platform.contracts.create(contractDefinition, identity);
  
  console.log('Contract registered!');
  console.log('Contract ID:', contract.toJSON().id);
  
  return contract.toJSON().id;
}

registerContract()
  .then(contractId => {
    console.log('Success! Add this to your .env file:');
    console.log(`NEXT_PUBLIC_TESTNET_CONTRACT_ID=${contractId}`);
  })
  .catch(console.error);
```

### Method 3: Using Python (dash-platform-python)

```python
import json
from dash_platform import Client, Identity

# Initialize client
client = Client(network='testnet')

# Load identity with private key
identity = Identity.from_private_key(
    'XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf',
    client
)

# Load contract definition
with open('contracts/nft3d-contract.json', 'r') as f:
    contract_def = json.load(f)

# Register contract
contract = client.contracts.create(contract_def, identity)

print(f"Contract registered! ID: {contract.id}")
print(f"Add to .env: NEXT_PUBLIC_TESTNET_CONTRACT_ID={contract.id}")
```

## Important Notes

1. **Check Balance**: Ensure your identity has sufficient credits for contract registration
2. **Network**: This is for testnet. For mainnet, change network parameter
3. **Save Contract ID**: The returned contract ID is permanent - save it immediately
4. **Update .env**: Add the contract ID to your `.env` file

## After Registration

1. Create `.env` file in project root:
```
NEXT_PUBLIC_TESTNET_CONTRACT_ID=<your-contract-id>
```

2. The contract ID will look something like:
```
GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec
```

3. Test the contract by querying it:
```javascript
const contract = await client.platform.contracts.get(contractId);
console.log(contract.toJSON());
```

## Troubleshooting

- **Insufficient funds**: Top up your identity with testnet DASH
- **Invalid contract**: Check JSON syntax and required fields
- **Network errors**: Ensure you're connected to testnet
- **Identity not found**: Verify the identity exists on testnet

## Security Note

**NEVER commit your private key to git!** The private key in this document should only be used for testnet.