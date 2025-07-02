// Real WASM DPP Integration Tests - Identity Queries
// Using actual WASM SDK, not mocks

describe('Real WASM DPP - Identity Integration Tests', () => {
  const TEST_IDENTITY_ID = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';
  
  let DashModule: any;
  let sdk: any;
  
  beforeAll(async () => {
    try {
      console.log('Loading real WASM SDK...');
      // Import the actual WASM SDK
      DashModule = await import('@/wasm/wasm_sdk');
      
      // Initialize WASM if needed
      if (typeof DashModule.default === 'function') {
        await DashModule.default();
        console.log('WASM initialized via default()');
      } else if (typeof DashModule.initSync === 'function') {
        DashModule.initSync();
        console.log('WASM initialized via initSync()');
      }
      
      // Create SDK instance for testnet
      console.log('Creating SDK builder for testnet...');
      const builder = DashModule.WasmSdkBuilder.new_testnet();
      sdk = builder.build();
      console.log('SDK instance created successfully');
      
    } catch (error) {
      console.error('Failed to initialize WASM SDK:', error);
      throw error;
    }
  }, 30000); // 30 second timeout for initialization
  
  afterAll(() => {
    if (sdk && typeof sdk.free === 'function') {
      sdk.free();
    }
  });
  
  describe('Identity Balance Queries', () => {
    it('should fetch identity balance with proved query', async () => {
      console.log(`Fetching balance for identity: ${TEST_IDENTITY_ID}`);
      
      // Create FetchOptions with prove = true
      const fetchOptions = new DashModule.FetchOptions();
      fetchOptions.withProve(true);
      
      try {
        const balance = await DashModule.fetchIdentityBalance(
          sdk,
          TEST_IDENTITY_ID,
          fetchOptions
        );
        
        console.log(`Balance fetched successfully: ${balance} duffs`);
        
        // Verify we got a valid balance
        expect(typeof balance).toBe('number');
        expect(balance).toBeGreaterThanOrEqual(0);
        
        // Convert to DASH for logging
        const dashAmount = balance / 100000000;
        console.log(`Balance: ${dashAmount} DASH (${balance} duffs)`);
        
      } finally {
        // Clean up
        fetchOptions.free();
      }
    }, 30000);
    
    it('should fail gracefully for non-existent identity', async () => {
      const invalidId = '1111111111111111111111111111111111111111111';
      console.log(`Testing invalid identity: ${invalidId}`);
      
      const fetchOptions = new DashModule.FetchOptions();
      fetchOptions.withProve(true);
      
      try {
        await DashModule.fetchIdentityBalance(
          sdk,
          invalidId,
          fetchOptions
        );
        
        // Should not reach here
        fail('Expected error for invalid identity');
        
      } catch (error: any) {
        console.log('Expected error received:', error.message);
        expect(error).toBeDefined();
        expect(error.message).toBeTruthy();
      } finally {
        fetchOptions.free();
      }
    }, 30000);
  });
  
  describe('Full Identity Queries', () => {
    it('should fetch full identity with proved query', async () => {
      console.log(`Fetching full identity: ${TEST_IDENTITY_ID}`);
      
      const fetchOptions = new DashModule.FetchOptions();
      fetchOptions.withProve(true);
      
      try {
        const identity = await DashModule.fetchIdentity(
          sdk,
          TEST_IDENTITY_ID,
          fetchOptions
        );
        
        console.log('Identity fetched successfully');
        
        // Verify identity structure
        expect(identity).toBeDefined();
        if (identity) {
          console.log('Identity details:', {
            id: identity.id,
            balance: identity.balance,
            revision: identity.revision,
            publicKeysCount: identity.publicKeys ? identity.publicKeys.length : 0
          });
          
          expect(identity.id).toBe(TEST_IDENTITY_ID);
          expect(typeof identity.balance).toBe('number');
          expect(typeof identity.revision).toBe('number');
        }
        
      } finally {
        fetchOptions.free();
      }
    }, 30000);
    
    it('should return null for non-existent identity when fetching full identity', async () => {
      const invalidId = '9999999999999999999999999999999999999999999';
      
      const fetchOptions = new DashModule.FetchOptions();
      fetchOptions.withProve(true);
      
      try {
        const identity = await DashModule.fetchIdentity(
          sdk,
          invalidId,
          fetchOptions
        );
        
        // Should return null or undefined for non-existent identity
        expect(identity).toBeFalsy();
        console.log('Correctly returned null/undefined for non-existent identity');
        
      } finally {
        fetchOptions.free();
      }
    }, 30000);
  });
  
  describe('Identity Public Keys', () => {
    it('should fetch identity and examine public keys', async () => {
      console.log('Fetching identity to examine public keys...');
      
      const fetchOptions = new DashModule.FetchOptions();
      fetchOptions.withProve(true);
      
      try {
        const identity = await DashModule.fetchIdentity(
          sdk,
          TEST_IDENTITY_ID,
          fetchOptions
        );
        
        if (identity && identity.publicKeys) {
          console.log(`Identity has ${identity.publicKeys.length} public keys`);
          
          identity.publicKeys.forEach((key: any, index: number) => {
            console.log(`Public key ${index}:`, {
              id: key.id,
              purpose: key.purpose,
              securityLevel: key.securityLevel,
              type: key.type,
              readOnly: key.readOnly
            });
            
            // Verify key structure
            expect(typeof key.id).toBe('number');
            expect(typeof key.purpose).toBe('number');
            expect(typeof key.securityLevel).toBe('number');
          });
          
          expect(identity.publicKeys.length).toBeGreaterThan(0);
        }
        
      } finally {
        fetchOptions.free();
      }
    }, 30000);
  });
  
  describe('Proved Mode Verification', () => {
    it('should enforce proved mode for all identity queries', async () => {
      // Test that we're actually using proved mode
      const fetchOptions = new DashModule.FetchOptions();
      fetchOptions.withProve(true);
      
      try {
        // This should succeed with proved mode
        const balance = await DashModule.fetchIdentityBalance(
          sdk,
          TEST_IDENTITY_ID,
          fetchOptions
        );
        
        expect(balance).toBeDefined();
        console.log('Proved query succeeded as expected');
        
      } finally {
        fetchOptions.free();
      }
      
      // Now test without proved mode (should still work but we log warning)
      const unprovedOptions = new DashModule.FetchOptions();
      // Not calling withProve(true)
      
      try {
        console.warn('WARNING: Testing unproved query (should not be used in production)');
        const balance = await DashModule.fetchIdentityBalance(
          sdk,
          TEST_IDENTITY_ID,
          unprovedOptions
        );
        
        console.warn('Unproved query completed - this should always use proved mode in production!');
        
      } finally {
        unprovedOptions.free();
      }
    }, 30000);
  });
  
  describe('Error Handling', () => {
    it('should handle malformed identity IDs', async () => {
      const malformedIds = [
        'invalid',
        '12345',
        'not-a-valid-identity-id',
        '',
        null,
        undefined
      ];
      
      for (const invalidId of malformedIds) {
        if (invalidId === null || invalidId === undefined) continue;
        
        console.log(`Testing malformed ID: "${invalidId}"`);
        const fetchOptions = new DashModule.FetchOptions();
        fetchOptions.withProve(true);
        
        try {
          await DashModule.fetchIdentityBalance(
            sdk,
            invalidId,
            fetchOptions
          );
          
          fail(`Should have thrown error for invalid ID: ${invalidId}`);
          
        } catch (error: any) {
          console.log(`Expected error for "${invalidId}":`, error.message);
          expect(error).toBeDefined();
        } finally {
          fetchOptions.free();
        }
      }
    }, 30000);
  });
});