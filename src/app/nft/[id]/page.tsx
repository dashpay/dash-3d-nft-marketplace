'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { getNFTSDK } from '@/lib/dash-sdk';
import NFT3DViewer from '@/components/NFT3DViewer';
import { NFT3D, NFTTransfer } from '@/types/nft';

export default function NFTDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { network, identityId, isAuthenticated } = useStore();
  const [nft, setNft] = useState<NFT3D | null>(null);
  const [history, setHistory] = useState<NFTTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [nftId, setNftId] = useState<string>('');

  useEffect(() => {
    // Resolve the params promise
    params.then(({ id }) => {
      setNftId(id);
    });
  }, [params]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    if (nftId) {
      loadNFTDetails();
    }
  }, [nftId, isAuthenticated]);

  const loadNFTDetails = async () => {
    setIsLoading(true);
    
    try {
      const sdk = getNFTSDK({ network });
      
      // Initialize SDK if not already initialized
      if (!sdk.isInitialized()) {
        console.log('Initializing SDK...');
        await sdk.initialize();
      }
      
      const nftData = await sdk.getNFTById(nftId);
      
      if (nftData) {
        setNft(nftData);
        const transferHistory = await sdk.getNFTHistory(nftId);
        setHistory(transferHistory);
      }
    } catch (error) {
      console.error('Failed to load NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!nft || !identityId) return;
    
    setIsPurchasing(true);
    
    try {
      const sdk = getNFTSDK({ network });
      
      // Initialize SDK if not already initialized
      if (!sdk.isInitialized()) {
        console.log('Initializing SDK...');
        await sdk.initialize();
      }
      
      await sdk.purchaseNFT(nft.id!, identityId);
      // In a real app, would show success message and update ownership
      alert('Purchase functionality not implemented in demo');
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading NFT...</div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">NFT not found</p>
          <button
            onClick={() => router.push('/gallery')}
            className="px-6 py-2 bg-dash-blue hover:bg-dash-blue-dark text-white rounded-lg transition-colors"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  const isOwner = nft.ownerId === identityId;
  const canPurchase = nft.forSale && !isOwner;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/gallery')}
          className="mb-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Gallery
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 3D Viewer */}
          <div className="gradient-border p-8">
            <NFT3DViewer nft={nft} size="large" />
          </div>

          {/* NFT Details */}
          <div className="space-y-8">
            {/* Title and Status */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{nft.name}</h1>
              {nft.edition && nft.maxEditions && (
                <p className="text-gray-400">
                  Edition {nft.edition} of {nft.maxEditions}
                </p>
              )}
              {isOwner && (
                <span className="inline-block mt-2 px-3 py-1 bg-dash-blue/20 text-dash-blue rounded-full text-sm">
                  You own this NFT
                </span>
              )}
            </div>

            {/* Description */}
            {nft.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-400">{nft.description}</p>
              </div>
            )}

            {/* Price and Purchase */}
            {nft.forSale && (
              <div className="gradient-border p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Current Price</span>
                  <span className="text-2xl font-bold text-dash-blue">
                    {(nft.price! / 100000000).toFixed(2)} DASH
                  </span>
                </div>
                
                {canPurchase && (
                  <button
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      isPurchasing
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-dash-blue hover:bg-dash-blue-dark text-white glow'
                    }`}
                  >
                    {isPurchasing ? 'Processing...' : 'Purchase NFT'}
                  </button>
                )}
              </div>
            )}

            {/* Attributes */}
            {nft.attributes && Object.keys(nft.attributes).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Attributes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(nft.attributes).map(([key, value]) => (
                    <div key={key} className="bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-400 capitalize">{key}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Geometry Type</span>
                  <span className="font-mono">{nft.geometryType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Owner</span>
                  <span className="font-mono text-xs">
                    {nft.ownerId.slice(0, 8)}...{nft.ownerId.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span>{new Date(nft.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Colors */}
            {nft.colors && nft.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Color Palette</h3>
                <div className="flex gap-2">
                  {nft.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 rounded-lg border border-gray-700"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transfer History */}
        {history.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-6">Transfer History</h3>
            <div className="space-y-3">
              {history.map((transfer, idx) => (
                <div key={idx} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">
                      From: {transfer.fromId.slice(0, 8)}...{transfer.fromId.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-400">
                      To: {transfer.toId.slice(0, 8)}...{transfer.toId.slice(-8)}
                    </p>
                  </div>
                  <div className="text-right">
                    {transfer.price && (
                      <p className="font-semibold text-dash-blue">
                        {(transfer.price / 100000000).toFixed(2)} DASH
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(transfer.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}