import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NFTMetadataPanel } from '@/components/nft-details/NFTMetadataPanel';
import { NFT3D } from '@/types/nft';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock NFT data for testing
const mockNFT: NFT3D = {
  id: '1234567890abcdef1234567890abcdef12345678',
  name: 'Test NFT',
  description: 'A test 3D NFT for unit testing',
  ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
  geometry3d: '{"type":"parametric","shape":"sphere","params":[1,32,32]}',
  geometryType: 'parametric',
  colors: ['#FF0000', '#00FF00', '#0000FF'],
  edition: 1,
  maxEditions: 100,
  createdAt: 1672531200000, // 2023-01-01 00:00:00
  updatedAt: 1672531200000,
  transferredAt: 1672617600000, // 2023-01-02 00:00:00
  transferredAtBlockHeight: 150000,
  transferredAtCoreBlockHeight: 850000,
  price: '10.5',
  collection: 'Test Collection',
  creator: 'Test Creator',
  rarity: 'Rare'
};

const mockNFTMinimal: NFT3D = {
  name: 'Minimal NFT',
  ownerId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
  geometry3d: '{"type":"voxel","size":[8,8,8],"data":"base64data"}',
  geometryType: 'voxel',
  createdAt: 1672531200000,
  updatedAt: 1672531200000
};

