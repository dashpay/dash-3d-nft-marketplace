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
import { NavHeader } from '@/components/NavHeader';
import { LoadingSpinner } from '@/components/loading/LoadingIndicators';
import ClientOnly from '@/components/ClientOnly';
import { Button } from '@/components/ui/Button';

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
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508]">
      <NavHeader />

      {/* Subtle background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-[#0d0d18] to-[#050508]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#008de4]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl" />
      </div>

      <div className="section-container page-content">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <div className="flex items-center gap-4 mt-4">
            <UsernameDisplay className="text-[#94a3b8]" />
            <span className="text-[#475569]">/</span>
            <span className="text-[#64748b] font-mono text-sm">
              {identityId ? `${identityId.slice(0, 8)}...${identityId.slice(-8)}` : 'No Identity'}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="section-spacing">
          <UserStats
            ownedCount={userNFTs.length}
            mintedCount={mintedNFTs.length}
          />
        </div>

        {/* Quick Actions */}
        <div className="section-spacing">
          <QuickActions />
        </div>

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
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="text-white text-xl">Loading Dashboard...</div>
      </div>
    }>
      <DashboardPageInner />
    </ClientOnly>
  );
}
