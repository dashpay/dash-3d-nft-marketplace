import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NFTOwnershipSection } from '@/components/nft-details/NFTOwnershipSection';
import { NFT3D } from '@/types/nft';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock NFT data for testing
const mockNFT: NFT3D = {
  id: '1234567890abcdef1234567890abcdef12345678',
  name: 'Test NFT',
  description: 'A test 3D NFT for unit testing',
  ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
  geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
  geometryType: 'parametric',
  createdAt: 1672531200000, // 2023-01-01 00:00:00
  updatedAt: 1672531200000,
  transferredAt: 1672617600000, // 2023-01-02 00:00:00
  creator: 'Test Creator'
};

const mockNFTWithoutCreator: NFT3D = {
  id: '1234567890abcdef1234567890abcdef12345678',
  name: 'Test NFT',
  ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
  geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
  geometryType: 'parametric',
  createdAt: 1672531200000,
  updatedAt: 1672531200000
};

const mockNFTWithoutTransfer: NFT3D = {
  id: '1234567890abcdef1234567890abcdef12345678',
  name: 'Test NFT',
  ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
  geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
  geometryType: 'parametric',
  createdAt: 1672531200000,
  updatedAt: 1672531200000,
  creator: 'Test Creator'
};

describe('NFTOwnershipSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date.now() to return a fixed timestamp for consistent testing
    jest.spyOn(Date, 'now').mockReturnValue(1672704000000); // 2023-01-03 00:00:00
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe('Component Rendering', () => {
    it('renders ownership section with correct title', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('Ownership & Creator')).toBeInTheDocument();
    });

    it('renders current owner information', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('Current Owner')).toBeInTheDocument();
      expect(screen.getByText('5DbLwAxG...25XB5Bk')).toBeInTheDocument();
    });

    it('renders creator information when available', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('Creator')).toBeInTheDocument();
      expect(screen.getByText('Test Creator')).toBeInTheDocument();
      expect(screen.getByText('Original Creator')).toBeInTheDocument();
    });

    it('hides creator section when creator is not available', () => {
      render(<NFTOwnershipSection nft={mockNFTWithoutCreator} isCurrentUser={false} />);
      
      expect(screen.queryByText('Creator')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Creator')).not.toBeInTheDocument();
    });

    it('renders ownership statistics', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('Ownership Statistics')).toBeInTheDocument();
      expect(screen.getByText('Days Owned')).toBeInTheDocument();
      expect(screen.getByText('Total Transfers')).toBeInTheDocument();
    });

    it('renders verification badge', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('Verified on Dash Platform')).toBeInTheDocument();
      expect(screen.getByText('Ownership verified through blockchain consensus')).toBeInTheDocument();
    });
  });

  describe('Current User Ownership', () => {
    it('displays "You" badge when user is the current owner', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={true} />);
      
      expect(screen.getByText('You')).toBeInTheDocument();
    });

    it('does not display "You" badge when user is not the current owner', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.queryByText('You')).not.toBeInTheDocument();
    });

    it('displays "You" as owner name when user is the current owner', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={true} />);
      
      const ownerNameElements = screen.getAllByText('You');
      expect(ownerNameElements).toHaveLength(2); // One in badge, one as owner name
    });

    it('displays formatted owner ID when user is not the current owner', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('5DbLwAxG...25XB5Bk')).toBeInTheDocument();
    });
  });

  describe('ID Formatting', () => {
    it('formats long identity IDs correctly', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('5DbLwAxG...25XB5Bk')).toBeInTheDocument();
    });

    it('does not truncate short identity IDs', () => {
      const shortIdNFT = { ...mockNFT, ownerId: 'shortId123' };
      render(<NFTOwnershipSection nft={shortIdNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('shortId123')).toBeInTheDocument();
    });

    it('formats creator names without truncation', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('Test Creator')).toBeInTheDocument();
    });
  });

  describe('Copy to Clipboard Functionality', () => {
    it('copies owner ID to clipboard when copy button is clicked', async () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      const copyButtons = screen.getAllByTitle('Copy owner ID');
      fireEvent.click(copyButtons[0]);
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockNFT.ownerId);
      });
    });

    it('copies creator name to clipboard when creator copy button is clicked', async () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      const copyButton = screen.getByTitle('Copy creator name');
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test Creator');
      });
    });

    it('handles clipboard copy failure gracefully', async () => {
      const mockWriteText = jest.fn().mockRejectedValue(new Error('Clipboard access denied'));
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });

      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      const copyButtons = screen.getAllByTitle('Copy owner ID');
      fireEvent.click(copyButtons[0]);
      
      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith('Failed to copy to clipboard:', expect.any(Error));
      });
    });
  });

  describe('Avatar Generation', () => {
    it('generates avatar initials from owner ID', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('5D')).toBeInTheDocument();
    });

    it('generates avatar initials from creator name', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('TE')).toBeInTheDocument();
    });

    it('uses uppercase for avatar initials', () => {
      const lowerCaseCreatorNFT = { ...mockNFT, creator: 'test creator' };
      render(<NFTOwnershipSection nft={lowerCaseCreatorNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('TE')).toBeInTheDocument();
    });
  });

  describe('Ownership Statistics', () => {
    it('calculates days owned based on transfer date', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      // Mock current time is 2023-01-03, transfer was 2023-01-02
      // So 1 day has passed
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('calculates days owned based on creation date when no transfer', () => {
      render(<NFTOwnershipSection nft={mockNFTWithoutTransfer} isCurrentUser={false} />);
      
      // Mock current time is 2023-01-03, creation was 2023-01-01
      // So 2 days have passed
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('displays total transfers count', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Total Transfers')).toBeInTheDocument();
    });
  });

  describe('Styling and Visual Elements', () => {
    it('applies correct gradient classes to owner avatar', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      const ownerAvatar = screen.getByText('5D').closest('div');
      expect(ownerAvatar).toHaveClass('bg-gradient-to-br', 'from-[#00D4FF]', 'to-[#8B5CF6]');
    });

    it('applies correct gradient classes to creator avatar', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      const creatorAvatar = screen.getByText('TE').closest('div');
      expect(creatorAvatar).toHaveClass('bg-gradient-to-br', 'from-[#8B5CF6]', 'to-[#FF0080]');
    });

    it('applies correct styling to "You" badge', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={true} />);
      
      const youBadge = screen.getByText('You');
      expect(youBadge).toHaveClass('text-green-400');
    });

    it('applies correct styling to verification badge', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      const verificationBadge = screen.getByText('Verified on Dash Platform');
      expect(verificationBadge).toHaveClass('text-white', 'font-medium');
    });
  });

  describe('Error Handling', () => {
    it('handles missing NFT data gracefully', () => {
      const incompleteNFT = {
        name: 'Test NFT',
        ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
        geometry3d: '{}',
        geometryType: 'parametric' as const,
        createdAt: 1672531200000,
        updatedAt: 1672531200000
      };

      render(<NFTOwnershipSection nft={incompleteNFT} isCurrentUser={false} />);
      
      expect(screen.getByText('Ownership & Creator')).toBeInTheDocument();
      expect(screen.getByText('5DbLwAxG...25XB5Bk')).toBeInTheDocument();
    });

    it('handles null/undefined creator gracefully', () => {
      const nftWithNullCreator = { ...mockNFT, creator: null };
      render(<NFTOwnershipSection nft={nftWithNullCreator as any} isCurrentUser={false} />);
      
      expect(screen.queryByText('Creator')).not.toBeInTheDocument();
    });

    it('handles empty string creator gracefully', () => {
      const nftWithEmptyCreator = { ...mockNFT, creator: '' };
      render(<NFTOwnershipSection nft={nftWithEmptyCreator} isCurrentUser={false} />);
      
      expect(screen.queryByText('Creator')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper titles for copy buttons', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.getByTitle('Copy owner ID')).toBeInTheDocument();
      expect(screen.getByTitle('Copy creator name')).toBeInTheDocument();
    });

    it('uses semantic HTML structure', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Ownership & Creator');
      expect(screen.getByRole('heading', { level: 3, name: 'Current Owner' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Creator' })).toBeInTheDocument();
    });

    it('provides interactive elements with proper hover states', () => {
      render(<NFTOwnershipSection nft={mockNFT} isCurrentUser={false} />);
      
      const copyButtons = screen.getAllByRole('button');
      copyButtons.forEach(button => {
        expect(button).toHaveClass('hover:bg-white/10');
      });
    });
  });
});