'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { getNFTSDK } from '@/lib/dash-sdk';
import NFT3DViewer from '@/components/NFT3DViewer';
import { ModernNFTCoverflow } from '@/components/ModernNFTCoverflow';
import { NFT3D } from '@/types/nft';
import { PREMIUM_MOCK_NFTS } from '@/lib/premium-mock-data';

export default function GalleryPage() {
  const router = useRouter();
  const { 
    network,
    identityId, 
    isAuthenticated, 
    userNFTs, 
    setUserNFTs, 
    selectNFT,
    logout 
  } = useStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'owned' | 'marketplace'>('owned');
  const [marketNFTs, setMarketNFTs] = useState<NFT3D[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'name'>('recent');

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
    router.push(`/nft/${nft.id}`);
  };

  // Sort function
  const sortNFTs = (nfts: NFT3D[], criteria: string) => {
    const sortedNFTs = [...nfts];
    
    switch (criteria) {
      case 'price-low':
        return sortedNFTs.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(' DASH', ''));
          const priceB = parseFloat(b.price.replace(' DASH', ''));
          return priceA - priceB;
        });
      case 'price-high':
        return sortedNFTs.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(' DASH', ''));
          const priceB = parseFloat(b.price.replace(' DASH', ''));
          return priceB - priceA;
        });
      case 'name':
        return sortedNFTs.sort((a, b) => a.name.localeCompare(b.name));
      case 'recent':
      default:
        return sortedNFTs.sort((a, b) => b.createdAt - a.createdAt);
    }
  };

  const rawDisplayNFTs = selectedTab === 'owned' ? userNFTs : marketNFTs;
  const displayNFTs = sortNFTs(rawDisplayNFTs, sortBy);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] p-8">
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/10 via-[#8B5CF6]/10 to-[#FF0080]/10 animate-pulse"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* User Actions - Top Right */}
        <div className="flex justify-end px-8 pt-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-sm bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/10">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Identity</div>
              <div className="text-[#00D4FF] font-mono font-medium">
                {identityId?.slice(0, 8)}...{identityId?.slice(-8)}
              </div>
            </div>
            
            <button
              onClick={logout}
              className="px-8 py-3 text-sm font-medium text-white hover:text-[#00D4FF] transition-all duration-200
                         bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10
                         hover:border-[#00D4FF]/30 hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Centered Header Title */}
        <div className="text-center px-8 pt-16 pb-24">
          {/* Main Title */}
          <h1 className="text-7xl font-black leading-none tracking-tight mb-8">
            <span className="bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#FF0080] bg-clip-text text-transparent">
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
          <div className="w-24 h-1 bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] rounded-full mx-auto mt-12"></div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-16 px-4">
          <div className="flex gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <button
              onClick={() => setSelectedTab('owned')}
              className={`px-20 py-6 rounded-xl transition-all font-medium text-xs whitespace-nowrap min-w-[200px] ${
                selectedTab === 'owned'
                  ? 'bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white shadow-lg shadow-[#00D4FF]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              My Collection ({userNFTs.length})
            </button>
            <button
              onClick={() => setSelectedTab('marketplace')}
              className={`px-20 py-6 rounded-xl transition-all font-medium text-xs whitespace-nowrap min-w-[180px] ${
                selectedTab === 'marketplace'
                  ? 'bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white shadow-lg shadow-[#00D4FF]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Marketplace ({marketNFTs.length})
            </button>
          </div>
        </div>

        {/* NFT Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Loading NFTs...</div>
          </div>
        ) : displayNFTs.length === 0 ? (
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
          <div className="space-y-20">
            {/* Modern 3D Coverflow */}
            <ModernNFTCoverflow 
              nfts={displayNFTs} 
              onNFTClick={handleNFTClick}
              className="mb-20"
            />
            
            {/* OpenSea-style NFT Listing */}
            <div className="px-4 mt-20">
              {/* Header Bar */}
              <div className="flex items-center justify-between mb-8 gap-4">
                <div className="text-white font-medium">
                  {displayNFTs.length} items
                </div>
                
                {/* Sort Dropdown */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm">Sort by</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'recent' | 'price-low' | 'price-high' | 'name')}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00D4FF]/50 cursor-pointer"
                  >
                    <option value="recent" className="bg-gray-800 text-white">Recently Created</option>
                    <option value="price-low" className="bg-gray-800 text-white">Price: Low to High</option>
                    <option value="price-high" className="bg-gray-800 text-white">Price: High to Low</option>
                    <option value="name" className="bg-gray-800 text-white">Name A-Z</option>
                  </select>
                </div>
              </div>

              {/* NFT Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {displayNFTs.map((nft) => (
                  <div
                    key={nft.id}
                    onClick={() => handleNFTClick(nft)}
                    className="group bg-white/5 hover:bg-white/8 rounded-2xl border border-white/10 hover:border-[#00D4FF]/30 cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                    style={{ padding: '24px' }}
                  >
                    {/* NFT Image/3D Preview */}
                    <div className="relative bg-black/20 rounded-xl overflow-hidden" 
                         style={{ aspectRatio: '1', marginBottom: '20px', marginLeft: '8px', marginRight: '8px' }}>
                      <div className="absolute inset-0 flex items-center justify-center" style={{ padding: '16px' }}>
                        <NFT3DViewer nft={nft} size="small" interactive={false} autoRotate={false} />
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="text-white text-sm font-medium">View Details</div>
                      </div>
                    </div>

                    {/* NFT Info */}
                    <div style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                      <div style={{ paddingLeft: '8px', paddingRight: '8px', marginBottom: '16px' }}>
                        <h3 className="text-white font-medium text-sm leading-tight line-clamp-1" 
                            style={{ marginBottom: '8px', paddingLeft: '6px', paddingRight: '6px' }}>
                          {nft.name}
                        </h3>
                        <p className="text-gray-400 text-xs" style={{ paddingLeft: '6px', paddingRight: '6px' }}>
                          {nft.collection}
                        </p>
                      </div>

                      {/* Price Section */}
                      <div style={{ paddingLeft: '8px', paddingRight: '8px', marginBottom: '16px' }}>
                        <div style={{ paddingLeft: '6px', paddingRight: '6px' }}>
                          <div className="text-gray-500 text-xs" style={{ marginBottom: '4px' }}>Price</div>
                          <div className="text-white font-mono text-sm font-bold">
                            {nft.price}
                          </div>
                        </div>
                      </div>

                      {/* Creator */}
                      <div className="border-t border-white/10" 
                           style={{ paddingTop: '12px', paddingLeft: '8px', paddingRight: '8px' }}>
                        <div className="text-gray-500 text-xs" style={{ marginBottom: '6px' }}>Creator</div>
                        <div className="text-[#8B5CF6] text-xs font-medium line-clamp-1" 
                             style={{ paddingLeft: '6px', paddingRight: '6px' }}>
                          {nft.creator}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
      </div>
    </div>
  );
}