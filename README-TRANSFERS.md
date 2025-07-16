# NFT Transfers on Dash Platform

## How Transfers Work

With the updated contract structure, NFT transfers are handled natively by Dash Platform using the document's `transferable: 1` and `tradeMode: 1` settings.

### Benefits:
1. **No manual price/sale management** - The platform handles trade negotiations
2. **Automatic transfer tracking** - System fields track all transfers
3. **Built-in ownership verification** - Platform ensures only owners can transfer
4. **Atomic transfers** - No risk of incomplete transfers

### System Fields
When an NFT is transferred, the platform automatically updates:
- `$ownerId` - Changes to the new owner
- `$transferredAt` - Timestamp of the transfer
- `$transferredAtBlockHeight` - Platform block height when transferred
- `$transferredAtCoreBlockHeight` - Core chain block height when transferred

### Transfer Process

1. **Owner initiates transfer** - Using their identity private key
2. **Platform validates ownership** - Ensures sender owns the NFT
3. **Transfer executes atomically** - Ownership changes instantly
4. **History is preserved** - All transfer data is tracked

### Trade Mode

With `tradeMode: 1`, the platform supports:
- **Direct transfers** - Owner can send NFT to any identity
- **Trade negotiations** - Platform can facilitate trades (future feature)
- **Marketplace integration** - Third-party marketplaces can list NFTs

### Querying Transfers

To find recently transferred NFTs:
```javascript
// Query by transfer time
const recentTransfers = await sdk.queryDocuments(contractId, {
  orderBy: [['$transferredAt', 'desc']],
  limit: 20
});

// Query transfers for a specific owner
const ownerTransfers = await sdk.queryDocuments(contractId, {
  where: [['$ownerId', '==', identityId]],
  orderBy: [['$transferredAt', 'desc']]
});
```

### Future Platform Features

The Dash Platform roadmap includes:
- **Built-in marketplace** - Buy/sell directly on platform
- **Escrow services** - Secure trades with conditions
- **Batch transfers** - Transfer multiple NFTs at once
- **Cross-contract trades** - Trade different document types

### Current Limitations

As of now:
- The WASM SDK doesn't yet expose the native transfer method
- Trade negotiations are not yet implemented
- Marketplace features are still in development

For now, transfers would need to be implemented through:
1. Platform CLI tools
2. Direct gRPC/HTTP API calls
3. Future WASM SDK updates