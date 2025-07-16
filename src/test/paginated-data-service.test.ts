import { paginatedDataService } from '../lib/paginated-data-service';
import { SortOptions } from '../types/nft';

describe('PaginatedDataService', () => {
  beforeEach(() => {
    // Remove delays for testing
    paginatedDataService.setLoadingDelay(0);
  });

  describe('getPaginatedNFTs', () => {
    it('should return paginated NFTs with correct structure', async () => {
      const result = await paginatedDataService.getPaginatedNFTs({
        page: 1,
        pageSize: 10
      });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(result).toHaveProperty('filters');
      expect(result).toHaveProperty('sortBy');

      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeLessThanOrEqual(10);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(10);
      expect(result.pagination.totalItems).toBeGreaterThan(0);
      expect(result.pagination.totalPages).toBeGreaterThan(0);
    });

    it('should handle different page sizes', async () => {
      const result = await paginatedDataService.getPaginatedNFTs({
        page: 1,
        pageSize: 5
      });

      expect(result.data.length).toBeLessThanOrEqual(5);
      expect(result.pagination.pageSize).toBe(5);
    });

    it('should handle pagination correctly', async () => {
      const page1 = await paginatedDataService.getPaginatedNFTs({
        page: 1,
        pageSize: 10
      });

      const page2 = await paginatedDataService.getPaginatedNFTs({
        page: 2,
        pageSize: 10
      });

      expect(page1.pagination.page).toBe(1);
      expect(page2.pagination.page).toBe(2);
      expect(page1.pagination.totalItems).toBe(page2.pagination.totalItems);
      expect(page1.pagination.totalPages).toBe(page2.pagination.totalPages);

      // Data should be different between pages
      const page1Ids = page1.data.map(nft => nft.id);
      const page2Ids = page2.data.map(nft => nft.id);
      expect(page1Ids).not.toEqual(page2Ids);
    });

    it('should handle filters correctly', async () => {
      const allResults = await paginatedDataService.getPaginatedNFTs({
        page: 1,
        pageSize: 50
      });

      const filteredResults = await paginatedDataService.getPaginatedNFTs({
        page: 1,
        pageSize: 50,
        filters: { collections: ['Basic Shapes'] }
      });

      expect(filteredResults.data.length).toBeLessThanOrEqual(allResults.data.length);
      expect(filteredResults.pagination.totalItems).toBeLessThanOrEqual(allResults.pagination.totalItems);

      // All results should be from the filtered collection
      filteredResults.data.forEach(nft => {
        expect(nft.collection).toBe('Basic Shapes');
      });
    });

    it('should handle sorting correctly', async () => {
      const recentResults = await paginatedDataService.getPaginatedNFTs({
        page: 1,
        pageSize: 10,
        sortBy: SortOptions.RECENT
      });

      const nameResults = await paginatedDataService.getPaginatedNFTs({
        page: 1,
        pageSize: 10,
        sortBy: SortOptions.NAME_AZ
      });

      expect(recentResults.data.length).toBeGreaterThan(0);
      expect(nameResults.data.length).toBeGreaterThan(0);

      // Results should be different when sorted differently
      const recentIds = recentResults.data.map(nft => nft.id);
      const nameIds = nameResults.data.map(nft => nft.id);
      expect(recentIds).not.toEqual(nameIds);
    });

    it('should handle search query correctly', async () => {
      const searchResults = await paginatedDataService.getPaginatedNFTs({
        page: 1,
        pageSize: 50,
        filters: { query: 'Sphere' }
      });

      expect(searchResults.data.length).toBeGreaterThan(0);
      
      // Results should contain the search term in name or description
      searchResults.data.forEach(nft => {
        const searchableText = `${nft.name} ${nft.description || ''}`.toLowerCase();
        expect(searchableText).toContain('sphere');
      });
    });

    it('should validate pagination parameters', async () => {
      // Test invalid page number
      await expect(paginatedDataService.getPaginatedNFTs({
        page: 0,
        pageSize: 10
      })).rejects.toThrow('Page number must be greater than 0');

      // Test invalid page size
      await expect(paginatedDataService.getPaginatedNFTs({
        page: 1,
        pageSize: 100
      })).rejects.toThrow('Page size cannot exceed 50');
    });

    it('should handle empty results', async () => {
      const results = await paginatedDataService.getPaginatedNFTs({
        page: 1,
        pageSize: 10,
        filters: { query: 'nonexistent_search_term_that_should_not_match' }
      });

      expect(results.data).toEqual([]);
      expect(results.pagination.totalItems).toBe(0);
      expect(results.pagination.totalPages).toBe(0);
      expect(results.pagination.hasNextPage).toBe(false);
      expect(results.pagination.hasPreviousPage).toBe(false);
    });
  });

  describe('searchNFTs', () => {
    it('should search NFTs by query', async () => {
      const results = await paginatedDataService.searchNFTs('Cosmic');

      expect(results.data.length).toBeGreaterThan(0);
      results.data.forEach(nft => {
        const searchableText = `${nft.name} ${nft.description || ''}`.toLowerCase();
        expect(searchableText).toContain('cosmic');
      });
    });
  });

  describe('getNFTsByCollection', () => {
    it('should return NFTs from specific collection', async () => {
      const results = await paginatedDataService.getNFTsByCollection('Basic Shapes');

      expect(results.data.length).toBeGreaterThan(0);
      results.data.forEach(nft => {
        expect(nft.collection).toBe('Basic Shapes');
      });
    });
  });

  describe('getNFTsByCreator', () => {
    it('should return NFTs from specific creator', async () => {
      const results = await paginatedDataService.getNFTsByCreator('GeometryMaster');

      expect(results.data.length).toBeGreaterThan(0);
      results.data.forEach(nft => {
        expect(nft.creator).toBe('GeometryMaster');
      });
    });
  });

  describe('getFilterOptions', () => {
    it('should return available filter options', async () => {
      const options = await paginatedDataService.getFilterOptions();

      expect(options).toHaveProperty('collections');
      expect(options).toHaveProperty('creators');
      expect(options).toHaveProperty('rarities');
      expect(options).toHaveProperty('geometryTypes');

      expect(Array.isArray(options.collections)).toBe(true);
      expect(Array.isArray(options.creators)).toBe(true);
      expect(Array.isArray(options.rarities)).toBe(true);
      expect(Array.isArray(options.geometryTypes)).toBe(true);

      expect(options.collections.length).toBeGreaterThan(0);
      expect(options.creators.length).toBeGreaterThan(0);
      expect(options.rarities.length).toBeGreaterThan(0);
      expect(options.geometryTypes.length).toBeGreaterThan(0);
    });
  });

  describe('getFilteredCount', () => {
    it('should return count for filtered results', async () => {
      const count = await paginatedDataService.getFilteredCount({
        collections: ['Basic Shapes']
      });

      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
    });

    it('should return total count for empty filters', async () => {
      const count = await paginatedDataService.getFilteredCount({});

      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
    });
  });
});