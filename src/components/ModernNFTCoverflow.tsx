'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { NFT3D } from '@/types/nft';
import { NFT3DViewer } from './NFT3DViewer';

interface ModernNFTCoverflowProps {
  nfts: NFT3D[];
  onNFTClick?: (nft: NFT3D) => void;
  className?: string;
}

// Floating particles background component
const FloatingParticles = () => {
  const particles = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-1 h-1 bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] rounded-full opacity-20"
          initial={{
            x: Math.random() * window?.innerWidth || 1920,
            y: Math.random() * window?.innerHeight || 1080,
          }}
          animate={{
            x: Math.random() * (window?.innerWidth || 1920),
            y: Math.random() * (window?.innerHeight || 1080),
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

// Rarity color mapping
const getRarityColor = (rarity?: string) => {
  switch (rarity) {
    case 'Mythic': return 'from-[#FF0080] to-[#8B5CF6]';
    case 'Legendary': return 'from-[#FFD700] to-[#FF6B00]';
    case 'Epic': return 'from-[#8B5CF6] to-[#00D4FF]';
    case 'Rare': return 'from-[#00D4FF] to-[#00C896]';
    default: return 'from-[#6B7280] to-[#374151]';
  }
};

export function ModernNFTCoverflow({ nfts, onNFTClick, className = '' }: ModernNFTCoverflowProps) {
  // Add CSS for animations
  const shineKeyframes = `
    @keyframes shine {
      0% { transform: translateX(-100%) rotate(45deg); }
      100% { transform: translateX(400%) rotate(45deg); }
    }
  `;

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = shineKeyframes;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && nfts.length > 1 && !isDragging) {
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
  }, [isAutoPlaying, nfts.length, isDragging]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + nfts.length) % nfts.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % nfts.length);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nfts.length, isAutoPlaying]);

  const currentNFT = nfts[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + nfts.length) % nfts.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % nfts.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Floating Particles Background */}
      <FloatingParticles />
      
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Main Coverflow Container */}
      <div 
        ref={containerRef}
        className="relative h-[480px] w-full overflow-hidden rounded-3xl"
        style={{
          background: 'transparent',
          perspective: '1200px',
        }}
      >
        {/* Coverflow Cards */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(event, info) => {
            const threshold = 50;
            if (info.offset.x > threshold) {
              handlePrevious();
            } else if (info.offset.x < -threshold) {
              handleNext();
            }
          }}
        >
          {nfts.map((nft, index) => {
              const offset = index - currentIndex;
              const isActive = index === currentIndex;
              const absOffset = Math.abs(offset);
              
              // Show 7 cards total (3 on each side + center)
              if (absOffset > 3) return null;

              // Coverflow calculations - balanced spacing
              const translateX = offset * 150; // Balanced horizontal spacing
              const translateZ = isActive ? 0 : -180 - (absOffset * 70); // Balanced depth
              const rotateY = isActive ? 0 : offset > 0 ? -35 : 35; // Balanced rotation
              const scale = isActive ? 1.0 : Math.max(0.72, 1 - absOffset * 0.10); // Balanced scale
              const opacity = absOffset > 3 ? 0 : Math.max(0.5, 1 - absOffset * 0.18); // Balanced opacity

              return (
                <motion.div
                  key={nft.id}
                  className="absolute cursor-pointer"
                  animate={{
                    opacity,
                    scale,
                    x: translateX,
                    z: translateZ,
                    rotateY,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94], // Smooth easing
                    type: "tween",
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    zIndex: isActive ? 10 : 5 - absOffset,
                  }}
                  onClick={() => {
                    if (isActive) {
                      onNFTClick?.(nft);
                    } else {
                      setCurrentIndex(index);
                    }
                  }}
                  onHoverStart={() => setIsAutoPlaying(false)}
                  onHoverEnd={() => setIsAutoPlaying(true)}
                  whileHover={{
                    scale: isActive ? 1.05 : scale * 1.05,
                    transition: { 
                      duration: 0.3,
                      ease: [0.23, 1, 0.32, 1]
                    }
                  }}
                  whileTap={{
                    scale: isActive ? 0.98 : scale * 0.95,
                    transition: { duration: 0.1 }
                  }}
                >
                  {/* NFT Card - Card Game Style */}
                  <div
                    className={`
                      relative overflow-hidden rounded-3xl border-2 transition-all duration-500
                      ${isActive 
                        ? 'border-[#00D4FF] shadow-2xl shadow-[#00D4FF]/40' 
                        : 'border-white/30 hover:border-[#8B5CF6]/60'
                      }
                    `}
                    style={{
                      background: isActive 
                        ? 'linear-gradient(145deg, rgba(0,212,255,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(255,0,128,0.1) 100%)'
                        : 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                      backdropFilter: 'blur(25px)',
                      WebkitBackdropFilter: 'blur(25px)',
                      width: isActive ? '300px' : '260px',
                      height: isActive ? '420px' : '360px',
                      filter: isActive ? 'brightness(1.2) saturate(1.1)' : 'brightness(0.75)',
                    }}
                  >
                    {/* Outer Glow Effect */}
                    <div 
                      className={`
                        absolute -inset-1 rounded-3xl opacity-60 blur-2xl transition-all duration-500
                        ${isActive ? 'bg-gradient-to-br from-[#00D4FF]/30 via-[#8B5CF6]/20 to-[#FF0080]/25' : ''}
                      `}
                    />
                    
                    {/* Card Header - Proportional padding */}
                    <div className="relative" style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '20px', paddingBottom: '12px' }}>
                      {/* NFT Title - Centered with proportional spacing */}
                      <div className="text-center" style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                        <h3 className="text-white font-bold text-xl leading-tight" style={{ marginBottom: '8px', paddingLeft: '4px', paddingRight: '4px' }}>
                          {nft.name}
                        </h3>
                        <div className="text-[#00D4FF] text-base font-medium tracking-wide" style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                          {nft.collection}
                        </div>
                      </div>
                    </div>

                    {/* 3D Shape Display Area - Proportional margin */}
                    <div className="relative bg-black/20 rounded-2xl border border-white/10" 
                         style={{ 
                           height: isActive ? '150px' : '130px',
                           marginLeft: '10px',
                           marginRight: '10px',
                           marginBottom: '12px'
                         }}>
                      {/* 3D Viewer Container */}
                      <div className="absolute inset-0 flex items-center justify-center" style={{ padding: '8px' }}>
                        <NFT3DViewer 
                          nft={nft} 
                          size={isActive ? "medium" : "small"} 
                          interactive={isActive}
                          autoRotate={true}
                          showControls={false}
                        />
                      </div>
                      
                      {/* Shape Info Overlay */}
                      <div className="absolute top-6 left-6">
                        <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2">
                          <span className="text-white/80 text-xs font-mono">
                            {nft.geometryType?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer - Proportional margin */}
                    <div className="relative" style={{ paddingLeft: '10px', paddingRight: '10px', paddingBottom: '15px' }}>
                      {/* Description - Smaller text with tighter spacing */}
                      <div className="text-center" style={{ marginBottom: '6px', paddingLeft: '8px', paddingRight: '8px' }}>
                        <p className="text-gray-300 text-xs leading-snug line-clamp-2" style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                          {nft.description}
                        </p>
                      </div>
                      
                      {/* Price Section - Smaller text */}
                      <div className="text-center" style={{ marginBottom: '4px', paddingLeft: '6px', paddingRight: '6px' }}>
                        <div className="text-white/60 text-xs font-mono tracking-wider" style={{ marginBottom: '2px' }}>PRICE</div>
                        <div className="text-white font-mono text-lg font-bold" style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                          {nft.price}
                        </div>
                      </div>
                      
                      {/* Creator - Smaller text */}
                      <div className="text-center" style={{ marginBottom: '4px', paddingLeft: '6px', paddingRight: '6px' }}>
                        <div className="text-white/50 text-xs tracking-wider" style={{ marginBottom: '2px' }}>CREATED BY</div>
                        <div className="text-[#8B5CF6] text-sm font-medium" style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                          {nft.creator}
                        </div>
                      </div>
                      
                      {/* Color Palette */}
                      <div className="flex justify-center space-x-3" style={{ marginTop: '4px', paddingLeft: '6px', paddingRight: '6px' }}>
                        {nft.colors?.slice(0, 3).map((color, colorIndex) => (
                          <div 
                            key={colorIndex}
                            className="w-4 h-4 rounded-full border-2 border-white/30 shadow-lg"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Card Border Shine Effect */}
                    {isActive && (
                      <div 
                        className="absolute inset-0 rounded-3xl opacity-50"
                        style={{
                          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                          animation: 'shine 3s ease-in-out infinite',
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
        </motion.div>

        {/* Navigation Controls */}
        <button
          onClick={handlePrevious}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full 
                     bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20
                     text-white transition-all duration-200 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full 
                     bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20
                     text-white transition-all duration-200 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-center mt-8 space-x-6">
        {/* Dots Indicator */}
        <div className="flex space-x-2">
          {nfts.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === currentIndex 
                  ? 'bg-[#00D4FF] w-8 shadow-lg shadow-[#00D4FF]/50' 
                  : 'bg-white/30 hover:bg-white/50'
                }
              `}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
        <motion.button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm 
                     border border-white/20 text-white text-sm font-medium transition-all duration-200 min-w-[100px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAutoPlaying ? (
            <>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
              <span className="whitespace-nowrap">Pause</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              <span className="whitespace-nowrap">Play</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Scan Lines Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,212,255,0.3) 2px,
            rgba(0,212,255,0.3) 4px
          )`
        }}
      />
    </div>
  );
}

export default ModernNFTCoverflow;