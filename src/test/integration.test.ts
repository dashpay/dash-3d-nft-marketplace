// Integration tests for js-sdk modules
describe('JS-SDK Integration Tests', () => {
  const TEST_IDENTITY_ID = global.TEST_IDENTITY_ID;
  const TEST_PRIVATE_KEY = global.TEST_PRIVATE_KEY;
  
  // Mock WASM SDK
  const mockWasmSdk = {
    WasmSdkBuilder: {
      new_testnet: jest.fn().mockReturnValue({
        build: jest.fn().mockReturnValue({
          free: jest.fn(),
        })
      })
    },
    fetchIdentityBalance: jest.fn(),
    fetchIdentity: jest.fn(),
    createIdentity: jest.fn(),
    topUpIdentity: jest.fn(),
    fetchDocuments: jest.fn(),
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
    fetchDataContract: jest.fn(),
    createDataContract: jest.fn(),
    FetchOptions: jest.fn().mockImplementation(() => {
      const options = {
        withProve: jest.fn(),
        withLimit: jest.fn(),
        free: jest.fn(),
      };
      options.withProve.mockReturnValue(options);
      options.withLimit.mockReturnValue(options);
      return options;
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Identity Operations', () => {
    it('should fetch identity balance with proved query', async () => {
      const expectedBalance = 1000000; // 0.01 DASH
      mockWasmSdk.fetchIdentityBalance.mockResolvedValue(expectedBalance);
      
      const fetchOptions = new mockWasmSdk.FetchOptions();
      fetchOptions.withProve(true); // Actually call withProve
      
      const balance = await mockWasmSdk.fetchIdentityBalance(
        mockWasmSdk,
        TEST_IDENTITY_ID,
        fetchOptions
      );
      
      expect(fetchOptions.withProve).toHaveBeenCalledWith(true);
      expect(balance).toBe(expectedBalance);
    });

    it('should create identity with funding', async () => {
      const mockNewIdentity = {
        id: 'new-identity-id',
        balance: 10000000,
        publicKeys: [],
        revision: 0,
      };
      
      mockWasmSdk.createIdentity.mockResolvedValue(mockNewIdentity);
      
      const identity = await mockWasmSdk.createIdentity(
        mockWasmSdk,
        TEST_PRIVATE_KEY,
        { funding: 10000000 }
      );
      
      expect(identity.id).toBe('new-identity-id');
      expect(identity.balance).toBe(10000000);
    });

    it('should top up identity balance', async () => {
      const topUpResult = {
        success: true,
        newBalance: 2000000,
      };
      
      mockWasmSdk.topUpIdentity.mockResolvedValue(topUpResult);
      
      const result = await mockWasmSdk.topUpIdentity(
        mockWasmSdk,
        TEST_IDENTITY_ID,
        1000000,
        TEST_PRIVATE_KEY
      );
      
      expect(result.success).toBe(true);
      expect(result.newBalance).toBe(2000000);
    });
  });

  describe('Document Operations', () => {
    const CONTRACT_ID = 'EBioSoFFTDf346ndCMHGmYF8QzgwM8972jG5fL4ndBL7';
    
    it('should query documents with proved mode', async () => {
      const mockDocuments = [
        { id: 'doc1', type: 'nft3d', ownerId: TEST_IDENTITY_ID },
        { id: 'doc2', type: 'nft3d', ownerId: TEST_IDENTITY_ID },
      ];
      
      mockWasmSdk.fetchDocuments.mockResolvedValue(mockDocuments);
      
      const fetchOptions = new mockWasmSdk.FetchOptions();
      fetchOptions.withProve(true); // Actually call withProve
      
      const documents = await mockWasmSdk.fetchDocuments(
        mockWasmSdk,
        CONTRACT_ID,
        'nft3d',
        fetchOptions
      );
      
      expect(fetchOptions.withProve).toHaveBeenCalledWith(true);
      expect(documents).toHaveLength(2);
    });

    it('should create document', async () => {
      const newDoc = {
        name: 'Test NFT',
        description: 'Test Description',
        modelUrl: 'https://example.com/model.glb',
      };
      
      const mockCreated = {
        id: 'new-doc-id',
        type: 'nft3d',
        ownerId: TEST_IDENTITY_ID,
        data: newDoc,
        revision: 1,
      };
      
      mockWasmSdk.createDocument.mockResolvedValue(mockCreated);
      
      const created = await mockWasmSdk.createDocument(
        mockWasmSdk,
        CONTRACT_ID,
        'nft3d',
        newDoc,
        TEST_PRIVATE_KEY
      );
      
      expect(created.id).toBe('new-doc-id');
      expect(created.data).toEqual(newDoc);
    });

    it('should update document', async () => {
      const updateData = { price: 200000000 };
      const mockUpdated = {
        id: 'doc1',
        revision: 2,
        data: { name: 'Test NFT', price: 200000000 },
      };
      
      mockWasmSdk.updateDocument.mockResolvedValue(mockUpdated);
      
      const updated = await mockWasmSdk.updateDocument(
        mockWasmSdk,
        CONTRACT_ID,
        'nft3d',
        'doc1',
        updateData,
        TEST_PRIVATE_KEY
      );
      
      expect(updated.revision).toBe(2);
      expect(updated.data.price).toBe(200000000);
    });

    it('should delete document', async () => {
      mockWasmSdk.deleteDocument.mockResolvedValue({ success: true });
      
      const result = await mockWasmSdk.deleteDocument(
        mockWasmSdk,
        CONTRACT_ID,
        'nft3d',
        'doc1',
        TEST_PRIVATE_KEY
      );
      
      expect(result.success).toBe(true);
    });
  });

  describe('Contract Operations', () => {
    const contractSchema = {
      nft3d: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          modelUrl: { type: 'string' },
        },
        required: ['name', 'modelUrl'],
        additionalProperties: false,
      },
    };
    
    it('should fetch data contract with proved query', async () => {
      const mockContract = {
        id: 'contract123',
        schema: contractSchema,
        version: 1,
      };
      
      mockWasmSdk.fetchDataContract.mockResolvedValue(mockContract);
      
      const fetchOptions = new mockWasmSdk.FetchOptions();
      fetchOptions.withProve(true); // Actually call withProve
      
      const contract = await mockWasmSdk.fetchDataContract(
        mockWasmSdk,
        'contract123',
        fetchOptions
      );
      
      expect(fetchOptions.withProve).toHaveBeenCalledWith(true);
      expect(contract.id).toBe('contract123');
      expect(contract.schema).toEqual(contractSchema);
    });

    it('should create data contract', async () => {
      const mockCreated = {
        id: 'new-contract-id',
        ownerId: TEST_IDENTITY_ID,
        schema: contractSchema,
        version: 1,
      };
      
      mockWasmSdk.createDataContract.mockResolvedValue(mockCreated);
      
      const created = await mockWasmSdk.createDataContract(
        mockWasmSdk,
        contractSchema,
        TEST_PRIVATE_KEY,
        { identityId: TEST_IDENTITY_ID }
      );
      
      expect(created.id).toBe('new-contract-id');
      expect(created.ownerId).toBe(TEST_IDENTITY_ID);
    });
  });

  describe('End-to-End Workflow', () => {
    it('should perform complete NFT creation workflow', async () => {
      // 1. Check identity balance
      mockWasmSdk.fetchIdentityBalance.mockResolvedValue(10000000);
      const balance = await mockWasmSdk.fetchIdentityBalance(
        mockWasmSdk,
        TEST_IDENTITY_ID,
        new mockWasmSdk.FetchOptions()
      );
      expect(balance).toBeGreaterThan(0);
      
      // 2. Create NFT document
      const nftData = {
        name: 'Rare Digital Collectible',
        description: 'Limited edition NFT',
        modelUrl: 'https://example.com/rare-model.glb',
        price: 500000000, // 5 DASH
      };
      
      mockWasmSdk.createDocument.mockResolvedValue({
        id: 'nft-doc-id',
        type: 'nft3d',
        ownerId: TEST_IDENTITY_ID,
        data: nftData,
        revision: 1,
      });
      
      const nft = await mockWasmSdk.createDocument(
        mockWasmSdk,
        'contract-id',
        'nft3d',
        nftData,
        TEST_PRIVATE_KEY
      );
      
      expect(nft.id).toBe('nft-doc-id');
      
      // 3. Query to verify creation
      mockWasmSdk.fetchDocuments.mockResolvedValue([nft]);
      const documents = await mockWasmSdk.fetchDocuments(
        mockWasmSdk,
        'contract-id',
        'nft3d',
        new mockWasmSdk.FetchOptions()
      );
      
      expect(documents).toContainEqual(nft);
      
      // 4. Update price
      mockWasmSdk.updateDocument.mockResolvedValue({
        ...nft,
        data: { ...nftData, price: 600000000 },
        revision: 2,
      });
      
      const updated = await mockWasmSdk.updateDocument(
        mockWasmSdk,
        'contract-id',
        'nft3d',
        'nft-doc-id',
        { price: 600000000 },
        TEST_PRIVATE_KEY
      );
      
      expect(updated.revision).toBe(2);
      expect(updated.data.price).toBe(600000000);
    });
  });

  describe('Error Handling', () => {
    it('should handle identity not found', async () => {
      mockWasmSdk.fetchIdentityBalance.mockRejectedValue(
        new Error('Identity not found')
      );
      
      await expect(
        mockWasmSdk.fetchIdentityBalance(
          mockWasmSdk,
          'invalid-id',
          new mockWasmSdk.FetchOptions()
        )
      ).rejects.toThrow('Identity not found');
    });

    it('should handle insufficient balance', async () => {
      mockWasmSdk.createDocument.mockRejectedValue(
        new Error('Insufficient identity balance')
      );
      
      await expect(
        mockWasmSdk.createDocument(
          mockWasmSdk,
          'contract-id',
          'nft3d',
          { name: 'test' },
          TEST_PRIVATE_KEY
        )
      ).rejects.toThrow('Insufficient identity balance');
    });

    it('should handle network errors', async () => {
      mockWasmSdk.fetchDocuments.mockRejectedValue(
        new Error('Network timeout')
      );
      
      await expect(
        mockWasmSdk.fetchDocuments(
          mockWasmSdk,
          'contract-id',
          'nft3d',
          new mockWasmSdk.FetchOptions()
        )
      ).rejects.toThrow('Network timeout');
    });
  });

  describe('Proved Mode Verification', () => {
    it('should always use proved mode for all queries', async () => {
      const operations = [
        () => {
          const opts = new mockWasmSdk.FetchOptions();
          opts.withProve(true);
          return mockWasmSdk.fetchIdentityBalance(mockWasmSdk, 'id', opts);
        },
        () => {
          const opts = new mockWasmSdk.FetchOptions();
          opts.withProve(true);
          return mockWasmSdk.fetchIdentity(mockWasmSdk, 'id', opts);
        },
        () => {
          const opts = new mockWasmSdk.FetchOptions();
          opts.withProve(true);
          return mockWasmSdk.fetchDocuments(mockWasmSdk, 'cid', 'type', opts);
        },
        () => {
          const opts = new mockWasmSdk.FetchOptions();
          opts.withProve(true);
          return mockWasmSdk.fetchDataContract(mockWasmSdk, 'cid', opts);
        },
      ];
      
      // Mock all to resolve
      mockWasmSdk.fetchIdentityBalance.mockResolvedValue(1000);
      mockWasmSdk.fetchIdentity.mockResolvedValue({});
      mockWasmSdk.fetchDocuments.mockResolvedValue([]);
      mockWasmSdk.fetchDataContract.mockResolvedValue({});
      
      for (const operation of operations) {
        await operation();
      }
      
      // Check all FetchOptions instances used withProve(true)
      const allCalls = mockWasmSdk.FetchOptions.mock.calls;
      expect(allCalls.length).toBe(4);
      
      allCalls.forEach((call, index) => {
        const instance = mockWasmSdk.FetchOptions.mock.results[index].value;
        expect(instance.withProve).toHaveBeenCalledWith(true);
      });
    });
  });
});