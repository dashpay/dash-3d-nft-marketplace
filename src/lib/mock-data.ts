// Mock data for UI development
import { NFT3D, createParametricGeometry } from '@/types/nft';

export const MOCK_IDENTITY_ID = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';
export const MOCK_OTHER_IDENTITY = '7FcQvuJm8EtRpLqY9NxVd2HkS6T3Wf1Xb4Ac9Zn2Mp8K';

// Use static timestamps to avoid hydration mismatches
const MOCK_BASE_TIME = 1720080000000; // Fixed timestamp: July 4, 2024
const DAY_MS = 86400000;

// Sample parametric geometries
const torusGeometry = createParametricGeometry('torus', [2, 0.5, 16, 8], [
  { type: 'rotate', values: [0, 0.7, 0] }
]);

const sphereGeometry = createParametricGeometry('sphere', [1.5, 32, 16], [
  { type: 'scale', values: [1.2, 0.8, 1.2] }
]);

const cubeGeometry = createParametricGeometry('cube', [2, 2, 2], [
  { type: 'rotate', values: [Math.PI / 4, Math.PI / 4, 0] }
]);

// Voxel geometry example (8x8x8 grid)
const voxelGeometry = JSON.stringify({
  type: 'voxel',
  size: [8, 8, 8],
  data: 'eJyNkEEKgDAMBP+Sc/+/9qAIFmq7m82kh4ZlMpNJa+0559ba2lp7+x8fH/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3'
});

// Procedural geometry example
const proceduralGeometry = JSON.stringify({
  type: 'procedural',
  seed: 12345,
  algorithm: 'fractal',
  params: {
    iterations: 4,
    scale: 0.7,
    angle: 25.7,
    axiom: 'F',
    rules: { F: 'F+F-F-FF+F+F-F' }
  }
});

// Additional complex voxel geometries
const voxelCrystalGeometry = JSON.stringify({
  type: 'voxel',
  size: [8, 8, 8],
  data: 'eJyNkMEKgzAMht/F8/5/bQdBsBDbzWYzm/TQsMxmMpl0a+0557ba2lp7+x8fH/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3'
});

const voxelCastleGeometry = JSON.stringify({
  type: 'voxel',
  size: [8, 8, 8],
  data: 'eJyNkLEKgzAQht/F8/5/bQdBsBDbzWYzm/TQsMxmMpl0a+0557ba2lp7+x8fH/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3'
});

// Additional procedural geometries
const proceduralSpiral = JSON.stringify({
  type: 'procedural',
  seed: 54321,
  algorithm: 'spiral',
  params: {
    turns: 3,
    radius: 1.5,
    height: 2,
    segments: 64
  }
});

const proceduralMandelbrot = JSON.stringify({
  type: 'procedural',
  seed: 98765,
  algorithm: 'mandelbrot',
  params: {
    iterations: 100,
    zoom: 0.5,
    centerX: -0.5,
    centerY: 0,
    extrude: 0.3
  }
});

const proceduralLSystem = JSON.stringify({
  type: 'procedural',
  seed: 13579,
  algorithm: 'lsystem',
  params: {
    iterations: 5,
    angle: 22.5,
    axiom: 'F',
    rules: { F: 'F[+F]F[-F]F' }
  }
});

