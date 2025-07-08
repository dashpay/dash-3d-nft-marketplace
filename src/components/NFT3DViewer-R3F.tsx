'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Torus, Cylinder, Cone, Octahedron, Tetrahedron } from '@react-three/drei';
import { NFT3D, ParametricGeometry, parseGeometry3D } from '@/types/nft';
import * as THREE from 'three';
import dynamic from 'next/dynamic';

interface NFT3DViewerProps {
  nft: NFT3D;
  interactive?: boolean;
  size?: 'small' | 'medium' | 'large';
  autoRotate?: boolean;
  showControls?: boolean;
  ambientLightIntensity?: number;
  directionalLightIntensity?: number;
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
  
  // Add auto-rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });
  
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
  const groupRef = useRef<THREE.Group>(null);
  
  // Add subtle rotation animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });
  
  // Enhanced voxel rendering with better depth perception
  return (
    <group ref={groupRef}>
      <Box position={[0, 0, 0]} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial 
          color={colors?.[0] || '#ff0000'} 
          metalness={0.3}
          roughness={0.7}
        />
      </Box>
      <Box position={[0.5, 0, 0]} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial 
          color={colors?.[1] || '#00ff00'}
          metalness={0.3}
          roughness={0.7}
        />
      </Box>
      <Box position={[0, 0.5, 0]} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial 
          color={colors?.[2] || '#0000ff'}
          metalness={0.3}
          roughness={0.7}
        />
      </Box>
      <Box position={[0.5, 0.5, 0]} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial 
          color={colors?.[0] || '#ff0000'}
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.8}
        />
      </Box>
    </group>
  );
}

// Component to render procedural geometry
function ProceduralShape({ geometry, colors }: { geometry: any; colors?: string[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Add complex animation for procedural shapes
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.children.forEach((child, index) => {
        child.rotation.z += delta * (0.5 + index * 0.1);
        child.position.y = Math.sin(state.clock.elapsedTime + index) * 0.1 + index * 0.5;
      });
    }
  });
  
  // Enhanced procedural rendering with more visual complexity
  const count = geometry.params?.iterations || 4;
  const shapes = [];
  
  for (let i = 0; i < count; i++) {
    const y = i * 0.5;
    const scale = 1 - (i * 0.15);
    shapes.push(
      <Cylinder
        key={i}
        position={[0, y, 0]}
        args={[scale * 0.4, scale * 0.2, 0.6]}
        rotation={[0, i * 0.8, 0]}
      >
        <meshStandardMaterial 
          color={colors?.[i % colors?.length] || '#228b22'}
          metalness={0.6}
          roughness={0.2}
          emissive={colors?.[i % colors?.length] || '#228b22'}
          emissiveIntensity={0.1}
        />
      </Cylinder>
    );
  }
  
  return <group ref={groupRef}>{shapes}</group>;
}

function NFT3DViewerInternal({ 
  nft, 
  interactive = true, 
  size = 'medium',
  autoRotate = false,
  showControls = true,
  ambientLightIntensity = 0.3,
  directionalLightIntensity = 1
}: NFT3DViewerProps) {
  const [isExtended, setIsExtended] = useState(false);
  
  useEffect(() => {
    // Extend Three.js namespace before rendering Canvas
    extend(THREE);
    setIsExtended(true);
  }, []);
  
  const sizeMap = {
    small: { width: 200, height: 200 },
    medium: { width: 400, height: 400 },
    large: { width: 600, height: 600 }
  };
  
  const { width, height } = sizeMap[size];
  const geometry = parseGeometry3D(nft.geometry3d, nft.geometryType);
  
  if (!isExtended) {
    return (
      <div 
        className="bg-gray-800 rounded-lg flex items-center justify-center"
        style={{ width, height }}
      >
        <p className="text-gray-400">Loading 3D model...</p>
      </div>
    );
  }
  
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
        {/* Enhanced lighting for better 3D depth */}
        <ambientLight intensity={ambientLightIntensity} />
        <directionalLight position={[10, 10, 5]} intensity={directionalLightIntensity} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4fc3f7" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} color="#ffeb3b" />
        
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
        
        {/* Enhanced controls for better interaction */}
        {interactive && showControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minDistance={3}
            maxDistance={8}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            dampingFactor={0.05}
            enableDamping={true}
          />
        )}
      </Canvas>
    </div>
  );
}

// Create dynamic import with no SSR
export const NFT3DViewer = dynamic(() => Promise.resolve(NFT3DViewerInternal), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-800 rounded-lg flex items-center justify-center" style={{ width: 200, height: 200 }}>
      <p className="text-gray-400">Loading 3D model...</p>
    </div>
  )
});

export default NFT3DViewer;