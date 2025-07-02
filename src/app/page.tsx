'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { NetworkToggle } from '@/components/NetworkToggle';
import { getNFTSDK } from '@/lib/dash-sdk';
import { ConnectionDebugger } from '@/components/ConnectionDebugger';

export default function LoginPage() {
  const router = useRouter();
  const { network, setNetwork, login, isAuthenticated, error, setError } = useStore();
  const [identityId, setIdentityId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved network preference
    const savedNetwork = localStorage.getItem('dash-nft-network') as 'mainnet' | 'testnet' | null;
    if (savedNetwork && savedNetwork !== network) {
      setNetwork(savedNetwork);
    }

    // Initialize SDK with current network
    const sdk = getNFTSDK({ network });
    sdk.initialize().catch(console.error);

    // Check if already logged in
    const savedIdentity = localStorage.getItem('dash-nft-identity');
    if (savedIdentity) {
      setIdentityId(savedIdentity);
      // Auto-login
      handleLogin(savedIdentity);
    }
  }, [network]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/gallery');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (id?: string) => {
    const identityToUse = id || identityId;
    if (!identityToUse.trim()) {
      setError('Please enter an identity ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(identityToUse);
    } catch (err) {
      // Error is handled in the store
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Title */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2">
            <span className="gradient-text">Dash 3D NFTs</span>
          </h1>
          <p className="text-gray-400">Enter your identity to view your collection</p>
        </div>

        {/* Network Toggle */}
        <div className="flex justify-center">
          <NetworkToggle
            currentNetwork={network}
            onNetworkChange={handleNetworkChange}
            disabled={isLoading}
          />
        </div>

        {/* Login Form */}
        <div className="gradient-border p-8 space-y-6">
          <div>
            <label htmlFor="identity" className="block text-sm font-medium mb-2">
              Identity ID
            </label>
            <input
              id="identity"
              type="text"
              value={identityId}
              onChange={(e) => setIdentityId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="e.g., 5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-dash-blue transition-colors"
              disabled={isLoading}
            />
            <p className="mt-2 text-sm text-gray-500">
              Format: 44 base58 characters (alphanumeric, no 0, O, I, or l)
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={() => handleLogin()}
            disabled={isLoading || !identityId.trim()}
            className={`
              w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
              ${isLoading || !identityId.trim()
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-dash-blue hover:bg-dash-blue-dark text-white glow'
              }
            `}
          >
            {isLoading ? 'Verifying...' : 'Enter Gallery'}
          </button>
        </div>

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
            onClick={() => handleLogin('5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx')}
            disabled={isLoading}
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
      
      {/* Connection Debugger */}
      <ConnectionDebugger />
    </div>
  );
}