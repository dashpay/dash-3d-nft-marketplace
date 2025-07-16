'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';

interface LoginFormProps {
  className?: string;
}

export function LoginForm({ className = '' }: LoginFormProps) {
  const { login, loginWithUsername, isLoading, error, setError } = useStore();
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'auto' | 'identity' | 'username'>('auto');

  const detectInputType = (value: string): 'identity' | 'username' => {
    // Identity ID format: 44 base58 characters
    const identityRegex = /^[1-9A-HJ-NP-Za-km-z]{44}$/;
    if (identityRegex.test(value)) {
      return 'identity';
    }
    // Otherwise treat as username
    return 'username';
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (inputType === 'auto') {
      // Auto-detect input type for UI feedback
      const detected = detectInputType(value);
      // You could add visual feedback here if needed
    }
  };

  const handleLogin = async () => {
    if (!input.trim()) {
      setError('Please enter an identity ID or username');
      return;
    }

    try {
      const type = inputType === 'auto' ? detectInputType(input) : inputType;
      
      if (type === 'identity') {
        await login(input);
      } else {
        await loginWithUsername(input);
      }
    } catch (err) {
      // Error is handled in the store
    }
  };

  const getInputPlaceholder = () => {
    switch (inputType) {
      case 'identity':
        return 'e.g., 5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      case 'username':
        return 'e.g., alice';
      default:
        return 'Identity ID or username';
    }
  };

  const getInputHelperText = () => {
    switch (inputType) {
      case 'identity':
        return 'Format: 44 base58 characters (alphanumeric, no 0, O, I, or l)';
      case 'username':
        return 'Enter your Dash Platform username (without @)';
      default:
        return 'Enter your identity ID (44 characters) or username';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <label htmlFor="auth-input" className="block text-sm font-medium mb-2">
          Identity ID or Username
        </label>
        
        {/* Input Type Toggle */}
        <div className="flex mb-3 p-1 bg-gray-800 rounded-lg">
          <button
            type="button"
            onClick={() => setInputType('auto')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              inputType === 'auto'
                ? 'bg-dash-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Auto-detect
          </button>
          <button
            type="button"
            onClick={() => setInputType('identity')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              inputType === 'identity'
                ? 'bg-dash-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Identity ID
          </button>
          <button
            type="button"
            onClick={() => setInputType('username')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              inputType === 'username'
                ? 'bg-dash-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Username
          </button>
        </div>

        <input
          id="auth-input"
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          placeholder={getInputPlaceholder()}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-dash-blue transition-colors"
          disabled={isLoading}
        />
        
        <p className="mt-2 text-sm text-gray-500">
          {getInputHelperText()}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={isLoading || !input.trim()}
        className={`
          w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
          ${isLoading || !input.trim()
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-dash-blue hover:bg-dash-blue-dark text-white'
          }
        `}
      >
        {isLoading ? 'Authenticating...' : 'Enter Gallery'}
      </button>
    </div>
  );
}