import { create } from 'zustand';
import { NFT3D } from '@/types/nft';
import { getNFTSDK } from '@/lib/dash-sdk';

interface AppState {
  // Network
  network: 'mainnet' | 'testnet';
  
  // User identity
  identityId: string | null;
  isAuthenticated: boolean;
  
  // NFTs
  userNFTs: NFT3D[];
  marketNFTs: NFT3D[];
  selectedNFT: NFT3D | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setNetwork: (network: 'mainnet' | 'testnet') => Promise<void>;
  setIdentityId: (id: string | null) => void;
  login: (identityId: string) => Promise<void>;
  logout: () => void;
  
  setUserNFTs: (nfts: NFT3D[]) => void;
  setMarketNFTs: (nfts: NFT3D[]) => void;
  selectNFT: (nft: NFT3D | null) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Global SDK instance that gets recreated on network change
let sdkInstance: any = null;

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  network: (typeof window !== 'undefined' && localStorage.getItem('dash-nft-network') as 'mainnet' | 'testnet') || 'testnet', // Default to testnet
  identityId: null,
  isAuthenticated: false,
  userNFTs: [],
  marketNFTs: [],
  selectedNFT: null,
  isLoading: false,
  error: null,
  
  // Actions
  setNetwork: async (network: 'mainnet' | 'testnet') => {
    try {
      set({ isLoading: true, error: null });
      
      // Reset SDK instance to force recreation with new network
      sdkInstance = null;
      
      // If user was authenticated, log them out since identity might not exist on other network
      const { isAuthenticated } = get();
      if (isAuthenticated) {
        set({ 
          identityId: null, 
          isAuthenticated: false,
          userNFTs: [],
          selectedNFT: null
        });
        
        // Clear from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('dash-nft-identity');
          localStorage.setItem('dash-nft-network', network);
        }
      }
      
      set({ network, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to switch network',
        isLoading: false 
      });
    }
  },
  
  setIdentityId: (id) => set({ identityId: id }),
  
  login: async (identityId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Validate identity ID format (base58 - alphanumeric, no special chars except excluded ones)
      const identityRegex = /^[1-9A-HJ-NP-Za-km-z]{44}$/;
      if (!identityRegex.test(identityId)) {
        throw new Error('Invalid identity ID format. Must be 44 base58 characters.');
      }
      
      // Initialize SDK and verify identity exists on platform
      const { network } = get();
      const sdk = getNFTSDK({ network });
      if (!sdk.isInitialized()) {
        console.log('Initializing SDK for login...');
        await sdk.initialize();
      }
      
      try {
        const isValid = await sdk.verifyIdentity(identityId);
        if (!isValid) {
          throw new Error('Identity not found on Dash Platform');
        }
      } catch (error) {
        // Check if it's a transport/CORS error
        if (error.message?.includes('Failed to fetch') || error.message?.includes('Transport error')) {
          throw new Error(
            'Unable to connect to Dash Platform. This is likely due to CORS restrictions. ' +
            'Please see README-CONTRACT.md for solutions.'
          );
        }
        throw error;
      }
      
      set({ 
        identityId, 
        isAuthenticated: true,
        isLoading: false 
      });
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('dash-nft-identity', identityId);
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false 
      });
      throw error;
    }
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dash-nft-identity');
    }
    set({ 
      identityId: null, 
      isAuthenticated: false,
      userNFTs: [],
      selectedNFT: null
    });
  },
  
  setUserNFTs: (nfts) => set({ userNFTs: nfts }),
  setMarketNFTs: (nfts) => set({ marketNFTs: nfts }),
  selectNFT: (nft) => set({ selectedNFT: nft }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));