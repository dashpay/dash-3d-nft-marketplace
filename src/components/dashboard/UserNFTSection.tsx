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
    console.log('Create listing for NFT:', nft.id);
  };

  const handleQuickBuy = (nft: NFT3D, listing: any) => {
    console.log('Quick buy NFT:', nft.id);
  };

  const handlePlaceBid = (nft: NFT3D, auction: any) => {
    console.log('Place bid on NFT:', nft.id);
  };

  return (
    <div className="pt-8 lg:pt-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-10 lg:mb-14">
        <div>
          <h2 className="section-title">Your NFTs</h2>
          <p className="section-subtitle mb-0">Manage your digital collectibles</p>
        </div>
        <button
          onClick={() => router.push('/gallery')}
          className="group flex items-center gap-3 text-[#008de4] hover:text-[#00D4FF] transition-colors font-medium"
        >
          View All
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Tab Navigation - Spacious Pill Style */}
      <div className="tab-container mb-10 lg:mb-14">
        <button
          onClick={() => setActiveTab('owned')}
          className={`tab-button ${
            activeTab === 'owned'
              ? 'tab-active bg-gradient-to-r from-[#008de4] to-[#00D4FF]'
              : ''
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Owned</span>
          <span className={`tab-count ${
            activeTab === 'owned'
              ? 'bg-white/20 text-white'
              : 'bg-white/[0.06] text-[#64748b]'
          }`}>
            {ownedNFTs.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('minted')}
          className={`tab-button ${
            activeTab === 'minted'
              ? 'tab-active bg-gradient-to-r from-[#8B5CF6] to-[#A855F7]'
              : ''
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span>Minted</span>
          <span className={`tab-count ${
            activeTab === 'minted'
              ? 'bg-white/20 text-white'
              : 'bg-white/[0.06] text-[#64748b]'
          }`}>
            {mintedNFTs.length}
          </span>
        </button>
      </div>

      {/* NFT Grid */}
      <div className="min-h-[400px]">
        {currentNFTs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 lg:py-36 text-center">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#00D4FF]/10 to-[#8B5CF6]/10 flex items-center justify-center mb-10 border border-white/[0.06]">
              <svg className="w-16 h-16 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-4">
              {activeTab === 'owned' ? 'No NFTs Owned' : 'No NFTs Minted'}
            </h3>
            <p className="text-[#64748b] mb-12 max-w-md text-lg leading-relaxed">
              {activeTab === 'owned'
                ? "You don't own any NFTs yet. Start by browsing the marketplace or minting your first NFT."
                : "You haven't minted any NFTs yet. Create your first 3D masterpiece!"
              }
            </p>
            <div className="flex gap-5">
              {activeTab === 'owned' ? (
                <>
                  <button
                    onClick={() => router.push('/gallery?tab=marketplace')}
                    className="btn btn-cyan"
                  >
                    Browse Marketplace
                  </button>
                  <button
                    onClick={() => router.push('/mint')}
                    className="btn btn-ghost"
                  >
                    Mint NFT
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/mint')}
                  className="btn btn-violet"
                >
                  Mint Your First NFT
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
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
          <div className="text-center pt-14 lg:pt-16">
            <button
              onClick={() => router.push('/gallery')}
              className="btn btn-ghost"
            >
              View All {currentNFTs.length} NFTs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
