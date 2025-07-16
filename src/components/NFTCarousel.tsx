'use client';

import { useState, useRef, useEffect } from 'react';
import { NFT3D } from '@/types/nft';
import { NFT3DViewer } from './NFT3DViewer';

interface NFTCarouselProps {
  nfts: NFT3D[];
  onNFTClick?: (nft: NFT3D) => void;
  className?: string;
}

export function NFTCarousel({ nfts, onNFTClick, className = '' }: NFTCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoPlaying && nfts.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % nfts.length);
      }, 4000);
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

  return (
    <div className={`relative w-full ${className}`}>
      {/* 3D Coverflow Carousel */}
      <div className="relative h-96 w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl overflow-hidden">
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {nfts.map((nft, index) => {
              const offset = index - currentIndex;
              const isActive = index === currentIndex;
              
              // Calculate position and rotation for coverflow effect
              const translateX = offset * 120; // Space between items
              const translateZ = isActive ? 0 : -200; // Depth for inactive items
              const rotateY = isActive ? 0 : offset > 0 ? -45 : 45; // Rotation angle
              const scale = isActive ? 1 : 0.8; // Scale for inactive items
              const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.3; // Fade distant items
              
              return (
                <div
                  key={nft.id}
                  className="absolute transition-all duration-500 ease-out cursor-pointer"
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex: isActive ? 10 : 5 - Math.abs(offset),
                  }}
                  onClick={() => {
                    if (isActive) {
                      onNFTClick?.(nft);
                    } else {
                      setCurrentIndex(index);
                    }
                  }}
                >
                  <div 
                    className={`transform transition-all duration-300 ${
                      isActive ? 'shadow-2xl shadow-blue-500/20' : 'hover:scale-105'
                    }`}
                    style={{
                      filter: isActive ? 'brightness(1.1)' : 'brightness(0.7)',
                    }}
                  >
                    <NFT3DViewer 
                      nft={nft} 
                      size={isActive ? "medium" : "small"} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
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

export default NFTCarousel;