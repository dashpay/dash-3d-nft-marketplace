// Mock wrapper for the Dash SDK - for UI development without WASM dependencies
import { NFT3D, NFTTransfer } from '@/types/nft';
import { 
  MOCK_NFTS, 
  MOCK_MARKETPLACE_NFTS, 
  MOCK_IDENTITIES, 
  MOCK_PLATFORM_STATE,
  getMockNFTsByOwner,
  getMockMarketplaceNFTs,
  getMockNFTById,
  MOCK_IDENTITY_ID 
} from './mock-data';

export interface DashSDKConfig {
  network: 'mainnet' | 'testnet' | 'devnet';
  apps?: {
    nftContract?: string;
  };
  contextProvider?: any;
  nodeList?: Array<{
    host: string;
    port?: number;
    protocol?: 'http' | 'https' | 'grpc';
  }>;
}

export interface Identity {
  id: string;
  balance: number;
  publicKeys: any[];
}

export interface DataContract {
  id: string;
  ownerId: string;
  schema: any;
}

export interface Document {
  id: string;
  ownerId: string;
  data: any;
  createdAt: number;
  updatedAt: number;
}

// Mock delay to simulate network operations
const mockDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Use static timestamps to avoid hydration mismatches
const MOCK_BASE_TIME = 1720080000000; // Fixed timestamp: July 4, 2024
let mockIdCounter = 1;

export class DashSDK {
  private config: DashSDKConfig;
  private initialized = false;

  constructor(config: DashSDKConfig) {
    this.config = config;
    console.log('🎭 Mock DashSDK initialized with config:', config);
  }

  async initialize(): Promise<void> {
    console.log('🎭 Mock SDK initialization started...');
    await mockDelay(500); // Simulate initialization time
    
    this.initialized = true;
    console.log('🎭 Mock SDK initialization complete');
    console.log('🎭 Network:', this.config.network);
    console.log('🎭 Mock data loaded:', MOCK_NFTS.length + MOCK_MARKETPLACE_NFTS.length, 'NFTs');
  }

  // Identity methods
  async getIdentity(id: string): Promise<Identity | null> {
    if (!this.initialized) throw new Error('SDK not initialized');
    
    console.log(`🎭 Mock: Fetching identity for: ${id}`);
    await mockDelay();
    
    const identity = MOCK_IDENTITIES[id as keyof typeof MOCK_IDENTITIES];
    if (identity) {
      console.log(`🎭 Mock: Identity found with balance: ${identity.balance}`);
      return identity;
    }
    
    console.log('🎭 Mock: Identity not found');
    return null;
  }

  // Document query methods
  async queryDocuments(contractId: string, query: any): Promise<Document[]> {
    if (!this.initialized) throw new Error('SDK not initialized');
    
    console.log(`🎭 Mock: Querying documents from contract: ${contractId}`);
    console.log('🎭 Mock: Query parameters:', query);
    
    await mockDelay();
    
    // Check if contract ID is valid
    if (!contractId || contractId.includes('CONTRACT_ID')) {
      console.warn(`🎭 Mock: Invalid contract ID: ${contractId}`);
      return [];
    }
    
    // Simulate different query types
    const allNFTs = [...MOCK_NFTS, ...MOCK_MARKETPLACE_NFTS];
    let filteredNFTs = allNFTs;
    
    // Handle where clauses
    if (query.where) {
      if (query.where.ownerId) {
        filteredNFTs = allNFTs.filter(nft => nft.ownerId === query.where.ownerId);
      }
      if (query.where.id) {
        filteredNFTs = allNFTs.filter(nft => nft.id === query.where.id);
      }
      if (query.where.geometryType) {
        filteredNFTs = filteredNFTs.filter(nft => nft.geometryType === query.where.geometryType);
      }
    }
    
    // Handle ordering
    if (query.orderBy) {
      if (query.orderBy.includes('createdAt')) {
        filteredNFTs.sort((a, b) => {
          const desc = query.orderBy.includes('desc');
          return desc ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
        });
      }
    }
    
    // Handle limit
    if (query.limit) {
      filteredNFTs = filteredNFTs.slice(0, query.limit);
    }
    
    console.log(`🎭 Mock: Returning ${filteredNFTs.length} documents`);
    
    // Convert NFTs to Document format
    return filteredNFTs.map(nft => ({
      id: nft.id!,
      ownerId: nft.ownerId,
      data: {
        ...nft,
        $id: nft.id,
        $ownerId: nft.ownerId,
        $createdAt: nft.createdAt,
        $updatedAt: nft.updatedAt,
        $transferredAt: nft.transferredAt,
        $transferredAtBlockHeight: 0,
        $transferredAtCoreBlockHeight: 0
      },
      createdAt: nft.createdAt,
      updatedAt: nft.updatedAt
    }));
  }

