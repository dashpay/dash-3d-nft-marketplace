import { DPNSHelper } from '../lib/dpns';
import { getNFTSDK } from '../lib/dash-sdk';

// Mock the SDK
jest.mock('../lib/dash-sdk', () => ({
  getNFTSDK: jest.fn()
}));

describe('DPNSHelper', () => {
  let dpnsHelper: DPNSHelper;
  let mockSDK: any;

  beforeEach(() => {
    dpnsHelper = new DPNSHelper();
    mockSDK = {
      getDPNSName: jest.fn(),
      resolveUsername: jest.fn(),
      searchUsernames: jest.fn()
    };
    (getNFTSDK as jest.Mock).mockReturnValue(mockSDK);
  });

  afterEach(() => {
    jest.clearAllMocks();
    dpnsHelper.clearCache();
  });

  describe('getDPNSName', () => {
    it('should return username for valid identity ID', async () => {
      const identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      const expectedUsername = 'alice';
      mockSDK.getDPNSName.mockResolvedValue(expectedUsername);

      const result = await dpnsHelper.getDPNSName(identityId, { network: 'testnet' });

      expect(result).toBe(expectedUsername);
      expect(mockSDK.getDPNSName).toHaveBeenCalledWith(identityId);
    });

    it('should return null for identity without username', async () => {
      const identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockSDK.getDPNSName.mockResolvedValue(null);

      const result = await dpnsHelper.getDPNSName(identityId, { network: 'testnet' });

      expect(result).toBe(null);
    });

    it('should handle errors gracefully', async () => {
      const identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockSDK.getDPNSName.mockRejectedValue(new Error('Network error'));

      const result = await dpnsHelper.getDPNSName(identityId, { network: 'testnet' });

      expect(result).toBe(null);
    });

    it('should use cache for repeated requests', async () => {
      const identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      const expectedUsername = 'alice';
      mockSDK.getDPNSName.mockResolvedValue(expectedUsername);

      // First call
      const result1 = await dpnsHelper.getDPNSName(identityId, { network: 'testnet' });
      // Second call
      const result2 = await dpnsHelper.getDPNSName(identityId, { network: 'testnet' });

      expect(result1).toBe(expectedUsername);
      expect(result2).toBe(expectedUsername);
      expect(mockSDK.getDPNSName).toHaveBeenCalledTimes(1); // Should be cached
    });
  });

  describe('resolveUsername', () => {
    it('should return identity ID for valid username', async () => {
      const username = 'alice';
      const expectedIdentityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockSDK.resolveUsername.mockResolvedValue(expectedIdentityId);

      const result = await dpnsHelper.resolveUsername(username, { network: 'testnet' });

      expect(result).toBe(expectedIdentityId);
      expect(mockSDK.resolveUsername).toHaveBeenCalledWith(username);
    });

    it('should return null for non-existent username', async () => {
      const username = 'nonexistent';
      mockSDK.resolveUsername.mockResolvedValue(null);

      const result = await dpnsHelper.resolveUsername(username, { network: 'testnet' });

      expect(result).toBe(null);
    });

    it('should handle errors gracefully', async () => {
      const username = 'alice';
      mockSDK.resolveUsername.mockRejectedValue(new Error('Network error'));

      const result = await dpnsHelper.resolveUsername(username, { network: 'testnet' });

      expect(result).toBe(null);
    });

    it('should use cache for repeated requests', async () => {
      const username = 'alice';
      const expectedIdentityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockSDK.resolveUsername.mockResolvedValue(expectedIdentityId);

      // First call
      const result1 = await dpnsHelper.resolveUsername(username, { network: 'testnet' });
      // Second call
      const result2 = await dpnsHelper.resolveUsername(username, { network: 'testnet' });

      expect(result1).toBe(expectedIdentityId);
      expect(result2).toBe(expectedIdentityId);
      expect(mockSDK.resolveUsername).toHaveBeenCalledTimes(1); // Should be cached
    });
  });

  describe('searchUsernames', () => {
    it('should return search results for valid query', async () => {
      const query = 'al';
      const expectedResults = [
        { name: 'alice', identityId: '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx' },
        { name: 'alex', identityId: '6rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx' }
      ];
      mockSDK.searchUsernames.mockResolvedValue(expectedResults);

      const result = await dpnsHelper.searchUsernames(query, { network: 'testnet' });

      expect(result).toEqual(expectedResults.map(r => ({ ...r, isValid: true })));
      expect(mockSDK.searchUsernames).toHaveBeenCalledWith(query);
    });

    it('should return empty array for no results', async () => {
      const query = 'xyz';
      mockSDK.searchUsernames.mockResolvedValue([]);

      const result = await dpnsHelper.searchUsernames(query, { network: 'testnet' });

      expect(result).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      const query = 'al';
      mockSDK.searchUsernames.mockRejectedValue(new Error('Network error'));

      const result = await dpnsHelper.searchUsernames(query, { network: 'testnet' });

      expect(result).toEqual([]);
    });
  });

  describe('validateUsername', () => {
    it('should validate correct usernames', () => {
      const validUsernames = ['alice', 'bob123', 'user-name', 'a1b2c3'];
      
      validUsernames.forEach(username => {
        const result = dpnsHelper.validateUsername(username);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject invalid usernames', () => {
      const invalidCases = [
        { username: '', error: 'Username is required' },
        { username: 'ab', error: 'Username must be at least 3 characters long' },
        { username: 'a'.repeat(64), error: 'Username must be less than 64 characters long' },
        { username: 'user@name', error: 'Username can only contain letters, numbers, and hyphens' },
        { username: '-username', error: 'Username cannot start or end with a hyphen' },
        { username: 'username-', error: 'Username cannot start or end with a hyphen' }
      ];

      invalidCases.forEach(({ username, error }) => {
        const result = dpnsHelper.validateUsername(username);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(error);
      });
    });
  });

  describe('validateIdentityId', () => {
    it('should validate correct identity IDs', () => {
      const validIdentityIds = [
        '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx',
        '6rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx'
      ];

      validIdentityIds.forEach(identityId => {
        const result = dpnsHelper.validateIdentityId(identityId);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject invalid identity IDs', () => {
      const invalidCases = [
        { identityId: '', error: 'Identity ID is required' },
        { identityId: '123', error: 'Identity ID must be 44 base58 characters (alphanumeric, no 0, O, I, or l)' },
        { identityId: '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBX', error: 'Identity ID must be 44 base58 characters (alphanumeric, no 0, O, I, or l)' },
        { identityId: '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx0', error: 'Identity ID must be 44 base58 characters (alphanumeric, no 0, O, I, or l)' },
        { identityId: '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBX0', error: 'Identity ID must be 44 base58 characters (alphanumeric, no 0, O, I, or l)' }
      ];

      invalidCases.forEach(({ identityId, error }) => {
        const result = dpnsHelper.validateIdentityId(identityId);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(error);
      });
    });
  });

  describe('cache management', () => {
    it('should clear cache', () => {
      dpnsHelper.clearCache();
      const stats = dpnsHelper.getCacheStats();
      expect(stats.size).toBe(0);
      expect(stats.keys).toEqual([]);
    });

    it('should provide cache statistics', async () => {
      const identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockSDK.getDPNSName.mockResolvedValue('alice');

      await dpnsHelper.getDPNSName(identityId, { network: 'testnet' });

      const stats = dpnsHelper.getCacheStats();
      expect(stats.size).toBe(1);
      expect(stats.keys).toContain(`name:${identityId}:testnet`);
    });
  });
});