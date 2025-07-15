import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../hooks/usePagination';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { paginatedDataService } from '../lib/paginated-data-service';
import { SortOptions } from '../types/nft';

// Mock the paginated data service
jest.mock('../lib/paginated-data-service', () => ({
  paginatedDataService: {
    getPaginatedNFTs: jest.fn(),
    setLoadingDelay: jest.fn()
  }
}));

describe('usePagination', () => {
  const mockPaginatedDataService = paginatedDataService as jest.Mocked<typeof paginatedDataService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPaginatedDataService.setLoadingDelay(0); // Remove delays for testing
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => usePagination({ autoLoad: false }));

    expect(result.current.state.data).toEqual([]);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBe(null);
    expect(result.current.state.page).toBe(1);
    expect(result.current.state.pageSize).toBe(20);
    expect(result.current.state.totalItems).toBe(0);
    expect(result.current.state.totalPages).toBe(0);
    expect(result.current.state.hasNextPage).toBe(false);
    expect(result.current.state.hasPreviousPage).toBe(false);
  });

  it('should load data successfully', async () => {
    const mockData = [
      { id: '1', name: 'NFT 1', geometryType: 'parametric' as const, ownerId: 'owner1', geometry3d: '{}', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '2', name: 'NFT 2', geometryType: 'voxel' as const, ownerId: 'owner2', geometry3d: '{}', createdAt: Date.now(), updatedAt: Date.now() }
    ];

    mockPaginatedDataService.getPaginatedNFTs.mockResolvedValue({
      data: mockData,
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },
      filters: {},
      sortBy: SortOptions.RECENT
    });

    const { result } = renderHook(() => usePagination({ autoLoad: false }));

    await act(async () => {
      result.current.actions.refresh();
    });

    expect(result.current.state.data).toEqual(mockData);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.totalItems).toBe(2);
    expect(result.current.state.totalPages).toBe(1);
  });

  it('should handle pagination correctly', async () => {
    const mockPage1 = [
      { id: '1', name: 'NFT 1', geometryType: 'parametric' as const, ownerId: 'owner1', geometry3d: '{}', createdAt: Date.now(), updatedAt: Date.now() }
    ];
    const mockPage2 = [
      { id: '2', name: 'NFT 2', geometryType: 'voxel' as const, ownerId: 'owner2', geometry3d: '{}', createdAt: Date.now(), updatedAt: Date.now() }
    ];

    // Mock first page
    mockPaginatedDataService.getPaginatedNFTs.mockResolvedValueOnce({
      data: mockPage1,
      pagination: {
        page: 1,
        pageSize: 1,
        totalItems: 2,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false
      },
      filters: {},
      sortBy: SortOptions.RECENT
    });

    // Mock second page
    mockPaginatedDataService.getPaginatedNFTs.mockResolvedValueOnce({
      data: mockPage2,
      pagination: {
        page: 2,
        pageSize: 1,
        totalItems: 2,
        totalPages: 2,
        hasNextPage: false,
        hasPreviousPage: true
      },
      filters: {},
      sortBy: SortOptions.RECENT
    });

    const { result } = renderHook(() => usePagination({ 
      autoLoad: false, 
      initialPageSize: 1 
    }));

    // Load first page
    await act(async () => {
      result.current.actions.refresh();
    });

    expect(result.current.state.data).toEqual(mockPage1);
    expect(result.current.state.page).toBe(1);
    expect(result.current.state.hasNextPage).toBe(true);
    expect(result.current.state.hasPreviousPage).toBe(false);

    // Go to next page
    await act(async () => {
      result.current.actions.nextPage();
    });

    expect(result.current.state.data).toEqual(mockPage2);
    expect(result.current.state.page).toBe(2);
    expect(result.current.state.hasNextPage).toBe(false);
    expect(result.current.state.hasPreviousPage).toBe(true);
  });

  it('should handle filters correctly', async () => {
    const mockData = [
      { id: '1', name: 'Filtered NFT', geometryType: 'parametric' as const, ownerId: 'owner1', geometry3d: '{}', createdAt: Date.now(), updatedAt: Date.now() }
    ];

    mockPaginatedDataService.getPaginatedNFTs.mockResolvedValue({
      data: mockData,
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },
      filters: { query: 'test' },
      sortBy: SortOptions.RECENT
    });

    const { result } = renderHook(() => usePagination({ autoLoad: false }));

    await act(async () => {
      result.current.actions.updateFilters({ query: 'test' });
    });

    expect(result.current.filters.query).toBe('test');
    expect(result.current.state.data).toEqual(mockData);
    expect(mockPaginatedDataService.getPaginatedNFTs).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      filters: { query: 'test' },
      sortBy: SortOptions.RECENT
    });
  });

  it('should handle sorting correctly', async () => {
    const mockData = [
      { id: '1', name: 'Sorted NFT', geometryType: 'parametric' as const, ownerId: 'owner1', geometry3d: '{}', createdAt: Date.now(), updatedAt: Date.now() }
    ];

    mockPaginatedDataService.getPaginatedNFTs.mockResolvedValue({
      data: mockData,
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },
      filters: {},
      sortBy: SortOptions.PRICE_LOW
    });

    const { result } = renderHook(() => usePagination({ autoLoad: false }));

    await act(async () => {
      result.current.actions.updateSort(SortOptions.PRICE_LOW);
    });

    expect(result.current.sortBy).toBe(SortOptions.PRICE_LOW);
    expect(result.current.state.data).toEqual(mockData);
    expect(mockPaginatedDataService.getPaginatedNFTs).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      filters: {},
      sortBy: SortOptions.PRICE_LOW
    });
  });

  it('should handle errors correctly', async () => {
    const errorMessage = 'Network error';
    mockPaginatedDataService.getPaginatedNFTs.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePagination({ autoLoad: false }));

    await act(async () => {
      result.current.actions.refresh();
    });

    expect(result.current.state.error).toBe(errorMessage);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.data).toEqual([]);
  });
});

