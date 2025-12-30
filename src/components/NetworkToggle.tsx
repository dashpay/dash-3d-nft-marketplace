'use client';

import { useState } from 'react';

interface NetworkToggleProps {
  currentNetwork: 'mainnet' | 'testnet';
  onNetworkChange: (network: 'mainnet' | 'testnet') => void;
  disabled?: boolean;
}

export function NetworkToggle({ currentNetwork, onNetworkChange, disabled = false }: NetworkToggleProps) {
  const [isChanging, setIsChanging] = useState(false);

  const handleToggle = async (targetNetwork: 'mainnet' | 'testnet') => {
    if (disabled || isChanging || currentNetwork === targetNetwork) return;

    setIsChanging(true);

    try {
      await onNetworkChange(targetNetwork);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="toggle-container">
      <button
        onClick={() => handleToggle('testnet')}
        disabled={disabled || isChanging}
        className={`toggle-option ${
          currentNetwork === 'testnet'
            ? 'toggle-active bg-gradient-to-r from-[#8B5CF6] to-[#A855F7]'
            : ''
        } ${disabled || isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${
          currentNetwork === 'testnet' ? 'bg-white animate-pulse-soft' : 'bg-[#475569]'
        }`} />
        <span>Testnet</span>
      </button>

      <button
        onClick={() => handleToggle('mainnet')}
        disabled={disabled || isChanging}
        className={`toggle-option ${
          currentNetwork === 'mainnet'
            ? 'toggle-active bg-gradient-to-r from-[#008de4] to-[#00D4FF]'
            : ''
        } ${disabled || isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${
          currentNetwork === 'mainnet' ? 'bg-white animate-pulse-soft' : 'bg-[#475569]'
        }`} />
        <span>Mainnet</span>
        {isChanging && (
          <div className="ml-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          </div>
        )}
      </button>
    </div>
  );
}
