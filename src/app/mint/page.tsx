'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { NFT3D } from '@/types/nft';
import { NFT3DViewer } from '@/components/NFT3DViewer';
import ClientOnly from '@/components/ClientOnly';

function MintPageInner() {
  const router = useRouter();
  const { isAuthenticated, mintNFT, isLoading } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    geometryType: 'parametric' as const,
    geometry3d: '',
    colors: ['#00D4FF', '#8B5CF6', '#FF0080'],
    edition: 1,
    maxEditions: 1
  });
  
  const [previewNFT, setPreviewNFT] = useState<NFT3D | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  const generateParametricGeometry = (shape: string) => {
    const geometries = {
      sphere: {
        type: "parametric",
        shape: "sphere",
        params: [1, 32, 16],
        transforms: [{ type: "rotate", values: [0, 0.5, 0] }]
      },
      torus: {
        type: "parametric",
        shape: "torus",
        params: [2, 0.5, 16, 8],
        transforms: [{ type: "rotate", values: [0.7, 0.3, 0] }]
      },
      cube: {
        type: "parametric",
        shape: "box",
        params: [2, 2, 2],
        transforms: [{ type: "rotate", values: [0.3, 0.7, 0] }]
      }
    };
    return JSON.stringify(geometries[shape as keyof typeof geometries]);
  };

  const handleQuickGenerate = (shape: string) => {
    const geometry = generateParametricGeometry(shape);
    setFormData(prev => ({ ...prev, geometry3d: geometry }));
    updatePreview({ ...formData, geometry3d: geometry });
  };

  const updatePreview = (data: typeof formData) => {
    if (data.geometry3d && data.name) {
      setPreviewNFT({
        id: 'preview',
        name: data.name,
        description: data.description,
        geometry3d: data.geometry3d,
        geometryType: data.geometryType,
        colors: data.colors,
        edition: data.edition,
        maxEditions: data.maxEditions,
        ownerId: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    } else {
      setPreviewNFT(null);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updatePreview(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.geometry3d) return;

    setIsMinting(true);
    try {
      await mintNFT({
        name: formData.name,
        description: formData.description,
        geometry3d: formData.geometry3d,
        geometryType: formData.geometryType,
        colors: formData.colors,
        edition: formData.edition,
        maxEditions: formData.maxEditions
      });
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e, #0a0a0a)' }}>
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.1), rgba(139,92,246,0.1), rgba(255,0,128,0.1))' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-12 lg:mb-16">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Mint New NFT</h1>
            <p className="text-gray-400">Create your unique 3D masterpiece on Dash Platform</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
              <div>
                <label className="block text-sm font-medium text-white mb-2">NFT Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D4FF] transition-colors"
                  placeholder="Enter NFT name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D4FF] transition-colors h-20 resize-none"
                  placeholder="Describe your NFT"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Quick Generate</label>
                <div className="flex gap-2">
                  {['sphere', 'torus', 'cube'].map(shape => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => handleQuickGenerate(shape)}
                      className="px-4 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-white rounded-lg hover:scale-105 transition-all duration-300 capitalize"
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">3D Geometry JSON *</label>
                <textarea
                  value={formData.geometry3d}
                  onChange={(e) => handleInputChange('geometry3d', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D4FF] transition-colors h-32 font-mono text-sm"
                  placeholder='{"type": "parametric", "shape": "sphere", "params": [1, 32, 16]}'
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Must be valid JSON under 3KB</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Colors</label>
                <div className="flex gap-2">
                  {formData.colors.map((color, index) => (
                    <input
                      key={index}
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...formData.colors];
                        newColors[index] = e.target.value;
                        handleInputChange('colors', newColors);
                      }}
                      className="w-12 h-12 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Edition</label>
                  <input
                    type="number"
                    value={formData.edition}
                    onChange={(e) => handleInputChange('edition', parseInt(e.target.value))}
                    min="1"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#00D4FF] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Max Editions</label>
                  <input
                    type="number"
                    value={formData.maxEditions}
                    onChange={(e) => handleInputChange('maxEditions', parseInt(e.target.value))}
                    min="1"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#00D4FF] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!formData.name || !formData.geometry3d || isMinting || isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isMinting ? 'Minting...' : 'Mint NFT'}
              </button>
            </form>
          </div>

          {/* Preview */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Preview</h3>
            {previewNFT ? (
              <div className="space-y-4">
                <div className="aspect-square bg-black/50 rounded-xl overflow-hidden">
                  <NFT3DViewer nft={previewNFT} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{previewNFT.name}</h4>
                  {previewNFT.description && (
                    <p className="text-gray-400 text-sm mt-1">{previewNFT.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-[#00D4FF]/20 text-[#00D4FF] px-2 py-1 rounded">
                      {previewNFT.geometryType}
                    </span>
                    <span className="text-xs text-gray-400">
                      Edition {previewNFT.edition}/{previewNFT.maxEditions}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-black/50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#00D4FF]/20 to-[#8B5CF6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">Enter NFT details to see preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MintPage() {
  return (
    <ClientOnly fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Mint Page...</div>
      </div>
    }>
      <MintPageInner />
    </ClientOnly>
  );
}