describe('useInfiniteScroll', () => {
  const mockPaginatedDataService = paginatedDataService as jest.Mocked<typeof paginatedDataService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPaginatedDataService.setLoadingDelay(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useInfiniteScroll({ autoLoad: false }));

    expect(result.current.state.data).toEqual([]);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.loadingMore).toBe(false);
    expect(result.current.state.error).toBe(null);
    expect(result.current.state.hasMore).toBe(true);
    expect(result.current.state.page).toBe(1);
    expect(result.current.state.pageSize).toBe(20);
    expect(result.current.state.totalItems).toBe(0);
    expect(result.current.state.totalPages).toBe(0);
  });

  it('should load initial data successfully', async () => {
    const mockData = [
      { id: '1', name: 'NFT 1', geometryType: 'parametric' as const, ownerId: 'owner1', geometry3d: '{}', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '2', name: 'NFT 2', geometryType: 'voxel' as const, ownerId: 'owner2', geometry3d: '{}', createdAt: Date.now(), updatedAt: Date.now() }
    ];

    mockPaginatedDataService.getPaginatedNFTs.mockResolvedValue({
      data: mockData,
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },
      filters: {},
      sortBy: SortOptions.RECENT
    });

    const { result } = renderHook(() => useInfiniteScroll({ autoLoad: false }));

    await act(async () => {
      result.current.actions.refresh();
    });

    expect(result.current.state.data).toEqual(mockData);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.hasMore).toBe(false);
    expect(result.current.state.totalItems).toBe(2);
  });

  it('should load more data correctly', async () => {
    const mockPage1 = [
      { id: '1', name: 'NFT 1', geometryType: 'parametric' as const, ownerId: 'owner1', geometry3d: '{}', createdAt: Date.now(), updatedAt: Date.now() }
    ];
    const mockPage2 = [
      { id: '2', name: 'NFT 2', geometryType: 'voxel' as const, ownerId: 'owner2', geometry3d: '{}', createdAt: Date.now(), updatedAt: Date.now() }
    ];

    // Mock first page
    mockPaginatedDataService.getPaginatedNFTs.mockResolvedValueOnce({
      data: mockPage1,
      pagination: {
        page: 1,
        pageSize: 1,
        totalItems: 2,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false
      },
      filters: {},
      sortBy: SortOptions.RECENT
    });

    // Mock second page
    mockPaginatedDataService.getPaginatedNFTs.mockResolvedValueOnce({
      data: mockPage2,
      pagination: {
        page: 2,
        pageSize: 1,
        totalItems: 2,
        totalPages: 2,
        hasNextPage: false,
        hasPreviousPage: true
      },
      filters: {},
      sortBy: SortOptions.RECENT
    });

    const { result } = renderHook(() => useInfiniteScroll({ 
      autoLoad: false, 
      initialPageSize: 1 
    }));

    // Load first page
    await act(async () => {
      result.current.actions.refresh();
    });

    expect(result.current.state.data).toEqual(mockPage1);
    expect(result.current.state.hasMore).toBe(true);
    expect(result.current.state.page).toBe(1);

    // Load more data
    await act(async () => {
      result.current.actions.loadMore();
    });

    expect(result.current.state.data).toEqual([...mockPage1, ...mockPage2]);
    expect(result.current.state.hasMore).toBe(false);
    expect(result.current.state.page).toBe(2);
  });

  it('should handle filters correctly', async () => {
    const mockData = [
      { id: '1', name: 'Filtered NFT', geometryType: 'parametric' as const, ownerId: 'owner1', geometry3d: '{}', createdAt: Date.now(), updatedAt: Date.now() }
    ];

    mockPaginatedDataService.getPaginatedNFTs.mockResolvedValue({
      data: mockData,
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },
      filters: { query: 'test' },
      sortBy: SortOptions.RECENT
    });

    const { result } = renderHook(() => useInfiniteScroll({ autoLoad: false }));

    await act(async () => {
      result.current.actions.updateFilters({ query: 'test' });
    });

    expect(result.current.filters.query).toBe('test');
    expect(result.current.state.data).toEqual(mockData);
    expect(result.current.state.page).toBe(1); // Should reset to page 1
  });

  it('should handle loading more when no more data available', async () => {
    const mockData = [
      { id: '1', name: 'NFT 1', geometryType: 'parametric' as const, ownerId: 'owner1', geometry3d: '{}', createdAt: Date.now(), updatedAt: Date.now() }
    ];

    mockPaginatedDataService.getPaginatedNFTs.mockResolvedValue({
      data: mockData,
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },
      filters: {},
      sortBy: SortOptions.RECENT
    });

    const { result } = renderHook(() => useInfiniteScroll({ autoLoad: false }));

    await act(async () => {
      result.current.actions.refresh();
    });

    expect(result.current.state.hasMore).toBe(false);

    // Try to load more when no more data
    await act(async () => {
      result.current.actions.loadMore();
    });

    // Should not make additional API calls
    expect(mockPaginatedDataService.getPaginatedNFTs).toHaveBeenCalledTimes(1);
    expect(result.current.state.data).toEqual(mockData);
  });
});