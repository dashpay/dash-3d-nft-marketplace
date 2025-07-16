// Premium Mock NFT Data for Modern Coverflow
import { NFT3D, createParametricGeometry } from '@/types/nft';

export const MOCK_IDENTITY_ID = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';

// Fixed timestamp for hydration consistency
const MOCK_BASE_TIME = 1720080000000; // July 4, 2024
const DAY_MS = 86400000;

// Premium sample geometries with modern aesthetics
const cosmicTorusGeometry = createParametricGeometry('torus', [2.2, 0.6, 32, 18], [
  { type: 'rotate', values: [0, 0.8, 0.3] }
]);

const neonSphereGeometry = createParametricGeometry('sphere', [1.8, 64, 32], [
  { type: 'scale', values: [1.1, 1.1, 1.1] }
]);

const quantumCubeGeometry = createParametricGeometry('cube', [2.2, 2.2, 2.2], [
  { type: 'rotate', values: [Math.PI / 4, Math.PI / 4, Math.PI / 6] }
]);

const cyberPyramidGeometry = createParametricGeometry('octahedron', [2.5], [
  { type: 'rotate', values: [0.5, 0.3, 0.1] }
]);

const plasmaTorusGeometry = createParametricGeometry('torus', [3.0, 1.2, 24, 16], [
  { type: 'rotate', values: [0.2, 1.5, 0.8] }
]);

// Procedural geometries
const fractalGeometry = JSON.stringify({
  type: 'procedural',
  seed: 12345,
  algorithm: 'fractal',
  params: { iterations: 6, angle: 25.7, scale: 0.75 }
});

const helixGeometry = JSON.stringify({
  type: 'procedural',
  seed: 54321,
  algorithm: 'helix',
  params: { turns: 4, radius: 1.8, height: 3.2, segments: 64 }
});

const plasmaGeometry = JSON.stringify({
  type: 'procedural',
  seed: 98765,
  algorithm: 'plasma_field',
  params: { intensity: 0.9, frequency: 3.2, octaves: 5 }
});

// Voxel geometries
const quantumLatticeGeometry = JSON.stringify({
  type: 'voxel',
  size: [12, 8, 12],
  data: 'eJyNkMEKgzAMht/F8/5/bQdBsBDbzWYzm/TQsMxmMpl0a+0557ba2lp7+x8fH3D7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3'
});

const crystalMatrixGeometry = JSON.stringify({
  type: 'voxel',
  size: [10, 10, 10],
  data: 'eJyNkLEKgzAQht/F8/5/bQdBsBDbzWYzm/TQsMxmMpl0a+0557ba2lp7+x8fH3D7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3+/1+v9/v9/v9fr/f7/f7/X6/3+/3'
});

