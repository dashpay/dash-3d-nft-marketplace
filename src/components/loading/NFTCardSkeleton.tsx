'use client';

interface NFTCardSkeletonProps {
  className?: string;
}

export function NFTCardSkeleton({ className = '' }: NFTCardSkeletonProps) {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-xl overflow-hidden ${className}`}>
      {/* 3D Viewer Skeleton */}
      <div className="aspect-square bg-gray-700 animate-pulse relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-600 rounded-full animate-spin border-2 border-gray-500 border-t-transparent"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-gray-700 rounded animate-pulse"></div>
        
        {/* Creator and Collection */}
        <div className="flex justify-between items-center">
          <div className="h-3 bg-gray-700 rounded w-20 animate-pulse"></div>
          <div className="h-3 bg-gray-700 rounded w-16 animate-pulse"></div>
        </div>

        {/* Price */}
        <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>

        {/* Rarity Badge */}
        <div className="h-5 bg-gray-700 rounded-full w-16 animate-pulse"></div>

        {/* Action Button */}
        <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

interface NFTCardSkeletonGridProps {
  count?: number;
  className?: string;
}

export function NFTCardSkeletonGrid({ count = 6, className = '' }: NFTCardSkeletonGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <NFTCardSkeleton key={index} />
      ))}
    </div>
  );
}