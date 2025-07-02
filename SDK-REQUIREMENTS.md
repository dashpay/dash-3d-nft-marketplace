# JS SDK Requirements Discovered

This document tracks what we need from the JS SDK based on building a real application.

## ✅ Currently Mocked (Needs Implementation)

### 1. Identity Operations
```typescript
// Need: Check if identity exists
sdk.getIdentity(identityId: string): Promise<Identity | null>

// Identity should include:
interface Identity {
  id: string;
  balance: number;  // In credits
  publicKeys: PublicKey[];
  revision: number;
}
```

### 2. Document Queries
```typescript
// Need: Query documents with filtering and sorting
sdk.queryDocuments(contractId: string, query: {
  where?: Array<[field: string, operator: string, value: any]>;
  orderBy?: Array<[field: string, direction: 'asc' | 'desc']>;
  limit?: number;
  startAfter?: string;  // For pagination
}): Promise<Document[]>
```

### 3. Single Document Fetch
```typescript
// Need: Get document by ID
sdk.getDocument(contractId: string, documentId: string): Promise<Document | null>
```

## 🚧 Not Yet Implemented (Future Needs)

### 4. Document Mutations
```typescript
// Need: Create new NFT
sdk.createDocument(contractId: string, identity: Identity, data: any): Promise<Document>

// Need: Update NFT (price, sale status)
sdk.updateDocument(contractId: string, documentId: string, identity: Identity, updates: any): Promise<Document>

// Need: Transfer ownership
sdk.transferDocument(contractId: string, documentId: string, fromIdentity: Identity, toIdentityId: string): Promise<Document>
```

### 5. Batch Operations
```typescript
// Need: Create multiple NFTs at once
sdk.createDocumentsBatch(contractId: string, identity: Identity, documents: any[]): Promise<Document[]>
```

### 6. Real-time Subscriptions
```typescript
// Need: Watch for new NFTs
sdk.subscribeToDocuments(contractId: string, query: any, callback: (doc: Document) => void): () => void

// Need: Watch identity balance
sdk.subscribeToIdentity(identityId: string, callback: (identity: Identity) => void): () => void
```

## 📊 Query Patterns Needed

### For NFT Marketplace:

1. **Get NFTs by Owner**
   ```javascript
   where: [['ownerId', '==', identityId]]
   orderBy: [['createdAt', 'desc']]
   ```

2. **Get NFTs for Sale**
   ```javascript
   where: [['forSale', '==', true]]
   orderBy: [['price', 'asc']]
   ```

3. **Search by Name**
   ```javascript
   where: [['name', 'contains', searchTerm]]  // Need text search?
   ```

4. **Filter by Price Range**
   ```javascript
   where: [
     ['forSale', '==', true],
     ['price', '>=', minPrice],
     ['price', '<=', maxPrice]
   ]
   ```

5. **Get by Attributes**
   ```javascript
   where: [['attributes.rarity', '==', 'legendary']]
   ```

## 🔒 Security Requirements

1. **Input Validation**
   - Validate identity ID format before queries
   - Sanitize document data before creation
   - Verify ownership before updates

2. **Error Handling**
   - Network timeouts
   - Invalid contract IDs
   - Insufficient balance
   - Document not found

3. **Rate Limiting**
   - Consider query costs
   - Implement client-side throttling

## 🎯 Performance Considerations

1. **Caching**
   - Cache identity lookups (TTL: 5 minutes)
   - Cache document queries (TTL: 1 minute)
   - Invalidate on mutations

2. **Pagination**
   - Support cursor-based pagination
   - Default limit: 20 documents
   - Maximum limit: 100 documents

3. **Batch Loading**
   - Fetch multiple documents by IDs
   - Combine similar queries

## 🌐 Browser Requirements

1. **WASM Support**
   - Detect WebAssembly availability
   - Provide fallback or error message

2. **Storage**
   - Use IndexedDB for caching
   - Handle storage quota errors

3. **Network**
   - Handle offline scenarios
   - Retry failed requests

## 📝 Developer Experience

1. **TypeScript Support**
   - Full type definitions
   - Generics for document types
   - Proper error types

2. **Debugging**
   - Verbose logging mode
   - Network request inspector
   - Performance metrics

3. **Testing**
   - Mock mode for unit tests
   - Testnet/Mainnet switching
   - Deterministic test data

## ✅ Implemented Components

### WebServiceProvider (Context Provider)
```typescript
// Implemented and working
const provider = new WebServiceProvider({
  network: 'testnet',
  nodeList: [/* developer provides IPs */],
  quorumServiceUrl: 'https://quorums.testnet.networks.dash.org'
});

// Provides:
- getQuorumPublicKey() - for proof verification
- getCurrentQuorum() - latest quorum info
- selectBestNode() - node selection logic
- getHealthyNodes() - connectivity testing
```

### What the Provider Handles
1. **Quorum Information**
   - Fetches from `/quorums` and `/previous` endpoints
   - Caches quorum public keys
   - Handles quorum transitions (8 blocks backup)

2. **Node Management**
   - Developers provide their own node IPs
   - Basic health checking
   - Random selection (can be customized)

## 🔄 SDK Integration Status

### What's Ready
- ✅ WebServiceProvider implementation
- ✅ Quorum data fetching and caching
- ✅ Node list management
- ✅ Basic health checking

### What's Still Needed
- ⏳ WASM module initialization
- ⏳ Actual platform queries (using node endpoints)
- ⏳ Proof verification using quorum keys
- ⏳ Data contract fetching
- ⏳ Document CRUD operations

## Update Log

- **2024-12-28**: Initial requirements based on NFT marketplace needs
- **2024-12-28**: Implemented WebServiceProvider based on Rust trait requirements
  - Added quorum fetching from web service
  - Added node list management (developer-provided IPs)
  - Simplified requirements based on actual platform needs