// 3D Shape Collection - Based on Mathematical Geometries
export const PREMIUM_MOCK_NFTS: NFT3D[] = [
  {
    id: 'nft_001',
    name: 'Sphere',
    description: 'Perfect round 3D shape with all points equidistant from center',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: neonSphereGeometry,
    geometryType: 'parametric',
    colors: ['#00D4FF', '#8B5CF6', '#FF0080'],
    edition: 1,
    maxEditions: 100,
    createdAt: MOCK_BASE_TIME - DAY_MS * 1,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 1,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 1,
    price: '12.5 DASH',
    collection: 'Basic Shapes',
    creator: 'GeometryMaster',
    rarity: 'Common'
  },
  {
    id: 'nft_002',
    name: 'Cube',
    description: 'Six-faced polyhedron with equal square faces',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: quantumCubeGeometry,
    geometryType: 'parametric',
    colors: ['#FF0080', '#00D4FF', '#8B5CF6'],
    edition: 1,
    maxEditions: 100,
    createdAt: MOCK_BASE_TIME - DAY_MS * 2,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 2,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 2,
    price: '8.2 DASH',
    collection: 'Basic Shapes',
    creator: 'GeometryMaster',
    rarity: 'Common'
  },
  {
    id: 'nft_003',
    name: 'Cylinder',
    description: 'Circular prism with two parallel circular bases',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('cylinder', [1, 2, 32], []),
    geometryType: 'parametric',
    colors: ['#8B5CF6', '#00D4FF', '#FF0080'],
    edition: 1,
    maxEditions: 100,
    createdAt: MOCK_BASE_TIME - DAY_MS * 3,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 3,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 3,
    price: '7.0 DASH',
    collection: 'Basic Shapes',
    creator: 'GeometryMaster',
    rarity: 'Common'
  },
  {
    id: 'nft_004',
    name: 'Cone',
    description: 'Pointed shape with circular base tapering to single point',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('cone', [1, 2, 32], []),
    geometryType: 'parametric',
    colors: ['#00D4FF', '#8B5CF6', '#FF0080'],
    edition: 1,
    maxEditions: 100,
    createdAt: MOCK_BASE_TIME - DAY_MS * 4,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 4,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 4,
    price: '6.8 DASH',
    collection: 'Basic Shapes',
    creator: 'GeometryMaster',
    rarity: 'Common'
  },
  {
    id: 'nft_005',
    name: 'Pyramid',
    description: 'Ancient geometric form with triangular faces meeting at apex',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: cyberPyramidGeometry,
    geometryType: 'parametric',
    colors: ['#FF0080', '#00D4FF', '#8B5CF6'],
    edition: 1,
    maxEditions: 100,
    createdAt: MOCK_BASE_TIME - DAY_MS * 5,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 5,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 5,
    price: '9.5 DASH',
    collection: 'Basic Shapes',
    creator: 'GeometryMaster',
    rarity: 'Common'
  },
  {
    id: 'nft_006',
    name: 'Triangular Prism',
    description: 'Three-sided prism with triangular cross-section',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('octahedron', [3, 2], []),
    geometryType: 'parametric',
    colors: ['#8B5CF6', '#FF0080', '#00D4FF'],
    edition: 1,
    maxEditions: 75,
    createdAt: MOCK_BASE_TIME - DAY_MS * 6,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 6,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 6,
    price: '8.7 DASH',
    collection: 'Prisms',
    creator: 'PrismCrafter',
    rarity: 'Common'
  },
  {
    id: 'nft_007',
    name: 'Rectangular Prism',
    description: 'Box-like shape with rectangular faces',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('cube', [2, 1.5, 1], []),
    geometryType: 'parametric',
    colors: ['#00D4FF', '#8B5CF6', '#FF0080'],
    edition: 1,
    maxEditions: 75,
    createdAt: MOCK_BASE_TIME - DAY_MS * 7,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 7,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 7,
    price: '7.5 DASH',
    collection: 'Prisms',
    creator: 'PrismCrafter',
    rarity: 'Common'
  },
  {
    id: 'nft_008',
    name: 'Pentagonal Prism',
    description: 'Five-sided prism with pentagonal cross-section',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('cylinder', [5, 2], []),
    geometryType: 'parametric',
    colors: ['#FF0080', '#00D4FF', '#8B5CF6'],
    edition: 1,
    maxEditions: 50,
    createdAt: MOCK_BASE_TIME - DAY_MS * 8,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 8,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 8,
    price: '12.3 DASH',
    collection: 'Prisms',
    creator: 'PrismCrafter',
    rarity: 'Rare'
  },
  {
    id: 'nft_009',
    name: 'Hexagonal Prism',
    description: 'Six-sided prism with hexagonal cross-section',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('cone', [6, 2], []),
    geometryType: 'parametric',
    colors: ['#8B5CF6', '#FF0080', '#00D4FF'],
    edition: 1,
    maxEditions: 50,
    createdAt: MOCK_BASE_TIME - DAY_MS * 9,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 9,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 9,
    price: '13.1 DASH',
    collection: 'Prisms',
    creator: 'PrismCrafter',
    rarity: 'Rare'
  },
  {
    id: 'nft_010',
    name: 'Octagonal Prism',
    description: 'Eight-sided prism with octagonal cross-section',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('cone', [8, 2], []),
    geometryType: 'parametric',
    colors: ['#00D4FF', '#8B5CF6', '#FF0080'],
    edition: 1,
    maxEditions: 40,
    createdAt: MOCK_BASE_TIME - DAY_MS * 10,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 10,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 10,
    price: '15.9 DASH',
    collection: 'Prisms',
    creator: 'PrismCrafter',
    rarity: 'Epic'
  },
  {
    id: 'nft_011',
    name: 'Tetrahedron',
    description: 'Four-faced polyhedron with triangular faces',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('tetrahedron', [1.5], []),
    geometryType: 'parametric',
    colors: ['#FF0080', '#00D4FF', '#8B5CF6'],
    edition: 1,
    maxEditions: 25,
    createdAt: MOCK_BASE_TIME - DAY_MS * 11,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 11,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 11,
    price: '18.5 DASH',
    collection: 'Platonic Solids',
    creator: 'PlatonicArtist',
    rarity: 'Legendary'
  },
  {
    id: 'nft_012',
    name: 'Octahedron',
    description: 'Eight-faced polyhedron with triangular faces',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: cyberPyramidGeometry,
    geometryType: 'parametric',
    colors: ['#8B5CF6', '#FF0080', '#00D4FF'],
    edition: 1,
    maxEditions: 25,
    createdAt: MOCK_BASE_TIME - DAY_MS * 12,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 12,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 12,
    price: '19.2 DASH',
    collection: 'Platonic Solids',
    creator: 'PlatonicArtist',
    rarity: 'Legendary'
  },
  {
    id: 'nft_013',
    name: 'Dodecahedron',
    description: 'Twelve-faced polyhedron with pentagonal faces',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('octahedron', [1.5], []),
    geometryType: 'parametric',
    colors: ['#00D4FF', '#8B5CF6', '#FF0080'],
    edition: 1,
    maxEditions: 15,
    createdAt: MOCK_BASE_TIME - DAY_MS * 13,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 13,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 13,
    price: '25.8 DASH',
    collection: 'Platonic Solids',
    creator: 'PlatonicArtist',
    rarity: 'Mythic'
  },
  {
    id: 'nft_014',
    name: 'Icosahedron',
    description: 'Twenty-faced polyhedron with triangular faces',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: createParametricGeometry('tetrahedron', [1.5], []),
    geometryType: 'parametric',
    colors: ['#FF0080', '#00D4FF', '#8B5CF6'],
    edition: 1,
    maxEditions: 15,
    createdAt: MOCK_BASE_TIME - DAY_MS * 14,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 14,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 14,
    price: '27.3 DASH',
    collection: 'Platonic Solids',
    creator: 'PlatonicArtist',
    rarity: 'Mythic'
  },
  {
    id: 'nft_015',
    name: 'Torus',
    description: 'Donut-shaped surface of revolution',
    ownerId: MOCK_IDENTITY_ID,
    geometry3d: cosmicTorusGeometry,
    geometryType: 'parametric',
    colors: ['#8B5CF6', '#FF0080', '#00D4FF'],
    edition: 1,
    maxEditions: 60,
    createdAt: MOCK_BASE_TIME - DAY_MS * 15,
    updatedAt: MOCK_BASE_TIME - DAY_MS * 15,
    transferredAt: MOCK_BASE_TIME - DAY_MS * 15,
    price: '14.7 DASH',
    collection: 'Curved Surfaces',
    creator: 'CurveMaster',
    rarity: 'Rare'
  }
];

// Export as default for backward compatibility
export const MOCK_NFTS = PREMIUM_MOCK_NFTS;