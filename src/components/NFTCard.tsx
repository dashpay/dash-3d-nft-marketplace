'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NFT3D, NFTListing, NFTAuction } from '@/types/nft';
import { NFT3DViewer } from './NFT3DViewer';
import { Button } from '@/components/ui/Button';
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
      case 'Common': return '#64748b';
      case 'Rare': return '#00D4FF';
      case 'Epic': return '#8B5CF6';
      case 'Legendary': return '#F59E0B';
      case 'Mythic': return '#EC4899';
      default: return '#64748b';
    }
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
      className={`nft-card group cursor-pointer ${className}`}
      onClick={() => onClick?.(nft)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      layout
    >
      {/* NFT Image/3D Preview */}
      <div className="nft-card-media">
        <div className="relative h-full flex items-center justify-center p-6">
          <NFT3DViewer nft={nft} size="small" interactive={false} autoRotate={false} />
        </div>

        {/* Auction Timer */}
        {isActiveAuction && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500/90 to-orange-500/90 backdrop-blur-xl rounded-xl px-4 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-sm font-bold font-mono">
                {formatTimeRemaining(timeRemaining)}
              </span>
            </div>
          </div>
        )}

        {/* Rarity Badge */}
        {nft.rarity && (
          <div
            className="absolute top-4 right-4 backdrop-blur-xl rounded-xl px-4 py-2 shadow-lg border border-white/10"
            style={{
              background: `linear-gradient(135deg, ${getRarityColor(nft.rarity)}15, ${getRarityColor(nft.rarity)}08)`,
              borderColor: `${getRarityColor(nft.rarity)}30`
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{
                  backgroundColor: getRarityColor(nft.rarity),
                  boxShadow: `0 0 12px ${getRarityColor(nft.rarity)}60`
                }}
              />
              <span className="text-white text-xs font-bold uppercase tracking-wide">{nft.rarity}</span>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-xl px-5 py-3 border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-white text-sm font-semibold">View Details</span>
          </div>
        </div>
      </div>

      {/* NFT Info */}
      <div className="nft-card-body space-y-5">
        {/* Name and Collection */}
        <div>
          <h3 className="text-white font-semibold text-lg leading-tight line-clamp-1 mb-2 group-hover:text-[#00D4FF] transition-colors">
            {nft.name}
          </h3>
          <div className="flex items-center gap-3">
            {nft.collection && (
              <span className="text-[#64748b] text-sm">
                {nft.collection}
              </span>
            )}
            {nft.edition && nft.maxEditions && (
              <span className="badge badge-violet">
                #{nft.edition}/{nft.maxEditions}
              </span>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="nft-price-section">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#64748b] text-xs tracking-wider font-semibold uppercase">
              {isAuction(listing) ? 'Current Bid' : (listing?.price || nft.price ? 'Price' : 'Not Listed')}
            </span>
            {auction && auction.totalBids > 0 && (
              <span className="text-[#64748b] text-xs">{auction.totalBids} bid{auction.totalBids !== 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            {listing?.price || nft.price ? (
              <>
                <span className="text-white font-bold text-2xl">{listing?.price || nft.price}</span>
                <span className="text-[#008de4] text-base font-semibold">DASH</span>
              </>
            ) : (
              <span className="text-[#475569] text-lg">—</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div>
          {isOwner && !isListed ? (
            <Button onClick={handleQuickAction} variant="violet" block>
              List for Sale
            </Button>
          ) : isListed ? (
            <Button onClick={handleQuickAction} variant="cyan" block>
              {isAuction(listing) ? 'Place Bid' : 'Buy Now'}
            </Button>
          ) : (
            <Button disabled variant="secondary" block>
              Not Listed
            </Button>
          )}
        </div>

        {/* Creator Info */}
        <div className="flex items-center justify-between pt-5 border-t border-white/[0.06]">
          <div className="min-w-0">
            <div className="text-[#475569] text-xs uppercase tracking-wider font-medium mb-1">Creator</div>
            <div className="text-[#8B5CF6] text-sm font-medium truncate max-w-[100px]" title={nft.creator}>
              {nft.creator || 'Unknown'}
            </div>
          </div>
          {showOwnership && (
            <div className="min-w-0 text-right">
              <div className="text-[#475569] text-xs uppercase tracking-wider font-medium mb-1">Owner</div>
              <div className="text-[#008de4] text-sm font-medium truncate max-w-[100px]">
                {isOwner ? 'You' : `${nft.ownerId?.slice(0, 6) || '???'}...`}
              </div>
            </div>
          )}
          {/* Color Palette */}
          {nft.colors && nft.colors.length > 0 && !showOwnership && (
            <div className="flex gap-2">
              {nft.colors.slice(0, 4).map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  className="w-5 h-5 rounded-lg border border-white/20"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default NFTCard;
