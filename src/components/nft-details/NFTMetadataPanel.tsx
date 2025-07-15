'use client';

import React from 'react';
import { NFT3D } from '@/types/nft';

interface NFTMetadataPanelProps {
  nft: NFT3D;
}

export function NFTMetadataPanel({ nft }: NFTMetadataPanelProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case 'Rare': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Epic': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'Legendary': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Mythic': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getGeometryTypeDisplay = (type: string) => {
    switch (type) {
      case 'parametric': return 'Parametric';
      case 'voxel': return 'Voxel';
      case 'procedural': return 'Procedural';
      default: return type;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{nft.name}</h1>
            {nft.collection && (
              <p className="text-lg text-gray-400">
                from <span className="text-[#00D4FF]">{nft.collection}</span>
              </p>
            )}
          </div>
          
          {nft.rarity && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRarityColor(nft.rarity)}`}>
              {nft.rarity}
            </div>
          )}
        </div>
        
        {nft.description && (
          <p className="text-gray-300 leading-relaxed">{nft.description}</p>
        )}
      </div>

      {/* Metadata Grid */}
      <div className="space-y-4">
        {/* Edition Information */}
        {nft.edition && nft.maxEditions && (
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <span className="text-gray-400">Edition</span>
            <span className="text-white font-medium">
              #{nft.edition} of {nft.maxEditions}
            </span>
          </div>
        )}

        {/* Geometry Type */}
        <div className="flex items-center justify-between py-3 border-b border-white/10">
          <span className="text-gray-400">Geometry Type</span>
          <span className="text-white font-medium">
            {getGeometryTypeDisplay(nft.geometryType)}
          </span>
        </div>

        {/* Color Palette */}
        {nft.colors && nft.colors.length > 0 && (
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <span className="text-gray-400">Colors</span>
            <div className="flex gap-2">
              {nft.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-white/20"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center justify-between py-3 border-b border-white/10">
          <span className="text-gray-400">Created</span>
          <span className="text-white font-medium">
            {formatDate(nft.createdAt)}
          </span>
        </div>

        {/* Last Updated */}
        {nft.updatedAt !== nft.createdAt && (
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <span className="text-gray-400">Last Updated</span>
            <span className="text-white font-medium">
              {formatDate(nft.updatedAt)}
            </span>
          </div>
        )}

        {/* Last Transfer */}
        {nft.transferredAt && (
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <span className="text-gray-400">Last Transfer</span>
            <span className="text-white font-medium">
              {formatDate(nft.transferredAt)}
            </span>
          </div>
        )}

        {/* NFT ID */}
        <div className="flex items-center justify-between py-3">
          <span className="text-gray-400">NFT ID</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-mono text-sm">
              {nft.id ? `${nft.id.slice(0, 8)}...${nft.id.slice(-8)}` : 'N/A'}
            </span>
            {nft.id && (
              <button
                onClick={() => navigator.clipboard.writeText(nft.id!)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Copy NFT ID"
              >
                <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Technical Details</h3>
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Geometry Size</span>
              <span className="text-white font-mono">
                {nft.geometry3d ? `${(nft.geometry3d.length / 1024).toFixed(2)} KB` : 'N/A'}
              </span>
            </div>
            
            {nft.transferredAtBlockHeight && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Block Height</span>
                <span className="text-white font-mono">
                  {nft.transferredAtBlockHeight.toLocaleString()}
                </span>
              </div>
            )}
            
            {nft.transferredAtCoreBlockHeight && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Core Block Height</span>
                <span className="text-white font-mono">
                  {nft.transferredAtCoreBlockHeight.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}