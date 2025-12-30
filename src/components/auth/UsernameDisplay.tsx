'use client';

import React from 'react';
import { useStore } from '@/store/useStore';

interface UsernameDisplayProps {
  identityId?: string;
  className?: string;
  showFullId?: boolean;
  maxWidth?: string;
  style?: React.CSSProperties;
}

export function UsernameDisplay({
  identityId,
  className = '',
  showFullId = false,
  maxWidth = '120px',
  style = {}
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
      <div className={`flex items-center gap-2 ${className}`} style={style}>
        <div className="w-3.5 h-3.5 border-2 border-[#64748b] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
        <span className="text-[#64748b] text-sm">Loading...</span>
      </div>
    );
  }

  // Shorter truncation for compact display
  const truncatedId = showFullId ? displayId : `${displayId.slice(0, 6)}...${displayId.slice(-4)}`;

  return (
    <div
      className={`block truncate ${className}`}
      style={{ maxWidth, ...style }}
      title={username ? `@${username}` : displayId}
    >
      {username ? (
        <span className="text-[#008de4]">@{username}</span>
      ) : (
        <span className="font-mono">{truncatedId}</span>
      )}
    </div>
  );
}