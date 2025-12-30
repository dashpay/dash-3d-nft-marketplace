'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { NetworkToggle } from '@/components/NetworkToggle';
import { getNFTSDK } from '@/lib/dash-sdk';
import { MOCK_IDENTITY_ID } from '@/lib/mock-data';
import { ConnectionDebugger } from '@/components/ConnectionDebugger';
import { LoginForm } from '@/components/auth/LoginForm';
import ClientOnly from '@/components/ClientOnly';
import { Button } from '@/components/ui/Button';

function LoginPageInner() {
  const router = useRouter();
  const { network, setNetwork, login, isAuthenticated } = useStore();
  const [identityId, setIdentityId] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNetwork = localStorage.getItem('dash-nft-network') as 'mainnet' | 'testnet' | null;
      if (savedNetwork && savedNetwork !== network) {
        setNetwork(savedNetwork);
        return;
      }
    }

    const sdk = getNFTSDK({ network });
    sdk.initialize().catch(console.error);

    if (typeof window !== 'undefined') {
      const savedIdentity = localStorage.getItem('dash-nft-identity');
      if (savedIdentity) {
        setIdentityId(savedIdentity);
        login(savedIdentity);
      }
    }
  }, [network]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleDemoLogin = async () => {
    try {
      await login(MOCK_IDENTITY_ID);
    } catch (err) {
      // Error is handled in the store
    }
  };

  const handleNetworkChange = async (newNetwork: 'mainnet' | 'testnet') => {
    try {
      await setNetwork(newNetwork);
    } catch (error) {
      console.error('Failed to change network:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-[#0d0d18] to-[#050508]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#008de4]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-20 lg:pb-24">
        <div className="section-container">
          <div className="text-center">
            {/* Platform Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] mb-12">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
              </span>
              <span className="text-sm font-medium text-[#94a3b8] tracking-wide">Powered by Dash Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-10 tracking-tight">
              <ClientOnly fallback={<span className="text-[#008de4]">Dash 3D NFTs</span>}>
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 50%, #EC4899 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundSize: '200% auto',
                    animation: 'gradient 4s ease infinite'
                  }}
                >
                  Dash 3D NFTs
                </span>
              </ClientOnly>
            </h1>

            <p className="text-xl md:text-2xl text-[#94a3b8] max-w-2xl mx-auto leading-relaxed font-light">
              Experience the future of digital art with immersive 3D NFTs on the Dash blockchain.
            </p>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="pb-28 lg:pb-36">
        <div className="section-container max-w-lg">
          <div className="text-center mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-5">
              Enter Your Gallery
            </h2>
            <p className="text-[#64748b]">Connect with your Dash identity to access your collection</p>
          </div>

          {/* Network Toggle */}
          <div className="flex justify-center mb-12">
            <NetworkToggle
              currentNetwork={network}
              onNetworkChange={handleNetworkChange}
            />
          </div>

          {/* Login Form */}
          <ClientOnly fallback={
            <div className="form-section space-y-6">
              <div>
                <label className="form-label">Identity ID or Username</label>
                <input type="text" placeholder="Loading..." className="w-full" disabled />
              </div>
            </div>
          }>
            <div className="form-section">
              <LoginForm />
            </div>
          </ClientOnly>

          {/* Demo Mode */}
          <div className="mt-12 text-center space-y-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-6 text-[#475569] text-sm bg-[#050508]">or</span>
              </div>
            </div>

            <Button
              onClick={handleDemoLogin}
              variant="ghost"
              size="lg"
              className="w-full"
            >
              Try Demo Mode
            </Button>
          </div>

          {/* Info */}
          <div className="text-center text-sm text-[#475569] mt-16 space-y-2">
            <p>Semi-static NFT marketplace demo</p>
            <p>All data stored on Dash Platform blockchain</p>
          </div>
        </div>
      </section>

      {/* Connection Debugger */}
      <ConnectionDebugger />
    </div>
  );
}

export default function LoginPage() {
  return (
    <ClientOnly fallback={
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <LoginPageInner />
    </ClientOnly>
  );
}
