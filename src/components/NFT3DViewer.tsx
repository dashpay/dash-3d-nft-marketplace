'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Torus, Cylinder, Cone, Octahedron, Tetrahedron } from '@react-three/drei';
import { NFT3D, ParametricGeometry, parseGeometry3D } from '@/types/nft';
import { useRef } from 'react';
import * as THREE from 'three';

interface NFT3DViewerProps {
  nft: NFT3D;
  interactive?: boolean;
  size?: 'small' | 'medium' | 'large';
}

// Component to render parametric geometry
function ParametricShape({ geometry, colors }: { geometry: ParametricGeometry; colors?: string[] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const primaryColor = colors?.[0] || '#00ffff';
  const secondaryColor = colors?.[1] || '#ff00ff';
  
  // Apply transforms
  const rotation = geometry.transforms?.find(t => t.type === 'rotate')?.values || [0, 0, 0];
  const position = geometry.transforms?.find(t => t.type === 'translate')?.values || [0, 0, 0];
  const scale = geometry.transforms?.find(t => t.type === 'scale')?.values || [1, 1, 1];
  
  // Animated rotation
  useRef<THREE.Mesh>(null);
  
  const renderShape = () => {
    const props = {
      ref: meshRef,
      position: position as [number, number, number],
      rotation: rotation as [number, number, number],
      scale: scale as [number, number, number],
    };
    
    const material = (
      <meshStandardMaterial 
        color={primaryColor}
        emissive={secondaryColor}
        emissiveIntensity={0.2}
        metalness={0.7}
        roughness={0.3}
      />
    );
    
    switch (geometry.shape) {
      case 'cube':
        return <Box args={geometry.params as [number, number, number]} {...props}>{material}</Box>;
      case 'sphere':
        return <Sphere args={geometry.params as [number, number, number]} {...props}>{material}</Sphere>;
      case 'torus':
        return <Torus args={geometry.params as [number, number, number, number]} {...props}>{material}</Torus>;
      case 'cylinder':
        return <Cylinder args={geometry.params as [number, number, number]} {...props}>{material}</Cylinder>;
      case 'cone':
        return <Cone args={geometry.params as [number, number, number]} {...props}>{material}</Cone>;
      case 'octahedron':
        return <Octahedron args={[geometry.params[0]]} {...props}>{material}</Octahedron>;
      case 'tetrahedron':
        return <Tetrahedron args={[geometry.params[0]]} {...props}>{material}</Tetrahedron>;
      default:
        return <Box {...props}>{material}</Box>;
    }
  };
  
  return renderShape();
}

// Component to render voxel geometry
function VoxelShape({ geometry, colors }: { geometry: any; colors?: string[] }) {
  // Simplified voxel rendering - in production, parse voxel data
  return (
    <group>
      <Box position={[0, 0, 0]} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial color={colors?.[0] || '#ff0000'} />
      </Box>
      <Box position={[0.5, 0, 0]} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial color={colors?.[1] || '#00ff00'} />
      </Box>
      <Box position={[0, 0.5, 0]} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial color={colors?.[2] || '#0000ff'} />
      </Box>
    </group>
  );
}

// Component to render procedural geometry
function ProceduralShape({ geometry, colors }: { geometry: any; colors?: string[] }) {
  // Simplified procedural rendering - in production, generate based on algorithm
  const count = geometry.params?.iterations || 3;
  const shapes = [];
  
  for (let i = 0; i < count; i++) {
    const y = i * 0.5;
    const scale = 1 - (i * 0.2);
    shapes.push(
      <Cylinder
        key={i}
        position={[0, y, 0]}
        args={[scale * 0.3, scale * 0.3, 0.5]}
        rotation={[0, i * 0.5, 0]}
      >
        <meshStandardMaterial color={colors?.[i % colors.length] || '#228b22'} />
      </Cylinder>
    );
  }
  
  return <group>{shapes}</group>;
}

export default function NFT3DViewer({ nft, interactive = true, size = 'medium' }: NFT3DViewerProps) {
  const sizeMap = {
    small: { width: 200, height: 200 },
    medium: { width: 400, height: 400 },
    large: { width: 600, height: 600 }
  };
  
  const { width, height } = sizeMap[size];
  const geometry = parseGeometry3D(nft.geometry3d, nft.geometryType);
  
  if (!geometry) {
    return (
      <div 
        className="bg-gray-800 rounded-lg flex items-center justify-center"
        style={{ width, height }}
      >
        <p className="text-gray-400">Unable to render 3D model</p>
      </div>
    );
  }
  
  return (
    <div 
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden"
      style={{ width, height }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        {/* Render based on geometry type */}
        {geometry.type === 'parametric' && (
          <ParametricShape geometry={geometry} colors={nft.colors} />
        )}
        {geometry.type === 'voxel' && (
          <VoxelShape geometry={geometry} colors={nft.colors} />
        )}
        {geometry.type === 'procedural' && (
          <ProceduralShape geometry={geometry} colors={nft.colors} />
        )}
        
        {/* Controls */}
        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        )}
      </Canvas>
    </div>
  );
}