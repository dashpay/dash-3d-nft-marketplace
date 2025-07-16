import { useState, useEffect, useCallback, useRef } from 'react';
import { NFT3D, SearchFilters, SortOptions } from '@/types/nft';
import { paginatedDataService, PaginatedResponse } from '@/lib/paginated-data-service';
import { PAGINATION_CONFIG } from '@/lib/enhanced-mock-data';

export interface PaginationState {
  data: NFT3D[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationActions {
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  refresh: () => void;
  updateFilters: (filters: SearchFilters) => void;
  updateSort: (sortBy: SortOptions) => void;
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialFilters?: SearchFilters;
  initialSort?: SortOptions;
  autoLoad?: boolean;
}

export interface UsePaginationReturn {
  state: PaginationState;
  actions: PaginationActions;
  filters: SearchFilters;
  sortBy: SortOptions;
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const {
    initialPage = 1,
    initialPageSize = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
    initialFilters = {},
    initialSort = SortOptions.RECENT,
    autoLoad = true
  } = options;

  // State management
  const [state, setState] = useState<PaginationState>({
    data: [],
    loading: false,
    error: null,
    page: initialPage,
    pageSize: initialPageSize,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOptions>(initialSort);

  // Refs for tracking current request
  const currentRequestRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load data function
  const loadData = useCallback(async (
    page: number = state.page,
    pageSize: number = state.pageSize,
    currentFilters: SearchFilters = filters,
    currentSort: SortOptions = sortBy,
    resetData: boolean = true
  ) => {
    // Increment request counter for race condition handling
    const requestId = ++currentRequestRef.current;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      ...(resetData && { data: [] })
    }));

    try {
      const response: PaginatedResponse<NFT3D> = await paginatedDataService.getPaginatedNFTs({
        page,
        pageSize,
        filters: currentFilters,
        sortBy: currentSort
      });

      // Check if this is still the current request
      if (requestId !== currentRequestRef.current) {
        return; // Ignore outdated request
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        page: response.pagination.page,
        pageSize: response.pagination.pageSize,
        totalItems: response.pagination.totalItems,
        totalPages: response.pagination.totalPages,
        hasNextPage: response.pagination.hasNextPage,
        hasPreviousPage: response.pagination.hasPreviousPage
      }));
    } catch (error) {
      // Check if this is still the current request and not aborted
      if (requestId !== currentRequestRef.current) {
        return;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        return; // Ignore aborted requests
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load data'
      }));
    }
  }, [state.page, state.pageSize, filters, sortBy]);

  // Actions
  const actions: PaginationActions = {
    goToPage: useCallback((page: number) => {
      if (page < 1 || page > state.totalPages) return;
      loadData(page, state.pageSize, filters, sortBy);
    }, [loadData, state.pageSize, state.totalPages, filters, sortBy]),

    nextPage: useCallback(() => {
      if (state.hasNextPage) {
        loadData(state.page + 1, state.pageSize, filters, sortBy);
      }
    }, [loadData, state.hasNextPage, state.page, state.pageSize, filters, sortBy]),

    previousPage: useCallback(() => {
      if (state.hasPreviousPage) {
        loadData(state.page - 1, state.pageSize, filters, sortBy);
      }
    }, [loadData, state.hasPreviousPage, state.page, state.pageSize, filters, sortBy]),

    setPageSize: useCallback((size: number) => {
      if (size < 1 || size > PAGINATION_CONFIG.MAX_PAGE_SIZE) return;
      loadData(1, size, filters, sortBy); // Reset to first page
    }, [loadData, filters, sortBy]),

    refresh: useCallback(() => {
      loadData(state.page, state.pageSize, filters, sortBy);
    }, [loadData, state.page, state.pageSize, filters, sortBy]),

    updateFilters: useCallback((newFilters: SearchFilters) => {
      setFilters(newFilters);
      loadData(1, state.pageSize, newFilters, sortBy); // Reset to first page
    }, [loadData, state.pageSize, sortBy]),

    updateSort: useCallback((newSort: SortOptions) => {
      setSortBy(newSort);
      loadData(1, state.pageSize, filters, newSort); // Reset to first page
    }, [loadData, state.pageSize, filters])
  };

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadData(initialPage, initialPageSize, initialFilters, initialSort);
    }
  }, []); // Only run on mount

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    state,
    actions,
    filters,
    sortBy
  };
}