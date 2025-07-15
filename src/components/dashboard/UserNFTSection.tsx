'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NFT3D } from '@/types/nft';
import { NFTCard } from '@/components/NFTCard';

interface UserNFTSectionProps {
  ownedNFTs: NFT3D[];
  mintedNFTs: NFT3D[];
}

export function UserNFTSection({ ownedNFTs, mintedNFTs }: UserNFTSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'owned' | 'minted'>('owned');
  
  const currentNFTs = activeTab === 'owned' ? ownedNFTs : mintedNFTs;

  const handleNFTClick = (nft: NFT3D) => {
    if (nft.id) {
      router.push(`/nft/${nft.id}`);
    }
  };

  const handleCreateListing = (nft: NFT3D) => {
    // TODO: Implement create listing modal
    console.log('Create listing for NFT:', nft.id);
  };

  const handleQuickBuy = (nft: NFT3D, listing: any) => {
    // TODO: Implement quick buy functionality
    console.log('Quick buy NFT:', nft.id);
  };

  const handlePlaceBid = (nft: NFT3D, auction: any) => {
    // TODO: Implement place bid functionality
    console.log('Place bid on NFT:', nft.id);
  };

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your NFTs</h2>
        <button
          onClick={() => router.push('/gallery')}
          className="text-[#00D4FF] hover:text-[#0099CC] transition-colors text-sm font-medium"
        >
          View All in Gallery →
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-6 lg:gap-8">
        <button
          onClick={() => setActiveTab('owned')}
          className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
            activeTab === 'owned'
              ? 'bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-white shadow-lg shadow-[#00D4FF]/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          Owned ({ownedNFTs.length})
        </button>
        <button
          onClick={() => setActiveTab('minted')}
          className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
            activeTab === 'minted'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white shadow-lg shadow-[#8B5CF6]/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          Minted ({mintedNFTs.length})
        </button>
      </div>

      {/* NFT Grid */}
      <div className="min-h-[300px]">
        {currentNFTs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#00D4FF]/20 to-[#8B5CF6]/20 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'owned' ? 'No NFTs Owned' : 'No NFTs Minted'}
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              {activeTab === 'owned' 
                ? "You don't own any NFTs yet. Start by browsing the marketplace or minting your first NFT."
                : "You haven't minted any NFTs yet. Create your first 3D masterpiece!"
              }
            </p>
            <div className="flex gap-4">
              {activeTab === 'owned' ? (
                <>
                  <button
                    onClick={() => router.push('/gallery?tab=marketplace')}
                    className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-white rounded-xl hover:scale-105 transition-all duration-300 font-medium"
                  >
                    Browse Marketplace
                  </button>
                  <button
                    onClick={() => router.push('/mint')}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 font-medium border border-white/20"
                  >
                    Mint NFT
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/mint')}
                  className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white rounded-xl hover:scale-105 transition-all duration-300 font-medium"
                >
                  Mint Your First NFT
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {currentNFTs.slice(0, 8).map((nft, index) => (
              <NFTCard
                key={nft.id || `nft-${index}`}
                nft={nft}
                onClick={handleNFTClick}
                onQuickBuy={handleQuickBuy}
                onPlaceBid={handlePlaceBid}
                onCreateListing={handleCreateListing}
                showOwnership={false}
                currentUserId=""
              />
            ))}
          </div>
        )}

        {/* Show More Button */}
        {currentNFTs.length > 8 && (
          <div className="text-center pt-8">
            <button
              onClick={() => router.push('/gallery')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 font-medium border border-white/20"
            >
              View All {currentNFTs.length} NFTs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}