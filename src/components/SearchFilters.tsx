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

const rarityOptions = [
  { value: 'Common', color: '#64748b' },
  { value: 'Rare', color: '#00D4FF' },
  { value: 'Epic', color: '#8B5CF6' },
  { value: 'Legendary', color: '#F59E0B' },
  { value: 'Mythic', color: '#EC4899' }
];

const sortOptions = [
  { value: SortOptions.RECENT, label: 'Recent' },
  { value: SortOptions.PRICE_LOW, label: 'Price ↑' },
  { value: SortOptions.PRICE_HIGH, label: 'Price ↓' },
  { value: SortOptions.NAME_AZ, label: 'A-Z' },
  { value: SortOptions.RARITY, label: 'Rarity' }
];

const geometryTypes = [
  { value: 'parametric', label: 'Parametric', icon: '◉' },
  { value: 'voxel', label: 'Voxel', icon: '▣' },
  { value: 'procedural', label: 'Procedural', icon: '✦' }
];

const listingTypes = [
  { value: 'fixed', label: 'Buy Now' },
  { value: 'auction', label: 'Auction' }
];

export function SearchFiltersComponent({
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
  className = ''
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: filters.priceRange?.min?.toString() || '',
    max: filters.priceRange?.max?.toString() || ''
  });

  useEffect(() => {
    setPriceRange({
      min: filters.priceRange?.min?.toString() || '',
      max: filters.priceRange?.max?.toString() || ''
    });
  }, [filters.priceRange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.priceRange?.min !== undefined || filters.priceRange?.max !== undefined) count++;
    if (filters.rarity?.length) count++;
    if (filters.listingType?.length) count++;
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
        priceRange: { ...filters.priceRange, [field]: numValue }
      });
    }
  };

  const toggleArrayFilter = (filterKey: keyof SearchFilters, value: string) => {
    const currentArray = (filters[filterKey] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters({ [filterKey]: newArray.length > 0 ? newArray : undefined });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setPriceRange({ min: '', max: '' });
  };

  return (
    <div className={`${className}`}>
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center">

        {/* Search Input - Large and prominent */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search NFTs by name, creator, or collection..."
            value={filters.query || ''}
            onChange={(e) => updateFilters({ query: e.target.value || undefined })}
            className="w-full h-14 lg:h-16 pl-14 pr-14 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder-[#64748b] text-base
                       focus:outline-none focus:border-[#008de4]/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-[#008de4]/10
                       transition-all duration-300"
          />
          {filters.query && (
            <button
              onClick={() => updateFilters({ query: undefined })}
              className="absolute inset-y-0 right-0 pr-6 flex items-center text-[#64748b] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex gap-3">
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-5 py-3.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                sortBy === option.value
                  ? 'bg-gradient-to-r from-[#008de4] to-[#00D4FF] text-white shadow-lg shadow-[#008de4]/25'
                  : 'bg-white/[0.03] border border-white/[0.08] text-[#94a3b8] hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all duration-300 ${
            showFilters || activeFilterCount > 0
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-lg shadow-[#8B5CF6]/25'
              : 'bg-white/[0.03] border border-white/[0.08] text-[#94a3b8] hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 32 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 lg:p-10">

              {/* Filter Header */}
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-semibold text-white">Refine Results</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/[0.05] transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-sm font-medium">Clear All</span>
                  </button>
                )}
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10">

                {/* Price Range */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-5">
                    <svg className="w-4 h-4 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Price (DASH)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                      className="flex-1 h-12 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-[#475569] text-sm
                                 focus:outline-none focus:border-[#008de4]/50 focus:bg-white/[0.05] transition-all"
                    />
                    <span className="text-[#475569]">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                      className="flex-1 h-12 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-[#475569] text-sm
                                 focus:outline-none focus:border-[#008de4]/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                {/* Geometry Type */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-5">
                    <svg className="w-4 h-4 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Geometry
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {geometryTypes.map(type => (
                      <button
                        key={type.value}
                        onClick={() => toggleArrayFilter('geometryType', type.value)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          filters.geometryType?.includes(type.value as 'parametric' | 'voxel' | 'procedural')
                            ? 'bg-[#8B5CF6]/20 text-[#A855F7] border border-[#8B5CF6]/40'
                            : 'bg-white/[0.03] border border-white/[0.08] text-[#94a3b8] hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{type.icon}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Listing Type */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-5">
                    <svg className="w-4 h-4 text-[#EC4899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Sale Type
                  </label>
                  <div className="flex gap-2">
                    {listingTypes.map(type => (
                      <button
                        key={type.value}
                        onClick={() => toggleArrayFilter('listingType', type.value)}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          filters.listingType?.includes(type.value as 'fixed' | 'auction')
                            ? 'bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/40'
                            : 'bg-white/[0.03] border border-white/[0.08] text-[#94a3b8] hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rarity */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-5">
                    <svg className="w-4 h-4 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Rarity
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {rarityOptions.map(rarity => (
                      <button
                        key={rarity.value}
                        onClick={() => toggleArrayFilter('rarity', rarity.value)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          filters.rarity?.includes(rarity.value as 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic')
                            ? 'text-white border-2'
                            : 'bg-white/[0.03] border border-white/[0.08] text-[#94a3b8] hover:bg-white/[0.06] hover:text-white'
                        }`}
                        style={filters.rarity?.includes(rarity.value as 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic') ? {
                          backgroundColor: `${rarity.color}20`,
                          borderColor: rarity.color,
                          color: rarity.color
                        } : {}}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: rarity.color }}
                        />
                        {rarity.value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFilterCount > 0 && (
                <div className="mt-10 pt-8 border-t border-white/[0.06]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-[#64748b]">Active:</span>
                    {filters.query && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#008de4]/10 border border-[#008de4]/30 rounded-lg text-sm text-[#00D4FF]">
                        "{filters.query}"
                        <button onClick={() => updateFilters({ query: undefined })} className="hover:text-white">×</button>
                      </span>
                    )}
                    {filters.geometryType?.map(type => (
                      <span key={type} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-lg text-sm text-[#A855F7]">
                        {type}
                        <button onClick={() => toggleArrayFilter('geometryType', type)} className="hover:text-white">×</button>
                      </span>
                    ))}
                    {filters.listingType?.map(type => (
                      <span key={type} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EC4899]/10 border border-[#EC4899]/30 rounded-lg text-sm text-[#EC4899]">
                        {type === 'fixed' ? 'Buy Now' : 'Auction'}
                        <button onClick={() => toggleArrayFilter('listingType', type)} className="hover:text-white">×</button>
                      </span>
                    ))}
                    {filters.rarity?.map(r => (
                      <span key={r} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg text-sm text-[#F59E0B]">
                        {r}
                        <button onClick={() => toggleArrayFilter('rarity', r)} className="hover:text-white">×</button>
                      </span>
                    ))}
                    {(filters.priceRange?.min !== undefined || filters.priceRange?.max !== undefined) && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-lg text-sm text-[#00D4FF]">
                        {filters.priceRange?.min || '0'} - {filters.priceRange?.max || '∞'} DASH
                        <button onClick={() => { updateFilters({ priceRange: undefined }); setPriceRange({ min: '', max: '' }); }} className="hover:text-white">×</button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchFiltersComponent;
