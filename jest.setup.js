// Jest setup file
require('@testing-library/jest-dom');

// Mock fetch for Node environment
global.fetch = jest.fn();

// Mock WASM imports
jest.mock('@/wasm/wasm_sdk', () => ({
  WasmSdkBuilder: {
    new_testnet: jest.fn().mockReturnValue({
      build: jest.fn().mockReturnValue({
        free: jest.fn(),
      })
    })
  },
  initSync: jest.fn(),
  default: jest.fn(),
  fetchIdentityBalance: jest.fn(),
  fetchDataContract: jest.fn(),
  fetch_documents: jest.fn(),
  FetchOptions: jest.fn().mockImplementation(() => ({
    withProve: jest.fn(),
    free: jest.fn(),
  })),
}));

// Set up test environment variables
process.env.NEXT_PUBLIC_NETWORK = 'testnet';

// Test identity and key for integration tests
global.TEST_IDENTITY_ID = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';
global.TEST_PRIVATE_KEY = 'XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf';

// Mock console methods to reduce test output noise
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('act()'))
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('componentWillReceiveProps')
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});