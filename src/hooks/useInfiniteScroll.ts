import { useState, useEffect, useCallback, useRef } from 'react';
import { NFT3D, SearchFilters, SortOptions } from '@/types/nft';
import { paginatedDataService, PaginatedResponse } from '@/lib/paginated-data-service';
import { PAGINATION_CONFIG } from '@/lib/enhanced-mock-data';

export interface InfiniteScrollState {
  data: NFT3D[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface InfiniteScrollActions {
  loadMore: () => void;
  refresh: () => void;
  updateFilters: (filters: SearchFilters) => void;
  updateSort: (sortBy: SortOptions) => void;
  setPageSize: (size: number) => void;
}

export interface UseInfiniteScrollOptions {
  initialPageSize?: number;
  initialFilters?: SearchFilters;
  initialSort?: SortOptions;
  autoLoad?: boolean;
  threshold?: number; // Intersection threshold for auto-loading
}

export interface UseInfiniteScrollReturn {
  state: InfiniteScrollState;
  actions: InfiniteScrollActions;
  filters: SearchFilters;
  sortBy: SortOptions;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions = {}): UseInfiniteScrollReturn {
  const {
    initialPageSize = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
    initialFilters = {},
    initialSort = SortOptions.RECENT,
    autoLoad = true,
    threshold = PAGINATION_CONFIG.INFINITE_SCROLL_THRESHOLD
  } = options;

  // State management
  const [state, setState] = useState<InfiniteScrollState>({
    data: [],
    loading: false,
    loadingMore: false,
    error: null,
    hasMore: true,
    page: 1,
    pageSize: initialPageSize,
    totalItems: 0,
    totalPages: 0
  });

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOptions>(initialSort);

  // Refs for tracking current request and intersection observer
  const currentRequestRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load initial data or refresh
  const loadInitialData = useCallback(async (
    currentFilters: SearchFilters = filters,
    currentSort: SortOptions = sortBy,
    pageSize: number = state.pageSize
  ) => {
    const requestId = ++currentRequestRef.current;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      data: [],
      page: 1,
      hasMore: true
    }));

    try {
      const response: PaginatedResponse<NFT3D> = await paginatedDataService.getPaginatedNFTs({
        page: 1,
        pageSize,
        filters: currentFilters,
        sortBy: currentSort
      });

      // Check if this is still the current request
      if (requestId !== currentRequestRef.current) {
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        page: 1,
        pageSize: response.pagination.pageSize,
        totalItems: response.pagination.totalItems,
        totalPages: response.pagination.totalPages,
        hasMore: response.pagination.hasNextPage
      }));
    } catch (error) {
      if (requestId !== currentRequestRef.current) {
        return;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load data'
      }));
    }
  }, [filters, sortBy, state.pageSize]);

  // Load more data for infinite scroll
  const loadMoreData = useCallback(async () => {
    if (!state.hasMore || state.loading || state.loadingMore) {
      return;
    }

    const requestId = ++currentRequestRef.current;
    const nextPage = state.page + 1;

    setState(prev => ({
      ...prev,
      loadingMore: true,
      error: null
    }));

    try {
      const response: PaginatedResponse<NFT3D> = await paginatedDataService.getPaginatedNFTs({
        page: nextPage,
        pageSize: state.pageSize,
        filters,
        sortBy
      });

      // Check if this is still the current request
      if (requestId !== currentRequestRef.current) {
        return;
      }

      setState(prev => ({
        ...prev,
        data: [...prev.data, ...response.data],
        loadingMore: false,
        page: nextPage,
        hasMore: response.pagination.hasNextPage
      }));
    } catch (error) {
      if (requestId !== currentRequestRef.current) {
        return;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      setState(prev => ({
        ...prev,
        loadingMore: false,
        error: error instanceof Error ? error.message : 'Failed to load more data'
      }));
    }
  }, [state.hasMore, state.loading, state.loadingMore, state.page, state.pageSize, filters, sortBy]);

  // Actions
  const actions: InfiniteScrollActions = {
    loadMore: loadMoreData,

    refresh: useCallback(() => {
      loadInitialData(filters, sortBy, state.pageSize);
    }, [loadInitialData, filters, sortBy, state.pageSize]),

    updateFilters: useCallback((newFilters: SearchFilters) => {
      setFilters(newFilters);
      loadInitialData(newFilters, sortBy, state.pageSize);
    }, [loadInitialData, sortBy, state.pageSize]),

    updateSort: useCallback((newSort: SortOptions) => {
      setSortBy(newSort);
      loadInitialData(filters, newSort, state.pageSize);
    }, [loadInitialData, filters, state.pageSize]),

    setPageSize: useCallback((size: number) => {
      if (size < 1 || size > PAGINATION_CONFIG.MAX_PAGE_SIZE) return;
      setState(prev => ({ ...prev, pageSize: size }));
      loadInitialData(filters, sortBy, size);
    }, [loadInitialData, filters, sortBy])
  };

  // Set up intersection observer for automatic loading
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && state.hasMore && !state.loading && !state.loadingMore) {
          loadMoreData();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before the element is visible
        threshold: 0.1
      }
    );

    observer.observe(loadMoreRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreData, state.hasMore, state.loading, state.loadingMore]);

  // Auto-load initial data
  useEffect(() => {
    if (autoLoad) {
      loadInitialData(initialFilters, initialSort, initialPageSize);
    }
  }, []); // Only run on mount

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    state,
    actions,
    filters,
    sortBy,
    loadMoreRef
  };
}