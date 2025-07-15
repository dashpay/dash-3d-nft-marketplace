'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { NFT3D, NFTListing, NFTAuction } from '@/types/nft';
import { NFT3DViewer } from '@/components/NFT3DViewer';
import { NFTMetadataPanel } from '@/components/nft-details/NFTMetadataPanel';
import { NFTOwnershipSection } from '@/components/nft-details/NFTOwnershipSection';
import { NFTActionPanel } from '@/components/nft-details/NFTActionPanel';
import { NFTTransactionHistory } from '@/components/nft-details/NFTTransactionHistory';
import { LoadingSpinner } from '@/components/loading/LoadingIndicators';

interface NFTDetailsClientPageProps {
  params: { id: string };
}

export function NFTDetailsClientPage({ params }: NFTDetailsClientPageProps) {
  const router = useRouter();
  const { 
    userNFTs, 
    listings, 
    auctions, 
    identityId, 
    isAuthenticated,
    buyNFT,
    placeBid,
    createListing,
    createAuction
  } = useStore();

  const [nft, setNFT] = useState<NFT3D | null>(null);
  const [listing, setListing] = useState<NFTListing | NFTAuction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateListing, setShowCreateListing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    loadNFTDetails();
  }, [params.id, userNFTs, listings, auctions, isAuthenticated]);

  const loadNFTDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // For now, search in userNFTs and market NFTs (mock data)
      // In production, this would call the SDK to fetch by ID
      const allNFTs = [...userNFTs];
      const foundNFT = allNFTs.find(nft => nft.id === params.id);

      if (!foundNFT) {
        setError('NFT not found');
        return;
      }

      setNFT(foundNFT);

      // Find associated listing or auction
      const nftListing = [...listings, ...auctions].find(l => l.nftId === foundNFT.id);
      setListing(nftListing || null);

    } catch (err) {
      console.error('Failed to load NFT details:', err);
      setError('Failed to load NFT details');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!listing) return;
    
    try {
      await buyNFT(listing.id);
      // Refresh NFT data after purchase
      loadNFTDetails();
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const handlePlaceBid = async (amount: string) => {
    if (!listing || listing.listingType !== 'auction') return;
    
    try {
      await placeBid(listing.id, amount);
      // Refresh NFT data after bid
      loadNFTDetails();
    } catch (error) {
      console.error('Bid failed:', error);
    }
  };

  const handleCreateListing = async (price: string, listingType: 'fixed' | 'auction', duration?: number) => {
    if (!nft || !identityId) return;
    
    try {
      if (listingType === 'auction') {
        const endTime = Date.now() + (duration || 24) * 60 * 60 * 1000; // duration in hours
        await createAuction({
          nftId: nft.id!,
          sellerId: identityId,
          listingType: 'auction',
          price: price,
          startingPrice: price,
          currency: 'DASH',
          status: 'active',
          bidIncrement: '0.1',
          startTime: Date.now(),
          endTime,
          highestBidder: undefined
        });
      } else {
        await createListing({
          nftId: nft.id!,
          sellerId: identityId,
          listingType: 'fixed',
          price: price,
          currency: 'DASH',
          status: 'active'
        });
      }
      setShowCreateListing(false);
      loadNFTDetails();
    } catch (error) {
      console.error('Listing creation failed:', error);
    }
  };

  const isOwner = nft && identityId && nft.ownerId === identityId;
  const canPurchase = !!(nft && !isOwner && listing);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {error || 'NFT Not Found'}
          </h1>
          <button
            onClick={() => router.push('/gallery')}
            className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-white rounded-lg hover:from-[#0099CC] hover:to-[#00D4FF] transition-colors"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e, #0a0a0a)' }}>
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.1), rgba(139,92,246,0.1), rgba(255,0,128,0.1))' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/gallery')}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Gallery
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - 3D Viewer */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
              <div className="w-full aspect-square">
                <NFT3DViewer
                  nft={nft}
                  size="large"
                  autoRotate={true}
                />
              </div>
            </div>

            {/* Transaction History */}
            <NFTTransactionHistory nftId={params.id || nft.id || ''} />
          </div>

          {/* Right Column - Details and Actions */}
          <div className="space-y-6">
            {/* Metadata Panel */}
            <NFTMetadataPanel nft={nft} />

            {/* Ownership Section */}
            <NFTOwnershipSection nft={nft} isCurrentUser={!!isOwner} />

            {/* Action Panel */}
            <NFTActionPanel
              nft={nft}
              listing={listing}
              isOwner={!!isOwner}
              canPurchase={canPurchase}
              onBuyNow={handleBuyNow}
              onPlaceBid={handlePlaceBid}
              onCreateListing={() => setShowCreateListing(true)}
            />
          </div>
        </div>
      </div>

      {/* Create Listing Modal */}
      {showCreateListing && nft && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] rounded-3xl border border-white/10 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create Listing</h2>
              <button
                onClick={() => setShowCreateListing(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Simple listing form - would be more complex in real app */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (DASH)
                </label>
                <input
                  type="number"
                  placeholder="0.0"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-dash-blue"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // In real app, would get values from form
                    handleCreateListing('5.0', 'fixed');
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-white rounded-lg hover:from-[#0099CC] hover:to-[#00D4FF] transition-colors"
                >
                  List for Sale
                </button>
                <button
                  onClick={() => setShowCreateListing(false)}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}