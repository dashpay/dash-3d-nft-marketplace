// Dash Platform SDK Integration for NFT Marketplace
import { NFT3D, NFTTransfer } from '@/types/nft';
import { DashSDK, createDashSDK, documentToNFT } from './dash-sdk-wrapper-mock';

export interface DashNFTSDKConfig {
  network: 'mainnet' | 'testnet' | 'devnet';
  contractId?: string;
}

export class DashNFTSDK {
  private config: DashNFTSDKConfig;
  private sdk: DashSDK;
  private contractId: string;
  
  constructor(config: DashNFTSDKConfig) {
    this.config = config;
    this.contractId = config.contractId || this.getDefaultContractId(config.network);
    
    // Create the underlying SDK instance
    this.sdk = createDashSDK({
      network: config.network,
      apps: {
        nftContract: this.contractId
      }
    });
  }
  
  private getDefaultContractId(network: 'mainnet' | 'testnet' | 'devnet'): string {
    // These would be the actual deployed contract IDs
    // TODO: Replace with actual contract IDs after registration
    switch (network) {
      case 'mainnet':
        return 'MAINNET_NFT_CONTRACT_ID';
      case 'testnet':
        // Update this with your registered contract ID
        return process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ID || 'TESTNET_NFT_CONTRACT_ID';
      case 'devnet':
        return 'DEVNET_NFT_CONTRACT_ID';
      default:
        return process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ID || 'TESTNET_NFT_CONTRACT_ID';
    }
  }
  
  async initialize(): Promise<void> {
    console.log('Initializing Dash NFT SDK...', {
      config: this.config,
      contractId: this.contractId,
      envContractId: process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ID
    });
    
    if (this.contractId.includes('CONTRACT_ID')) {
      console.warn('⚠️ NFT Contract not configured!');
      console.warn('Please register the contract at contracts/nft3d-contract.json');
      console.warn('Then update NEXT_PUBLIC_TESTNET_CONTRACT_ID in your .env file');
    } else {
      console.log('✅ Using contract ID:', this.contractId);
    }
    
    await this.sdk.initialize();
  }
  
  isInitialized(): boolean {
    return this.sdk.isInitialized();
  }
  
  // Identity Methods
  async verifyIdentity(identityId: string): Promise<boolean> {
    try {
      const identity = await this.sdk.getIdentity(identityId);
      return identity !== null;
    } catch (error) {
      console.error('Failed to verify identity:', error);
      return false;
    }
  }

