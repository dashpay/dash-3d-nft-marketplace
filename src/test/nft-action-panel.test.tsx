import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NFTActionPanel } from '@/components/nft-details/NFTActionPanel';
import { NFT3D, NFTListing, NFTAuction } from '@/types/nft';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock window.location for share functionality
const mockLocation = {
  href: 'https://example.com/nft/123',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock NFT data
const mockNFT: NFT3D = {
  id: '1234567890abcdef1234567890abcdef12345678',
  name: 'Test NFT',
  ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
  geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
  geometryType: 'parametric',
  createdAt: 1672531200000,
  updatedAt: 1672531200000,
};

// Mock fixed price listing
const mockFixedListing: NFTListing = {
  id: 'listing-123',
  nftId: '1234567890abcdef1234567890abcdef12345678',
  sellerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
  listingType: 'fixed',
  price: '10.5',
  currency: 'DASH',
  status: 'active',
  createdAt: 1672531200000,
};

// Mock auction listing
const mockAuctionListing: NFTAuction = {
  id: 'auction-123',
  nftId: '1234567890abcdef1234567890abcdef12345678',
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
  endTime: 1672617600000, // 24 hours later
  totalBids: 3,
};

// Mock callbacks
const mockOnBuyNow = jest.fn();
const mockOnPlaceBid = jest.fn();
const mockOnCreateListing = jest.fn();

describe('NFTActionPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date.now() to return a fixed timestamp for consistent testing
    jest.spyOn(Date, 'now').mockReturnValue(1672531200000); // Same as start time
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe('Component Rendering', () => {
    it('renders action panel with correct title', () => {
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
    });

    it('renders platform and creator fee information', () => {
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
      
      expect(screen.getByText('Platform Fee')).toBeInTheDocument();
      expect(screen.getByText('2.5%')).toBeInTheDocument();
      expect(screen.getByText('Creator Fee')).toBeInTheDocument();
      expect(screen.getByText('5.0%')).toBeInTheDocument();
    });

    it('renders share button', () => {
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
      
      expect(screen.getByText('Share NFT')).toBeInTheDocument();
    });

    it('renders blockchain security message', () => {
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
      
      expect(screen.getByText('All transactions are secured by the Dash Platform blockchain')).toBeInTheDocument();
    });
  });

  describe('Owner Actions', () => {
    it('displays "List for Sale" button when owner has no listing', () => {
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
      
      expect(screen.getByText('List for Sale')).toBeInTheDocument();
    });

    it('calls onCreateListing when "List for Sale" button is clicked', () => {
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

    it('displays listing status when owner has active listing', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockFixedListing}
          isOwner={true}
          canPurchase={false}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('Your NFT is Listed')).toBeInTheDocument();
      expect(screen.getByText('Available for purchase')).toBeInTheDocument();
    });

    it('displays auction status when owner has active auction', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockAuctionListing}
          isOwner={true}
          canPurchase={false}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('Your NFT is Listed')).toBeInTheDocument();
      expect(screen.getByText('Auction is live')).toBeInTheDocument();
    });

    it('hides "List for Sale" button when owner has active listing', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockFixedListing}
          isOwner={true}
          canPurchase={false}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.queryByText('List for Sale')).not.toBeInTheDocument();
    });
  });

  describe('Fixed Price Listings', () => {
    it('displays fixed price listing information', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockFixedListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('Listed Price')).toBeInTheDocument();
      expect(screen.getByText('10.5 DASH')).toBeInTheDocument();
    });

    it('displays "Buy Now" button for fixed price listings', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockFixedListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('Buy Now for 10.5 DASH')).toBeInTheDocument();
    });

    it('calls onBuyNow when "Buy Now" button is clicked', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockFixedListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      const buyButton = screen.getByText('Buy Now for 10.5 DASH');
      fireEvent.click(buyButton);
      
      expect(mockOnBuyNow).toHaveBeenCalledTimes(1);
    });

    it('hides "Buy Now" button when user cannot purchase', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockFixedListing}
          isOwner={false}
          canPurchase={false}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.queryByText('Buy Now for 10.5 DASH')).not.toBeInTheDocument();
    });
  });

  describe('Auction Listings', () => {
    it('displays auction listing information', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockAuctionListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('Current Bid')).toBeInTheDocument();
      expect(screen.getByText('5.0 DASH')).toBeInTheDocument();
    });

    it('displays auction end time', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockAuctionListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('Auction ends in')).toBeInTheDocument();
      expect(screen.getByText('24h 0m remaining')).toBeInTheDocument();
    });

    it('displays minimum bid and bid count', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockAuctionListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('Minimum bid: 5.1 DASH')).toBeInTheDocument();
      expect(screen.getByText('3 bids')).toBeInTheDocument();
    });

    it('displays bid input field with correct placeholder', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockAuctionListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      const bidInput = screen.getByPlaceholderText('Min: 5.1');
      expect(bidInput).toBeInTheDocument();
      expect(bidInput).toHaveAttribute('type', 'number');
      expect(bidInput).toHaveAttribute('step', '0.1');
    });

    it('displays "Place Bid" button for auctions', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockAuctionListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('Place Bid')).toBeInTheDocument();
    });

    it('calls onPlaceBid when valid bid is submitted', async () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockAuctionListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      const bidInput = screen.getByPlaceholderText('Min: 5.1');
      const placeBidButton = screen.getByText('Place Bid');
      
      fireEvent.change(bidInput, { target: { value: '6.0' } });
      fireEvent.click(placeBidButton);
      
      await waitFor(() => {
        expect(mockOnPlaceBid).toHaveBeenCalledWith('6.0');
      });
    });

    it('disables bid button when bid amount is below minimum', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockAuctionListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      const bidInput = screen.getByPlaceholderText('Min: 5.1');
      const placeBidButton = screen.getByText('Place Bid');
      
      fireEvent.change(bidInput, { target: { value: '3.0' } });
      
      expect(placeBidButton).toBeDisabled();
    });

    it('disables bid button when no bid amount is entered', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockAuctionListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      const placeBidButton = screen.getByText('Place Bid');
      expect(placeBidButton).toBeDisabled();
    });

    it('shows loading state when placing bid', async () => {
      let resolveBid: (value: unknown) => void;
      const mockOnPlaceBidAsync = jest.fn(() => new Promise(resolve => {
        resolveBid = resolve;
      }));

      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockAuctionListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBidAsync}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      const bidInput = screen.getByPlaceholderText('Min: 5.1');
      const placeBidButton = screen.getByText('Place Bid');
      
      fireEvent.change(bidInput, { target: { value: '6.0' } });
      fireEvent.click(placeBidButton);
      
      expect(screen.getByText('Placing Bid...')).toBeInTheDocument();
      expect(placeBidButton).toBeDisabled();
      
      resolveBid!(undefined);
      await waitFor(() => {
        expect(screen.getByText('Place Bid')).toBeInTheDocument();
      });
    });

    it('clears bid input after successful bid', async () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockAuctionListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      const bidInput = screen.getByPlaceholderText('Min: 5.1') as HTMLInputElement;
      const placeBidButton = screen.getByText('Place Bid');
      
      fireEvent.change(bidInput, { target: { value: '6.0' } });
      expect(bidInput.value).toBe('6.0');
      
      fireEvent.click(placeBidButton);
      
      await waitFor(() => {
        expect(bidInput.value).toBe('');
      });
    });

    it('handles bid submission failure', async () => {
      const mockOnPlaceBidError = jest.fn().mockRejectedValue(new Error('Bid failed'));

      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockAuctionListing}
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
      
      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith('Bid failed:', expect.any(Error));
        expect(screen.getByText('Place Bid')).toBeInTheDocument();
      });
    });
  });

  describe('Time Remaining Calculations', () => {
    it('displays days and hours for long durations', () => {
      const longAuction = {
        ...mockAuctionListing,
        endTime: Date.now() + (2 * 24 * 60 * 60 * 1000) + (5 * 60 * 60 * 1000), // 2 days, 5 hours
      };

      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={longAuction}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('2d 5h remaining')).toBeInTheDocument();
    });

    it('displays hours and minutes for medium durations', () => {
      const mediumAuction = {
        ...mockAuctionListing,
        endTime: Date.now() + (3 * 60 * 60 * 1000) + (45 * 60 * 1000), // 3 hours, 45 minutes
      };

      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mediumAuction}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('3h 45m remaining')).toBeInTheDocument();
    });

    it('displays minutes for short durations', () => {
      const shortAuction = {
        ...mockAuctionListing,
        endTime: Date.now() + (30 * 60 * 1000), // 30 minutes
      };

      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={shortAuction}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('30m remaining')).toBeInTheDocument();
    });

    it('displays "Auction ended" for expired auctions', () => {
      const expiredAuction = {
        ...mockAuctionListing,
        endTime: Date.now() - (60 * 60 * 1000), // 1 hour ago
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
      
      expect(screen.getByText('Auction ended')).toBeInTheDocument();
    });
  });

  describe('Not Listed State', () => {
    it('displays "Not Listed" message when NFT is not listed and user is not owner', () => {
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
      
      expect(screen.getByText('Not Listed')).toBeInTheDocument();
      expect(screen.getByText('This NFT is not currently available for purchase')).toBeInTheDocument();
    });

    it('does not display "Not Listed" message when user is owner', () => {
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
      
      expect(screen.queryByText('Not Listed')).not.toBeInTheDocument();
    });
  });

  describe('Share Functionality', () => {
    it('copies current URL to clipboard when share button is clicked', () => {
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
      
      const shareButton = screen.getByText('Share NFT');
      fireEvent.click(shareButton);
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/nft/123');
    });
  });

  describe('Price Formatting', () => {
    it('formats numeric prices correctly', () => {
      const numericListing = { ...mockFixedListing, price: 15.75 };
      
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={numericListing as any}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('15.8 DASH')).toBeInTheDocument();
    });

    it('formats string prices correctly', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockFixedListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('10.5 DASH')).toBeInTheDocument();
    });
  });

  describe('Minimum Bid Calculation', () => {
    it('calculates minimum bid correctly with standard increment', () => {
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={mockAuctionListing}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      // Current price is 5.0, increment is 0.1, so minimum bid should be 5.1
      expect(screen.getByText('Minimum bid: 5.1 DASH')).toBeInTheDocument();
    });

    it('handles missing bid increment with default value', () => {
      const auctionWithoutIncrement = { ...mockAuctionListing, bidIncrement: undefined };
      
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={auctionWithoutIncrement as any}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      // Should use default increment of 0.1
      expect(screen.getByText('Minimum bid: 5.1 DASH')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing listing data gracefully', () => {
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
    });

    it('handles malformed auction data gracefully', () => {
      const malformedAuction = { ...mockAuctionListing, totalBids: undefined };
      
      render(
        <NFTActionPanel
          nft={mockNFT}
          listing={malformedAuction as any}
          isOwner={false}
          canPurchase={true}
          onBuyNow={mockOnBuyNow}
          onPlaceBid={mockOnPlaceBid}
          onCreateListing={mockOnCreateListing}
        />
      );
      
      expect(screen.getByText('0 bids')).toBeInTheDocument();
    });
  });
});