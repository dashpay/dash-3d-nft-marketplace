'use client';

import { useState, useEffect } from 'react';
import { NFT3D, SearchFilters, SortOptions } from '@/types/nft';
import { usePagination } from '@/hooks/usePagination';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { NFTCard } from '@/components/NFTCard';
import { NFTCardSkeletonGrid } from '@/components/loading/NFTCardSkeleton';
import { PaginationControls, PaginationInfo, PageSizeSelector } from '@/components/pagination/PaginationControls';
import { LoadMoreButton, InfiniteScrollIndicator, EmptyState, PaginationLoading } from '@/components/loading/LoadingIndicators';

export type PaginationMode = 'pagination' | 'infinite' | 'manual';

interface PaginatedGalleryProps {
  mode?: PaginationMode;
  initialFilters?: SearchFilters;
  initialSort?: SortOptions;
  initialPageSize?: number;
  showControls?: boolean;
  showInfo?: boolean;
  showPageSizeSelector?: boolean;
  onNFTClick?: (nft: NFT3D) => void;
  onQuickBuy?: (nft: NFT3D, listing: any) => void;
  onPlaceBid?: (nft: NFT3D, auction: any) => void;
  onCreateListing?: (nft: NFT3D) => void;
  currentUserId?: string;
  className?: string;
}

