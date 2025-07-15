import { 
  NFT3D, 
  NFTTransfer, 
  NFTListing, 
  NFTAuction, 
  NFTBid, 
  SearchFilters, 
  SortOptions, 
  MarketplaceStats,
  ParametricGeometry,
  VoxelGeometry,
  ProceduralGeometry,
  Transform,
  parseGeometry3D,
  createParametricGeometry,
  estimateGeometrySize
} from '@/types/nft';

describe('NFT TypeScript Types', () => {
  describe('NFT3D Type', () => {
    it('should accept all required fields', () => {
      const nft: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      expect(nft.name).toBe('Test NFT');
      expect(nft.ownerId).toBe('5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk');
      expect(nft.geometryType).toBe('parametric');
    });

    it('should accept all optional fields', () => {
      const nft: NFT3D = {
        id: '1234567890abcdef',
        name: 'Test NFT',
        description: 'A test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        colors: ['#FF0000', '#00FF00', '#0000FF'],
        edition: 1,
        maxEditions: 100,
        createdAt: 1672531200000,
        updatedAt: 1672531200000,
        transferredAt: 1672617600000,
        transferredAtBlockHeight: 150000,
        transferredAtCoreBlockHeight: 850000,
        price: '10.5',
        collection: 'Test Collection',
        creator: 'Test Creator',
        rarity: 'Rare'
      };

      expect(nft.id).toBe('1234567890abcdef');
      expect(nft.description).toBe('A test NFT');
      expect(nft.colors).toEqual(['#FF0000', '#00FF00', '#0000FF']);
      expect(nft.edition).toBe(1);
      expect(nft.maxEditions).toBe(100);
      expect(nft.rarity).toBe('Rare');
    });

    it('should enforce correct geometry types', () => {
      const parametricNFT: NFT3D = {
        name: 'Parametric NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      const voxelNFT: NFT3D = {
        name: 'Voxel NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{}',
        geometryType: 'voxel',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      const proceduralNFT: NFT3D = {
        name: 'Procedural NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{}',
        geometryType: 'procedural',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      expect(parametricNFT.geometryType).toBe('parametric');
      expect(voxelNFT.geometryType).toBe('voxel');
      expect(proceduralNFT.geometryType).toBe('procedural');
    });

    it('should enforce correct rarity values', () => {
      const rarities: NFT3D['rarity'][] = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];
      
      rarities.forEach(rarity => {
        const nft: NFT3D = {
          name: 'Test NFT',
          ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
          geometry3d: '{}',
          geometryType: 'parametric',
          createdAt: 1672531200000,
          updatedAt: 1672531200000,
          rarity
        };

        expect(nft.rarity).toBe(rarity);
      });
    });
  });

  describe('NFTTransfer Type', () => {
    it('should accept all required fields', () => {
      const transfer: NFTTransfer = {
        nftId: '1234567890abcdef',
        fromId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        toId: '7FcQvuJm8EtRpLqY9NxVd2HkS6T3Wf1Xb4Ac9Zn2Mp8K',
        timestamp: 1672531200000,
        blockHeight: 150000,
        coreBlockHeight: 850000
      };

      expect(transfer.nftId).toBe('1234567890abcdef');
      expect(transfer.fromId).toBe('5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk');
      expect(transfer.toId).toBe('7FcQvuJm8EtRpLqY9NxVd2HkS6T3Wf1Xb4Ac9Zn2Mp8K');
      expect(transfer.timestamp).toBe(1672531200000);
      expect(transfer.blockHeight).toBe(150000);
      expect(transfer.coreBlockHeight).toBe(850000);
    });
  });

  describe('NFTListing Type', () => {
    it('should accept all required fields', () => {
      const listing: NFTListing = {
        id: 'listing-123',
        nftId: '1234567890abcdef',
        sellerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        listingType: 'fixed',
        price: '10.5',
        currency: 'DASH',
        status: 'active',
        createdAt: 1672531200000
      };

      expect(listing.listingType).toBe('fixed');
      expect(listing.price).toBe('10.5');
      expect(listing.currency).toBe('DASH');
      expect(listing.status).toBe('active');
    });

    it('should accept all optional fields', () => {
      const listing: NFTListing = {
        id: 'listing-123',
        nftId: '1234567890abcdef',
        sellerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        listingType: 'auction',
        price: '10.5',
        startingPrice: '1.0',
        currentPrice: '5.0',
        currency: 'DASH',
        status: 'active',
        createdAt: 1672531200000,
        expiresAt: 1672617600000,
        views: 150,
        favorites: 25
      };

      expect(listing.startingPrice).toBe('1.0');
      expect(listing.currentPrice).toBe('5.0');
      expect(listing.expiresAt).toBe(1672617600000);
      expect(listing.views).toBe(150);
      expect(listing.favorites).toBe(25);
    });

    it('should enforce correct listing types', () => {
      const fixedListing: NFTListing = {
        id: 'listing-123',
        nftId: '1234567890abcdef',
        sellerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        listingType: 'fixed',
        price: '10.5',
        currency: 'DASH',
        status: 'active',
        createdAt: 1672531200000
      };

      const auctionListing: NFTListing = {
        id: 'listing-123',
        nftId: '1234567890abcdef',
        sellerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        listingType: 'auction',
        price: '10.5',
        currency: 'DASH',
        status: 'active',
        createdAt: 1672531200000
      };

      expect(fixedListing.listingType).toBe('fixed');
      expect(auctionListing.listingType).toBe('auction');
    });

    it('should enforce correct status values', () => {
      const statuses: NFTListing['status'][] = ['active', 'sold', 'cancelled', 'expired'];
      
      statuses.forEach(status => {
        const listing: NFTListing = {
          id: 'listing-123',
          nftId: '1234567890abcdef',
          sellerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
          listingType: 'fixed',
          price: '10.5',
          currency: 'DASH',
          status,
          createdAt: 1672531200000
        };

        expect(listing.status).toBe(status);
      });
    });
  });

  describe('NFTAuction Type', () => {
    it('should extend NFTListing with auction-specific fields', () => {
      const auction: NFTAuction = {
        id: 'auction-123',
        nftId: '1234567890abcdef',
        sellerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        listingType: 'auction',
        price: '5.0',
        startingPrice: '1.0',
        currentPrice: '5.0',
        currency: 'DASH',
        status: 'active',
        createdAt: 1672531200000,
        reservePrice: '10.0',
        bidIncrement: '0.1',
        startTime: 1672531200000,
        endTime: 1672617600000,
        totalBids: 5,
        highestBidder: '7FcQvuJm8EtRpLqY9NxVd2HkS6T3Wf1Xb4Ac9Zn2Mp8K'
      };

      expect(auction.listingType).toBe('auction');
      expect(auction.startingPrice).toBe('1.0');
      expect(auction.currentPrice).toBe('5.0');
      expect(auction.reservePrice).toBe('10.0');
      expect(auction.bidIncrement).toBe('0.1');
      expect(auction.startTime).toBe(1672531200000);
      expect(auction.endTime).toBe(1672617600000);
      expect(auction.totalBids).toBe(5);
      expect(auction.highestBidder).toBe('7FcQvuJm8EtRpLqY9NxVd2HkS6T3Wf1Xb4Ac9Zn2Mp8K');
    });
  });

  describe('NFTBid Type', () => {
    it('should accept all required fields', () => {
      const bid: NFTBid = {
        id: 'bid-123',
        auctionId: 'auction-123',
        bidderId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        amount: '5.0',
        currency: 'DASH',
        timestamp: 1672531200000,
        status: 'active'
      };

      expect(bid.id).toBe('bid-123');
      expect(bid.auctionId).toBe('auction-123');
      expect(bid.bidderId).toBe('5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk');
      expect(bid.amount).toBe('5.0');
      expect(bid.currency).toBe('DASH');
      expect(bid.timestamp).toBe(1672531200000);
      expect(bid.status).toBe('active');
    });

    it('should enforce correct bid status values', () => {
      const statuses: NFTBid['status'][] = ['active', 'outbid', 'winning', 'cancelled'];
      
      statuses.forEach(status => {
        const bid: NFTBid = {
          id: 'bid-123',
          auctionId: 'auction-123',
          bidderId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
          amount: '5.0',
          currency: 'DASH',
          timestamp: 1672531200000,
          status
        };

        expect(bid.status).toBe(status);
      });
    });
  });

  describe('SearchFilters Type', () => {
    it('should accept all optional fields', () => {
      const filters: SearchFilters = {
        query: 'test nft',
        collections: ['Collection 1', 'Collection 2'],
        creators: ['Creator 1', 'Creator 2'],
        priceRange: {
          min: 1.0,
          max: 100.0
        },
        rarity: ['Rare', 'Epic'],
        listingType: ['fixed', 'auction'],
        status: ['active', 'sold'],
        geometryType: ['parametric', 'voxel']
      };

      expect(filters.query).toBe('test nft');
      expect(filters.collections).toEqual(['Collection 1', 'Collection 2']);
      expect(filters.creators).toEqual(['Creator 1', 'Creator 2']);
      expect(filters.priceRange).toEqual({ min: 1.0, max: 100.0 });
      expect(filters.rarity).toEqual(['Rare', 'Epic']);
      expect(filters.listingType).toEqual(['fixed', 'auction']);
      expect(filters.status).toEqual(['active', 'sold']);
      expect(filters.geometryType).toEqual(['parametric', 'voxel']);
    });

    it('should accept empty filters object', () => {
      const filters: SearchFilters = {};
      expect(filters).toEqual({});
    });
  });

  describe('SortOptions Enum', () => {
    it('should have all expected sort options', () => {
      expect(SortOptions.RECENT).toBe('recent');
      expect(SortOptions.PRICE_LOW).toBe('price-low');
      expect(SortOptions.PRICE_HIGH).toBe('price-high');
      expect(SortOptions.NAME_AZ).toBe('name-az');
      expect(SortOptions.NAME_ZA).toBe('name-za');
      expect(SortOptions.ENDING_SOON).toBe('ending-soon');
      expect(SortOptions.MOST_BIDS).toBe('most-bids');
      expect(SortOptions.RARITY).toBe('rarity');
    });
  });

  describe('MarketplaceStats Type', () => {
    it('should accept all required fields', () => {
      const stats: MarketplaceStats = {
        totalListings: 1250,
        totalVolume: '15000.5',
        floorPrice: '0.5',
        averagePrice: '12.5',
        activeAuctions: 35,
        soldToday: 85
      };

      expect(stats.totalListings).toBe(1250);
      expect(stats.totalVolume).toBe('15000.5');
      expect(stats.floorPrice).toBe('0.5');
      expect(stats.averagePrice).toBe('12.5');
      expect(stats.activeAuctions).toBe(35);
      expect(stats.soldToday).toBe(85);
    });
  });

  describe('Geometry Types', () => {
    it('should accept ParametricGeometry', () => {
      const geometry: ParametricGeometry = {
        type: 'parametric',
        shape: 'sphere',
        params: [1, 32, 32],
        transforms: [
          {
            type: 'translate',
            values: [0, 0, 0]
          },
          {
            type: 'rotate',
            values: [0, 0, 0]
          },
          {
            type: 'scale',
            values: [1, 1, 1]
          }
        ]
      };

      expect(geometry.type).toBe('parametric');
      expect(geometry.shape).toBe('sphere');
      expect(geometry.params).toEqual([1, 32, 32]);
      expect(geometry.transforms).toHaveLength(3);
    });

    it('should accept VoxelGeometry', () => {
      const geometry: VoxelGeometry = {
        type: 'voxel',
        size: [8, 8, 8],
        data: 'base64encodeddata'
      };

      expect(geometry.type).toBe('voxel');
      expect(geometry.size).toEqual([8, 8, 8]);
      expect(geometry.data).toBe('base64encodeddata');
    });

    it('should accept ProceduralGeometry', () => {
      const geometry: ProceduralGeometry = {
        type: 'procedural',
        seed: 12345,
        algorithm: 'fractal',
        params: {
          iterations: 5,
          scale: 2.0,
          complexity: 0.5
        }
      };

      expect(geometry.type).toBe('procedural');
      expect(geometry.seed).toBe(12345);
      expect(geometry.algorithm).toBe('fractal');
      expect(geometry.params).toEqual({
        iterations: 5,
        scale: 2.0,
        complexity: 0.5
      });
    });

    it('should accept Transform', () => {
      const translate: Transform = {
        type: 'translate',
        values: [1, 2, 3]
      };

      const rotate: Transform = {
        type: 'rotate',
        values: [0, 90, 0]
      };

      const scale: Transform = {
        type: 'scale',
        values: [2, 2, 2]
      };

      expect(translate.type).toBe('translate');
      expect(translate.values).toEqual([1, 2, 3]);
      expect(rotate.type).toBe('rotate');
      expect(rotate.values).toEqual([0, 90, 0]);
      expect(scale.type).toBe('scale');
      expect(scale.values).toEqual([2, 2, 2]);
    });
  });

  describe('Geometry Helper Functions', () => {
    describe('parseGeometry3D', () => {
      it('should parse valid JSON geometry data', () => {
        const geometryData = '{"type":"parametric","shape":"sphere","params":[1,32,32]}';
        const parsed = parseGeometry3D(geometryData, 'parametric');
        
        expect(parsed).toEqual({
          type: 'parametric',
          shape: 'sphere',
          params: [1, 32, 32]
        });
      });

      it('should return null for invalid JSON', () => {
        const invalidGeometry = 'invalid json';
        const parsed = parseGeometry3D(invalidGeometry, 'parametric');
        
        expect(parsed).toBeNull();
      });
    });

    describe('createParametricGeometry', () => {
      it('should create parametric geometry JSON string', () => {
        const geometryString = createParametricGeometry('sphere', [1, 32, 32]);
        const parsed = JSON.parse(geometryString);
        
        expect(parsed).toEqual({
          type: 'parametric',
          shape: 'sphere',
          params: [1, 32, 32]
        });
      });

      it('should create parametric geometry with transforms', () => {
        const transforms: Transform[] = [
          { type: 'translate', values: [0, 0, 0] },
          { type: 'scale', values: [2, 2, 2] }
        ];
        
        const geometryString = createParametricGeometry('cube', [1, 1, 1], transforms);
        const parsed = JSON.parse(geometryString);
        
        expect(parsed).toEqual({
          type: 'parametric',
          shape: 'cube',
          params: [1, 1, 1],
          transforms
        });
      });
    });

    describe('estimateGeometrySize', () => {
      it('should estimate geometry size in bytes', () => {
        const geometry = '{"type":"parametric","shape":"sphere","params":[1,32,32]}';
        const size = estimateGeometrySize(geometry);
        
        expect(size).toBe(geometry.length);
      });

      it('should handle empty geometry', () => {
        const size = estimateGeometrySize('');
        expect(size).toBe(0);
      });

      it('should handle large geometry data', () => {
        const largeGeometry = 'x'.repeat(10000);
        const size = estimateGeometrySize(largeGeometry);
        expect(size).toBe(10000);
      });
    });
  });

  describe('Type Compatibility', () => {
    it('should allow NFTAuction to be used as NFTListing', () => {
      const auction: NFTAuction = {
        id: 'auction-123',
        nftId: '1234567890abcdef',
        sellerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        listingType: 'auction',
        price: '5.0',
        startingPrice: '1.0',
        currentPrice: '5.0',
        currency: 'DASH',
        status: 'active',
        createdAt: 1672531200000,
        bidIncrement: '0.1',
        startTime: 1672531200000,
        endTime: 1672617600000,
        totalBids: 5
      };

      // This should not cause TypeScript errors
      const listing: NFTListing = auction;
      expect(listing.listingType).toBe('auction');
    });

    it('should allow union types for listings', () => {
      const fixedListing: NFTListing = {
        id: 'listing-123',
        nftId: '1234567890abcdef',
        sellerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        listingType: 'fixed',
        price: '10.5',
        currency: 'DASH',
        status: 'active',
        createdAt: 1672531200000
      };

      const auctionListing: NFTAuction = {
        id: 'auction-123',
        nftId: '1234567890abcdef',
        sellerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        listingType: 'auction',
        price: '5.0',
        startingPrice: '1.0',
        currentPrice: '5.0',
        currency: 'DASH',
        status: 'active',
        createdAt: 1672531200000,
        bidIncrement: '0.1',
        startTime: 1672531200000,
        endTime: 1672617600000,
        totalBids: 5
      };

      const listings: (NFTListing | NFTAuction)[] = [fixedListing, auctionListing];
      expect(listings).toHaveLength(2);
    });
  });
});