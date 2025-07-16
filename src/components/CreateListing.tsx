'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NFT3D, NFTListing, NFTAuction } from '@/types/nft';
import { NFT3DViewer } from './NFT3DViewer';
import { formatPrice } from '@/lib/search';

interface CreateListingProps {
  nft: NFT3D;
  isOpen: boolean;
  onClose: () => void;
  onCreateListing: (listing: Omit<NFTListing, 'id' | 'createdAt'>) => Promise<void>;
  onCreateAuction: (auction: Omit<NFTAuction, 'id' | 'createdAt' | 'currentPrice' | 'totalBids'>) => Promise<void>;
}

export function CreateListing({ nft, isOpen, onClose, onCreateListing, onCreateAuction }: CreateListingProps) {
  const [listingType, setListingType] = useState<'fixed' | 'auction'>('fixed');
  const [price, setPrice] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [reservePrice, setReservePrice] = useState('');
  const [bidIncrement, setBidIncrement] = useState('0.1');
  const [duration, setDuration] = useState('7'); // days
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setPrice('');
      setStartingPrice('');
      setReservePrice('');
      setBidIncrement('0.1');
      setDuration('7');
      setError('');
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    if (listingType === 'fixed') {
      if (!price || parseFloat(price) <= 0) {
        setError('Please enter a valid price');
        return false;
      }
    } else {
      if (!startingPrice || parseFloat(startingPrice) <= 0) {
        setError('Please enter a valid starting price');
        return false;
      }
      if (reservePrice && parseFloat(reservePrice) < parseFloat(startingPrice)) {
        setError('Reserve price must be higher than starting price');
        return false;
      }
      if (!bidIncrement || parseFloat(bidIncrement) <= 0) {
        setError('Please enter a valid bid increment');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      if (listingType === 'fixed') {
        await onCreateListing({
          nftId: nft.id!,
          sellerId: nft.ownerId,
          listingType: 'fixed',
          price: formatPrice(parseFloat(price)),
          currency: 'DASH',
          status: 'active'
        });
      } else {
        const now = Date.now();
        const auctionDuration = parseInt(duration) * 24 * 60 * 60 * 1000; // Convert days to ms
        
        await onCreateAuction({
          nftId: nft.id!,
          sellerId: nft.ownerId,
          listingType: 'auction',
          startingPrice: formatPrice(parseFloat(startingPrice)),
          reservePrice: reservePrice ? formatPrice(parseFloat(reservePrice)) : undefined,
          bidIncrement: formatPrice(parseFloat(bidIncrement)),
          startTime: now,
          endTime: now + auctionDuration,
          currency: 'DASH',
          status: 'active',
          price: formatPrice(parseFloat(startingPrice)) // Initial price
        });
      }
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] rounded-3xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">List NFT for Sale</h2>
              <p className="text-gray-400">Create a listing or auction for your NFT</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* NFT Preview */}
          <div className="flex gap-6 mb-8">
            <div className="w-32 h-32 bg-black/20 rounded-2xl border border-white/10 flex items-center justify-center">
              <NFT3DViewer nft={nft} size="small" interactive={false} autoRotate={true} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-xl mb-2">{nft.name}</h3>
              <p className="text-gray-400 mb-2">{nft.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">Collection:</span>
                <span className="text-[#00D4FF]">{nft.collection}</span>
              </div>
              <div className="flex items-center gap-4 text-sm mt-1">
                <span className="text-gray-400">Creator:</span>
                <span className="text-[#8B5CF6]">{nft.creator}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Listing Type */}
            <div>
              <label className="text-white font-medium mb-4 block">Listing Type</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setListingType('fixed')}
                  className={`flex-1 p-4 rounded-xl text-center transition-all ${
                    listingType === 'fixed'
                      ? 'bg-[#00D4FF]/20 border-2 border-[#00D4FF] text-[#00D4FF]'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">Fixed Price</div>
                  <div className="text-sm opacity-75">Sell at a set price</div>
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('auction')}
                  className={`flex-1 p-4 rounded-xl text-center transition-all ${
                    listingType === 'auction'
                      ? 'bg-[#8B5CF6]/20 border-2 border-[#8B5CF6] text-[#8B5CF6]'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">Auction</div>
                  <div className="text-sm opacity-75">Sell to highest bidder</div>
                </button>
              </div>
            </div>

            {/* Fixed Price Form */}
            {listingType === 'fixed' && (
              <div>
                <label className="text-white font-medium mb-2 block">Price</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#00D4FF]/50 pr-16"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    DASH
                  </div>
                </div>
              </div>
            )}

            {/* Auction Form */}
            {listingType === 'auction' && (
              <div className="space-y-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Starting Price</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      placeholder="Enter starting price"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6]/50 pr-16"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      DASH
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Reserve Price (Optional)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={reservePrice}
                      onChange={(e) => setReservePrice(e.target.value)}
                      placeholder="Enter reserve price"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6]/50 pr-16"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      DASH
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Minimum price to sell the NFT</p>
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Bid Increment</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={bidIncrement}
                      onChange={(e) => setBidIncrement(e.target.value)}
                      placeholder="Enter bid increment"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6]/50 pr-16"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      DASH
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Minimum amount to increase each bid</p>
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8B5CF6]/50"
                  >
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                  </select>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-xl text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 px-6 py-3 rounded-xl text-white font-medium transition-colors disabled:opacity-50 ${
                  listingType === 'fixed'
                    ? 'bg-gradient-to-r from-[#00D4FF] to-[#0099CC] hover:from-[#0099CC] hover:to-[#00D4FF]'
                    : 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#8B5CF6]'
                }`}
              >
                {isLoading ? 'Creating...' : `Create ${listingType === 'fixed' ? 'Listing' : 'Auction'}`}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CreateListing;