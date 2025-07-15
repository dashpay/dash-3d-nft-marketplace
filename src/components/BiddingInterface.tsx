'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NFTAuction, NFTBid } from '@/types/nft';
import { formatTimeRemaining, getTimeUntilAuctionEnd, isAuctionActive, extractPrice } from '@/lib/search';

interface BiddingInterfaceProps {
  auction: NFTAuction;
  currentUserBid?: NFTBid;
  recentBids: NFTBid[];
  currentUserId: string;
  onPlaceBid: (amount: string) => Promise<void>;
  className?: string;
}

export function BiddingInterface({ 
  auction, 
  currentUserBid, 
  recentBids, 
  currentUserId, 
  onPlaceBid,
  className = '' 
}: BiddingInterfaceProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(getTimeUntilAuctionEnd(auction));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isActive = isAuctionActive(auction);
  const currentPrice = extractPrice(auction.currentPrice) || extractPrice(auction.startingPrice) || 0;
  const minBidAmount = currentPrice + (extractPrice(auction.bidIncrement) || 0.1);
  const isHighestBidder = auction.highestBidder === currentUserId;

  // Update countdown timer
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining(getTimeUntilAuctionEnd(auction));
    }, 1000);

    return () => clearInterval(interval);
  }, [auction, isActive]);

  const validateBid = (amount: string): boolean => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid bid amount');
      return false;
    }

    if (numAmount < minBidAmount) {
      setError(`Bid must be at least ${minBidAmount.toFixed(1)} DASH`);
      return false;
    }

    return true;
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBid(bidAmount)) return;

    setIsLoading(true);
    setError('');

    try {
      await onPlaceBid(bidAmount);
      setBidAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bid');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'sold': return 'text-blue-400';
      case 'cancelled': return 'text-red-400';
      case 'expired': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium text-lg">
              {auction.listingType === 'auction' ? 'Auction' : 'Fixed Price'}
            </h3>
            <p className={`text-sm ${getStatusColor(auction.status)}`}>
              {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
            </p>
          </div>
          
          {isActive && (
            <div className="text-right">
              <div className="text-gray-400 text-sm">Ends in</div>
              <div className="text-white font-mono text-lg">
                {formatTimeRemaining(timeRemaining)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Price */}
      <div className="p-6 border-b border-white/10">
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">Current Price</div>
          <div className="text-white font-mono text-3xl font-bold">
            {auction.currentPrice}
          </div>
          
          {auction.totalBids > 0 && (
            <div className="text-gray-400 text-sm mt-2">
              {auction.totalBids} bid{auction.totalBids !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Bidding Form */}
      {isActive && auction.listingType === 'auction' && (
        <div className="p-6 border-b border-white/10">
          <form onSubmit={handlePlaceBid} className="space-y-4">
            <div>
              <label className="text-white font-medium mb-2 block">Place Bid</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min={minBidAmount}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min ${minBidAmount.toFixed(1)} DASH`}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#00D4FF]/50 pr-16"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  DASH
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !bidAmount}
              className="w-full px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#00D4FF] to-[#0099CC] hover:from-[#0099CC] hover:to-[#00D4FF] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Placing Bid...' : 'Place Bid'}
            </button>
          </form>
        </div>
      )}

      {/* Buy Now Button for Auction */}
      {auction.listingType === 'auction' && auction.status === 'active' && (
        <div className="p-6 border-b border-white/10">
          <button
            onClick={() => onPlaceBid(auction.price)}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#00D4FF] to-[#0099CC] hover:from-[#0099CC] hover:to-[#00D4FF] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      )}

      {/* User Status */}
      {currentUserBid && (
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm">Your Bid</div>
              <div className="text-white font-mono text-lg">
                {currentUserBid.amount}
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${
              isHighestBidder 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {isHighestBidder ? 'Highest Bid' : 'Outbid'}
            </div>
          </div>
        </div>
      )}

      {/* Recent Bids */}
      {recentBids.length > 0 && (
        <div className="p-6">
          <h4 className="text-white font-medium mb-4">Recent Bids</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {recentBids.slice(0, 5).map((bid) => (
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {bid.bidderId.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-white font-mono text-sm">{bid.amount}</div>
                    <div className="text-gray-400 text-xs">
                      {new Date(bid.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                {bid.bidderId === currentUserId && (
                  <div className="text-[#00D4FF] text-xs">You</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Auction Details */}
      {auction.listingType === 'auction' && (
        <div className="p-6 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Starting Price</div>
              <div className="text-white font-mono">{auction.startingPrice}</div>
            </div>
            <div>
              <div className="text-gray-400">Bid Increment</div>
              <div className="text-white font-mono">{auction.bidIncrement}</div>
            </div>
            {auction.reservePrice && (
              <div>
                <div className="text-gray-400">Reserve Price</div>
                <div className="text-white font-mono">{auction.reservePrice}</div>
              </div>
            )}
            <div>
              <div className="text-gray-400">Started</div>
              <div className="text-white">
                {new Date(auction.startTime).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BiddingInterface;