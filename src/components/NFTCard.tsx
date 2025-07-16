'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NFT3D, NFTListing, NFTAuction } from '@/types/nft';
import { NFT3DViewer } from './NFT3DViewer';
import { formatTimeRemaining, getTimeUntilAuctionEnd, isAuctionActive, isAuction } from '@/lib/search';

interface NFTCardProps {
  nft: NFT3D;
  listing?: NFTListing | NFTAuction;
  onClick?: (nft: NFT3D) => void;
  onQuickBuy?: (nft: NFT3D, listing: NFTListing) => void;
  onPlaceBid?: (nft: NFT3D, auction: NFTAuction) => void;
  onCreateListing?: (nft: NFT3D) => void;
  showOwnership?: boolean;
  currentUserId?: string;
  className?: string;
}

export function NFTCard({ 
  nft, 
  listing, 
  onClick, 
  onQuickBuy, 
  onPlaceBid, 
  onCreateListing,
  showOwnership = false,
  currentUserId,
  className = '' 
}: NFTCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(
    listing && isAuction(listing) ? getTimeUntilAuctionEnd(listing) : 0
  );

  const isOwner = currentUserId === nft.ownerId;
  const isListed = listing && listing.status === 'active';
  const auction = isAuction(listing) ? listing : undefined;
  const isActiveAuction = auction && isAuctionActive(auction);

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'Common': return '#6B7280';
      case 'Rare': return '#00D4FF';
      case 'Epic': return '#8B5CF6';
      case 'Legendary': return '#FFD700';
      case 'Mythic': return '#FF0080';
      default: return '#6B7280';
    }
  };

  const getStatusBadge = () => {
    if (!listing) return null;
    
    const statusColors = {
      active: 'bg-green-500/20 text-green-400',
      sold: 'bg-blue-500/20 text-blue-400',
      cancelled: 'bg-red-500/20 text-red-400',
      expired: 'bg-gray-500/20 text-gray-400'
    };

    return (
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[listing.status]}`}>
        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
      </div>
    );
  };

  const handleQuickAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isOwner && !isListed) {
      onCreateListing?.(nft);
    } else if (listing && listing.status === 'active') {
      if (isAuction(listing)) {
        onPlaceBid?.(nft, listing);
      } else {
        onQuickBuy?.(nft, listing);
      }
    }
  };

  return (
    <motion.div
      className={`group bg-white/5 hover:bg-white/8 rounded-2xl border border-white/10 hover:border-[#00D4FF]/30 cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm ${className}`}
      onClick={() => onClick?.(nft)}
      whileHover={{ y: -5 }}
      layout
    >
      {/* NFT Image/3D Preview */}
      <div className="relative bg-black/20 rounded-xl overflow-hidden m-6 mb-4" style={{ aspectRatio: '1' }}>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <NFT3DViewer nft={nft} size="small" interactive={false} autoRotate={false} />
        </div>
        
        {/* Auction Timer Overlay */}
        {isActiveAuction && (
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1">
            <div className="text-white text-xs font-mono">
              {formatTimeRemaining(timeRemaining)}
            </div>
          </div>
        )}

        {/* Rarity Badge */}
        {nft.rarity && (
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getRarityColor(nft.rarity) }}
              />
              <span className="text-white text-xs font-medium">{nft.rarity}</span>
            </div>
          </div>
        )}

        {/* Status Badge */}
        {listing && (
          <div className="absolute bottom-3 left-3">
            {getStatusBadge()}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="text-white text-sm font-medium">View Details</div>
        </div>
      </div>

      {/* NFT Info */}
      <div className="px-6 pb-6">
        {/* Name and Collection */}
        <div className="mb-4">
          <h3 className="text-white font-medium text-lg leading-tight line-clamp-1 mb-2">
            {nft.name}
          </h3>
          <p className="text-gray-400 text-sm">
            {nft.collection}
          </p>
        </div>

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">
              {isAuction(listing) ? 'Current Bid' : 'Price'}
            </span>
            {auction && auction.totalBids > 0 && (
              <span className="text-gray-400 text-sm">
                {auction.totalBids} bid{auction.totalBids !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="text-white font-mono text-xl font-bold">
            {listing?.price || nft.price || '—'}
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-4">
          {isOwner && !isListed ? (
            <button
              onClick={handleQuickAction}
              className="w-full px-4 py-3 rounded-xl text-white font-medium transition-colors"
              style={{ background: 'linear-gradient(90deg, #8B5CF6, #6D28D9)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #6D28D9, #8B5CF6)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #8B5CF6, #6D28D9)'}
            >
              List for Sale
            </button>
          ) : isListed ? (
            <button
              onClick={handleQuickAction}
              className="w-full px-4 py-3 rounded-xl text-white font-medium transition-colors"
              style={{ background: 'linear-gradient(90deg, #00D4FF, #0099CC)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #0099CC, #00D4FF)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #00D4FF, #0099CC)'}
            >
              {isAuction(listing) ? 'Place Bid' : 'Buy Now'}
            </button>
          ) : (
            <button
              disabled
              className="w-full px-4 py-3 rounded-xl text-gray-500 font-medium bg-gray-600/20 cursor-not-allowed"
            >
              Not Listed
            </button>
          )}
        </div>

        {/* Creator Info */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-xs mb-1">Creator</div>
              <div className="text-[#8B5CF6] text-sm font-medium line-clamp-1">
                {nft.creator}
              </div>
            </div>
            
            {showOwnership && (
              <div className="text-right">
                <div className="text-gray-500 text-xs mb-1">Owner</div>
                <div className="text-[#00D4FF] text-sm font-medium">
                  {isOwner ? 'You' : `${nft.ownerId.slice(0, 6)}...`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Color Palette */}
        {nft.colors && nft.colors.length > 0 && (
          <div className="flex justify-center space-x-2 mt-4">
            {nft.colors.slice(0, 3).map((color, colorIndex) => (
              <div 
                key={colorIndex}
                className="w-3 h-3 rounded-full border border-white/30 shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default NFTCard;