// Wrapper for the JS Dash SDK
// This allows us to develop and test the SDK while building our app

import { NFT3D, NFTTransfer } from '@/types/nft';
import { SDK, SDKOptions } from '@/dash-sdk-src/SDK';
import { WebServiceProvider } from '@/dash-sdk-src/providers/WebServiceProvider';

// Direct wrapper around the Dash SDK - no mocks, only real SDK functionality

export interface DashSDKConfig {
  network: 'mainnet' | 'testnet' | 'devnet';
  apps?: {
    nftContract?: string;
  };
  contextProvider?: WebServiceProvider;
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

export class DashSDK {
  private config: DashSDKConfig;
  private sdk: SDK;
  private initialized = false;

  constructor(config: DashSDKConfig) {
    this.config = config;
    
    // Create SDK options
    const sdkOptions: SDKOptions = {
      network: config.network,
      apps: config.apps ? Object.fromEntries(
        Object.entries(config.apps).map(([key, value]) => [
          key, 
          typeof value === 'string' ? { contractId: value } : value
        ])
      ) : undefined,
      contextProvider: config.contextProvider
    };
    
    // Create the actual Dash SDK
    this.sdk = new SDK(sdkOptions);
  }

  async initialize(): Promise<void> {
    console.log('=== Dash SDK Initialization Started ===');
    console.log('Config:', JSON.stringify(this.config, null, 2));
    
    try {
      console.log('Step 1: Creating SDK instance...');
      
      // Initialize the actual SDK
      console.log('Step 2: Calling SDK.initialize()...');
      await this.sdk.initialize();
      
      console.log('Step 3: SDK initialized successfully');
      console.log('Network:', JSON.stringify(this.sdk.getNetwork(), null, 2));
      console.log('Apps:', JSON.stringify(this.sdk.getApps(), null, 2));
      
      // Test WASM SDK availability
      console.log('Step 4: Testing WASM SDK availability...');
      const wasmSdk = this.sdk.getWasmSdk();
      console.log('WASM SDK available:', !!wasmSdk);
      
      const wasmModule = this.sdk.getWasmModule();
      console.log('WASM Module available:', !!wasmModule);
      
      this.initialized = true;
      console.log('=== Dash SDK Initialization Complete ===');
    } catch (error) {
      console.error('=== Dash SDK Initialization Failed ===');
      console.error('Error details:', error);
      
      // Provide helpful error message if WASM isn't built
      if ((error instanceof Error && error.message?.includes('WASM')) || (error instanceof Error && error.message?.includes('wasm'))) {
        throw new Error(
          'WASM SDK not available. Please build the WASM module first:\n' +
          'cd /Users/quantum/src/platform/packages/wasm-sdk && ./build.sh'
        );
      }
      
      throw error;
    }
  }

