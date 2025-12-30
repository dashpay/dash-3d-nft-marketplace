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
    const identityRegex = /^[1-9A-HJ-NP-Za-km-z]{44}$/;
    if (identityRegex.test(value)) {
      return 'identity';
    }
    return 'username';
  };

  const handleInputChange = (value: string) => {
    setInput(value);
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
    <div className={`space-y-8 ${className}`}>
      <div>
        <label className="form-label mb-4 block">
          Identity ID or Username
        </label>

        {/* Input Type Toggle */}
        <div className="toggle-container mb-6">
          <button
            type="button"
            onClick={() => setInputType('auto')}
            className={`toggle-option ${
              inputType === 'auto'
                ? 'toggle-active bg-gradient-to-r from-[#008de4] to-[#00D4FF]'
                : ''
            }`}
          >
            Auto
          </button>
          <button
            type="button"
            onClick={() => setInputType('identity')}
            className={`toggle-option ${
              inputType === 'identity'
                ? 'toggle-active bg-gradient-to-r from-[#008de4] to-[#00D4FF]'
                : ''
            }`}
          >
            Identity ID
          </button>
          <button
            type="button"
            onClick={() => setInputType('username')}
            className={`toggle-option ${
              inputType === 'username'
                ? 'toggle-active bg-gradient-to-r from-[#008de4] to-[#00D4FF]'
                : ''
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
          className="w-full"
          disabled={isLoading}
        />

        <p className="form-helper mt-3">
          {getInputHelperText()}
        </p>
      </div>

      {error && (
        <div className="px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={isLoading || !input.trim()}
        className={`btn w-full ${
          isLoading || !input.trim()
            ? 'btn-secondary opacity-50 cursor-not-allowed'
            : 'btn-cyan'
        }`}
      >
        {isLoading ? 'Authenticating...' : 'Enter Gallery'}
      </button>
    </div>
  );
}
