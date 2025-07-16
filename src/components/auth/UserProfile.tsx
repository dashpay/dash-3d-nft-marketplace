'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { UsernameDisplay } from './UsernameDisplay';

interface UserProfileProps {
  className?: string;
}

export function UserProfile({ className = '' }: UserProfileProps) {
  const { 
    identityId, 
    username, 
    isLoadingUsername, 
    network, 
    logout 
  } = useStore();

  if (!identityId) {
    return null;
  }

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white">User Profile</h3>
        <button
          onClick={logout}
          className="text-red-400 hover:text-red-300 transition-colors text-sm"
        >
          Logout
        </button>
      </div>

      <div className="space-y-4">
        {/* Username Display */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Username
          </label>
          {isLoadingUsername ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-400">Loading...</span>
            </div>
          ) : username ? (
            <div className="flex items-center gap-2">
              <span className="text-dash-blue font-medium">@{username}</span>
              <span className="text-gray-500 text-sm">({network})</span>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">No username registered</span>
          )}
        </div>

        {/* Identity ID */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Identity ID
          </label>
          <div className="bg-gray-900 p-3 rounded border border-gray-700">
            <code className="text-sm text-gray-300 break-all font-mono">
              {identityId}
            </code>
          </div>
        </div>

        {/* Network */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Network
          </label>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded ${
              network === 'mainnet' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {network.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-700">
          <div className="flex gap-2">
            <button
              onClick={() => {
                // You could add a modal or redirect to DPNS registration
                alert('Visit dash.org to register a username for your identity');
              }}
              className="text-dash-blue hover:text-dash-blue-dark transition-colors text-sm"
            >
              {username ? 'Manage Username' : 'Register Username'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}