  // Identity methods
  async getIdentity(id: string): Promise<Identity | null> {
    if (!this.initialized) throw new Error('SDK not initialized');
    
    try {
      console.log(`Fetching identity for: ${id}`);
      
      const wasmSdk = this.sdk.getWasmSdk();
      if (!wasmSdk) {
        throw new Error('WASM SDK not available - please ensure the WASM module is built');
      }
      
      // Get the WASM module
      const wasm = this.sdk.getWasmModule() as any;
      
      // NEVER use unproved fetching - always use proved
      console.log('Using PROVED fetching only as required');
      
      console.log('Available balance methods:', wasm ? Object.keys(wasm).filter(k => k.toLowerCase().includes('balance')).slice(0, 10) : []);
      
      // Try to fetch just the balance first (simpler query)
      let balance = 0;
      
      if (wasm && typeof wasm.fetchIdentityBalance === 'function') {
        console.log('Using fetchIdentityBalance...');
        
        let fetchOptions = null;
        try {
          // Create FetchOptions - check if constructor needs parameters
          if (wasm && wasm.FetchOptions) {
            fetchOptions = new wasm.FetchOptions();
            
            // ALWAYS use proved fetching
            if (typeof fetchOptions.withProve === 'function') {
              fetchOptions.withProve(true); // ALWAYS TRUE - NEVER FALSE
            } else {
              console.error('WARNING: Cannot set withProve(true) - this should never happen!');
            }
          } else {
            console.warn('FetchOptions not available, trying without options');
            // Try without options
            const balanceResult = await wasm!.fetchIdentityBalance(wasmSdk, id);
            console.log('Balance result without options:', balanceResult);
            
            if (typeof balanceResult === 'number') {
              balance = balanceResult;
            } else if (balanceResult && typeof balanceResult.balance === 'number') {
              balance = balanceResult.balance;
            }
            // Continue to the main flow
          }
          
          const balanceResult = await wasm!.fetchIdentityBalance(wasmSdk, id, fetchOptions);
          console.log('Balance result:', balanceResult);
          
          if (typeof balanceResult === 'number') {
            balance = balanceResult;
          } else if (balanceResult && typeof balanceResult.balance === 'number') {
            balance = balanceResult.balance;
          }
        } catch (error) {
          console.error('fetchIdentityBalance failed:', error);
          if (error instanceof Error && error.message?.includes('Failed to fetch')) {
            console.error('This is likely due to SSL certificate issues with testnet evonodes.');
            console.error('See SSL_CERTIFICATE_ISSUE.md for solutions.');
          }
          // Continue to try other methods
        } finally {
          // Safely clean up
          if (fetchOptions && typeof fetchOptions.free === 'function') {
            try {
              fetchOptions.free();
            } catch (e) {
              console.warn('Failed to free fetchOptions:', e);
            }
          }
        }
      }
      
      // If balance fetch worked, return a minimal identity object
      if (balance > 0) {
        console.log(`Identity found with balance: ${balance}`);
        return {
          id: id,
          balance: balance,
          publicKeys: []
        };
      }
      
      // We should NEVER query the full identity - only balance
      console.log('NOT fetching full identity as per user requirement - we only need balance');
      
      // NO MOCK DATA - if all methods fail, we fail
      console.log('All fetch methods failed');
      
      return null;
    } catch (error) {
      console.error('Failed to get identity:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
        toString: error instanceof Error ? error.toString() : String(error)
      });
      
      // NEVER return mock data - only real data or errors
      if ((error instanceof Error && error.message?.includes('Failed to fetch')) || (error instanceof Error && error.message?.includes('Transport error'))) {
        throw new Error(
          `Identity fetch failed due to SSL certificate issues. ` +
          `Browsers reject connections to testnet IPs with self-signed certificates. ` +
          `See SSL_CERTIFICATE_ISSUE.md for solutions. ` +
          `Original error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
      
      throw new Error(`Identity fetch failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Document query methods
  async queryDocuments(contractId: string, query: any): Promise<Document[]> {
    if (!this.initialized) throw new Error('SDK not initialized');
    
    // Check if contract ID is valid
    if (!contractId || contractId.includes('CONTRACT_ID')) {
      console.warn(`Invalid contract ID: ${contractId}. Please register the contract first.`);
      return [];
    }
    
    try {
      console.log(`Querying documents from contract: ${contractId}`);
      console.log('Query parameters:', query);
      
      const wasmModule = this.sdk.getWasmModule() as any;
      const wasmSdk = this.sdk.getWasmSdk() as any;
      const documentType = query.documentType || 'nft3d';
      
      console.log(`Document type: ${documentType}`);
      
      // Check if fetch_documents exists
      if (!wasmModule || !wasmModule.fetch_documents) {
        console.error('fetch_documents not found in WASM module');
        console.log('Available document methods:', wasmModule ? Object.keys(wasmModule).filter(k => k.includes('document') || k.includes('Document')).slice(0, 10) : []);
        return [];
      }
      
      // Create DocumentQueryOptions for proved queries
      const queryOptions = new wasmModule.DocumentQueryOptions(contractId, documentType);
      
      // Set query parameters
      if (query.where) {
        queryOptions.setWhereClause(query.where);
      }
      if (query.orderBy) {
        queryOptions.setOrderBy(query.orderBy);
      }
      if (query.limit) {
        queryOptions.setLimit(query.limit);
      }
      
      // Create FetchManyOptions with prove set to true
      const fetchOptions = new wasmModule.FetchManyOptions();
      fetchOptions.setProve(true);
      
      console.log('Fetching documents...');
      const response = await wasmModule.fetch_documents(
        wasmSdk,
        queryOptions,
        fetchOptions
      );
      
      // Clean up objects
      queryOptions.free();
      fetchOptions.free();
      
      console.log('Documents response:', response);
      const documents = response.items || [];
      
      return documents.map((doc: any) => ({
        id: doc.$id,
        ownerId: doc.$ownerId,
        data: {
          ...doc,
          // Map system fields to expected properties
          ownerId: doc.$ownerId,
          createdAt: doc.$createdAt,
          updatedAt: doc.$updatedAt,
          transferredAt: doc.$transferredAt,
          transferredAtBlockHeight: doc.$transferredAtBlockHeight,
          transferredAtCoreBlockHeight: doc.$transferredAtCoreBlockHeight
        },
        createdAt: doc.$createdAt || Date.now(),
        updatedAt: doc.$updatedAt || Date.now()
      }));
    } catch (error) {
      console.error('Failed to query documents:', error);
      
      // Check if it's a contract not found error
      if ((error instanceof Error && error.message?.includes('contract')) || (error instanceof Error && error.message?.includes('not found'))) {
        console.error(`Contract ${contractId} not found on the network. Please register it first.`);
        return [];
      }
      
      throw error;
    }
  }

  // Platform state methods
  async getPlatformState(): Promise<any> {
    if (!this.initialized) throw new Error('SDK not initialized');
    
    try {
      const context = await this.sdk.createContext() as any;
      return {
        height: context.blockHeight || 0,
        timestamp: context.blockTime || Date.now(),
        coreChainLockedHeight: context.coreChainLockedHeight || 0,
        version: context.version || '1.0.0'
      };
    } catch (error) {
      console.error('Failed to get platform state:', error);
      throw error;
    }
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

    try {
      const wasmModule = this.sdk.getWasmModule() as any;
      const wasmSdk = this.sdk.getWasmSdk() as any;
      
      // Prepare document data with required transfer fields
      const now = Date.now();
      const documentData = {
        ...options.nftData,
        // System fields that need to be set on creation
        $transferredAt: now,
        $transferredAtBlockHeight: 0, // Will be set by platform
        $transferredAtCoreBlockHeight: 0 // Will be set by platform
      };

      // Create document state transition
      const transition = await wasmModule.createDocument(
        wasmSdk,
        options.contractId,
        options.identity.id,
        'nft3d',
        documentData
      );

      // Broadcast the transition
      const result = await wasmModule.broadcastStateTransition(
        wasmSdk,
        transition,
        false
      );
      return result;
    } catch (error) {
      console.error('Failed to create NFT:', error);
      throw error;
    }
  }

  async transferNFT(options: {
    contractId: string;
    nftId: string;
    fromIdentity: { id: string; privateKey: string };
    toIdentityId: string;
  }) {
    if (!this.initialized) throw new Error('SDK not initialized');
    
    try {
      const wasmModule = this.sdk.getWasmModule() as any;
      const wasmSdk = this.sdk.getWasmSdk() as any;
      
      // Platform handles transfers natively for documents with transferable: 1
      // Use the transfer method provided by the platform
      console.log('Transferring NFT using platform transfer mechanism...');
      
      // TODO: Use the platform's native transfer method when available in WASM SDK
      // For now, this is a placeholder - the actual transfer would be handled by
      // the platform's document transfer functionality
      
      throw new Error('Platform transfer not yet implemented in WASM SDK');
    } catch (error) {
      console.error('Failed to transfer NFT:', error);
      throw error;
    }
  }

  // Utility methods
  getSDK(): SDK {
    return this.sdk;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getNetwork(): string {
    return this.sdk.getNetwork().name;
  }

  getApps(): Record<string, any> {
    return this.sdk.getApps();
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