  // Platform state methods
  async getPlatformState(): Promise<any> {
    if (!this.initialized) throw new Error('SDK not initialized');
    
    console.log('🎭 Mock: Getting platform state...');
    await mockDelay(100);
    
    return MOCK_PLATFORM_STATE;
  }

  // Document operations
  async createNFT(options: {
    contractId: string;
    identity: { id: string; privateKey: string };
    nftData: {
      name: string;
      description: string;
      geometry3d: string;
      geometryType: 'parametric' | 'voxel' | 'procedural';
      colors: string[];
      edition?: number;
      maxEditions?: number;
    };
  }) {
    if (!this.initialized) throw new Error('SDK not initialized');
    
    console.log('🎭 Mock: Creating NFT...', options.nftData.name);
    
    // Validate geometry size (3KB limit)
    const geometrySize = new TextEncoder().encode(options.nftData.geometry3d).length;
    if (geometrySize > 3072) {
      throw new Error(`Geometry data too large: ${geometrySize} bytes (max 3072)`);
    }

    // Validate geometry JSON
    try {
      JSON.parse(options.nftData.geometry3d);
    } catch (error) {
      throw new Error('Invalid geometry JSON');
    }

    await mockDelay(1000); // Simulate blockchain write time
    
    // Create new NFT
    const newNFT: NFT3D = {
      id: `mock_${mockIdCounter++}`,
      ...options.nftData,
      ownerId: options.identity.id,
      createdAt: MOCK_BASE_TIME,
      updatedAt: MOCK_BASE_TIME,
      transferredAt: MOCK_BASE_TIME
    };
    
    // Add to mock data (in real app, this would be on blockchain)
    MOCK_NFTS.push(newNFT);
    
    console.log('🎭 Mock: NFT created successfully:', newNFT.id);
    return { id: newNFT.id, success: true };
  }

  async transferNFT(options: {
    contractId: string;
    nftId: string;
    fromIdentity: { id: string; privateKey: string };
    toIdentityId: string;
  }) {
    if (!this.initialized) throw new Error('SDK not initialized');
    
    console.log('🎭 Mock: Transferring NFT...', options.nftId);
    await mockDelay(1000);
    
    // Find the NFT
    const allNFTs = [...MOCK_NFTS, ...MOCK_MARKETPLACE_NFTS];
    const nft = allNFTs.find(n => n.id === options.nftId);
    
    if (!nft) {
      throw new Error('NFT not found');
    }
    
    if (nft.ownerId !== options.fromIdentity.id) {
      throw new Error('Not authorized to transfer this NFT');
    }
    
    // Update ownership
    nft.ownerId = options.toIdentityId;
    nft.transferredAt = MOCK_BASE_TIME;
    nft.updatedAt = MOCK_BASE_TIME;
    
    console.log('🎭 Mock: NFT transferred successfully');
    return { success: true };
  }

  // Utility methods
  getSDK(): any {
    return { mock: true };
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getNetwork(): string {
    return this.config.network;
  }

  getApps(): Record<string, any> {
    return this.config.apps || {};
  }
}

// Helper to convert SDK documents to NFT format
export function documentToNFT(doc: Document): NFT3D {
  const data = doc.data;
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    ownerId: data.ownerId || data.$ownerId,
    geometry3d: data.geometry3d,
    geometryType: data.geometryType,
    colors: data.colors,
    edition: data.edition,
    maxEditions: data.maxEditions,
    createdAt: data.createdAt || data.$createdAt,
    updatedAt: data.updatedAt || data.$updatedAt,
    transferredAt: data.transferredAt || data.$transferredAt,
    transferredAtBlockHeight: data.transferredAtBlockHeight || data.$transferredAtBlockHeight,
    transferredAtCoreBlockHeight: data.transferredAtCoreBlockHeight || data.$transferredAtCoreBlockHeight
  };
}

// Export a factory function
export function createDashSDK(config: DashSDKConfig): DashSDK {
  return new DashSDK(config);
}

// Mock-specific helper functions
export const MockHelpers = {
  // Get all NFTs for development/testing
  getAllMockNFTs: () => [...MOCK_NFTS, ...MOCK_MARKETPLACE_NFTS],
  
  // Get NFTs by owner
  getNFTsByOwner: (ownerId: string) => getMockNFTsByOwner(ownerId),
  
  // Get marketplace NFTs (excluding current user)
  getMarketplaceNFTs: (currentUserId: string) => getMockMarketplaceNFTs(currentUserId),
  
  // Get NFT by ID
  getNFTById: (id: string) => getMockNFTById(id),
  
  // Reset mock data to initial state
  resetMockData: () => {
    // In a real implementation, you might want to restore from a backup
    console.log('🎭 Mock: Data reset requested (not implemented)');
  },
  
  // Add custom NFT to mock data
  addMockNFT: (nft: NFT3D) => {
    MOCK_NFTS.push(nft);
    console.log('🎭 Mock: Added custom NFT:', nft.name);
  }
};