import { NFT3D } from '@/types/nft';

// Enhanced mock data with 100+ NFTs for pagination testing
const MOCK_IDENTITY_ID = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';

// Helper to create parametric geometry
function createParametricGeometry(
  shape: 'sphere' | 'cube' | 'torus' | 'cylinder' | 'cone' | 'octahedron' | 'tetrahedron',
  params: number[],
  transforms: Array<{ type: string; values: number[] }>
): string {
  return JSON.stringify({
    type: 'parametric',
    shape,
    params,
    transforms
  });
}

// Helper to create voxel geometry
function createVoxelGeometry(size: [number, number, number], data: string): string {
  return JSON.stringify({
    type: 'voxel',
    size,
    data
  });
}

// Helper to create procedural geometry
function createProceduralGeometry(seed: number, instructions: string[], params: Record<string, any>): string {
  return JSON.stringify({
    type: 'procedural',
    seed,
    instructions,
    params
  });
}

// Collections and creators for variety
const COLLECTIONS = [
  'Basic Shapes', 'Prisms', 'Platonic Solids', 'Curved Surfaces', 'Abstract Forms',
  'Geometric Patterns', 'Fractal Art', 'Minimalist Shapes', 'Dynamic Structures',
  'Organic Forms', 'Crystal Structures', 'Architectural Elements'
];

const CREATORS = [
  'GeometryMaster', 'PrismCrafter', 'PlatonicArtist', 'CurveMaster', 'AbstractDesigner',
  'PatternWeaver', 'FractalExplorer', 'MinimalArtist', 'StructuralEngineer',
  'OrganicModeler', 'CrystalArchitect', 'ArchitecturalVision'
];

const RARITY_LEVELS = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'] as const;
const GEOMETRY_TYPES = ['parametric', 'voxel', 'procedural'] as const;

// Color palettes for different rarities
const COLOR_PALETTES = {
  Common: [
    ['#3B82F6', '#60A5FA', '#93C5FD'],
    ['#10B981', '#34D399', '#6EE7B7'],
    ['#F59E0B', '#FBBF24', '#FCD34D'],
    ['#EF4444', '#F87171', '#FCA5A5']
  ],
  Rare: [
    ['#8B5CF6', '#A78BFA', '#C4B5FD'],
    ['#06B6D4', '#22D3EE', '#67E8F9'],
    ['#F97316', '#FB923C', '#FDBA74'],
    ['#EC4899', '#F472B6', '#F9A8D4']
  ],
  Epic: [
    ['#7C3AED', '#8B5CF6', '#A78BFA'],
    ['#0891B2', '#06B6D4', '#22D3EE'],
    ['#DC2626', '#EF4444', '#F87171'],
    ['#C2410C', '#EA580C', '#F97316']
  ],
  Legendary: [
    ['#5B21B6', '#7C3AED', '#8B5CF6'],
    ['#BE185D', '#DB2777', '#EC4899'],
    ['#B91C1C', '#DC2626', '#EF4444'],
    ['#92400E', '#B45309', '#D97706']
  ],
  Mythic: [
    ['#4C1D95', '#5B21B6', '#7C3AED'],
    ['#9F1239', '#BE185D', '#DB2777'],
    ['#991B1B', '#B91C1C', '#DC2626'],
    ['#78350F', '#92400E', '#B45309']
  ]
};

// Generate NFT names based on geometry type and collection
function generateNFTName(index: number, collection: string, geometryType: string): string {
  const shapes = {
    parametric: ['Sphere', 'Cube', 'Torus', 'Cylinder', 'Cone', 'Octahedron', 'Tetrahedron'],
    voxel: ['Pixelated', 'Blocky', 'Voxel', 'Chunky', 'Cubic', 'Stepped', 'Layered'],
    procedural: ['Generated', 'Algorithmic', 'Computed', 'Synthesized', 'Evolved', 'Emergent', 'Recursive']
  };

  const prefixes = ['Ethereal', 'Cosmic', 'Quantum', 'Digital', 'Holographic', 'Neon', 'Prismatic', 'Luminous'];
  const suffixes = ['Vision', 'Dream', 'Form', 'Structure', 'Creation', 'Manifestation', 'Expression', 'Art'];

  const shape = shapes[geometryType as keyof typeof shapes][index % shapes[geometryType as keyof typeof shapes].length];
  const prefix = prefixes[index % prefixes.length];
  const suffix = suffixes[Math.floor(index / prefixes.length) % suffixes.length];

  return `${prefix} ${shape} ${suffix}`;
}

