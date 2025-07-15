import { NFT3D, SearchFilters, SortOptions } from '@/types/nft';
import { ENHANCED_MOCK_NFTS, PAGINATION_CONFIG } from './enhanced-mock-data';
import { searchAndFilterNFTs } from './search';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: SearchFilters;
  sortBy: SortOptions;
}

export interface PaginationRequest {
  page: number;
  pageSize: number;
  filters?: SearchFilters;
  sortBy?: SortOptions;
}

export class PaginatedDataService {
  private static instance: PaginatedDataService;
  private dataset: NFT3D[] = ENHANCED_MOCK_NFTS;
  private loadingDelay: number = PAGINATION_CONFIG.LOADING_DELAY;

  private constructor() {}

  static getInstance(): PaginatedDataService {
    if (!PaginatedDataService.instance) {
      PaginatedDataService.instance = new PaginatedDataService();
    }
    return PaginatedDataService.instance;
  }

  // Simulate network delay
  private async simulateNetworkDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, this.loadingDelay));
  }

  // Get paginated NFTs with filtering and sorting
  async getPaginatedNFTs(request: PaginationRequest): Promise<PaginatedResponse<NFT3D>> {
    await this.simulateNetworkDelay();

    const {
      page,
      pageSize = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
      filters = {},
      sortBy = SortOptions.RECENT
    } = request;

    // Validate pagination parameters
    if (page < 1) {
      throw new Error('Page number must be greater than 0');
    }
    if (pageSize > PAGINATION_CONFIG.MAX_PAGE_SIZE) {
      throw new Error(`Page size cannot exceed ${PAGINATION_CONFIG.MAX_PAGE_SIZE}`);
    }

    // Convert NFTs to format expected by search function
    const nftsWithListings = this.dataset.map(nft => ({
      ...nft,
      listing: undefined // No listings for now
    }));

    // Apply filters and sorting
    const filteredNFTs = searchAndFilterNFTs(nftsWithListings, filters, sortBy);

    // Calculate pagination
    const totalItems = filteredNFTs.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Get page data
    const pageData = filteredNFTs.slice(startIndex, endIndex);

    return {
      data: pageData,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      },
      filters,
      sortBy
    };
  }

  // Get NFTs for infinite scroll (append to existing data)
  async getInfiniteScrollNFTs(request: PaginationRequest): Promise<PaginatedResponse<NFT3D>> {
    return this.getPaginatedNFTs(request);
  }

  // Search NFTs with debouncing simulation
  async searchNFTs(
    query: string,
    page: number = 1,
    pageSize: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
    sortBy: SortOptions = SortOptions.RECENT
  ): Promise<PaginatedResponse<NFT3D>> {
    const filters: SearchFilters = { query };
    return this.getPaginatedNFTs({ page, pageSize, filters, sortBy });
  }

  // Get NFTs by specific filters
  async getFilteredNFTs(
    filters: SearchFilters,
    page: number = 1,
    pageSize: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
    sortBy: SortOptions = SortOptions.RECENT
  ): Promise<PaginatedResponse<NFT3D>> {
    return this.getPaginatedNFTs({ page, pageSize, filters, sortBy });
  }

  // Get NFTs by collection
  async getNFTsByCollection(
    collection: string,
    page: number = 1,
    pageSize: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
    sortBy: SortOptions = SortOptions.RECENT
  ): Promise<PaginatedResponse<NFT3D>> {
    const filters: SearchFilters = { collections: [collection] };
    return this.getPaginatedNFTs({ page, pageSize, filters, sortBy });
  }

  // Get NFTs by creator
  async getNFTsByCreator(
    creator: string,
    page: number = 1,
    pageSize: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
    sortBy: SortOptions = SortOptions.RECENT
  ): Promise<PaginatedResponse<NFT3D>> {
    const filters: SearchFilters = { creators: [creator] };
    return this.getPaginatedNFTs({ page, pageSize, filters, sortBy });
  }

  // Get available filter options
  async getFilterOptions(): Promise<{
    collections: string[];
    creators: string[];
    rarities: string[];
    geometryTypes: string[];
  }> {
    await this.simulateNetworkDelay();

    const collections = [...new Set(this.dataset.map(nft => nft.collection).filter((x): x is string => Boolean(x)))];
    const creators = [...new Set(this.dataset.map(nft => nft.creator).filter((x): x is string => Boolean(x)))];
    const rarities = [...new Set(this.dataset.map(nft => nft.rarity).filter((x): x is 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' => Boolean(x)))];
    const geometryTypes = [...new Set(this.dataset.map(nft => nft.geometryType))];

    return {
      collections: collections.sort(),
      creators: creators.sort(),
      rarities: rarities.sort(),
      geometryTypes: geometryTypes.sort()
    };
  }

  // Update loading delay for testing
  setLoadingDelay(delay: number): void {
    this.loadingDelay = delay;
  }

  // Get total count for a specific filter
  async getFilteredCount(filters: SearchFilters): Promise<number> {
    const nftsWithListings = this.dataset.map(nft => ({
      ...nft,
      listing: undefined
    }));

    const filteredNFTs = searchAndFilterNFTs(nftsWithListings, filters);
    return filteredNFTs.length;
  }
}

// Export singleton instance
export const paginatedDataService = PaginatedDataService.getInstance();