describe('NFTMetadataPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders NFT name and basic information', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
      expect(screen.getByText('A test 3D NFT for unit testing')).toBeInTheDocument();
      expect(screen.getByText('Test Collection')).toBeInTheDocument();
    });

    it('renders minimal NFT without optional fields', () => {
      render(<NFTMetadataPanel nft={mockNFTMinimal} />);
      
      expect(screen.getByText('Minimal NFT')).toBeInTheDocument();
      expect(screen.queryByText('Test Collection')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Creator')).not.toBeInTheDocument();
      expect(screen.queryByText('Rare')).not.toBeInTheDocument();
    });

    it('displays rarity badge with correct styling', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      const rarityBadge = screen.getByText('Rare');
      expect(rarityBadge).toBeInTheDocument();
      expect(rarityBadge).toHaveClass('text-blue-400');
    });

    it('displays correct geometry type', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      expect(screen.getByText('Parametric')).toBeInTheDocument();
    });

    it('displays edition information when available', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      expect(screen.getByText('#1 of 100')).toBeInTheDocument();
    });

    it('displays color palette when colors are provided', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      const colorDivs = screen.getAllByTitle(/^#[0-9A-F]{6}$/i);
      expect(colorDivs).toHaveLength(3);
    });
  });

  describe('Date Formatting', () => {
    it('formats creation date correctly', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      expect(screen.getByText(/January 1, 2023/)).toBeInTheDocument();
    });

    it('displays last updated date when different from creation date', () => {
      const updatedNFT = { ...mockNFT, updatedAt: 1672704000000 }; // 2023-01-03
      render(<NFTMetadataPanel nft={updatedNFT} />);
      
      expect(screen.getByText('Last Updated')).toBeInTheDocument();
    });

    it('displays transfer date when available', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      expect(screen.getByText('Last Transfer')).toBeInTheDocument();
      expect(screen.getByText(/January 2, 2023/)).toBeInTheDocument();
    });

    it('hides last updated when same as creation date', () => {
      render(<NFTMetadataPanel nft={mockNFTMinimal} />);
      
      expect(screen.queryByText('Last Updated')).not.toBeInTheDocument();
    });
  });

  describe('NFT ID Display and Copy Functionality', () => {
    it('displays truncated NFT ID when available', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      expect(screen.getByText('12345678...12345678')).toBeInTheDocument();
    });

    it('displays N/A when NFT ID is not available', () => {
      render(<NFTMetadataPanel nft={mockNFTMinimal} />);
      
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('copies NFT ID to clipboard when copy button is clicked', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      const copyButton = screen.getByTitle('Copy NFT ID');
      fireEvent.click(copyButton);
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('1234567890abcdef1234567890abcdef12345678');
    });

    it('hides copy button when NFT ID is not available', () => {
      render(<NFTMetadataPanel nft={mockNFTMinimal} />);
      
      expect(screen.queryByTitle('Copy NFT ID')).not.toBeInTheDocument();
    });
  });

  describe('Technical Details Section', () => {
    it('displays geometry size calculation', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      const geometrySize = (mockNFT.geometry3d.length / 1024).toFixed(2);
      expect(screen.getByText(`${geometrySize} KB`)).toBeInTheDocument();
    });

    it('displays block height information when available', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      expect(screen.getByText('150,000')).toBeInTheDocument();
      expect(screen.getByText('850,000')).toBeInTheDocument();
    });

    it('hides block height information when not available', () => {
      render(<NFTMetadataPanel nft={mockNFTMinimal} />);
      
      expect(screen.queryByText('Block Height')).not.toBeInTheDocument();
      expect(screen.queryByText('Core Block Height')).not.toBeInTheDocument();
    });

    it('displays N/A for geometry size when geometry3d is not available', () => {
      const nftWithoutGeometry = { ...mockNFTMinimal, geometry3d: '' };
      render(<NFTMetadataPanel nft={nftWithoutGeometry} />);
      
      expect(screen.getAllByText('N/A')).toHaveLength(2); // One for NFT ID, one for geometry size
    });
  });

  describe('Rarity Color Coding', () => {
    const testCases = [
      { rarity: 'Common', expectedClass: 'text-gray-400' },
      { rarity: 'Rare', expectedClass: 'text-blue-400' },
      { rarity: 'Epic', expectedClass: 'text-purple-400' },
      { rarity: 'Legendary', expectedClass: 'text-yellow-400' },
      { rarity: 'Mythic', expectedClass: 'text-red-400' }
    ];

    testCases.forEach(({ rarity, expectedClass }) => {
      it(`displays ${rarity} rarity with correct color`, () => {
        const nftWithRarity = { ...mockNFT, rarity: rarity as NFT3D['rarity'] };
        render(<NFTMetadataPanel nft={nftWithRarity} />);
        
        const rarityBadge = screen.getByText(rarity);
        expect(rarityBadge).toHaveClass(expectedClass);
      });
    });

    it('uses default color for unknown rarity', () => {
      const nftWithUnknownRarity = { ...mockNFT, rarity: 'Unknown' as NFT3D['rarity'] };
      render(<NFTMetadataPanel nft={nftWithUnknownRarity} />);
      
      const rarityBadge = screen.getByText('Unknown');
      expect(rarityBadge).toHaveClass('text-gray-400');
    });
  });

  describe('Geometry Type Display', () => {
    const geometryTypes = [
      { type: 'parametric', expected: 'Parametric' },
      { type: 'voxel', expected: 'Voxel' },
      { type: 'procedural', expected: 'Procedural' }
    ];

    geometryTypes.forEach(({ type, expected }) => {
      it(`displays ${type} geometry type correctly`, () => {
        const nftWithGeometry = { ...mockNFT, geometryType: type as NFT3D['geometryType'] };
        render(<NFTMetadataPanel nft={nftWithGeometry} />);
        
        expect(screen.getByText(expected)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles missing description gracefully', () => {
      const nftWithoutDescription = { ...mockNFT, description: undefined };
      render(<NFTMetadataPanel nft={nftWithoutDescription} />);
      
      expect(screen.getByText('Test NFT')).toBeInTheDocument();
      expect(screen.queryByText('A test 3D NFT for unit testing')).not.toBeInTheDocument();
    });

    it('handles missing colors gracefully', () => {
      const nftWithoutColors = { ...mockNFT, colors: undefined };
      render(<NFTMetadataPanel nft={nftWithoutColors} />);
      
      expect(screen.queryByText('Colors')).not.toBeInTheDocument();
    });

    it('handles empty colors array gracefully', () => {
      const nftWithEmptyColors = { ...mockNFT, colors: [] };
      render(<NFTMetadataPanel nft={nftWithEmptyColors} />);
      
      expect(screen.queryByText('Colors')).not.toBeInTheDocument();
    });

    it('handles missing edition information gracefully', () => {
      const nftWithoutEdition = { ...mockNFT, edition: undefined, maxEditions: undefined };
      render(<NFTMetadataPanel nft={nftWithoutEdition} />);
      
      expect(screen.queryByText('Edition')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper alt text for copy button', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      const copyButton = screen.getByTitle('Copy NFT ID');
      expect(copyButton).toHaveAttribute('title', 'Copy NFT ID');
    });

    it('provides color tooltips for color palette', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      const redColor = screen.getByTitle('#FF0000');
      const greenColor = screen.getByTitle('#00FF00');
      const blueColor = screen.getByTitle('#0000FF');
      
      expect(redColor).toBeInTheDocument();
      expect(greenColor).toBeInTheDocument();
      expect(blueColor).toBeInTheDocument();
    });

    it('uses semantic HTML structure', () => {
      render(<NFTMetadataPanel nft={mockNFT} />);
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test NFT');
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Technical Details');
    });
  });
});