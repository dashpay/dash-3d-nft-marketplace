'use client';

import React from 'react';
import { NFT3D } from '@/types/nft';
import { UsernameDisplay } from '@/components/auth/UsernameDisplay';

interface NFTOwnershipSectionProps {
  nft: NFT3D;
  isCurrentUser: boolean;
}

export function NFTOwnershipSection({ nft, isCurrentUser }: NFTOwnershipSectionProps) {
  const formatIdentityId = (id: string) => {
    if (id.length <= 16) return id;
    return `${id.slice(0, 8)}...${id.slice(-8)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // In a real app, you'd show a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
      <h2 className="text-xl font-bold text-white mb-6">Ownership & Creator</h2>
      
      <div className="space-y-6">
        {/* Current Owner */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Current Owner
            </h3>
            {isCurrentUser && (
              <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                <span className="text-green-400 text-xs font-medium">You</span>
              </div>
            )}
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00D4FF] to-[#8B5CF6] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {nft.ownerId.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium">
                    {isCurrentUser ? 'You' : formatIdentityId(nft.ownerId)}
                  </div>
                  <div className="text-gray-400 text-sm font-mono">
                    {formatIdentityId(nft.ownerId)}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => copyToClipboard(nft.ownerId)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Copy owner ID"
              >
                <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Creator */}
        {nft.creator && (
          <div>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
              Creator
            </h3>
            
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#FF0080] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {nft.creator.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{nft.creator}</div>
                    <div className="text-gray-400 text-sm">Original Creator</div>
                  </div>
                </div>
                
                <button
                  onClick={() => copyToClipboard(nft.creator!)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy creator name"
                >
                  <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ownership Stats */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Ownership Statistics
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {nft.transferredAt ? 
                  Math.floor((Date.now() - nft.transferredAt) / (1000 * 60 * 60 * 24)) : 
                  Math.floor((Date.now() - nft.createdAt) / (1000 * 60 * 60 * 24))
                }
              </div>
              <div className="text-gray-400 text-sm">Days Owned</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {/* This would be calculated from transfer history in a real app */}
                1
              </div>
              <div className="text-gray-400 text-sm">Total Transfers</div>
            </div>
          </div>
        </div>

        {/* Verification Badge */}
        <div className="bg-gradient-to-r from-[#00D4FF]/10 to-[#8B5CF6]/10 border border-[#00D4FF]/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-medium">Verified on Dash Platform</div>
              <div className="text-[#00D4FF] text-sm">
                Ownership verified through blockchain consensus
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}