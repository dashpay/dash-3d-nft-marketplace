// Tests for type definitions and type guards
import { 
  Network,
  SDKOptions,
  WalletOptions,
  AppDefinition,
  StateTransition,
  BlockHeight,
  ContextProvider,
  StateTransitionResult
} from '../dash-sdk-src/core/types';

describe('Core Types', () => {
  describe('Network Type', () => {
    it('should accept valid network configurations', () => {
      const testnet: Network = { name: 'testnet', type: 'testnet' };
      const mainnet: Network = { name: 'mainnet', type: 'mainnet' };
      const devnet: Network = { name: 'devnet', type: 'devnet' };
      
      expect(testnet.type).toBe('testnet');
      expect(mainnet.type).toBe('mainnet');
      expect(devnet.type).toBe('devnet');
    });

    it('should allow custom network names', () => {
      const customNet: Network = { name: 'custom-testnet-1', type: 'testnet' };
      expect(customNet.name).toBe('custom-testnet-1');
      expect(customNet.type).toBe('testnet');
    });
  });

  describe('SDKOptions Type', () => {
    it('should accept minimal configuration', () => {
      const options: SDKOptions = {};
      expect(options).toBeDefined();
    });

    it('should accept full configuration', () => {
      const options: SDKOptions = {
        network: 'testnet',
        wallet: {
          mnemonic: 'test mnemonic phrase',
          bluetooth: false
        },
        apps: {
          myApp: { contractId: 'contract123' }
        },
        retries: 3,
        timeout: 30000
      };
      
      expect(options.network).toBe('testnet');
      expect(options.wallet?.mnemonic).toBe('test mnemonic phrase');
      expect(options.apps?.myApp.contractId).toBe('contract123');
      expect(options.retries).toBe(3);
      expect(options.timeout).toBe(30000);
    });

    it('should accept network as object or string', () => {
      const stringNetwork: SDKOptions = { network: 'testnet' };
      const objectNetwork: SDKOptions = { 
        network: { name: 'testnet', type: 'testnet' } 
      };
      
      expect(stringNetwork.network).toBe('testnet');
      expect((objectNetwork.network as Network).type).toBe('testnet');
    });
  });

  describe('WalletOptions Type', () => {
    it('should accept mnemonic configuration', () => {
      const wallet: WalletOptions = {
        mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
      };
      expect(wallet.mnemonic).toBeDefined();
    });

    it('should accept private key configuration', () => {
      const wallet: WalletOptions = {
        privateKey: global.TEST_PRIVATE_KEY
      };
      expect(wallet.privateKey).toBe(global.TEST_PRIVATE_KEY);
    });

    it('should accept bluetooth configuration', () => {
      const wallet: WalletOptions = {
        bluetooth: true
      };
      expect(wallet.bluetooth).toBe(true);
    });

    it('should accept seed configuration', () => {
      const wallet: WalletOptions = {
        seed: 'hex-encoded-seed-value'
      };
      expect(wallet.seed).toBeDefined();
    });
  });

  describe('AppDefinition Type', () => {
    it('should require contractId', () => {
      const app: AppDefinition = {
        contractId: 'EBioSoFFTDf346ndCMHGmYF8QzgwM8972jG5fL4ndBL7'
      };
      expect(app.contractId).toBeDefined();
      expect(app.contractId.length).toBeGreaterThan(0);
    });

    it('should optionally include contract object', () => {
      const app: AppDefinition = {
        contractId: 'contract123',
        contract: { schema: {}, version: 1 }
      };
      expect(app.contract).toBeDefined();
    });
  });

  describe('StateTransition Type', () => {
    it('should implement toBuffer method', () => {
      const stateTransition: StateTransition = {
        toBuffer: () => Buffer.from('test-data'),
        signature: Buffer.from('signature-data')
      };
      
      const buffer = stateTransition.toBuffer();
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.toString()).toBe('test-data');
    });

    it('should optionally include signature', () => {
      const withSignature: StateTransition = {
        toBuffer: () => Buffer.from('data'),
        signature: Buffer.from('sig')
      };
      
      const withoutSignature: StateTransition = {
        toBuffer: () => Buffer.from('data')
      };
      
      expect(withSignature.signature).toBeDefined();
      expect(withoutSignature.signature).toBeUndefined();
    });
  });

  describe('BlockHeight Type', () => {
    it('should be a number', () => {
      const height: BlockHeight = 12345;
      expect(typeof height).toBe('number');
      expect(height).toBe(12345);
    });

    it('should handle edge cases', () => {
      const zero: BlockHeight = 0;
      const max: BlockHeight = Number.MAX_SAFE_INTEGER;
      
      expect(zero).toBe(0);
      expect(max).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('StateTransitionResult Type', () => {
    it('should include state transition', () => {
      const result: StateTransitionResult = {
        stateTransition: { type: 'identityCreate' }
      };
      expect(result.stateTransition).toBeDefined();
    });

    it('should optionally include metadata', () => {
      const result: StateTransitionResult = {
        stateTransition: { type: 'documentsBatch' },
        metadata: {
          height: 1000,
          coreChainLockedHeight: 950,
          epoch: 5,
          timeMs: Date.now(),
          protocolVersion: 1,
          fee: 1000
        }
      };
      
      expect(result.metadata).toBeDefined();
      expect(result.metadata.height).toBe(1000);
      expect(result.metadata.fee).toBe(1000);
    });

    it('should allow partial metadata', () => {
      const result: StateTransitionResult = {
        stateTransition: {},
        metadata: {
          height: 500
        }
      };
      
      expect(result.metadata.height).toBe(500);
      expect(result.metadata.fee).toBeUndefined();
    });
  });

  describe('ContextProvider Interface', () => {
    it('should define required methods', () => {
      const mockProvider: ContextProvider = {
        getBlockHash: jest.fn(),
        getDataContract: jest.fn(),
        waitForStateTransitionResult: jest.fn(),
        broadcastStateTransition: jest.fn(),
        getProtocolVersion: jest.fn()
      };
      
      expect(mockProvider.getBlockHash).toBeDefined();
      expect(mockProvider.getDataContract).toBeDefined();
      expect(mockProvider.waitForStateTransitionResult).toBeDefined();
      expect(mockProvider.broadcastStateTransition).toBeDefined();
      expect(mockProvider.getProtocolVersion).toBeDefined();
    });

    it('should have optional platform methods', () => {
      const minimalProvider: ContextProvider = {
        getBlockHash: async (height) => `hash-${height}`,
        getDataContract: async (id) => ({ id }),
        waitForStateTransitionResult: async (hash, prove) => ({ hash, prove }),
        broadcastStateTransition: async (st) => 'hash',
        getProtocolVersion: async () => 1
      };
      
      expect(minimalProvider.getLatestPlatformBlockHeight).toBeUndefined();
      expect(minimalProvider.isValid).toBeUndefined();
    });

    it('should support full platform methods', () => {
      const fullProvider: ContextProvider = {
        getBlockHash: async (height) => `hash-${height}`,
        getDataContract: async (id) => ({ id }),
        waitForStateTransitionResult: async (hash, prove) => ({ hash, prove }),
        broadcastStateTransition: async (st) => 'hash',
        getProtocolVersion: async () => 1,
        getLatestPlatformBlockHeight: async () => 1000,
        getLatestPlatformBlockTime: async () => Date.now(),
        getLatestPlatformCoreChainLockedHeight: async () => 950,
        getLatestPlatformVersion: async () => '1.0.0',
        getProposerBlockCount: async (hash) => 10,
        getTimePerBlockMillis: async () => 2500,
        getBlockProposer: async (height) => 'proposer-hash',
        isValid: async () => true
      };
      
      expect(fullProvider.getLatestPlatformBlockHeight).toBeDefined();
      expect(fullProvider.isValid).toBeDefined();
    });
  });
});