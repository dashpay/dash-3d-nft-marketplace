import { useStore } from '../store/useStore';
import { getNFTSDK } from '../lib/dash-sdk';

// Mock the SDK
jest.mock('../lib/dash-sdk', () => ({
  getNFTSDK: jest.fn()
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('Authentication Store', () => {
  let mockSDK: any;
  let store: any;

  beforeEach(() => {
    mockSDK = {
      initialize: jest.fn().mockResolvedValue(undefined),
      isInitialized: jest.fn().mockReturnValue(true),
      verifyIdentity: jest.fn(),
      getDPNSName: jest.fn(),
      resolveUsername: jest.fn()
    };
    (getNFTSDK as jest.Mock).mockReturnValue(mockSDK);
    
    // Clear localStorage mock
    jest.clearAllMocks();
    
    // Get fresh store instance
    store = useStore.getState();
  });

  afterEach(() => {
    // Reset store state
    useStore.setState({
      identityId: null,
      isAuthenticated: false,
      username: null,
      isLoadingUsername: false,
      network: 'testnet',
      error: null,
      isLoading: false
    });
  });

  describe('login', () => {
    it('should login with valid identity ID', async () => {
      const identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockSDK.verifyIdentity.mockResolvedValue(true);
      mockSDK.getDPNSName.mockResolvedValue('alice');

      await store.login(identityId);

      const state = useStore.getState();
      expect(state.identityId).toBe(identityId);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBe(null);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('dash-nft-identity', identityId);
    });

    it('should reject invalid identity ID format', async () => {
      const invalidIdentityId = 'invalid-id';

      await expect(store.login(invalidIdentityId)).rejects.toThrow('Invalid identity ID format');
      
      const state = useStore.getState();
      expect(state.identityId).toBe(null);
      expect(state.isAuthenticated).toBe(false);
    });

    it('should reject non-existent identity', async () => {
      const identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockSDK.verifyIdentity.mockResolvedValue(false);

      await expect(store.login(identityId)).rejects.toThrow('Identity not found on Dash Platform');
      
      const state = useStore.getState();
      expect(state.identityId).toBe(null);
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle network errors', async () => {
      const identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockSDK.verifyIdentity.mockRejectedValue(new Error('Failed to fetch'));

      await expect(store.login(identityId)).rejects.toThrow('Unable to connect to Dash Platform');
      
      const state = useStore.getState();
      expect(state.identityId).toBe(null);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('loginWithUsername', () => {
    it('should login with valid username', async () => {
      const username = 'alice';
      const identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockSDK.resolveUsername.mockResolvedValue(identityId);
      mockSDK.verifyIdentity.mockResolvedValue(true);
      mockSDK.getDPNSName.mockResolvedValue(username);

      await store.loginWithUsername(username);

      const state = useStore.getState();
      expect(state.identityId).toBe(identityId);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should reject non-existent username', async () => {
      const username = 'nonexistent';
      mockSDK.resolveUsername.mockResolvedValue(null);

      await expect(store.loginWithUsername(username)).rejects.toThrow('Username not found');
      
      const state = useStore.getState();
      expect(state.identityId).toBe(null);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout and clear state', () => {
      // Set up authenticated state
      useStore.setState({
        identityId: '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx',
        isAuthenticated: true,
        username: 'alice',
        userNFTs: [{ id: '1', name: 'Test NFT' }] as any
      });

      store.logout();

      const state = useStore.getState();
      expect(state.identityId).toBe(null);
      expect(state.isAuthenticated).toBe(false);
      expect(state.username).toBe(null);
      expect(state.isLoadingUsername).toBe(false);
      expect(state.userNFTs).toEqual([]);
      expect(state.selectedNFT).toBe(null);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('dash-nft-identity');
    });
  });

  describe('loadUsername', () => {
    it('should load username for identity', async () => {
      const identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      const username = 'alice';
      mockSDK.getDPNSName.mockResolvedValue(username);

      await store.loadUsername(identityId);

      const state = useStore.getState();
      expect(state.username).toBe(username);
      expect(state.isLoadingUsername).toBe(false);
    });

    it('should handle missing username', async () => {
      const identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockSDK.getDPNSName.mockResolvedValue(null);

      await store.loadUsername(identityId);

      const state = useStore.getState();
      expect(state.username).toBe(null);
      expect(state.isLoadingUsername).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      const identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockSDK.getDPNSName.mockRejectedValue(new Error('Network error'));

      await store.loadUsername(identityId);

      const state = useStore.getState();
      expect(state.username).toBe(null);
      expect(state.isLoadingUsername).toBe(false);
    });
  });

  describe('resolveUsernameToId', () => {
    it('should resolve username to identity ID', async () => {
      const username = 'alice';
      const identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockSDK.resolveUsername.mockResolvedValue(identityId);

      const result = await store.resolveUsernameToId(username);

      expect(result).toBe(identityId);
    });

    it('should return null for non-existent username', async () => {
      const username = 'nonexistent';
      mockSDK.resolveUsername.mockResolvedValue(null);

      const result = await store.resolveUsernameToId(username);

      expect(result).toBe(null);
    });

    it('should handle errors gracefully', async () => {
      const username = 'alice';
      mockSDK.resolveUsername.mockRejectedValue(new Error('Network error'));

      const result = await store.resolveUsernameToId(username);

      expect(result).toBe(null);
    });
  });

  describe('network switching', () => {
    it('should clear authentication state when switching networks', async () => {
      // Set up authenticated state
      useStore.setState({
        identityId: '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx',
        isAuthenticated: true,
        username: 'alice',
        network: 'testnet'
      });

      await store.setNetwork('mainnet');

      const state = useStore.getState();
      expect(state.network).toBe('mainnet');
      expect(state.identityId).toBe(null);
      expect(state.isAuthenticated).toBe(false);
      expect(state.username).toBe(null);
      expect(state.isLoadingUsername).toBe(false);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('dash-nft-identity');
    });

    it('should preserve network preference in localStorage', async () => {
      // Set up authenticated state first to trigger localStorage update
      useStore.setState({
        identityId: '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx',
        isAuthenticated: true,
        network: 'testnet'
      });

      await store.setNetwork('mainnet');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('dash-nft-network', 'mainnet');
    });
  });
});