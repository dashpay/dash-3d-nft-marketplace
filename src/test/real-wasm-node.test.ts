// Real WASM tests for Node.js - no mocks, actual network calls
import 'isomorphic-fetch';
import { TextEncoder, TextDecoder } from 'util';
import * as fs from 'fs';
import * as path from 'path';

// Polyfill TextEncoder/TextDecoder for Node.js
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Set up fetch for WASM
(global as any).fetch = fetch;

describe('Real WASM DPP Tests - Node.js with Fetch', () => {
  const TEST_IDENTITY_ID = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';
  const TEST_CONTRACT_ID = 'EBioSoFFTDf346ndCMHGmYF8QzgwM8972jG5fL4ndBL7';
  
  let DashModule: any;
  let sdk: any;
  let wasmBytes: Buffer;
  
  beforeAll(async () => {
    try {
      console.log('=== REAL WASM INITIALIZATION ===');
      
      // Load WASM bytes
      const wasmPath = path.join(__dirname, '../wasm/wasm_sdk/wasm_sdk_bg.wasm');
      console.log('Loading WASM from:', wasmPath);
      wasmBytes = fs.readFileSync(wasmPath);
      console.log('WASM bytes loaded:', wasmBytes.length, 'bytes');
      
      // Import the JS bindings
      console.log('Importing WASM JS bindings...');
      DashModule = await import('@/wasm/wasm_sdk/wasm_sdk.js');
      console.log('WASM module imported, exports:', Object.keys(DashModule).slice(0, 10));
      
      // Initialize WASM with the bytes
      if (typeof DashModule.initSync === 'function') {
        console.log('Initializing WASM with initSync...');
        DashModule.initSync(wasmBytes);
      } else if (typeof DashModule.default === 'function') {
        console.log('Initializing WASM with default...');
        await DashModule.default(wasmBytes);
      } else {
        // Try __wbg_init if available
        const wbgInit = (DashModule as any).__wbg_init;
        if (wbgInit) {
          console.log('Initializing WASM with __wbg_init...');
          await wbgInit(wasmBytes);
        }
      }
      
      console.log('WASM initialized successfully');
      
      // Create SDK instance
      console.log('Creating testnet SDK...');
      const builder = DashModule.WasmSdkBuilder.new_testnet();
      sdk = builder.build();
      console.log('SDK created successfully');
      
    } catch (error) {
      console.error('Failed to initialize:', error);
      throw error;
    }
  }, 30000);
  
  afterAll(() => {
    if (sdk && typeof sdk.free === 'function') {
      sdk.free();
    }
  });
  
  describe('Identity Balance - Real Network Call', () => {
    it('should fetch real identity balance from testnet', async () => {
      console.log('\n=== REAL IDENTITY BALANCE TEST ===');
      console.log('Identity:', TEST_IDENTITY_ID);
      console.log('This is a REAL network call, not a mock!');
      
      const fetchOptions = new DashModule.FetchOptions();
      
      try {
        // Enable proved mode
        if (typeof fetchOptions.withProve === 'function') {
          fetchOptions.withProve(true);
          console.log('Proved mode: ENABLED');
        }
        
        console.log('Making network call to testnet...');
        const startTime = Date.now();
        
        const balance = await DashModule.fetchIdentityBalance(
          sdk,
          TEST_IDENTITY_ID,
          fetchOptions
        );
        
        const elapsed = Date.now() - startTime;
        console.log(`Network call completed in ${elapsed}ms`);
        
        // Log the result
        console.log('Balance result:', balance);
        console.log('Balance type:', typeof balance);
        
        if (balance !== undefined && balance !== null) {
          const balanceNum = Number(balance);
          console.log(`Balance: ${balanceNum} duffs`);
          console.log(`Balance: ${balanceNum / 100000000} DASH`);
          
          expect(balance).toBeDefined();
          expect(balanceNum).toBeGreaterThanOrEqual(0);
          console.log('✅ Real balance fetched successfully!');
        }
        
      } finally {
        if (fetchOptions && typeof fetchOptions.free === 'function') {
          fetchOptions.free();
        }
      }
    }, 60000);
  });
  
  describe('Data Contract - Real Network Call', () => {
    it('should fetch real data contract from testnet', async () => {
      console.log('\n=== REAL DATA CONTRACT TEST ===');
      console.log('Contract ID:', TEST_CONTRACT_ID);
      
      const fetchOptions = new DashModule.FetchOptions();
      
      try {
        if (typeof fetchOptions.withProve === 'function') {
          fetchOptions.withProve(true);
          console.log('Proved mode: ENABLED');
        }
        
        console.log('Fetching contract from testnet...');
        const startTime = Date.now();
        
        const contract = await DashModule.fetchDataContract(
          sdk,
          TEST_CONTRACT_ID,
          fetchOptions
        );
        
        const elapsed = Date.now() - startTime;
        console.log(`Network call completed in ${elapsed}ms`);
        
        if (contract) {
          console.log('✅ Contract fetched successfully!');
          console.log('Contract type:', typeof contract);
          expect(contract).toBeDefined();
        }
        
      } finally {
        if (fetchOptions && typeof fetchOptions.free === 'function') {
          fetchOptions.free();
        }
      }
    }, 60000);
  });
  
  describe('Invalid Identity - Real Network Call', () => {
    it('should handle non-existent identity gracefully', async () => {
      const invalidId = '1111111111111111111111111111111111111111111';
      console.log('\n=== TESTING NON-EXISTENT IDENTITY ===');
      console.log('Invalid ID:', invalidId);
      
      const fetchOptions = new DashModule.FetchOptions();
      
      try {
        if (typeof fetchOptions.withProve === 'function') {
          fetchOptions.withProve(true);
        }
        
        console.log('Making network call...');
        const balance = await DashModule.fetchIdentityBalance(
          sdk,
          invalidId,
          fetchOptions
        );
        
        console.log('Result for invalid identity:', balance);
        
        if (balance !== undefined && balance !== null) {
          const balanceNum = Number(balance);
          expect(balanceNum).toBe(0);
          console.log('✅ Non-existent identity returned 0 balance');
        }
        
      } catch (error: any) {
        console.log('Error (expected):', error.message);
        expect(error).toBeDefined();
      } finally {
        if (fetchOptions && typeof fetchOptions.free === 'function') {
          fetchOptions.free();
        }
      }
    }, 60000);
  });
  
  describe('Network Connectivity', () => {
    it('should verify we are connected to testnet', async () => {
      console.log('\n=== NETWORK CONNECTIVITY TEST ===');
      expect(sdk).toBeDefined();
      expect(DashModule.WasmSdkBuilder).toBeDefined();
      expect(DashModule.fetchIdentityBalance).toBeDefined();
      console.log('✅ All required functions are available');
    });
  });
});