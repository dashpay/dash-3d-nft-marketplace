'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchFilters, SortOptions } from '@/types/nft';

interface SearchFiltersProps {
  filters: SearchFilters;
  sortBy: SortOptions;
  onFiltersChange: (filters: SearchFilters) => void;
  onSortChange: (sort: SortOptions) => void;
  className?: string;
}

const rarityColors = {
  Common: '#6B7280',
  Rare: '#00D4FF',
  Epic: '#8B5CF6',
  Legendary: '#FFD700',
  Mythic: '#FF0080'
};

const sortOptions = [
  { value: SortOptions.RECENT, label: 'Recently Listed' },
  { value: SortOptions.PRICE_LOW, label: 'Price: Low to High' },
  { value: SortOptions.PRICE_HIGH, label: 'Price: High to Low' },
  { value: SortOptions.NAME_AZ, label: 'Name A-Z' },
  { value: SortOptions.NAME_ZA, label: 'Name Z-A' },
  { value: SortOptions.ENDING_SOON, label: 'Ending Soon' },
  { value: SortOptions.MOST_BIDS, label: 'Most Bids' },
  { value: SortOptions.RARITY, label: 'Rarity' }
];

const geometryTypes = [
  { value: 'parametric', label: 'Parametric' },
  { value: 'voxel', label: 'Voxel' },
  { value: 'procedural', label: 'Procedural' }
];

const listingTypes = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'auction', label: 'Auction' }
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'sold', label: 'Sold' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'expired', label: 'Expired' }
];

export function SearchFiltersComponent({ 
  filters, 
  sortBy, 
  onFiltersChange, 
  onSortChange, 
  className = '' 
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: filters.priceRange?.min?.toString() || '',
    max: filters.priceRange?.max?.toString() || ''
  });

  // Sync local price range state with filters prop
  useEffect(() => {
    setPriceRange({
      min: filters.priceRange?.min?.toString() || '',
      max: filters.priceRange?.max?.toString() || ''
    });
  }, [filters.priceRange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.collections?.length) count++;
    if (filters.creators?.length) count++;
    if (filters.priceRange?.min !== undefined || filters.priceRange?.max !== undefined) count++;
    if (filters.rarity?.length) count++;
    if (filters.listingType?.length) count++;
    if (filters.status?.length) count++;
    if (filters.geometryType?.length) count++;
    return count;
  }, [filters]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...newFilters });
  };

  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    setPriceRange(prev => ({ ...prev, [field]: value }));
    
    const numValue = value === '' ? undefined : parseFloat(value);
    if (numValue === undefined || !isNaN(numValue)) {
      updateFilters({
        priceRange: {
          ...filters.priceRange,
          [field]: numValue
        }
      });
    }
  };

  const toggleArrayFilter = (
    filterKey: keyof SearchFilters,
    value: string
  ) => {
    const currentArray = (filters[filterKey] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters({
      [filterKey]: newArray.length > 0 ? newArray : undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setPriceRange({ min: '', max: '' });
  };

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 mx-12 lg:mx-16 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <h3 className="text-white font-medium">Search & Filters</h3>
          {activeFilterCount > 0 && (
            <div className="px-3 py-1 bg-[#00D4FF]/20 text-[#00D4FF] text-sm rounded-full">
              {activeFilterCount} active
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Clear all
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg 
              className={`w-5 h-5 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 border-b border-white/10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search NFTs..."
            value={filters.query || ''}
            onChange={(e) => updateFilters({ query: e.target.value || undefined })}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#00D4FF]/50 focus:ring-1 focus:ring-[#00D4FF]/50"
          />
        </div>
      </div>

      {/* Sort Options */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOptions)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00D4FF]/50 cursor-pointer"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 lg:p-8 space-y-8 lg:space-y-10">
              {/* Price Range */}
              <div>
                <h4 className="text-white font-medium mb-4">Price Range (DASH)</h4>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D4FF]/50"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D4FF]/50"
                    />
                  </div>
                </div>
              </div>

              {/* Rarity */}
              <div>
                <h4 className="text-white font-medium mb-4">Rarity</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(rarityColors).map(([rarity, color]) => (
                    <button
                      key={rarity}
                      onClick={() => toggleArrayFilter('rarity', rarity)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.rarity?.includes(rarity as 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic')
                          ? 'bg-white/20 text-white border-2'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                      style={filters.rarity?.includes(rarity as 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic') ? { borderColor: color } : {}}
                    >
                      <span className="w-2 h-2 rounded-full mr-2 inline-block" style={{ backgroundColor: color }}></span>
                      {rarity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Listing Type */}
              <div>
                <h4 className="text-white font-medium mb-4">Listing Type</h4>
                <div className="flex flex-wrap gap-2">
                  {listingTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => toggleArrayFilter('listingType', type.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.listingType?.includes(type.value as 'fixed' | 'auction')
                          ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Geometry Type */}
              <div>
                <h4 className="text-white font-medium mb-4">Geometry Type</h4>
                <div className="flex flex-wrap gap-2">
                  {geometryTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => toggleArrayFilter('geometryType', type.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.geometryType?.includes(type.value as 'parametric' | 'voxel' | 'procedural')
                          ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-white font-medium mb-4">Status</h4>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status.value}
                      onClick={() => toggleArrayFilter('status', status.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.status?.includes(status.value as 'active' | 'sold' | 'cancelled' | 'expired')
                          ? 'bg-[#FF0080]/20 text-[#FF0080] border border-[#FF0080]/30'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchFiltersComponent;