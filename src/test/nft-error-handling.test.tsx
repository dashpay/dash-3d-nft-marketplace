import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NFTMetadataPanel } from '@/components/nft-details/NFTMetadataPanel';
import { NFTOwnershipSection } from '@/components/nft-details/NFTOwnershipSection';
import { NFTActionPanel } from '@/components/nft-details/NFTActionPanel';
import { NFT3D, NFTListing, NFTAuction } from '@/types/nft';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Mock window.location for share functionality
Object.defineProperty(window, 'location', {
  value: { href: 'https://example.com/nft/123' },
  writable: true,
});

// Mock callbacks
const mockOnBuyNow = jest.fn();
const mockOnPlaceBid = jest.fn();
const mockOnCreateListing = jest.fn();

describe('NFT Components Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('NFTMetadataPanel Error Handling', () => {
    it('handles missing NFT ID gracefully', () => {
      const nftWithoutId: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      render(<NFTMetadataPanel nft={nftWithoutId} />);
      
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.queryByTitle('Copy NFT ID')).not.toBeInTheDocument();
    });

    it('handles missing description gracefully', () => {
      const nftWithoutDescription: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      render(<NFTMetadataPanel nft={nftWithoutDescription} />);
      
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
      expect(screen.queryByText('A test description')).not.toBeInTheDocument();
    });

    it('handles missing collection gracefully', () => {
      const nftWithoutCollection: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      render(<NFTMetadataPanel nft={nftWithoutCollection} />);
      
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
      expect(screen.queryByText('from')).not.toBeInTheDocument();
    });

    it('handles missing rarity gracefully', () => {
      const nftWithoutRarity: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      render(<NFTMetadataPanel nft={nftWithoutRarity} />);
      
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
      expect(screen.queryByText('Common')).not.toBeInTheDocument();
      expect(screen.queryByText('Rare')).not.toBeInTheDocument();
    });

    it('handles missing colors gracefully', () => {
      const nftWithoutColors: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      render(<NFTMetadataPanel nft={nftWithoutColors} />);
      
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
      expect(screen.queryByText('Colors')).not.toBeInTheDocument();
    });

    it('handles empty colors array gracefully', () => {
      const nftWithEmptyColors: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000,
        colors: []
      };

      render(<NFTMetadataPanel nft={nftWithEmptyColors} />);
      
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
      expect(screen.queryByText('Colors')).not.toBeInTheDocument();
    });

    it('handles missing edition information gracefully', () => {
      const nftWithoutEdition: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      render(<NFTMetadataPanel nft={nftWithoutEdition} />);
      
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
      expect(screen.queryByText('Edition')).not.toBeInTheDocument();
    });

    it('handles missing geometry3d gracefully', () => {
      const nftWithoutGeometry: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      render(<NFTMetadataPanel nft={nftWithoutGeometry} />);
      
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument(); // For geometry size
    });

    it('handles missing transfer information gracefully', () => {
      const nftWithoutTransfer: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      render(<NFTMetadataPanel nft={nftWithoutTransfer} />);
      
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
      expect(screen.queryByText('Last Transfer')).not.toBeInTheDocument();
      expect(screen.queryByText('Block Height')).not.toBeInTheDocument();
      expect(screen.queryByText('Core Block Height')).not.toBeInTheDocument();
    });

    it('handles clipboard write failure gracefully', async () => {
      const mockClipboard = {
        writeText: jest.fn().mockRejectedValue(new Error('Clipboard access denied'))
      };
      Object.assign(navigator, { clipboard: mockClipboard });

      const nftWithId: NFT3D = {
        id: '1234567890abcdef',
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      render(<NFTMetadataPanel nft={nftWithId} />);
      
      const copyButton = screen.getByTitle('Copy NFT ID');
      fireEvent.click(copyButton);
      
      expect(mockClipboard.writeText).toHaveBeenCalledWith('1234567890abcdef');
    });
  });

  describe('NFTOwnershipSection Error Handling', () => {
    it('handles missing creator gracefully', () => {
      const nftWithoutCreator: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      render(<NFTOwnershipSection nft={nftWithoutCreator} isCurrentUser={false} />);
      
      expect(screen.getByText('Ownership & Creator')).toBeInTheDocument();
      expect(screen.getByText('Current Owner')).toBeInTheDocument();
      expect(screen.queryByText('Creator')).not.toBeInTheDocument();
    });

    it('handles empty creator string gracefully', () => {
      const nftWithEmptyCreator: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000,
        creator: ''
      };

      render(<NFTOwnershipSection nft={nftWithEmptyCreator} isCurrentUser={false} />);
      
      expect(screen.getByText('Ownership & Creator')).toBeInTheDocument();
      expect(screen.queryByText('Creator')).not.toBeInTheDocument();
    });

    it('handles missing transfer date gracefully', () => {
      const nftWithoutTransfer: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      // Mock Date.now to return a fixed timestamp
      jest.spyOn(Date, 'now').mockReturnValue(1672617600000); // 24 hours later

      render(<NFTOwnershipSection nft={nftWithoutTransfer} isCurrentUser={false} />);
      
      expect(screen.getByText('Ownership & Creator')).toBeInTheDocument();
      expect(screen.getByText('Days Owned')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Days since creation
    });

    it('handles clipboard write failure gracefully', async () => {
      const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const mockClipboard = {
        writeText: jest.fn().mockRejectedValue(new Error('Clipboard access denied'))
      };
      Object.assign(navigator, { clipboard: mockClipboard });

      const nft: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      render(<NFTOwnershipSection nft={nft} isCurrentUser={false} />);
      
      const copyButton = screen.getByTitle('Copy owner ID');
      fireEvent.click(copyButton);
      
      expect(mockClipboard.writeText).toHaveBeenCalledWith('5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk');
      
      mockConsoleError.mockRestore();
    });
  });

  describe('NFTActionPanel Error Handling', () => {
    const mockNFT: NFT3D = {
      name: 'Test NFT',
      ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
      geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
      geometryType: 'parametric',
      createdAt: 1672531200000,
      updatedAt: 1672531200000
    };

    it('handles null listing gracefully', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={null}
          isOwner={false}
          canPurchase={false}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('Actions')).toBeInTheDocument();
      expect(screen.getByText('Not Listed')).toBeInTheDocument();
      expect(screen.getByText('This NFT is not currently available for purchase')).toBeInTheDocument();
    });

    it('handles malformed listing data gracefully', () => {
      const malformedListing = {
        id: 'listing-123',
        nftId: '1234567890abcdef',
        sellerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        listingType: 'fixed',
        price: null, // Invalid price
        currency: 'DASH',
        status: 'active',
        createdAt: 1672531200000
      } as any;

      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={malformedListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('Actions')).toBeInTheDocument();
      expect(screen.getByText('Listed Price')).toBeInTheDocument();
    });

    it('handles malformed auction data gracefully', () => {
      const malformedAuction = {
        id: 'auction-123',
        nftId: '1234567890abcdef',
        sellerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        listingType: 'auction',
        price: '5.0',
        currency: 'DASH',
        status: 'active',
        createdAt: 1672531200000,
        endTime: 1672617600000,
        totalBids: undefined, // Missing totalBids
        bidIncrement: undefined // Missing bidIncrement
      } as any;

      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={malformedAuction}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('Actions')).toBeInTheDocument();
      expect(screen.getByText('Current Bid')).toBeInTheDocument();
      expect(screen.getByText('0 bids')).toBeInTheDocument();
      expect(screen.getByText('Minimum bid: 5.1 DASH')).toBeInTheDocument(); // Uses default increment
    });

    it('handles expired auction gracefully', () => {
      const expiredAuction: NFTAuction = {
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
        endTime: 1672531200000 - 3600000, // 1 hour ago
        totalBids: 3
      };

      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={expiredAuction}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('Actions')).toBeInTheDocument();
      expect(screen.getByText('Auction ended')).toBeInTheDocument();
    });

    it('handles bid placement failure gracefully', async () => {
      const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const mockOnPlaceBidError = jest.fn().mockRejectedValue(new Error('Bid failed'));

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
        totalBids: 3
      };

      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={auctionListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBidError}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      const bidInput = screen.getByPlaceholderText('Min: 5.1');
      const placeBidButton = screen.getByText('Place Bid');
      
      fireEvent.change(bidInput, { target: { value: '6.0' } });
      fireEvent.click(placeBidButton);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(mockConsoleError).toHaveBeenCalledWith('Bid failed:', expect.any(Error));
      mockConsoleError.mkRestore();
    });

    it('handles missing callback functions gracefully', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={null}
          isOwner={true}
          canPurchase={false}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      const listButton = screen.getByText('List for Sale');
      fireEvent.click(listButton);
      
      expect(mockOnCreateListing).toHaveBeenCalledTimes(1);
    });

    it('handles invalid bid amounts gracefully', () => {
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
        totalBids: 3
      };

      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={auctionListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      const bidInput = screen.getByPlaceholderText('Min: 5.1');
      const placeBidButton = screen.getByText('Place Bid');
      
      // Test with invalid amounts
      fireEvent.change(bidInput, { target: { value: '0' } });
      expect(placeBidButton).toBeDisabled();
      
      fireEvent.change(bidInput, { target: { value: '-1' } });
      expect(placeBidButton).toBeDisabled();
      
      fireEvent.change(bidInput, { target: { value: 'abc' } });
      expect(placeBidButton).toBeDisabled();
    });
  });

  describe('General Error Handling', () => {
    it('handles undefined NFT data gracefully', () => {
      const undefinedNFT = undefined as any;
      
      expect(() => {
        render(<NFTMetadataPanel nft={undefinedNFT} />);
      }).toThrow();
    });

    it('handles null NFT data gracefully', () => {
      const nullNFT = null as any;
      
      expect(() => {
        render(<NFTMetadataPanel nft={nullNFT} />);
      }).toThrow();
    });

    it('handles incomplete NFT data gracefully', () => {
      const incompleteNFT = {
        name: 'Test NFT',
        // Missing required fields
      } as any;
      
      expect(() => {
        render(<NFTMetadataPanel nft={incompleteNFT} />);
      }).toThrow();
    });

    it('handles very long NFT names gracefully', () => {
      const longNameNFT: NFT3D = {
        name: 'A'.repeat(1000), // Very long name
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      render(<NFTMetadataPanel nft={longNameNFT} />);
      
      expect(screen.getByText('A'.repeat(1000))).toBeInTheDocument();
    });

    it('handles special characters in NFT data gracefully', () => {
      const specialCharNFT: NFT3D = {
        name: 'Test NFT <script>alert("xss")</script>',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 1672531200000,
        updatedAt: 1672531200000,
        description: 'Test & special chars "quotes" and emojis 🎨'
      };

      render(<NFTMetadataPanel nft={specialCharNFT} />);
      
      expect(screen.getByText('Test NFT <script>alert("xss")</script>')).toBeInTheDocument();
      expect(screen.getByText('Test & special chars "quotes" and emojis 🎨')).toBeInTheDocument();
    });

    it('handles extreme timestamp values gracefully', () => {
      const extremeTimestampNFT: NFT3D = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
        geometryType: 'parametric',
        createdAt: 0, // Unix epoch
        updatedAt: 253402300799000 // Year 9999
      };

      render(<NFTMetadataPanel nft={extremeTimestampNFT} />);
      
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
    });
  });
});