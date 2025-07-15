import { create } from 'zustand';
import { NFT3D, NFTListing, NFTAuction, NFTBid, SearchFilters, SortOptions } from '@/types/nft';
import { getNFTSDK } from '@/lib/dash-sdk';

interface AppState {
  // Network
  network: 'mainnet' | 'testnet';
  
  // User identity
  identityId: string | null;
  isAuthenticated: boolean;
  username: string | null;
  isLoadingUsername: boolean;
  
  // NFTs
  userNFTs: NFT3D[];
  mintedNFTs: NFT3D[];
  marketNFTs: NFT3D[];
  selectedNFT: NFT3D | null;
  
  // Marketplace
  listings: NFTListing[];
  auctions: NFTAuction[];
  userBids: NFTBid[];
  
  // Search & Filters
  searchFilters: SearchFilters;
  sortBy: SortOptions;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setNetwork: (network: 'mainnet' | 'testnet') => Promise<void>;
  setIdentityId: (id: string | null) => void;
  login: (identityId: string) => Promise<void>;
  loginWithUsername: (username: string) => Promise<void>;
  logout: () => void;
  loadUsername: (identityId: string) => Promise<void>;
  resolveUsernameToId: (username: string) => Promise<string | null>;
  
  setUserNFTs: (nfts: NFT3D[]) => void;
  setMintedNFTs: (nfts: NFT3D[]) => void;
  setMarketNFTs: (nfts: NFT3D[]) => void;
  selectNFT: (nft: NFT3D | null) => void;
  mintNFT: (nft: Omit<NFT3D, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  
  // Marketplace actions
  setListings: (listings: NFTListing[]) => void;
  setAuctions: (auctions: NFTAuction[]) => void;
  setUserBids: (bids: NFTBid[]) => void;
  createListing: (listing: Omit<NFTListing, 'id' | 'createdAt'>) => Promise<void>;
  createAuction: (auction: Omit<NFTAuction, 'id' | 'createdAt' | 'currentPrice' | 'totalBids'>) => Promise<void>;
  placeBid: (auctionId: string, amount: string) => Promise<void>;
  buyNFT: (listingId: string) => Promise<void>;
  
  // Search & Filter actions
  setSearchFilters: (filters: SearchFilters) => void;
  setSortBy: (sort: SortOptions) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Global SDK instance that gets recreated on network change
let sdkInstance: any = null;

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  network: 'testnet', // Default to testnet, will be hydrated from localStorage
  identityId: null,
  isAuthenticated: false,
  username: null,
  isLoadingUsername: false,
  userNFTs: [],
  mintedNFTs: [],
  marketNFTs: [],
  selectedNFT: null,
  
  // Marketplace state
  listings: [],
  auctions: [],
  userBids: [],
  
  // Search & Filter state
  searchFilters: {},
  sortBy: SortOptions.RECENT,
  
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
          username: null,
          isLoadingUsername: false,
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
        if ((error instanceof Error && error.message?.includes('Failed to fetch')) || (error instanceof Error && error.message?.includes('Transport error'))) {
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
      
      // Load username after successful login
      get().loadUsername(identityId);
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
      username: null,
      isLoadingUsername: false,
      userNFTs: [],
      selectedNFT: null
    });
  },
  
  loginWithUsername: async (username: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const identityId = await get().resolveUsernameToId(username);
      if (!identityId) {
        throw new Error('Username not found');
      }
      
      // Use the regular login method with the resolved identity ID
      await get().login(identityId);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login with username failed',
        isLoading: false 
      });
      throw error;
    }
  },

  loadUsername: async (identityId: string) => {
    set({ isLoadingUsername: true });
    
    try {
      const { network } = get();
      const sdk = getNFTSDK({ network });
      
      const username = await sdk.getDPNSName(identityId);
      set({ username, isLoadingUsername: false });
    } catch (error) {
      console.error('Failed to load username:', error);
      set({ username: null, isLoadingUsername: false });
    }
  },

  resolveUsernameToId: async (username: string): Promise<string | null> => {
    try {
      const { network } = get();
      const sdk = getNFTSDK({ network });
      
      return await sdk.resolveUsername(username);
    } catch (error) {
      console.error('Failed to resolve username:', error);
      return null;
    }
  },

  setUserNFTs: (nfts) => set({ userNFTs: nfts }),
  setMintedNFTs: (nfts) => set({ mintedNFTs: nfts }),
  setMarketNFTs: (nfts) => set({ marketNFTs: nfts }),
  selectNFT: (nft) => set({ selectedNFT: nft }),

  mintNFT: async (nftData) => {
    try {
      set({ isLoading: true, error: null });
      
      const { identityId } = get();
      if (!identityId) {
        throw new Error('Must be authenticated to mint NFT');
      }

      // Create new NFT with generated ID and timestamps
      const newNFT: NFT3D = {
        ...nftData,
        id: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ownerId: identityId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      // TODO: Implement actual SDK call to mint NFT
      // const sdk = getNFTSDK({ network: get().network });
      // await sdk.mintNFT(newNFT);

      // For now, add to both userNFTs and mintedNFTs arrays
      const { userNFTs, mintedNFTs } = get();
      set({ 
        userNFTs: [...userNFTs, newNFT],
        mintedNFTs: [...mintedNFTs, newNFT],
        isLoading: false 
      });

      return newNFT;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to mint NFT',
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Marketplace actions
  setListings: (listings) => set({ listings }),
  setAuctions: (auctions) => set({ auctions }),
  setUserBids: (bids) => set({ userBids: bids }),
  
  createListing: async (listing) => {
    try {
      set({ isLoading: true, error: null });
      
      // TODO: Implement SDK call to create listing
      const newListing: NFTListing = {
        ...listing,
        id: `listing_${Date.now()}`,
        createdAt: Date.now()
      };
      
      const { listings } = get();
      set({ listings: [...listings, newListing], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create listing',
        isLoading: false 
      });
      throw error;
    }
  },
  
  createAuction: async (auction) => {
    try {
      set({ isLoading: true, error: null });
      
      // TODO: Implement SDK call to create auction
      const newAuction: NFTAuction = {
        ...auction,
        id: `auction_${Date.now()}`,
        createdAt: Date.now(),
        currentPrice: auction.startingPrice,
        totalBids: 0
      };
      
      const { auctions } = get();
      set({ auctions: [...auctions, newAuction], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create auction',
        isLoading: false 
      });
      throw error;
    }
  },
  
  placeBid: async (auctionId, amount) => {
    try {
      set({ isLoading: true, error: null });
      
      // TODO: Implement SDK call to place bid
      const { auctions, userBids, identityId } = get();
      
      const newBid: NFTBid = {
        id: `bid_${Date.now()}`,
        auctionId,
        bidderId: identityId!,
        amount: `${amount} DASH`,
        currency: 'DASH',
        timestamp: Date.now(),
        status: 'active'
      };
      
      // Update auction with new bid
      const updatedAuctions = auctions.map(auction => {
        if (auction.id === auctionId) {
          return {
            ...auction,
            currentPrice: `${amount} DASH`,
            totalBids: auction.totalBids + 1,
            highestBidder: identityId!
          };
        }
        return auction;
      });
      
      set({ 
        auctions: updatedAuctions,
        userBids: [...userBids, newBid],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to place bid',
        isLoading: false 
      });
      throw error;
    }
  },
  
  buyNFT: async (listingId) => {
    try {
      set({ isLoading: true, error: null });
      
      // TODO: Implement SDK call to buy NFT
      const { listings } = get();
      
      // Update listing status to sold
      const updatedListings = listings.map(listing => {
        if (listing.id === listingId) {
          return { ...listing, status: 'sold' as const };
        }
        return listing;
      });
      
      set({ listings: updatedListings, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to buy NFT',
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Search & Filter actions
  setSearchFilters: (filters) => set({ searchFilters: filters }),
  setSortBy: (sort) => set({ sortBy: sort }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));