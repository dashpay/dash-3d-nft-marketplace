'use client';

import { useState, useEffect } from 'react';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  className?: string;
}

export function LoadMoreButton({
  onClick,
  loading,
  disabled = false,
  className = ''
}: LoadMoreButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-8 py-3 rounded-lg font-medium transition-all duration-200 
        ${disabled || loading
          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
          : 'bg-dash-blue hover:bg-dash-blue-dark text-white hover:scale-105'
        }
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        'Load More'
      )}
    </button>
  );
}

interface InfiniteScrollIndicatorProps {
  loading: boolean;
  hasMore: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export function InfiniteScrollIndicator({
  loading,
  hasMore,
  error,
  onRetry,
  className = ''
}: InfiniteScrollIndicatorProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  if (error) {
    return (
      <div className={`flex flex-col items-center gap-3 py-8 ${className}`}>
        <div className="text-red-400 text-center">
          <p className="font-medium">Failed to load more items</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!hasMore) {
    return (
      <div className={`flex flex-col items-center py-8 text-gray-400 ${className}`}>
        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-center">
          That's all the NFTs!
          <br />
          <span className="text-sm text-gray-500">No more items to load</span>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex flex-col items-center py-8 ${className}`}>
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-dash-blue rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-dash-blue rounded-full animate-spin animation-delay-150"></div>
        </div>
        <p className="text-gray-400 mt-3">Loading more NFTs{dots}</p>
      </div>
    );
  }

  return null;
}

interface PaginationLoadingProps {
  className?: string;
}

export function PaginationLoading({ className = '' }: PaginationLoadingProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-dash-blue rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-dash-blue rounded-full animate-spin animation-delay-150"></div>
        </div>
        <div className="text-center">
          <p className="text-white font-medium">Loading NFTs</p>
          <p className="text-gray-400 text-sm">Please wait while we fetch the collection</p>
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'No NFTs found',
  description = 'Try adjusting your filters or search terms',
  actionLabel = 'Clear filters',
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-center mb-6 max-w-md">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2 bg-dash-blue hover:bg-dash-blue-dark text-white rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-700 border-t-dash-blue rounded-full animate-spin`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-dash-blue rounded-full animate-spin animation-delay-150`}></div>
      </div>
    </div>
  );
}