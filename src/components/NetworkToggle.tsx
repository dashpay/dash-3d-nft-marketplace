'use client';

import { useState } from 'react';

interface NetworkToggleProps {
  currentNetwork: 'mainnet' | 'testnet';
  onNetworkChange: (network: 'mainnet' | 'testnet') => void;
  disabled?: boolean;
}

export function NetworkToggle({ currentNetwork, onNetworkChange, disabled = false }: NetworkToggleProps) {
  const [isChanging, setIsChanging] = useState(false);

  const handleToggle = async () => {
    if (disabled || isChanging) return;
    
    setIsChanging(true);
    const newNetwork = currentNetwork === 'mainnet' ? 'testnet' : 'mainnet';
    
    try {
      await onNetworkChange(newNetwork);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <span className={`text-sm font-medium ${currentNetwork === 'testnet' ? 'text-blue-400' : 'text-gray-400'}`}>
        Testnet
      </span>
      
      <button
        onClick={handleToggle}
        disabled={disabled || isChanging}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
          ${disabled || isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${currentNetwork === 'mainnet' ? 'bg-blue-600' : 'bg-gray-600'}
        `}
        title={`Switch to ${currentNetwork === 'mainnet' ? 'testnet' : 'mainnet'}`}
      >
        <span
          className={`
            ${currentNetwork === 'mainnet' ? 'translate-x-6' : 'translate-x-1'}
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          `}
        />
        {isChanging && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          </div>
        )}
      </button>
      
      <span className={`text-sm font-medium ${currentNetwork === 'mainnet' ? 'text-blue-400' : 'text-gray-400'}`}>
        Mainnet
      </span>
    </div>
  );
}