  // DPNS Methods
  async getDPNSName(identityId: string): Promise<string | null> {
    try {
      const dpnsDocuments = await this.sdk.queryDocuments('dpns', {
        where: {
          normalizedParentDomainName: 'dash',
          identityId: identityId
        },
        orderBy: 'normalizedLabel asc'
      });
      
      if (dpnsDocuments.length > 0) {
        return dpnsDocuments[0].data.normalizedLabel;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get DPNS name:', error);
      return null;
    }
  }

  async resolveUsername(username: string): Promise<string | null> {
    try {
      const normalizedUsername = username.toLowerCase();
      
      const dpnsDocuments = await this.sdk.queryDocuments('dpns', {
        where: {
          normalizedParentDomainName: 'dash',
          normalizedLabel: normalizedUsername
        }
      });
      
      if (dpnsDocuments.length > 0) {
        return dpnsDocuments[0].data.identityId;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to resolve username:', error);
      return null;
    }
  }

  async searchUsernames(query: string): Promise<Array<{name: string, identityId: string}>> {
    try {
      const normalizedQuery = query.toLowerCase();
      
      const dpnsDocuments = await this.sdk.queryDocuments('dpns', {
        where: {
          normalizedParentDomainName: 'dash',
          normalizedLabel: { startsWith: normalizedQuery }
        },
        orderBy: 'normalizedLabel asc',
        limit: 20
      });
      
      return dpnsDocuments.map(doc => ({
        name: doc.data.normalizedLabel,
        identityId: doc.data.identityId
      }));
    } catch (error) {
      console.error('Failed to search usernames:', error);
      return [];
    }
  }
  
  // NFT Query Methods
  async getNFTsByOwner(ownerId: string): Promise<NFT3D[]> {
    try {
      const documents = await this.sdk.queryDocuments(this.contractId, {
        where: {
          ownerId: ownerId
        },
        orderBy: '$createdAt desc'
      });
      
      return documents.map(doc => documentToNFT(doc));
    } catch (error) {
      console.error('Failed to fetch NFTs by owner:', error);
      return [];
    }
  }
  
  async getRecentNFTs(): Promise<NFT3D[]> {
    try {
      const documents = await this.sdk.queryDocuments(this.contractId, {
        orderBy: '$createdAt desc',
        limit: 20
      });
      
      return documents.map(doc => documentToNFT(doc));
    } catch (error) {
      console.error('Failed to fetch recent NFTs:', error);
      return [];
    }
  }
  
  async getRecentlyTransferredNFTs(): Promise<NFT3D[]> {
    try {
      const documents = await this.sdk.queryDocuments(this.contractId, {
        orderBy: '$transferredAt desc',
        limit: 20
      });
      
      return documents.map(doc => documentToNFT(doc));
    } catch (error) {
      console.error('Failed to fetch recently transferred NFTs:', error);
      return [];
    }
  }
  
  async getNFTById(nftId: string): Promise<NFT3D | null> {
    try {
      const documents = await this.sdk.queryDocuments(this.contractId, {
        where: {
          id: nftId
        }
      });
      
      if (documents.length === 0) return null;
      
      return documentToNFT(documents[0]);
    } catch (error) {
      console.error('Failed to fetch NFT by ID:', error);
      return null;
    }
  }
  
  async getNFTHistory(nftId: string): Promise<NFTTransfer[]> {
    try {
      const documents = await this.sdk.queryDocuments(this.contractId, {
        documentType: 'transfer',
        where: {
          nftId: nftId
        },
        orderBy: 'transferredAt desc'
      });
      
      return documents.map(doc => ({
        nftId: doc.data.nftId,
        fromId: doc.data.fromId,
        toId: doc.data.toId,
        blockHeight: doc.data.transferredAtBlockHeight || 0,
        coreBlockHeight: doc.data.transferredAtCoreBlockHeight || 0,
        timestamp: doc.data.transferredAt
      }));
    } catch (error) {
      console.error('Failed to fetch NFT history:', error);
      return [];
    }
  }
  
  // Transaction Methods
  async transferNFT(nftId: string, fromIdentity: { id: string; privateKey: string }, toIdentityId: string): Promise<boolean> {
    try {
      // Get current NFT to verify ownership
      const nft = await this.getNFTById(nftId);
      if (!nft) {
        throw new Error('NFT not found');
      }
      
      if (nft.ownerId !== fromIdentity.id) {
        throw new Error('Only the owner can transfer the NFT');
      }

      // Transfer the NFT using platform's native transfer
      const result = await this.sdk.transferNFT({
        contractId: this.contractId,
        nftId,
        fromIdentity,
        toIdentityId
      });

      return true;
    } catch (error) {
      console.error('Failed to transfer NFT:', error);
      return false;
    }
  }
  
  async createNFT(nftData: Omit<NFT3D, 'id' | 'createdAt' | 'updatedAt' | 'ownerId' | 'transferredAt' | 'transferredAtBlockHeight' | 'transferredAtCoreBlockHeight'>, creatorIdentity: { id: string; privateKey: string }): Promise<string | null> {
    try {
      const result = await this.sdk.createNFT({
        contractId: this.contractId,
        identity: creatorIdentity,
        nftData: {
          name: nftData.name,
          description: nftData.description || '',
          geometry3d: nftData.geometry3d,
          geometryType: nftData.geometryType,
          colors: nftData.colors || [],
          edition: nftData.edition,
          maxEditions: nftData.maxEditions
        }
      });

      return result.success ? (result.id || null) : null;
    } catch (error) {
      console.error('Failed to create NFT:', error);
      return null;
    }
  }
}

// SDK is now purely based on real Dash Platform data

// Export singleton instance
let sdkInstance: DashNFTSDK | null = null;
let currentNetwork: 'mainnet' | 'testnet' | 'devnet' | null = null;

export function getNFTSDK(config?: DashNFTSDKConfig): DashNFTSDK {
  // Get network from config or default to testnet
  const network = config?.network || 'testnet';
  
  // If network changed or no instance exists, create new one
  if (!sdkInstance || currentNetwork !== network) {
    sdkInstance = new DashNFTSDK({
      network,
      ...config
    });
    currentNetwork = network;
  }
  
  return sdkInstance;
}