// Mock NFT collection - 12 diverse NFTs
export const MOCK_NFTS: NFT3D[] = [
  {
    id: 'nft_001',
    name: 'Cosmic Genesis',
    description: 'A crystalline structure that captures the birth of stars',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: torusGeometry,
    geometryType: 'parametric',
    colors: ['#00D4FF', '#8B5CF6', '#FF0080'],
    edition: 1,
    maxEditions: 10,
    createdAt: MOCK_BASE_TIME - DAY_MS * 7,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 7,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 7,
    price: '12.5 DASH',
    collection: 'Genesis Collection',
    creator: 'CryptoDemiurge',
    rarity: 'Legendary'
  },
  {
    id: 'nft_002',
    name: 'Morphed Sphere',
    description: 'A sphere that defies perfect geometry',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: sphereGeometry,
    geometryType: 'parametric',
    colors: ['#96ceb4', '#ffeaa7', '#dda0dd'],
    edition: 3,
    maxEditions: 5,
    createdAt: MOCK_BASE_TIME - DAY_MS * 3,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 3,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 3
  },
  {
    id: 'nft_003',
    name: 'Crystal Cube',
    description: 'A crystalline structure with perfect angles',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: cubeGeometry,
    geometryType: 'parametric',
    colors: ['#74b9ff', '#e17055', '#fdcb6e'],
    createdAt: MOCK_BASE_TIME - DAY_MS * 1,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 1,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 1
  },
  {
    id: 'nft_004',
    name: 'Golden Cylinder',
    description: 'A sleek cylindrical form with golden ratios',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('cylinder', [1, 3, 32], [
      { type: 'rotate', values: [Math.PI / 2, 0, 0] }
    ]),
    geometryType: 'parametric',
    colors: ['#fdcb6e', '#e17055', '#6c5ce7'],
    edition: 2,
    maxEditions: 3,
    createdAt: MOCK_BASE_TIME - DAY_MS * 4,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 4,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 4
  },
  {
    id: 'nft_005',
    name: 'Prism Tower',
    description: 'An elegant triangular tower reaching skyward',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('tetrahedron', [1.5], [
      { type: 'rotate', values: [0, Math.PI / 6, 0] },
      { type: 'scale', values: [1, 2.5, 1] }
    ]),
    geometryType: 'parametric',
    colors: ['#a29bfe', '#fd79a8', '#6c5ce7'],
    edition: 1,
    maxEditions: 8,
    createdAt: MOCK_BASE_TIME - DAY_MS * 2,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 2,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 2
  },
  {
    id: 'nft_006',
    name: 'Spiral Torus',
    description: 'A mesmerizing torus with spiral properties',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('torus', [1.2, 0.3, 32, 16], [
      { type: 'rotate', values: [Math.PI / 4, 0, 0] }
    ]),
    geometryType: 'parametric',
    colors: ['#00b894', '#55a3ff', '#fd79a8'],
    edition: 4,
    maxEditions: 6,
    createdAt: MOCK_BASE_TIME - DAY_MS * 6,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 6,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 6
  },
  {
    id: 'nft_007',
    name: 'Diamond Octahedron',
    description: 'A perfect 8-sided diamond from another dimension',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('octahedron', [1.8], [
      { type: 'rotate', values: [0, Math.PI / 4, Math.PI / 6] }
    ]),
    geometryType: 'parametric',
    colors: ['#00cec9', '#6c5ce7', '#fd79a8'],
    edition: 1,
    maxEditions: 4,
    createdAt: MOCK_BASE_TIME - DAY_MS * 8,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 8,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 8
  },
  {
    id: 'nft_008',
    name: 'Twisted Cone',
    description: 'A cone with a mathematical twist',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('cone', [1.2, 2.8, 32], [
      { type: 'rotate', values: [0, 0, Math.PI / 8] },
      { type: 'scale', values: [1, 1, 1.2] }
    ]),
    geometryType: 'parametric',
    colors: ['#e17055', '#74b9ff', '#fdcb6e'],
    edition: 2,
    maxEditions: 7,
    createdAt: MOCK_BASE_TIME - DAY_MS * 5,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 5,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 5
  },
  {
    id: 'nft_009',
    name: 'Voxel Temple',
    description: 'An ancient temple rendered in voxel art',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: voxelGeometry,
    geometryType: 'voxel',
    colors: ['#a29bfe', '#6c5ce7', '#fd79a8'],
    edition: 1,
    maxEditions: 1,
    createdAt: MOCK_BASE_TIME - DAY_MS * 9,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 9,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 9
  },
  {
    id: 'nft_010',
    name: 'Crystal Fortress',
    description: 'A crystalline fortress built from digital blocks',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: voxelCrystalGeometry,
    geometryType: 'voxel',
    colors: ['#74b9ff', '#00cec9', '#fd79a8'],
    edition: 3,
    maxEditions: 5,
    createdAt: MOCK_BASE_TIME - DAY_MS * 10,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 10,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 10
  },
  {
    id: 'nft_011',
    name: 'Fractal Tree',
    description: 'A procedurally generated tree using L-systems',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: proceduralGeometry,
    geometryType: 'procedural',
    colors: ['#00b894', '#55a3ff', '#fd79a8'],
    edition: 1,
    maxEditions: 3,
    createdAt: MOCK_BASE_TIME - DAY_MS * 11,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 11,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 11
  },
  {
    id: 'nft_012',
    name: 'Quantum Spiral',
    description: 'A spiral that bends space and time',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: proceduralSpiral,
    geometryType: 'procedural',
    colors: ['#e17055', '#74b9ff', '#6c5ce7'],
    edition: 2,
    maxEditions: 4,
    createdAt: MOCK_BASE_TIME - DAY_MS * 12,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 12,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 12
  }
];

