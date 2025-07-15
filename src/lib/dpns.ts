import { getNFTSDK } from './dash-sdk';

export interface DPNSResult {
  name: string;
  identityId: string;
  isValid: boolean;
}

export interface DPNSLookupOptions {
  network: 'mainnet' | 'testnet';
  timeout?: number;
}

export class DPNSHelper {
  private cache: Map<string, { result: string | null, timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(type: 'name' | 'resolve', input: string, network: string): string {
    return `${type}:${input}:${network}`;
  }

  private getCachedResult(key: string): string | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.result;
    }
    return null;
  }

  private setCachedResult(key: string, result: string | null): void {
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });
  }

  async getDPNSName(identityId: string, options: DPNSLookupOptions): Promise<string | null> {
    const cacheKey = this.getCacheKey('name', identityId, options.network);
    
    // Check cache first
    const cached = this.getCachedResult(cacheKey);
    if (cached !== null) {
      return cached;
    }

    try {
      const sdk = getNFTSDK({ network: options.network });
      const result = await sdk.getDPNSName(identityId);
      
      // Cache the result
      this.setCachedResult(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Failed to get DPNS name:', error);
      return null;
    }
  }

  async resolveUsername(username: string, options: DPNSLookupOptions): Promise<string | null> {
    const cacheKey = this.getCacheKey('resolve', username, options.network);
    
    // Check cache first
    const cached = this.getCachedResult(cacheKey);
    if (cached !== null) {
      return cached;
    }

    try {
      const sdk = getNFTSDK({ network: options.network });
      const result = await sdk.resolveUsername(username);
      
      // Cache the result
      this.setCachedResult(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Failed to resolve username:', error);
      return null;
    }
  }

  async searchUsernames(query: string, options: DPNSLookupOptions): Promise<DPNSResult[]> {
    try {
      const sdk = getNFTSDK({ network: options.network });
      const results = await sdk.searchUsernames(query);
      
      return results.map(result => ({
        name: result.name,
        identityId: result.identityId,
        isValid: true
      }));
    } catch (error) {
      console.error('Failed to search usernames:', error);
      return [];
    }
  }

  validateUsername(username: string): { isValid: boolean; error?: string } {
    if (!username) {
      return { isValid: false, error: 'Username is required' };
    }

    if (username.length < 3) {
      return { isValid: false, error: 'Username must be at least 3 characters long' };
    }

    if (username.length > 63) {
      return { isValid: false, error: 'Username must be less than 64 characters long' };
    }

    if (!/^[a-zA-Z0-9-]+$/.test(username)) {
      return { isValid: false, error: 'Username can only contain letters, numbers, and hyphens' };
    }

    if (username.startsWith('-') || username.endsWith('-')) {
      return { isValid: false, error: 'Username cannot start or end with a hyphen' };
    }

    return { isValid: true };
  }

  validateIdentityId(identityId: string): { isValid: boolean; error?: string } {
    if (!identityId) {
      return { isValid: false, error: 'Identity ID is required' };
    }

    const identityRegex = /^[1-9A-HJ-NP-Za-km-z]{44}$/;
    if (!identityRegex.test(identityId)) {
      return { 
        isValid: false, 
        error: 'Identity ID must be 44 base58 characters (alphanumeric, no 0, O, I, or l)' 
      };
    }

    return { isValid: true };
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const dpnsHelper = new DPNSHelper();