export function PaginatedGallery({
  mode = 'pagination',
  initialFilters = {},
  initialSort = SortOptions.RECENT,
  initialPageSize = 20,
  showControls = true,
  showInfo = true,
  showPageSizeSelector = true,
  onNFTClick,
  onQuickBuy,
  onPlaceBid,
  onCreateListing,
  currentUserId = '',
  className = ''
}: PaginatedGalleryProps) {
  const [currentMode, setCurrentMode] = useState<PaginationMode>(mode);

  // Pagination hook for traditional pagination
  const pagination = usePagination({
    initialPageSize,
    initialFilters,
    initialSort,
    autoLoad: currentMode === 'pagination'
  });

  // Infinite scroll hook for infinite scrolling
  const infiniteScroll = useInfiniteScroll({
    initialPageSize,
    initialFilters,
    initialSort,
    autoLoad: currentMode === 'infinite'
  });

  // Current data source based on mode
  const currentData = currentMode === 'pagination' ? pagination : infiniteScroll;

  // Handle filter changes
  const handleFilterChange = (filters: SearchFilters) => {
    currentData.actions.updateFilters(filters);
  };

  // Handle sort changes
  const handleSortChange = (sortBy: SortOptions) => {
    currentData.actions.updateSort(sortBy);
  };

  // Handle page size changes
  const handlePageSizeChange = (size: number) => {
    currentData.actions.setPageSize(size);
  };

  // Handle NFT interactions
  const handleNFTClick = (nft: NFT3D) => {
    onNFTClick?.(nft);
  };

  const handleQuickBuy = (nft: NFT3D, listing: any) => {
    onQuickBuy?.(nft, listing);
  };

  const handlePlaceBid = (nft: NFT3D, auction: any) => {
    onPlaceBid?.(nft, auction);
  };

  const handleCreateListing = (nft: NFT3D) => {
    onCreateListing?.(nft);
  };

  // Render loading state
  if (currentData.state.loading && currentData.state.data.length === 0) {
    return (
      <div className={className}>
        <PaginationLoading />
      </div>
    );
  }

  // Render empty state
  if (!currentData.state.loading && currentData.state.data.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          title="No NFTs found"
          description="Try adjusting your filters or search terms to find NFTs."
          actionLabel="Clear filters"
          onAction={() => handleFilterChange({})}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Gallery Info */}
        {showInfo && (
          <div className="flex items-center gap-4">
            {currentMode === 'pagination' && (
              <PaginationInfo
                currentPage={pagination.state.page}
                totalPages={pagination.state.totalPages}
                totalItems={pagination.state.totalItems}
                pageSize={pagination.state.pageSize}
              />
            )}
            {currentMode === 'infinite' && (
              <div className="text-sm text-gray-400">
                Showing {infiniteScroll.state.data.length.toLocaleString()} of {infiniteScroll.state.totalItems.toLocaleString()} NFTs
              </div>
            )}
          </div>
        )}

        {/* Mode Toggle and Page Size */}
        <div className="flex items-center gap-4">
          {/* Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">View:</span>
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setCurrentMode('pagination')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  currentMode === 'pagination'
                    ? 'bg-dash-blue text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Pages
              </button>
              <button
                onClick={() => setCurrentMode('infinite')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  currentMode === 'infinite'
                    ? 'bg-dash-blue text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Infinite
              </button>
            </div>
          </div>

          {/* Page Size Selector */}
          {showPageSizeSelector && (
            <PageSizeSelector
              currentPageSize={currentData.state.pageSize}
              onPageSizeChange={handlePageSizeChange}
              options={[10, 20, 50]}
            />
          )}
        </div>
      </div>

      {/* Error Display */}
      {currentData.state.error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
          <p className="font-medium">Error loading NFTs</p>
          <p className="text-sm">{currentData.state.error}</p>
          <button
            onClick={() => currentData.actions.refresh()}
            className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8 xl:gap-10">
        {currentData.state.data.map((nft, index) => (
          <NFTCard
            key={`${nft.id}-${index}`}
            nft={nft}
            listing={undefined} // No listings for now
            onClick={handleNFTClick}
            onQuickBuy={handleQuickBuy}
            onPlaceBid={handlePlaceBid}
            onCreateListing={handleCreateListing}
            showOwnership={true}
            currentUserId={currentUserId}
          />
        ))}
      </div>

      {/* Loading More Skeletons */}
      {currentData.state.loading && currentData.state.data.length > 0 && (
        <NFTCardSkeletonGrid count={6} />
      )}

      {/* Pagination Controls */}
      {currentMode === 'pagination' && showControls && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <PaginationControls
            currentPage={pagination.state.page}
            totalPages={pagination.state.totalPages}
            hasNextPage={pagination.state.hasNextPage}
            hasPreviousPage={pagination.state.hasPreviousPage}
            onPageChange={pagination.actions.goToPage}
            onNextPage={pagination.actions.nextPage}
            onPreviousPage={pagination.actions.previousPage}
          />
        </div>
      )}

      {/* Infinite Scroll Controls */}
      {currentMode === 'infinite' && (
        <div className="flex flex-col items-center gap-4">
          <InfiniteScrollIndicator
            loading={infiniteScroll.state.loadingMore}
            hasMore={infiniteScroll.state.hasMore}
            error={infiniteScroll.state.error}
            onRetry={infiniteScroll.actions.loadMore}
          />
          {/* Invisible element for intersection observer */}
          <div
            ref={infiniteScroll.loadMoreRef}
            className="h-1 w-1 opacity-0"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Manual Load More */}
      {currentMode === 'manual' && (
        <div className="flex justify-center">
          <LoadMoreButton
            onClick={infiniteScroll.actions.loadMore}
            loading={infiniteScroll.state.loadingMore}
            disabled={!infiniteScroll.state.hasMore}
          />
        </div>
      )}
    </div>
  );
}

// Export context for external filter/sort controls
export interface PaginatedGalleryContextValue {
  filters: SearchFilters;
  sortBy: SortOptions;
  updateFilters: (filters: SearchFilters) => void;
  updateSort: (sortBy: SortOptions) => void;
  refresh: () => void;
  loading: boolean;
  error: string | null;
  totalItems: number;
}

export function usePaginatedGalleryContext(): PaginatedGalleryContextValue {
  // This would typically use React Context, but for now we'll keep it simple
  // In a real implementation, you'd wrap the gallery in a context provider
  throw new Error('usePaginatedGalleryContext must be used within a PaginatedGalleryProvider');
}