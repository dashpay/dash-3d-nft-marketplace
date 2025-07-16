'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { getNFTSDK } from '@/lib/dash-sdk';
import { NFT3DViewer } from '@/components/NFT3DViewer';
import { ModernNFTCoverflow } from '@/components/ModernNFTCoverflow';
import SearchFiltersComponent from '@/components/SearchFilters';
import { CreateListing } from '@/components/CreateListing';
import { BiddingInterface } from '@/components/BiddingInterface';
import { NFTCard } from '@/components/NFTCard';
import { NFT3D, NFTListing, NFTAuction, NFTBid, SortOptions } from '@/types/nft';
import { PREMIUM_MOCK_NFTS } from '@/lib/premium-mock-data';
import { NFTWithListing, searchAndFilterNFTs } from '@/lib/search';
import { UsernameDisplay } from '@/components/auth/UsernameDisplay';
import { PaginatedGallery } from '@/components/gallery/PaginatedGallery';
import ClientOnly from '@/components/ClientOnly';

function GalleryPageInner() {
  const router = useRouter();
  const { 
    network,
    identityId, 
    isAuthenticated, 
    userNFTs, 
    setUserNFTs, 
    selectNFT,
    logout,
    // Marketplace state
    listings,
    auctions,
    userBids,
    searchFilters,
    sortBy,
    // Marketplace actions
    createListing,
    createAuction,
    placeBid,
    buyNFT,
    setSearchFilters,
    setSortBy
  } = useStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'owned' | 'marketplace' | 'enhanced'>('owned');
  const [marketNFTs, setMarketNFTs] = useState<NFT3D[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFT3D | null>(null);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showBiddingInterface, setShowBiddingInterface] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<NFTAuction | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    loadNFTs();
  }, [isAuthenticated, identityId]);

  const loadNFTs = async () => {
    setIsLoading(true);
    
    try {
      // Use premium mock data for demo
      setUserNFTs(PREMIUM_MOCK_NFTS);
      
      // Create some marketplace NFTs (simulate other users' NFTs)
      const marketplaceNFTs = PREMIUM_MOCK_NFTS.slice(5).map(nft => ({
        ...nft,
        id: `market_${nft.id}`,
        ownerId: '7FcQvuJm8EtRpLqY9NxVd2HkS6T3Wf1Xb4Ac9Zn2Mp8K', // Different owner
      }));
      setMarketNFTs(marketplaceNFTs);
    } catch (error) {
      console.error('Failed to load NFTs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNFTClick = (nft: NFT3D) => {
    selectNFT(nft);
    if (nft.id) {
      router.push(`/nft/${nft.id}`);
    }
  };

  const handleCreateListing = (nft: NFT3D) => {
    setSelectedNFT(nft);
    setShowCreateListing(true);
  };

  const handleQuickBuy = async (nft: NFT3D, listing: NFTListing) => {
    try {
      await buyNFT(listing.id);
      // TODO: Show success message
    } catch (error) {
      console.error('Failed to buy NFT:', error);
    }
  };

  const handlePlaceBid = (nft: NFT3D, auction: NFTAuction) => {
    setSelectedNFT(nft);
    setSelectedAuction(auction);
    setShowBiddingInterface(true);
  };

  const handleBidSubmit = async (amount: string) => {
    if (!selectedAuction) return;
    
    try {
      await placeBid(selectedAuction.id, amount);
      setShowBiddingInterface(false);
      setSelectedAuction(null);
    } catch (error) {
      console.error('Failed to place bid:', error);
    }
  };

  // Combine NFTs with their listings for filtering
  const combineNFTsWithListings = (nfts: NFT3D[]): NFTWithListing[] => {
    return nfts.map(nft => {
      const listing = nft.id ? [...listings, ...auctions].find(l => l.nftId === nft.id) : undefined;
      return { ...nft, listing };
    });
  };

  const getNFTBids = (auctionId: string): NFTBid[] => {
    return userBids.filter(bid => bid.auctionId === auctionId);
  };

  // Note: Sort function moved to search.ts utility for consistency

  // Separate data flow: unfiltered for coverflow, filtered for grid
  const rawDisplayNFTs = selectedTab === 'owned' ? userNFTs : marketNFTs;
  const nftsWithListings = combineNFTsWithListings(rawDisplayNFTs);
  
  // Unfiltered NFTs for coverflow (discovery/showcase)
  const coverflowNFTs = nftsWithListings;
  
  // Filtered NFTs for grid (browsing with search/filters)
  const filteredNFTs = searchAndFilterNFTs(nftsWithListings, searchFilters, sortBy);

  return (
    <div className="min-h-screen p-8 lg:p-12" style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e, #0a0a0a)' }}>
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.1), rgba(139,92,246,0.1), rgba(255,0,128,0.1))' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* User Actions - Top Right */}
        <div className="flex justify-end px-8 pt-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/10 min-w-[240px]">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">User</div>
              <UsernameDisplay 
                className="text-sm font-medium whitespace-nowrap"
                showFullId={false}
              />
            </div>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 text-sm font-medium text-white hover:text-[#00D4FF] transition-all duration-200
                         bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10
                         hover:border-[#00D4FF]/30 hover:scale-105 whitespace-nowrap"
            >
              Dashboard
            </button>
            
            <button
              onClick={logout}
              className="px-10 py-4 text-sm font-medium text-white hover:text-[#00D4FF] transition-all duration-200
                         bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10
                         hover:border-[#00D4FF]/30 hover:scale-105 min-w-[100px] whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Centered Header Title */}
        <div className="text-center px-8 pt-16 pb-32 lg:pb-40">
          {/* Main Title */}
          <h1 className="text-7xl font-black leading-none tracking-tight mb-8">
            <span className="bg-clip-text text-transparent" style={{ background: 'linear-gradient(90deg, #00D4FF, #8B5CF6, #FF0080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              3D NFT Gallery
            </span>
          </h1>
          
          {/* Subtitle with perfect spacing - Force Centered */}
          <div className="w-full flex flex-col items-center justify-center space-y-6 px-8">
            <p className="text-2xl font-medium text-white/80 leading-relaxed text-center max-w-2xl">
              Explore the future of digital art
            </p>
            <p className="text-lg text-gray-400 leading-relaxed font-light text-center max-w-2xl">
              Discover unique 3D masterpieces on the Dash Platform blockchain
            </p>
          </div>
          
          {/* Centered accent line */}
          <div className="w-24 h-1 rounded-full mx-auto mt-12" style={{ background: 'linear-gradient(90deg, #00D4FF, #8B5CF6)' }}></div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-16 px-4">
          <div className="flex gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <button
              onClick={() => setSelectedTab('owned')}
              className={`px-12 py-6 rounded-xl transition-all font-medium text-xs whitespace-nowrap min-w-[150px] ${
                selectedTab === 'owned'
                  ? 'text-white shadow-lg shadow-[#00D4FF]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={selectedTab === 'owned' ? { background: 'linear-gradient(90deg, #00D4FF, #8B5CF6)' } : {}}
            >
              My Collection ({userNFTs.length})
            </button>
            <button
              onClick={() => setSelectedTab('marketplace')}
              className={`px-12 py-6 rounded-xl transition-all font-medium text-xs whitespace-nowrap min-w-[130px] ${
                selectedTab === 'marketplace'
                  ? 'text-white shadow-lg shadow-[#00D4FF]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={selectedTab === 'marketplace' ? { background: 'linear-gradient(90deg, #00D4FF, #8B5CF6)' } : {}}
            >
              Marketplace ({marketNFTs.length})
            </button>
            <button
              onClick={() => setSelectedTab('enhanced')}
              className={`px-12 py-6 rounded-xl transition-all font-medium text-xs whitespace-nowrap min-w-[130px] ${
                selectedTab === 'enhanced'
                  ? 'text-white shadow-lg shadow-[#00D4FF]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={selectedTab === 'enhanced' ? { background: 'linear-gradient(90deg, #00D4FF, #8B5CF6)' } : {}}
            >
              Enhanced Gallery (150)
            </button>
          </div>
        </div>

        {/* NFT Grid */}
        {selectedTab === 'enhanced' ? (
          <div className="space-y-20 lg:space-y-24">
            {/* Enhanced Gallery Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Enhanced Gallery</h2>
              <p className="text-gray-400">Pagination and infinite scroll with 150+ NFTs</p>
            </div>

            {/* Enhanced NFT Grid with Pagination */}
            <div className="px-12 lg:px-16">
              <PaginatedGallery
                mode="pagination"
                initialFilters={{}}
                initialSort={SortOptions.RECENT}
                initialPageSize={20}
                onNFTClick={handleNFTClick}
                onQuickBuy={handleQuickBuy}
                onPlaceBid={handlePlaceBid}
                onCreateListing={handleCreateListing}
                currentUserId={identityId || ''}
                showControls={true}
                showInfo={true}
                showPageSizeSelector={true}
              />
            </div>
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Loading NFTs...</div>
              </div>
            ) : rawDisplayNFTs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 mb-4">
                  {selectedTab === 'owned' 
                    ? "You don't own any NFTs yet"
                    : "No NFTs available in the marketplace"
                  }
                </p>
                {selectedTab === 'owned' && (
                  <button
                    onClick={() => setSelectedTab('marketplace')}
                    className="px-6 py-3 bg-dash-blue hover:bg-dash-blue-dark text-white rounded-lg transition-colors"
                  >
                    Browse Marketplace
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-20 lg:space-y-28">
                {/* Modern 3D Coverflow - Always shows unfiltered NFTs for discovery */}
                <div className="space-y-8 lg:space-y-10">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Featured Collection</h2>
                    <p className="text-gray-400">Discover amazing 3D NFTs</p>
                  </div>
                  <ModernNFTCoverflow 
                    nfts={coverflowNFTs.slice(0, 10)} // Show first 10 unfiltered NFTs
                    onNFTClick={handleNFTClick}
                  />
                </div>
                
                {/* Search & Filters */}
                <SearchFiltersComponent
                  filters={searchFilters}
                  sortBy={sortBy}
                  onFiltersChange={setSearchFilters}
                  onSortChange={setSortBy}
                />
                
                {/* Original NFT Grid */}
                <div className="px-12 lg:px-16">
                  {/* Header Bar */}
                  <div className="flex items-center justify-between mb-10 lg:mb-12 gap-4">
                    <div className="text-white font-medium">
                      {filteredNFTs.length} items {searchFilters.query || Object.keys(searchFilters).length > 0 ? '(filtered)' : ''}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {selectedTab === 'owned' && (
                        <button
                          onClick={() => setShowCreateListing(true)}
                          className="px-6 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white rounded-lg hover:from-[#6D28D9] hover:to-[#8B5CF6] transition-colors text-sm font-medium"
                        >
                          Create Listing
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Original NFT Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8 xl:gap-10">
                    {filteredNFTs.length === 0 ? (
                      <div className="col-span-full text-center py-16">
                        <p className="text-gray-400 mb-4">No NFTs match your search criteria</p>
                        <button
                          onClick={() => setSearchFilters({})}
                          className="text-[#00D4FF] hover:text-[#0099CC] transition-colors"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      filteredNFTs.map((nft, index) => (
                      <NFTCard
                        key={nft.id || `nft-${index}`}
                        nft={nft}
                        listing={nft.listing}
                        onClick={handleNFTClick}
                        onQuickBuy={handleQuickBuy}
                        onPlaceBid={handlePlaceBid}
                        onCreateListing={handleCreateListing}
                        showOwnership={selectedTab === 'marketplace'}
                        currentUserId={identityId || ''}
                      />
                      ))
                    )}
                  </div>
                </div>
                
                {/* Marketplace Badge */}
                {selectedTab === 'marketplace' && (
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#00D4FF]/20 to-[#8B5CF6]/20 border border-[#00D4FF]/30 backdrop-blur-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-[#00D4FF] text-sm font-medium">Live Marketplace</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modals */}
      {showCreateListing && selectedNFT && (
        <CreateListing
          nft={selectedNFT}
          isOpen={showCreateListing}
          onClose={() => {
            setShowCreateListing(false);
            setSelectedNFT(null);
          }}
          onCreateListing={createListing}
          onCreateAuction={createAuction}
        />
      )}
      
      {showBiddingInterface && selectedAuction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] rounded-3xl border border-white/10 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Place Bid</h2>
              <button
                onClick={() => {
                  setShowBiddingInterface(false);
                  setSelectedAuction(null);
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <BiddingInterface
              auction={selectedAuction}
              currentUserBid={userBids.find(bid => bid.auctionId === selectedAuction.id && bid.bidderId === identityId)}
              recentBids={getNFTBids(selectedAuction.id)}
              currentUserId={identityId || ''}
              onPlaceBid={handleBidSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <ClientOnly fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Gallery...</div>
      </div>
    }>
      <GalleryPageInner />
    </ClientOnly>
  );
}