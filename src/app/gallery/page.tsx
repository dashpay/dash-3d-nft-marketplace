'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { getNFTSDK } from '@/lib/dash-sdk';
import NFT3DViewer from '@/components/NFT3DViewer';
import { NFT3D } from '@/types/nft';

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
      const sdk = getNFTSDK({ network });
      
      // Initialize SDK if not already initialized
      if (!sdk.isInitialized()) {
        console.log('Initializing SDK...');
        await sdk.initialize();
      }
      
      // Load user's NFTs
      if (identityId) {
        const owned = await sdk.getNFTsByOwner(identityId);
        setUserNFTs(owned);
      }
      
      // Load marketplace NFTs
      const forSale = await sdk.getNFTsForSale();
      setMarketNFTs(forSale);
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

  const displayNFTs = selectedTab === 'owned' ? userNFTs : marketNFTs;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">3D NFT Gallery</span>
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-400">Identity:</span>
              <span className="ml-2 text-dash-blue font-mono">
                {identityId?.slice(0, 8)}...{identityId?.slice(-8)}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 bg-gray-800 rounded-lg w-fit">
          <button
            onClick={() => setSelectedTab('owned')}
            className={`px-6 py-2 rounded-md transition-all ${
              selectedTab === 'owned'
                ? 'bg-dash-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My NFTs ({userNFTs.length})
          </button>
          <button
            onClick={() => setSelectedTab('marketplace')}
            className={`px-6 py-2 rounded-md transition-all ${
              selectedTab === 'marketplace'
                ? 'bg-dash-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Marketplace ({marketNFTs.length})
          </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayNFTs.map((nft) => (
              <div
                key={nft.id}
                onClick={() => handleNFTClick(nft)}
                className="gradient-border cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <div className="p-4 space-y-4">
                  {/* 3D Preview */}
                  <div className="relative">
                    <NFT3DViewer nft={nft} size="small" interactive={false} />
                    {nft.forSale && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/90 text-white text-xs rounded">
                        For Sale
                      </div>
                    )}
                  </div>
                  
                  {/* NFT Info */}
                  <div>
                    <h3 className="font-semibold text-lg">{nft.name}</h3>
                    {nft.description && (
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {nft.description}
                      </p>
                    )}
                    
                    {/* Price */}
                    {nft.price && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-400">Price</span>
                        <span className="font-semibold text-dash-blue">
                          {(nft.price / 100000000).toFixed(2)} DASH
                        </span>
                      </div>
                    )}
                    
                    {/* Edition */}
                    {nft.edition && nft.maxEditions && (
                      <div className="mt-1 text-xs text-gray-500">
                        Edition {nft.edition} of {nft.maxEditions}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}