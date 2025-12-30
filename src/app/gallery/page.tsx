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
import { Button } from '@/components/ui/Button';
import { NavHeader } from '@/components/NavHeader';
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e, #0a0a0a)' }}>
      {/* Navigation Header */}
      <NavHeader />

      {/* Aurora Background Effect */}
      <div className="fixed inset-0 opacity-30 pointer-events-none -z-10">
        <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.1), rgba(139,92,246,0.1), rgba(255,0,128,0.1))' }}></div>
      </div>

      <div className="relative section-container page-content">

        {/* Refined Header Section */}
        <div className="text-left pb-16 lg:pb-20 max-w-4xl">
          {/* Refined Main Title */}
          <h1 className="relative mb-4">
            <span className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-[-0.02em] bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 50%, #FF0080 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundSize: '200% auto',
                    animation: 'gradient 3s ease infinite'
                  }}>
              Digital Art Gallery
            </span>
          </h1>
          <p className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mb-8">3D NFT Collection</p>

          {/* Subtitle - aligned left */}
          <div className="space-y-3">
            <p className="text-lg md:text-xl font-light text-white/90 leading-relaxed tracking-wide">
              Where <span className="font-semibold text-[#00D4FF]">creativity</span> meets <span className="font-semibold text-[#8B5CF6]">blockchain</span>
            </p>
            <p className="text-sm md:text-base text-white/60 font-light leading-relaxed">
              Immerse yourself in a curated collection of procedural, parametric, and voxel art
            </p>
          </div>

          {/* Interactive Stats */}
          <div className="flex gap-10 md:gap-14 mt-12 lg:mt-14">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{userNFTs.length + marketNFTs.length}</div>
              <div className="text-xs uppercase tracking-wider text-white/40">Total NFTs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#00D4FF] mb-1">{listings.length}</div>
              <div className="text-xs uppercase tracking-wider text-white/40">Active Listings</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#8B5CF6] mb-1">{auctions.length}</div>
              <div className="text-xs uppercase tracking-wider text-white/40">Live Auctions</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-16 lg:mb-20 px-4">
          <div className="relative flex gap-2 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/20">
            <button
              onClick={() => setSelectedTab('owned')}
              className={`px-8 py-4 rounded-xl transition-all duration-300 font-medium text-sm whitespace-nowrap min-w-[140px] ${
                selectedTab === 'owned'
                  ? 'text-white shadow-xl shadow-[#00D4FF]/25'
                  : 'text-gray-400 hover:text-white/80 hover:bg-white/5'
              }`}
              style={selectedTab === 'owned' ? {
                background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)'
              } : {}}
            >
              My Collection
            </button>
            <button
              onClick={() => setSelectedTab('marketplace')}
              className={`px-8 py-4 rounded-xl transition-all duration-300 font-medium text-sm whitespace-nowrap min-w-[140px] ${
                selectedTab === 'marketplace'
                  ? 'text-white shadow-xl shadow-[#8B5CF6]/25'
                  : 'text-gray-400 hover:text-white/80 hover:bg-white/5'
              }`}
              style={selectedTab === 'marketplace' ? {
                background: 'linear-gradient(135deg, #8B5CF6, #FF0080)'
              } : {}}
            >
              Marketplace
            </button>
            <button
              onClick={() => setSelectedTab('enhanced')}
              className={`px-8 py-4 rounded-xl transition-all duration-300 font-medium text-sm whitespace-nowrap min-w-[140px] ${
                selectedTab === 'enhanced'
                  ? 'text-white shadow-xl shadow-[#FF0080]/25'
                  : 'text-gray-400 hover:text-white/80 hover:bg-white/5'
              }`}
              style={selectedTab === 'enhanced' ? {
                background: 'linear-gradient(135deg, #FF0080, #00D4FF)'
              } : {}}
            >
              Enhanced
            </button>
          </div>
        </div>

        {/* NFT Grid */}
        {selectedTab === 'enhanced' ? (
          <div className="space-y-24 lg:space-y-32">
            {/* Enhanced Gallery Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Enhanced Gallery</h2>
              <p className="text-gray-400">Pagination and infinite scroll with 150+ NFTs</p>
            </div>

            {/* Enhanced NFT Grid with Pagination */}
            <div className="px-4 lg:px-8">
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
              <div className="space-y-24 lg:space-y-32">
                {/* Enhanced 3D Coverflow Section */}
                <div className="space-y-10 lg:space-y-12">
                  <div className="text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#00D4FF]/10 to-[#8B5CF6]/10 border border-[#00D4FF]/20 mb-4">
                      <svg className="w-3 h-3 text-[#00D4FF]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF]">Featured</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Premium Collection</h2>
                    <p className="text-sm text-gray-500">Hand-picked exceptional 3D artworks</p>
                  </div>
                  <ModernNFTCoverflow 
                    nfts={coverflowNFTs.slice(0, 10)} // Show first 10 unfiltered NFTs
                    onNFTClick={handleNFTClick}
                  />
                </div>
                
                {/* Search & Filters */}
                <div className="px-4 lg:px-8">
                  <SearchFiltersComponent
                    filters={searchFilters}
                    sortBy={sortBy}
                    onFiltersChange={setSearchFilters}
                    onSortChange={setSortBy}
                  />
                </div>
                
                {/* Enhanced NFT Grid Section */}
                <div className="px-4 lg:px-8">
                  {/* Enhanced Header Bar */}
                  <div className="flex items-center justify-between mb-12 lg:mb-14 gap-6 animate-fade-in-up">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] rounded-xl border border-white/10">
                        <svg className="w-4 h-4 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span className="text-white font-bold text-sm">{filteredNFTs.length}</span>
                        <span className="text-gray-500 text-xs">items</span>
                      </div>
                      {(searchFilters.query || Object.keys(searchFilters).length > 0) && (
                        <div className="px-3 py-1.5 bg-[#8B5CF6]/10 rounded-lg border border-[#8B5CF6]/20">
                          <span className="text-[#8B5CF6] text-xs font-semibold">Filtered</span>
                        </div>
                      )}
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

                  {/* Optimized NFT Grid with Animation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
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
                
                {/* Enhanced Marketplace Status */}
                {selectedTab === 'marketplace' && (
                  <div className="text-center mt-16 lg:mt-20 animate-fade-in-up">
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00D4FF]/10 via-[#8B5CF6]/10 to-[#FF0080]/10 border border-white/10 backdrop-blur-xl shadow-xl">
                      <div className="relative">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping absolute"></div>
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-sm font-bold uppercase tracking-wider">Live Marketplace</span>
                      <div className="flex items-center gap-1">
                        <span className="text-white/60 text-xs">Active:</span>
                        <span className="text-[#00D4FF] text-sm font-bold">{listings.filter(l => l.status === 'active').length}</span>
                      </div>
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
