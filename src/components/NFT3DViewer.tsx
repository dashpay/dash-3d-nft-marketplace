'use client';

import { NFT3D } from '@/types/nft';

interface NFT3DViewerProps {
  nft: NFT3D;
  interactive?: boolean;
  size?: 'small' | 'medium' | 'large';
  autoRotate?: boolean;
  showControls?: boolean;
  ambientLightIntensity?: number;
  directionalLightIntensity?: number;
}

export function NFT3DViewer({ 
  nft, 
  size = 'medium',
  autoRotate = false,
  interactive = true
}: NFT3DViewerProps) {
  const sizeMap = {
    small: { width: '100%', height: '100%', scale: 0.8 },
    medium: { width: '100%', height: '100%', scale: 1 },
    large: { width: '100%', height: '100%', scale: 1.2 }
  };
  
  const { width, height, scale } = sizeMap[size];
  
  // Parse geometry to determine shape based on NFT name
  let shapeType = nft.name.toLowerCase(); // Use the NFT name as shape type
  
  // Fallback to parsing geometry if needed
  try {
    const geometry = JSON.parse(nft.geometry3d);
    if (geometry.shape && !shapeType) {
      shapeType = geometry.shape;
    }
  } catch (e) {
    // fallback to geometryType
    if (!shapeType) {
      if (nft.geometryType === 'parametric') shapeType = 'cube';
      if (nft.geometryType === 'voxel') shapeType = 'voxel';
      if (nft.geometryType === 'procedural') shapeType = 'spiral';
    }
  }

  const primaryColor = nft.colors?.[0] || '#00D4FF';
  const secondaryColor = nft.colors?.[1] || '#8B5CF6';
  const tertiaryColor = nft.colors?.[2] || '#FF0080';

  const renderShape = () => {
    const baseClasses = `transform-gpu transition-all duration-1000 ${autoRotate ? 'animate-spin' : 'hover:rotate-12'}`;
    
    switch (shapeType) {
      case 'sphere':
        return (
          <div 
            className={`w-20 h-20 rounded-full ${baseClasses}`}
            style={{
              background: `radial-gradient(circle at 30% 30%, ${primaryColor}, ${secondaryColor})`,
              boxShadow: `0 0 25px ${primaryColor}50, inset -8px -8px 15px rgba(0,0,0,0.3)`,
              transform: `scale(${scale})`,
            }}
          />
        );
      
      case 'cube':
        return (
          <div 
            className={`w-16 h-16 ${baseClasses}`}
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${tertiaryColor} 100%)`,
              boxShadow: `0 0 20px ${primaryColor}40, inset -6px -6px 12px rgba(0,0,0,0.3)`,
              borderRadius: '3px',
              transform: `scale(${scale}) rotateX(12deg) rotateY(12deg)`,
              transformStyle: 'preserve-3d',
            }}
          />
        );

      case 'cylinder':
        return (
          <div 
            className={`relative ${baseClasses}`}
            style={{ transform: `scale(${scale})` }}
          >
            <div 
              className="w-12 h-16 mx-auto rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                boxShadow: `0 0 18px ${primaryColor}40, inset -4px 0 8px rgba(0,0,0,0.3)`,
              }}
            />
          </div>
        );
      
      case 'cone':
        return (
          <div 
            className={`relative ${baseClasses}`}
            style={{ transform: `scale(${scale})` }}
          >
            <div 
              className="w-0 h-0 mx-auto"
              style={{
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderBottom: `40px solid ${primaryColor}`,
                filter: `drop-shadow(0 0 12px ${primaryColor}50)`,
              }}
            />
            <div 
              className="w-10 h-2 rounded-full mx-auto -mt-1"
              style={{
                background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                boxShadow: `0 0 8px ${secondaryColor}40`,
              }}
            />
          </div>
        );

      case 'pyramid':
        return (
          <div 
            className={`relative ${baseClasses}`}
            style={{ transform: `scale(${scale})` }}
          >
            <div 
              className="w-0 h-0 mx-auto"
              style={{
                borderLeft: '18px solid transparent',
                borderRight: '18px solid transparent',
                borderBottom: `35px solid ${primaryColor}`,
                filter: `drop-shadow(0 0 12px ${primaryColor}50)`,
              }}
            />
            <div 
              className="w-9 h-2 mx-auto -mt-1"
              style={{
                background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                borderRadius: '2px',
                boxShadow: `0 0 8px ${secondaryColor}40`,
              }}
            />
          </div>
        );

      case 'torus':
        return (
          <div className="relative" style={{ transform: `scale(${scale})` }}>
            <div 
              className={`w-20 h-20 rounded-full border-6 ${baseClasses}`}
              style={{
                borderColor: primaryColor,
                background: `conic-gradient(from 0deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
                boxShadow: `0 0 20px ${primaryColor}50, inset 0 0 12px rgba(0,0,0,0.3)`,
              }}
            />
          </div>
        );
      
      case 'octahedron':
        return (
          <div 
            className={`relative ${baseClasses}`}
            style={{ transform: `scale(${scale})` }}
          >
            {/* Top pyramid */}
            <div 
              className="w-0 h-0 mx-auto"
              style={{
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderBottom: `30px solid ${primaryColor}`,
                filter: `drop-shadow(0 0 15px ${primaryColor}60)`,
              }}
            />
            {/* Bottom pyramid */}
            <div 
              className="w-0 h-0 mx-auto -mt-1"
              style={{
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderTop: `30px solid ${secondaryColor}`,
                filter: `drop-shadow(0 0 15px ${secondaryColor}60)`,
              }}
            />
          </div>
        );
      
      // Prism shapes
      case 'triangular prism':
        return (
          <div 
            className={`relative ${baseClasses}`}
            style={{ transform: `scale(${scale})` }}
          >
            <div 
              className="w-0 h-0 mx-auto mb-1"
              style={{
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderBottom: `20px solid ${primaryColor}`,
                filter: `drop-shadow(0 0 10px ${primaryColor}50)`,
              }}
            />
            <div 
              className="w-8 h-12 mx-auto rounded-sm"
              style={{
                background: `linear-gradient(135deg, ${secondaryColor}, ${tertiaryColor})`,
                boxShadow: `0 0 15px ${secondaryColor}40`,
              }}
            />
          </div>
        );

      case 'rectangular prism':
        return (
          <div 
            className={`w-16 h-12 mx-auto ${baseClasses}`}
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${tertiaryColor} 100%)`,
              boxShadow: `0 0 18px ${primaryColor}40, inset -6px -6px 10px rgba(0,0,0,0.3)`,
              borderRadius: '3px',
              transform: `scale(${scale}) rotateX(10deg) rotateY(10deg)`,
              transformStyle: 'preserve-3d',
            }}
          />
        );

      case 'pentagonal prism':
        return (
          <div 
            className={`relative ${baseClasses}`}
            style={{ transform: `scale(${scale})` }}
          >
            <div 
              className="w-14 h-14 mx-auto"
              style={{
                background: `conic-gradient(from 0deg, ${primaryColor}, ${secondaryColor}, ${tertiaryColor}, ${primaryColor})`,
                clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                boxShadow: `0 0 16px ${primaryColor}50`,
              }}
            />
          </div>
        );

      case 'hexagonal prism':
        return (
          <div 
            className={`relative ${baseClasses}`}
            style={{ transform: `scale(${scale})` }}
          >
            <div 
              className="w-14 h-14 mx-auto"
              style={{
                background: `conic-gradient(from 0deg, ${primaryColor}, ${secondaryColor}, ${tertiaryColor}, ${primaryColor})`,
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                boxShadow: `0 0 16px ${primaryColor}50`,
              }}
            />
          </div>
        );

      case 'octagonal prism':
        return (
          <div 
            className={`relative ${baseClasses}`}
            style={{ transform: `scale(${scale})` }}
          >
            <div 
              className="w-14 h-14 mx-auto"
              style={{
                background: `conic-gradient(from 0deg, ${primaryColor}, ${secondaryColor}, ${tertiaryColor}, ${primaryColor})`,
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                boxShadow: `0 0 16px ${primaryColor}50`,
              }}
            />
          </div>
        );

      // Platonic solids
      case 'tetrahedron':
        return (
          <div 
            className={`relative ${baseClasses}`}
            style={{ transform: `scale(${scale})` }}
          >
            <div 
              className="w-0 h-0 mx-auto"
              style={{
                borderLeft: '18px solid transparent',
                borderRight: '18px solid transparent',
                borderBottom: `30px solid ${primaryColor}`,
                filter: `drop-shadow(0 0 12px ${primaryColor}50) drop-shadow(3px 3px 8px ${secondaryColor}40)`,
              }}
            />
          </div>
        );

      case 'dodecahedron':
        return (
          <div 
            className={`relative ${baseClasses}`}
            style={{ transform: `scale(${scale})` }}
          >
            <div 
              className="w-14 h-14 mx-auto"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${primaryColor}, ${secondaryColor})`,
                clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 85% 70%, 65% 85%, 35% 85%, 15% 70%, 0% 35%, 20% 10%)',
                boxShadow: `0 0 20px ${primaryColor}50, inset -4px -4px 10px rgba(0,0,0,0.3)`,
              }}
            />
          </div>
        );

      case 'icosahedron':
        return (
          <div 
            className={`relative ${baseClasses}`}
            style={{ transform: `scale(${scale})` }}
          >
            <div 
              className="w-14 h-14 mx-auto"
              style={{
                background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor}, ${tertiaryColor})`,
                clipPath: 'polygon(50% 0%, 75% 25%, 100% 50%, 75% 75%, 50% 100%, 25% 75%, 0% 50%, 25% 25%)',
                boxShadow: `0 0 20px ${secondaryColor}50, inset -6px -6px 12px rgba(0,0,0,0.4)`,
              }}
            />
          </div>
        );

      case 'voxel':
        return (
          <div 
            className={`grid grid-cols-3 gap-1 ${baseClasses}`}
            style={{ transform: `scale(${scale})` }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div 
                key={i}
                className="w-6 h-6 rounded-sm"
                style={{
                  background: [primaryColor, secondaryColor, tertiaryColor][i % 3],
                  boxShadow: `0 0 8px ${[primaryColor, secondaryColor, tertiaryColor][i % 3]}40`,
                  opacity: Math.random() > 0.3 ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        );
      
      case 'spiral':
      case 'procedural':
        return (
          <div 
            className={`relative ${baseClasses}`}
            style={{ transform: `scale(${scale})` }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-8 h-2 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                  transform: `rotate(${i * 36}deg) translateX(${10 + i * 5}px)`,
                  boxShadow: `0 0 10px ${primaryColor}50`,
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 50%',
                }}
              />
            ))}
          </div>
        );
      
      default: // cube
        return (
          <div 
            className={`w-20 h-20 ${baseClasses}`}
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${tertiaryColor} 100%)`,
              boxShadow: `0 0 25px ${primaryColor}50, inset -8px -8px 15px rgba(0,0,0,0.3)`,
              borderRadius: '8px',
              transform: `scale(${scale}) rotateX(15deg) rotateY(15deg)`,
              transformStyle: 'preserve-3d',
            }}
          />
        );
    }
  };
  
  return (
    <div 
      className="flex items-center justify-center"
      style={{ 
        width, 
        height,
        perspective: '200px',
      }}
    >
      {renderShape()}
    </div>
  );
}

export default NFT3DViewer;