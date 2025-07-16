'use client';

import React, { useState } from 'react';
import { NFT3D, NFTListing, NFTAuction } from '@/types/nft';

interface NFTActionPanelProps {
  nft: NFT3D;
  listing: NFTListing | NFTAuction | null;
  isOwner: boolean;
  canPurchase: boolean;
  onBuyNow: () => void;
  onPlaceBid: (amount: string) => void;
  onCreateListing: () => void;
}

export function NFTActionPanel({ 
  nft, 
  listing, 
  isOwner, 
  canPurchase, 
  onBuyNow, 
  onPlaceBid, 
  onCreateListing 
}: NFTActionPanelProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  const isAuction = listing?.listingType === 'auction';
  const auctionListing = isAuction ? listing as NFTAuction : null;

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `${numPrice.toFixed(1)} DASH`;
  };

  const handleBidSubmit = async () => {
    if (!bidAmount || isPlacingBid) return;
    
    setIsPlacingBid(true);
    try {
      await onPlaceBid(bidAmount);
      setBidAmount('');
    } catch (error) {
      console.error('Bid failed:', error);
    } finally {
      setIsPlacingBid(false);
    }
  };

  const getMinimumBid = () => {
    if (!auctionListing) return 0;
    
    const currentPrice = parseFloat(auctionListing.price);
    const increment = parseFloat(auctionListing.bidIncrement) || 0.1;
    return currentPrice + increment;
  };

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Auction ended';
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
      <h2 className="text-xl font-bold text-white mb-6">Actions</h2>
      
      {/* Listing Information */}
      {listing && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-[#00D4FF]/10 to-[#8B5CF6]/10 border border-[#00D4FF]/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {isAuction ? 'Current Bid' : 'Listed Price'}
                </h3>
                <div className="text-3xl font-bold text-[#00D4FF] mt-1">
                  {formatPrice(listing.price)}
                </div>
              </div>
              
              {isAuction && auctionListing && (
                <div className="text-right">
                  <div className="text-gray-400 text-sm mb-1">Auction ends in</div>
                  <div className="text-yellow-400 font-medium">
                    {formatTimeRemaining(auctionListing.endTime)}
                  </div>
                </div>
              )}
            </div>
            
            {isAuction && auctionListing && (
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Minimum bid: {formatPrice(getMinimumBid())}</span>
                <span>{auctionListing.totalBids || 0} bids</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Owner Actions */}
        {isOwner && (
          <div className="space-y-3">
            {!listing && (
              <button
                onClick={onCreateListing}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white rounded-xl hover:from-[#6D28D9] hover:to-[#8B5CF6] transition-colors font-medium"
              >
                List for Sale
              </button>
            )}
            
            {listing && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                <div className="text-green-400 font-medium mb-1">Your NFT is Listed</div>
                <div className="text-gray-400 text-sm">
                  {isAuction ? 'Auction is live' : 'Available for purchase'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Buyer Actions */}
        {!isOwner && canPurchase && (
          <div className="space-y-3">
            {/* Fixed Price Purchase */}
            {!isAuction && (
              <button
                onClick={onBuyNow}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-white rounded-xl hover:from-[#0099CC] hover:to-[#00D4FF] transition-colors font-medium text-lg"
              >
                Buy Now for {formatPrice(listing!.price)}
              </button>
            )}

            {/* Auction Bidding */}
            {isAuction && auctionListing && (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Min: ${getMinimumBid().toFixed(1)}`}
                    min={getMinimumBid()}
                    step="0.1"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#00D4FF] pr-16"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                    DASH
                  </div>
                </div>
                
                <button
                  onClick={handleBidSubmit}
                  disabled={!bidAmount || isPlacingBid || parseFloat(bidAmount) < getMinimumBid()}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-white rounded-xl hover:from-[#0099CC] hover:to-[#00D4FF] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Not Listed */}
        {!isOwner && !listing && (
          <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4 text-center">
            <div className="text-gray-400 font-medium mb-1">Not Listed</div>
            <div className="text-gray-500 text-sm">
              This NFT is not currently available for purchase
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-gray-400 mb-1">Platform Fee</div>
            <div className="text-white font-medium">2.5%</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-gray-400 mb-1">Creator Fee</div>
            <div className="text-white font-medium">5.0%</div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            All transactions are secured by the Dash Platform blockchain
          </p>
        </div>
      </div>

      {/* Share Button */}
      <div className="mt-6">
        <button
          onClick={() => {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            // In a real app, show toast notification
          }}
          className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          Share NFT
        </button>
      </div>
    </div>
  );
}