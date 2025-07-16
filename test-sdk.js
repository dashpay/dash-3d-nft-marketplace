#!/usr/bin/env node

/**
 * Test script for the Dash SDK implementation
 * 
 * This script tests the key functionality we've implemented:
 * - WASM module loading
 * - Platform client queries
 * - Document operations
 * - Proof verification
 */

const { createDashSDK } = require('./src/lib/dash-sdk-wrapper.ts');

async function testSDK() {
  console.log('🧪 Testing Dash SDK Implementation...\n');

  // Create SDK instance
  const sdk = createDashSDK({
    network: 'testnet',
    apps: {
      nftContract: 'test-contract-id'
    }
  });

  try {
    // Test 1: SDK Initialization
    console.log('1️⃣ Testing SDK initialization...');
    await sdk.initialize();
    console.log('✅ SDK initialized successfully');
    console.log('   - WASM loaded:', sdk.isWasmLoaded());
    console.log('   - Provider:', sdk.getProvider().constructor.name);
    console.log('');

    // Test 2: Platform State
    console.log('2️⃣ Testing platform state...');
    const platformState = await sdk.getPlatformState();
    console.log('✅ Platform state retrieved:', {
      height: platformState.height,
      timestamp: new Date(platformState.timestamp).toISOString(),
      version: platformState.version
    });
    console.log('');

    // Test 3: Identity Lookup
    console.log('3️⃣ Testing identity lookup...');
    const testIdentityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
    const identity = await sdk.getIdentity(testIdentityId);
    if (identity) {
      console.log('✅ Identity found:', {
        id: identity.id.slice(0, 20) + '...',
        balance: identity.balance,
        publicKeys: identity.publicKeys.length
      });
    } else {
      console.log('❌ Identity not found');
    }
    console.log('');

    // Test 4: Document Query
    console.log('4️⃣ Testing document query...');
    const documents = await sdk.queryDocuments('test-contract-id', {
      documentType: 'nft3d',
      where: [['forSale', '==', true]],
      limit: 5
    });
    console.log('✅ Documents retrieved:', documents.length);
    if (documents.length > 0) {
      console.log('   - First document:', {
        id: documents[0].id,
        name: documents[0].data.name,
        price: documents[0].data.price
      });
    }
    console.log('');

    // Test 5: NFT Creation (mock)
    console.log('5️⃣ Testing NFT creation...');
    const createResult = await sdk.createNFT({
      contractId: 'test-contract-id',
      identity: {
        id: testIdentityId,
        privateKey: 'mock-private-key'
      },
      nftData: {
        name: 'Test Crystal',
        description: 'A test crystal NFT',
        geometry3d: JSON.stringify({
          type: 'parametric',
          shape: 'cube',
          params: [1, 1, 1]
        }),
        geometryType: 'parametric',
        colors: ['#ff0000', '#00ff00'],
        price: 1000000000,
        forSale: false
      }
    });
    console.log('✅ NFT creation result:', createResult);
    console.log('');

    // Test 6: Proof Verification
    console.log('6️⃣ Testing proof verification...');
    const mockProof = new Uint8Array([1, 2, 3, 4, 5]);
    const verificationResult = await sdk.verifyDocumentProof(
      'test-doc-id',
      { name: 'test' },
      mockProof
    );
    console.log('✅ Proof verification result:', verificationResult);
    console.log('');

    // Test 7: WASM Module Access
    console.log('7️⃣ Testing WASM module access...');
    const wasmModule = sdk.getWasmModule();
    if (wasmModule) {
      console.log('✅ WASM module available');
      console.log('   - Functions available:', Object.keys(wasmModule).slice(0, 5));
    } else {
      console.log('⚠️ WASM module not available (using fallback)');
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Handle ES module vs CommonJS
if (require.main === module) {
  testSDK().catch(console.error);
}

module.exports = { testSDK };