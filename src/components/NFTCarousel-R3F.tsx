'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { NFT3D } from '@/types/nft';
import { NFT3DViewer } from './NFT3DViewer';
import * as THREE from 'three';
import dynamic from 'next/dynamic';

interface NFTCarouselProps {
  nfts: NFT3D[];
  onNFTClick?: (nft: NFT3D) => void;
  className?: string;
}

interface CarouselItemProps {
  nft: NFT3D;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  opacity: number;
  isActive: boolean;
  onClick?: () => void;
}

function CarouselItem({ nft, position, rotation, scale, opacity, isActive, onClick }: CarouselItemProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Gentle rotation for active item
      if (isActive) {
        meshRef.current.rotation.y += 0.005;
      }
    }
  });

  return (
    <group 
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Card Background */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[2.4, 3.2, 0.1]} />
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : '#f8f9fa'} 
          transparent 
          opacity={opacity * 0.9}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      
      {/* Card Frame */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[2.2, 3.0, 0.05]} />
        <meshStandardMaterial 
          color={isActive ? '#4f46e5' : '#e5e7eb'} 
          transparent 
          opacity={opacity}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      
      {/* 3D NFT Model */}
      <group position={[0, 0.3, 0]} scale={0.6}>
        <NFT3DViewer 
          nft={nft} 
          autoRotate={false}
          showControls={false}
          ambientLightIntensity={0.8}
          directionalLightIntensity={0.6}
        />
      </group>
      
      {/* Title Background */}
      <mesh position={[0, -1.1, 0]}>
        <boxGeometry args={[2.0, 0.4, 0.02]} />
        <meshStandardMaterial 
          color="#1f2937" 
          transparent 
          opacity={opacity * 0.8}
        />
      </mesh>
    </group>
  );
}

function CarouselScene({ nfts, currentIndex, onNFTClick }: { 
  nfts: NFT3D[]; 
  currentIndex: number; 
  onNFTClick?: (nft: NFT3D) => void;
}) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (camera) {
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);
    }
  }, [camera]);

  const getItemTransform = (index: number, currentIndex: number, totalItems: number) => {
    const relativeIndex = index - currentIndex;
    const maxVisible = 5; // Show 5 items at once
    
    if (Math.abs(relativeIndex) > maxVisible / 2) {
      return { visible: false, position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: 0, opacity: 0 };
    }
    
    const angle = relativeIndex * 0.6; // Angle between items
    const radius = 4; // Radius of the carousel
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius - 2;
    
    // Center item is at index 0 (currentIndex)
    const distance = Math.abs(relativeIndex);
    const scale = distance === 0 ? 1.2 : Math.max(0.6, 1 - distance * 0.2);
    const opacity = distance === 0 ? 1 : Math.max(0.3, 1 - distance * 0.3);
    
    const rotationY = -angle * 0.7; // Rotate items to face center
    
    return {
      visible: true,
      position: [x, 0, z] as [number, number, number],
      rotation: [0, rotationY, 0] as [number, number, number],
      scale,
      opacity
    };
  };

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, 5]} intensity={0.6} color="#4f46e5" />
      
      {nfts.map((nft, index) => {
        const transform = getItemTransform(index, currentIndex, nfts.length);
        
        if (!transform.visible) return null;
        
        return (
          <CarouselItem
            key={nft.id}
            nft={nft}
            position={transform.position}
            rotation={transform.rotation}
            scale={transform.scale}
            opacity={transform.opacity}
            isActive={index === currentIndex}
            onClick={() => onNFTClick?.(nft)}
          />
        );
      })}
    </>
  );
}

function NFTCarouselInternal({ nfts, onNFTClick, className = '' }: NFTCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isExtended, setIsExtended] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Extend Three.js namespace before rendering Canvas
    extend(THREE as any);
    setIsExtended(true);
  }, []);

  useEffect(() => {
    if (isAutoPlaying && nfts.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % nfts.length);
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, nfts.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + nfts.length) % nfts.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % nfts.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const currentNFT = nfts[currentIndex];

  if (!isExtended) {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="relative h-96 w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
          <p className="text-white">Loading 3D Carousel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* 3D Carousel */}
      <div className="relative h-96 w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl overflow-hidden">
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <CarouselScene 
            nfts={nfts} 
            currentIndex={currentIndex} 
            onNFTClick={onNFTClick}
          />
        </Canvas>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>
      
      {/* Controls */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2">
        <button
          onClick={handlePrevious}
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div className="absolute top-1/2 right-4 -translate-y-1/2">
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* NFT Info */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{currentNFT?.name}</h3>
              <p className="text-sm text-white/70">{currentNFT?.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {currentNFT?.geometryType}
                </span>
                {currentNFT?.edition && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    Edition {currentNFT.edition}/{currentNFT.maxEditions}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isAutoPlaying ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {nfts.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Create dynamic import with no SSR
export const NFTCarousel = dynamic(() => Promise.resolve(NFTCarouselInternal), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
      <p className="text-white">Loading 3D Carousel...</p>
    </div>
  )
});

export default NFTCarousel;