// Mock marketplace listings (NFTs owned by others)
export const MOCK_MARKETPLACE_NFTS: NFT3D[] = [
  {
    id: 'market_001',
    name: 'Abstract Cone',
    description: 'A minimalist cone with abstract properties',
    ownerId: MOCK_OTHER_IDENTITY,
    geometry3d: createParametricGeometry('cone', [1, 2, 32], [
      { type: 'translate', values: [0, 1, 0] }
    ]),
    geometryType: 'parametric',
    colors: ['#2d3436', '#636e72', '#b2bec3'],
    createdAt: MOCK_BASE_TIME - DAY_MS * 6, // 6 days ago
    updatedAt: MOCK_BASE_TIME - DAY_MS * 6,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 6
  },
  {
    id: 'market_002',
    name: 'Digital Octahedron',
    description: 'An 8-sided digital artifact from cyberspace',
    ownerId: '9MnPqR3sT7UvW2Xz5YbC8dE6fG4hJ1kL0oI9uY7tR6eW',
    geometry3d: createParametricGeometry('octahedron', [1.5], [
      { type: 'rotate', values: [0, Math.PI / 4, Math.PI / 6] }
    ]),
    geometryType: 'parametric',
    colors: ['#00cec9', '#6c5ce7', '#fd79a8'],
    edition: 1,
    maxEditions: 7,
    createdAt: MOCK_BASE_TIME - DAY_MS * 8, // 8 days ago
    updatedAt: MOCK_BASE_TIME - DAY_MS * 8,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 8
  }
];

// Mock identity data
export const MOCK_IDENTITIES = {
  [MOCK_IDENTITY_ID]: {
    id: MOCK_IDENTITY_ID,
    balance: 1500000000, // 15 DASH in duffs
    publicKeys: []
  },
  [MOCK_OTHER_IDENTITY]: {
    id: MOCK_OTHER_IDENTITY,
    balance: 750000000, // 7.5 DASH in duffs
    publicKeys: []
  }
};

// Mock network state
export const MOCK_PLATFORM_STATE = {
  height: 125000,
  timestamp: MOCK_BASE_TIME,
  coreChainLockedHeight: 890000,
  version: '1.0.0'
};

// Helper to get NFTs by owner
export function getMockNFTsByOwner(ownerId: string): NFT3D[] {
  return [...MOCK_NFTS, ...MOCK_MARKETPLACE_NFTS].filter(nft => nft.ownerId === ownerId);
}

// Helper to get all marketplace NFTs (not owned by current user)
export function getMockMarketplaceNFTs(currentUserId: string): NFT3D[] {
  return [...MOCK_NFTS, ...MOCK_MARKETPLACE_NFTS].filter(nft => nft.ownerId !== currentUserId);
}

// Helper to get NFT by ID
export function getMockNFTById(id: string): NFT3D | null {
  return [...MOCK_NFTS, ...MOCK_MARKETPLACE_NFTS].find(nft => nft.id === id) || null;
}