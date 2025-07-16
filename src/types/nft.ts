// 3D NFT Type Definitions

export interface NFT3D {
  id?: string;
  name: string;
  description?: string;
  ownerId: string; // System field $ownerId
  geometry3d: string; // JSON string containing 3D geometry data
  geometryType: 'parametric' | 'voxel' | 'procedural';
  colors?: string[]; // Array of hex color codes
  edition?: number;
  maxEditions?: number;
  createdAt: number; // System field $createdAt
  updatedAt: number; // System field $updatedAt
  // Platform managed transfer fields
  transferredAt?: number; // System field $transferredAt
  transferredAtBlockHeight?: number; // System field $transferredAtBlockHeight
  transferredAtCoreBlockHeight?: number; // System field $transferredAtCoreBlockHeight
  // Additional UI fields for premium experience
  price?: string;
  collection?: string;
  creator?: string;
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
}

// Transfer history is tracked by the platform through system fields
// This interface represents transfer data for UI purposes
export interface NFTTransfer {
  nftId: string;
  fromId: string;
  toId: string;
  timestamp: number; // $transferredAt
  blockHeight: number; // $transferredAtBlockHeight
  coreBlockHeight: number; // $transferredAtCoreBlockHeight
}

// Compact 3D Geometry Formats
export interface ParametricGeometry {
  type: 'parametric';
  shape: 'sphere' | 'cube' | 'torus' | 'cylinder' | 'cone' | 'octahedron' | 'tetrahedron';
  params: number[]; // Shape-specific parameters
  transforms?: Transform[];
}

export interface VoxelGeometry {
  type: 'voxel';
  size: [number, number, number]; // Grid dimensions
  data: string; // Base64 encoded voxel data
}

export interface Transform {
  type: 'translate' | 'rotate' | 'scale';
  values: [number, number, number];
}

// Procedural geometry using compact instructions
export interface ProceduralGeometry {
  type: 'procedural';
  seed: number;
  algorithm: 'fractal' | 'lsystem' | 'noise' | 'cellular';
  params: Record<string, number>;
}

// Helper to parse geometry data
export function parseGeometry3D(data: string, type: NFT3D['geometryType']): any {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// Helper to create compact parametric geometry
export function createParametricGeometry(
  shape: ParametricGeometry['shape'],
  params: number[],
  transforms?: Transform[]
): string {
  const geometry: ParametricGeometry = {
    type: 'parametric',
    shape,
    params,
    transforms
  };
  return JSON.stringify(geometry);
}

// Helper to estimate data size
export function estimateGeometrySize(geometry: string): number {
  return new Blob([geometry]).size;
}

// Marketplace Types

export interface NFTListing {
  id: string;
  nftId: string;
  sellerId: string;
  listingType: 'fixed' | 'auction';
  price: string; // For fixed price listings
  startingPrice?: string; // For auctions
  currentPrice?: string; // Current highest bid for auctions
  currency: 'DASH';
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  createdAt: number;
  expiresAt?: number; // For auctions
  // Additional fields for UI
  views?: number;
  favorites?: number;
}

export interface NFTAuction extends NFTListing {
  listingType: 'auction';
  startingPrice: string;
  currentPrice: string;
  reservePrice?: string;
  bidIncrement: string;
  startTime: number;
  endTime: number;
  totalBids: number;
  highestBidder?: string;
}

export interface NFTBid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: string;
  currency: 'DASH';
  timestamp: number;
  status: 'active' | 'outbid' | 'winning' | 'cancelled';
}

export interface SearchFilters {
  query?: string;
  collections?: string[];
  creators?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  rarity?: ('Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic')[];
  listingType?: ('fixed' | 'auction')[];
  status?: ('active' | 'sold' | 'cancelled' | 'expired')[];
  geometryType?: ('parametric' | 'voxel' | 'procedural')[];
}

export enum SortOptions {
  RECENT = 'recent',
  PRICE_LOW = 'price-low',
  PRICE_HIGH = 'price-high',
  NAME_AZ = 'name-az',
  NAME_ZA = 'name-za',
  ENDING_SOON = 'ending-soon',
  MOST_BIDS = 'most-bids',
  RARITY = 'rarity'
}

export interface MarketplaceStats {
  totalListings: number;
  totalVolume: string;
  floorPrice: string;
  averagePrice: string;
  activeAuctions: number;
  soldToday: number;
}