// Generate enhanced mock data
export function generateEnhancedMockData(count: number = 150): NFT3D[] {
  const nfts: NFT3D[] = [];
  const baseTime = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    const collection = COLLECTIONS[i % COLLECTIONS.length];
    const creator = CREATORS[i % CREATORS.length];
    const geometryType = GEOMETRY_TYPES[i % GEOMETRY_TYPES.length];
    const rarity = RARITY_LEVELS[Math.floor(Math.random() * RARITY_LEVELS.length)];
    const colors = COLOR_PALETTES[rarity][i % COLOR_PALETTES[rarity].length];
    
    // Generate realistic creation dates (spread over last 6 months)
    const createdAt = baseTime - Math.floor(Math.random() * 180) * dayMs;
    const updatedAt = createdAt + Math.floor(Math.random() * 7) * dayMs;
    
    // Generate realistic prices (6-50 DASH based on rarity)
    const basePrices = {
      Common: [6, 12],
      Rare: [12, 20],
      Epic: [20, 30],
      Legendary: [30, 40],
      Mythic: [40, 50]
    };
    const [minPrice, maxPrice] = basePrices[rarity];
    const price = (Math.random() * (maxPrice - minPrice) + minPrice).toFixed(1);
    
    // Generate edition numbers
    const maxEditions = rarity === 'Mythic' ? 5 : 
                       rarity === 'Legendary' ? 10 :
                       rarity === 'Epic' ? 25 :
                       rarity === 'Rare' ? 50 : 100;
    const edition = Math.floor(Math.random() * maxEditions) + 1;

    // Generate geometry based on type
    let geometry3d: string;
    switch (geometryType) {
      case 'parametric':
        const shapes = ['sphere', 'cube', 'torus', 'cylinder', 'cone', 'octahedron', 'tetrahedron'] as const;
        const shape = shapes[i % shapes.length];
        const params = shape === 'sphere' ? [1 + Math.random()] :
                      shape === 'cube' ? [1 + Math.random(), 1 + Math.random(), 1 + Math.random()] :
                      shape === 'torus' ? [1 + Math.random(), 0.3 + Math.random() * 0.5] :
                      [1 + Math.random(), 2 + Math.random()];
        geometry3d = createParametricGeometry(shape, params, []);
        break;
      case 'voxel':
        geometry3d = createVoxelGeometry([8, 8, 8], `voxel_data_${i}`);
        break;
      case 'procedural':
        geometry3d = createProceduralGeometry(i, ['generate', 'subdivide', 'smooth'], { complexity: 0.5 + Math.random() * 0.5 });
        break;
    }

    const nft: NFT3D = {
      id: `enhanced_nft_${String(i + 1).padStart(3, '0')}`,
      name: generateNFTName(i, collection, geometryType),
      description: `A unique ${rarity.toLowerCase()} ${geometryType} NFT from the ${collection} collection. Edition ${edition} of ${maxEditions}.`,
      ownerId: MOCK_IDENTITY_ID,
      geometry3d,
      geometryType,
      colors,
      edition,
      maxEditions,
      createdAt,
      updatedAt,
      price: `${price} DASH`,
      collection,
      creator,
      rarity
    };

    nfts.push(nft);
  }

  return nfts;
}

// Export the enhanced mock data
export const ENHANCED_MOCK_NFTS = generateEnhancedMockData(150);

// Export pagination utilities
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 50,
  LOADING_DELAY: 800, // Simulate network delay
  INFINITE_SCROLL_THRESHOLD: 0.8, // Load more when 80% scrolled
};