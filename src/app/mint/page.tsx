'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { NFT3D } from '@/types/nft';
import { NFT3DViewer } from '@/components/NFT3DViewer';
import { NavHeader } from '@/components/NavHeader';
import ClientOnly from '@/components/ClientOnly';
import { Button } from '@/components/ui/Button';

function MintPageInner() {
  const router = useRouter();
  const { isAuthenticated, identityId, mintNFT, isLoading } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    geometryType: 'parametric' as const,
    geometry3d: '',
    colors: ['#00D4FF', '#8B5CF6', '#EC4899'],
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
    if (!formData.name || !formData.geometry3d || !identityId) return;

    setIsMinting(true);
    try {
      await mintNFT({
        name: formData.name,
        description: formData.description,
        geometry3d: formData.geometry3d,
        geometryType: formData.geometryType,
        colors: formData.colors,
        edition: formData.edition,
        maxEditions: formData.maxEditions,
        ownerId: identityId
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508]">
      <NavHeader />

      {/* Subtle background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-[#0d0d18] to-[#050508]" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#008de4]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl" />
      </div>

      <div className="section-container page-content">
        <div className="page-header">
          <h1 className="page-title">Mint New NFT</h1>
          <p className="page-subtitle mt-4">Create your unique 3D masterpiece on Dash Platform</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24">
          {/* Form */}
          <div className="form-section">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="form-group">
                <label className="form-label">NFT Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full"
                  placeholder="Enter NFT name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full h-28 resize-none"
                  placeholder="Describe your NFT"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quick Generate</label>
                <div className="flex gap-4">
                  {['sphere', 'torus', 'cube'].map(shape => (
                    <Button
                      key={shape}
                      type="button"
                      onClick={() => handleQuickGenerate(shape)}
                      variant="ghost"
                      className="capitalize flex-1"
                    >
                      {shape}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">3D Geometry JSON *</label>
                <textarea
                  value={formData.geometry3d}
                  onChange={(e) => handleInputChange('geometry3d', e.target.value)}
                  className="w-full h-36 font-mono text-sm resize-none"
                  placeholder='{"type": "parametric", "shape": "sphere", "params": [1, 32, 16]}'
                  required
                />
                <p className="form-helper">Must be valid JSON under 3KB</p>
              </div>

              <div className="form-group">
                <label className="form-label">Colors</label>
                <div className="flex gap-4">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="relative">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...formData.colors];
                          newColors[index] = e.target.value;
                          handleInputChange('colors', newColors);
                        }}
                        className="w-16 h-16 rounded-xl border-2 border-white/[0.1] bg-transparent cursor-pointer hover:border-white/30 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-group mb-0">
                  <label className="form-label">Edition</label>
                  <input
                    type="number"
                    value={formData.edition}
                    onChange={(e) => handleInputChange('edition', parseInt(e.target.value))}
                    min="1"
                    className="w-full"
                  />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Max Editions</label>
                  <input
                    type="number"
                    value={formData.maxEditions}
                    onChange={(e) => handleInputChange('maxEditions', parseInt(e.target.value))}
                    min="1"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={!formData.name || !formData.geometry3d || isMinting || isLoading}
                  variant="cyan"
                  size="lg"
                  block
                >
                  {isMinting ? 'Minting...' : 'Mint NFT'}
                </Button>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="form-section h-fit lg:sticky lg:top-28">
            <div className="flex items-center gap-4 mb-10">
              <div className="icon-container-sm bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20">
                <svg className="w-6 h-6 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Live Preview</h3>
            </div>

            {previewNFT ? (
              <div className="space-y-8">
                <div className="aspect-square bg-[#0d0d12] rounded-2xl overflow-hidden border border-white/[0.06]">
                  <NFT3DViewer nft={previewNFT} />
                </div>
                <div className="p-6 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                  <h4 className="text-lg font-semibold text-white mb-3">{previewNFT.name}</h4>
                  {previewNFT.description && (
                    <p className="text-[#64748b] text-sm mb-5 line-clamp-2">{previewNFT.description}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="badge badge-blue">
                      {previewNFT.geometryType}
                    </span>
                    <span className="text-sm text-[#64748b]">
                      Edition {previewNFT.edition}/{previewNFT.maxEditions}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-[#0d0d12] rounded-2xl flex items-center justify-center border border-white/[0.06]">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#00D4FF]/10 to-[#8B5CF6]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/[0.06]">
                    <svg className="w-12 h-12 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-[#64748b]">Fill in the form to see your 3D NFT preview</p>
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
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="text-white text-xl">Loading Mint Page...</div>
      </div>
    }>
      <MintPageInner />
    </ClientOnly>
  );
}
