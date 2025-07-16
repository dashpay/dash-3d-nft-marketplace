'use client';

import React from 'react';
import { useStore } from '@/store/useStore';

interface UsernameDisplayProps {
  identityId?: string;
  className?: string;
  showFullId?: boolean;
}

export function UsernameDisplay({ 
  identityId, 
  className = '', 
  showFullId = false 
}: UsernameDisplayProps) {
  const { 
    identityId: currentIdentityId, 
    username, 
    isLoadingUsername 
  } = useStore();

  const displayId = identityId || currentIdentityId;
  
  if (!displayId) {
    return null;
  }

  if (isLoadingUsername) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  const truncatedId = showFullId ? displayId : `${displayId.slice(0, 8)}...${displayId.slice(-8)}`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {username ? (
        <div className="flex items-center gap-2">
          <span className="text-dash-blue font-medium">@{username}</span>
          {showFullId && (
            <span className="text-gray-500 text-sm">({truncatedId})</span>
          )}
        </div>
      ) : (
        <span className="text-gray-300 font-mono text-sm">{truncatedId}</span>
      )}
    </div>
  );
}