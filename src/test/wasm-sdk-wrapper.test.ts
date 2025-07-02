import { WasmSdkWrapper, createWasmSdk } from '@/lib/wasm-sdk-wrapper';
import * as DashModule from '@/wasm/wasm_sdk';

// Mock the WASM module
jest.mock('@/wasm/wasm_sdk', () => ({
  __esModule: true,
  default: jest.fn(),
  initSync: jest.fn(),
  WasmSdkBuilder: {
    new_testnet: jest.fn().mockReturnValue({
      build: jest.fn().mockReturnValue({
        free: jest.fn()
      }),
      with_dapi_client: jest.fn()
    }),
    new_mainnet: jest.fn().mockReturnValue({
      build: jest.fn().mockReturnValue({
        free: jest.fn()
      })
    })
  },
  DapiClientConfig: jest.fn().mockImplementation(() => ({
    addEndpoint: jest.fn(),
    setTimeout: jest.fn(),
    setRetries: jest.fn()
  })),
  DapiClient: jest.fn(),
  fetchIdentityBalance: jest.fn()
}));

describe('WasmSdkWrapper', () => {
  let originalFetch: typeof fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    // Save original fetch
    originalFetch = global.fetch;
    
    // Create fetch mock
    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
      text: async () => '',
      status: 200
    });
    
    global.fetch = fetchMock;
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
  });

  describe('initialization', () => {
    it('should initialize WASM module', async () => {
      const wrapper = new WasmSdkWrapper({ network: 'testnet' });
      await wrapper.initialize();

      expect(DashModule.default).toHaveBeenCalled();
    });

    it('should create testnet SDK', async () => {
      const wrapper = new WasmSdkWrapper({ network: 'testnet' });
      const sdk = await wrapper.initialize();

      expect(DashModule.WasmSdkBuilder.new_testnet).toHaveBeenCalled();
      expect(sdk).toBeDefined();
    });

    it('should configure DapiClient with evonodes', async () => {
      const wrapper = new WasmSdkWrapper({ 
        network: 'testnet',
        evonodes: ['https://custom-evonode:1443']
      });
      
      await wrapper.initialize();

      const dapiConfigInstance = (DashModule.DapiClientConfig as jest.Mock).mock.results[0].value;
      expect(dapiConfigInstance.addEndpoint).toHaveBeenCalledWith('https://custom-evonode:1443');
    });

    it('should set timeout and retries if specified', async () => {
      const wrapper = new WasmSdkWrapper({ 
        network: 'testnet',
        timeout: 5000,
        retries: 3
      });
      
      await wrapper.initialize();

      const dapiConfigInstance = (DashModule.DapiClientConfig as jest.Mock).mock.results[0].value;
      expect(dapiConfigInstance.setTimeout).toHaveBeenCalledWith(5000);
      expect(dapiConfigInstance.setRetries).toHaveBeenCalledWith(3);
    });
  });

  describe('fetch interceptor', () => {
    it('should redirect old DAPI endpoints to evonodes', async () => {
      const wrapper = new WasmSdkWrapper({ network: 'testnet' });
      await wrapper.initialize();

      // Make a fetch to old DAPI endpoint
      await fetch('https://testnet-dapi.dash.org/v0/getIdentity');

      expect(fetchMock).toHaveBeenCalled();
      const [url, options] = fetchMock.mock.calls[0];
      
      // Should redirect to evonode
      expect(url).toMatch(/https:\/\/\d+\.\d+\.\d+\.\d+:1443\/v0\/getIdentity/);
      
      // Should add gRPC-Web headers
      expect(options.headers['Content-Type']).toBe('application/grpc-web+proto');
      expect(options.headers['X-Grpc-Web']).toBe('1');
    });

    it('should use round-robin for load distribution', async () => {
      const wrapper = new WasmSdkWrapper({ 
        network: 'testnet',
        evonodes: ['https://node1:1443', 'https://node2:1443']
      });
      await wrapper.initialize();

      // Make multiple fetches
      await fetch('https://testnet-dapi.dash.org/v0/getIdentity');
      await fetch('https://testnet-dapi.dash.org/v0/getIdentity');
      await fetch('https://testnet-dapi.dash.org/v0/getIdentity');

      expect(fetchMock).toHaveBeenCalledTimes(3);
      
      // Check round-robin distribution
      expect(fetchMock.mock.calls[0][0]).toContain('node1');
      expect(fetchMock.mock.calls[1][0]).toContain('node2');
      expect(fetchMock.mock.calls[2][0]).toContain('node1');
    });

    it('should not intercept non-DAPI URLs', async () => {
      const wrapper = new WasmSdkWrapper({ network: 'testnet' });
      await wrapper.initialize();

      await fetch('https://example.com/api/data');

      expect(fetchMock).toHaveBeenCalledWith('https://example.com/api/data');
    });
  });

  describe('cleanup', () => {
    it('should restore original fetch on cleanup', async () => {
      const wrapper = new WasmSdkWrapper({ network: 'testnet' });
      await wrapper.initialize();

      // Verify fetch is intercepted
      expect(global.fetch).not.toBe(originalFetch);

      wrapper.cleanup();

      // Verify fetch is restored to the mock we set
      expect(global.fetch).toBe(fetchMock);
    });

    it('should free SDK resources', async () => {
      const wrapper = new WasmSdkWrapper({ network: 'testnet' });
      const sdk = await wrapper.initialize();

      wrapper.cleanup();

      expect(sdk.free).toHaveBeenCalled();
    });
  });

  describe('createWasmSdk helper', () => {
    it('should create SDK with default testnet', async () => {
      const sdk = await createWasmSdk();

      expect(DashModule.WasmSdkBuilder.new_testnet).toHaveBeenCalled();
      expect(sdk).toBeDefined();
    });

    it('should create mainnet SDK when specified', async () => {
      const sdk = await createWasmSdk('mainnet');

      expect(DashModule.WasmSdkBuilder.new_mainnet).toHaveBeenCalled();
      expect(sdk).toBeDefined();
    });
  });
});