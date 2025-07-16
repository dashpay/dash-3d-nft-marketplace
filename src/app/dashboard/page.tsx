'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { NFT3D } from '@/types/nft';
import { NFTCard } from '@/components/NFTCard';
import { UserStats } from '@/components/dashboard/UserStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { UserNFTSection } from '@/components/dashboard/UserNFTSection';
import { UsernameDisplay } from '@/components/auth/UsernameDisplay';
import { LoadingSpinner } from '@/components/loading/LoadingIndicators';
import ClientOnly from '@/components/ClientOnly';

function DashboardPageInner() {
  const router = useRouter();
  const { 
    identityId, 
    isAuthenticated, 
    username,
    userNFTs, 
    mintedNFTs,
    logout,
    setUserNFTs,
    setMintedNFTs
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    loadUserData();
  }, [isAuthenticated, identityId]);

  const loadUserData = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Load actual user NFTs from SDK
      // For now, we'll use mock data and filter by ownership
      // In production, this would be:
      // const sdk = getNFTSDK({ network });
      // const ownedNFTs = await sdk.getNFTsByOwner(identityId);
      // const mintedNFTs = await sdk.getNFTsByCreator(identityId);
      
      // Mock data loading - in real app this would come from blockchain
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e, #0a0a0a)' }}>
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.1), rgba(139,92,246,0.1), rgba(255,0,128,0.1))' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 lg:mb-16">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <UsernameDisplay className="text-gray-400" />
              <span className="text-gray-600">•</span>
              <span className="text-gray-400 text-sm">
                {identityId ? `${identityId.slice(0, 8)}...${identityId.slice(-8)}` : 'No Identity'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/gallery')}
              className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 rounded-lg transition-colors"
            >
              View Gallery
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-red-400 hover:text-red-300 border border-red-600 hover:border-red-400 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <UserStats 
          ownedCount={userNFTs.length}
          mintedCount={mintedNFTs.length}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* NFT Sections */}
        <UserNFTSection 
          ownedNFTs={userNFTs}
          mintedNFTs={mintedNFTs}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ClientOnly fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Dashboard...</div>
      </div>
    }>
      <DashboardPageInner />
    </ClientOnly>
  );
}