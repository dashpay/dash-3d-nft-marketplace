'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { NetworkToggle } from '@/components/NetworkToggle';
import { getNFTSDK } from '@/lib/dash-sdk';
import { ConnectionDebugger } from '@/components/ConnectionDebugger';
import { LoginForm } from '@/components/auth/LoginForm';
import ClientOnly from '@/components/ClientOnly';

function LoginPageInner() {
  const router = useRouter();
  const { network, setNetwork, login, isAuthenticated } = useStore();
  const [identityId, setIdentityId] = useState('');

  useEffect(() => {
    // Load saved network preference only on client side
    if (typeof window !== 'undefined') {
      const savedNetwork = localStorage.getItem('dash-nft-network') as 'mainnet' | 'testnet' | null;
      if (savedNetwork && savedNetwork !== network) {
        setNetwork(savedNetwork);
        return; // Don't continue with this effect, let the next one handle SDK init
      }
    }

    // Initialize SDK with current network
    const sdk = getNFTSDK({ network });
    sdk.initialize().catch(console.error);

    // Check if already logged in (only on client side)
    if (typeof window !== 'undefined') {
      const savedIdentity = localStorage.getItem('dash-nft-identity');
      if (savedIdentity) {
        setIdentityId(savedIdentity);
        // Auto-login
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
      await login('5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-7xl font-bold mb-4">
              <ClientOnly fallback={<span className="text-blue-400">Dash 3D NFTs</span>}>
                <span className="gradient-text">Dash 3D NFTs</span>
              </ClientOnly>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of digital art with 3D NFTs on Dash Platform. 
              Collect, trade, and showcase unique 3D masterpieces in a decentralized marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-20 px-4">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Enter Your Gallery
            </h2>
            <p className="text-gray-400">Enter your identity to view your collection</p>
          </div>

          {/* Network Toggle */}
          <div className="flex justify-center">
            <NetworkToggle
              currentNetwork={network}
              onNetworkChange={handleNetworkChange}
            />
          </div>

          {/* Login Form */}
          <ClientOnly fallback={
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 space-y-6">
              <div>
                <label htmlFor="identity" className="block text-sm font-medium mb-2">Identity ID or Username</label>
                <input id="identity" type="text" placeholder="Loading..." className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg" disabled />
              </div>
            </div>
          }>
            <div className="gradient-border p-8">
              <LoginForm />
            </div>
          </ClientOnly>

          {/* Demo Mode */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">or</span>
              </div>
            </div>
            
            <button
              onClick={handleDemoLogin}
              className="text-dash-blue hover:text-dash-blue-dark transition-colors"
            >
              Try Demo Mode
            </button>
          </div>

          {/* Info */}
          <div className="text-center text-sm text-gray-500">
            <p>This is a semi-static NFT marketplace demo</p>
            <p>All data is stored on Dash Platform</p>
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <LoginPageInner />
    </ClientOnly>
  );
}