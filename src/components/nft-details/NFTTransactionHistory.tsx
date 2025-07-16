'use client';

import React, { useState, useEffect } from 'react';
import { NFTTransfer } from '@/types/nft';

interface NFTTransactionHistoryProps {
  nftId: string;
}

// Mock transaction data - in a real app, this would come from the SDK
const generateMockTransactions = (nftId: string): NFTTransfer[] => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  
  return [
    {
      nftId,
      fromId: '0x0000000000000000000000000000000000000000',
      toId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
      timestamp: now - (7 * day),
      blockHeight: 150000,
      coreBlockHeight: 850000
    },
    {
      nftId,
      fromId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
      toId: '7FcQvuJm8EtRpLqY9NxVd2HkS6T3Wf1Xb4Ac9Zn2Mp8K',
      timestamp: now - (3 * day),
      blockHeight: 150245,
      coreBlockHeight: 850175
    },
    {
      nftId,
      fromId: '7FcQvuJm8EtRpLqY9NxVd2HkS6T3Wf1Xb4Ac9Zn2Mp8K',
      toId: '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
      timestamp: now - (1 * day),
      blockHeight: 150432,
      coreBlockHeight: 850298
    }
  ];
};

export function NFTTransactionHistory({ nftId }: NFTTransactionHistoryProps) {
  const [transfers, setTransfers] = useState<NFTTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const loadTransactionHistory = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would call the SDK:
        // const history = await getNFTHistory(nftId);
        
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
        const mockTransfers = generateMockTransactions(nftId);
        setTransfers(mockTransfers);
      } catch (error) {
        console.error('Failed to load transaction history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactionHistory();
  }, [nftId]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: string) => {
    if (address === '0x0000000000000000000000000000000000000000') {
      return 'Minted';
    }
    if (address.length <= 16) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const getTransactionType = (transfer: NFTTransfer) => {
    if (transfer.fromId === '0x0000000000000000000000000000000000000000') {
      return { type: 'mint', label: 'Minted', color: 'text-green-400' };
    }
    return { type: 'transfer', label: 'Transfer', color: 'text-blue-400' };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, show toast notification
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
        <h2 className="text-xl font-bold text-white mb-6">Transaction History</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-800 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayedTransfers = expanded ? transfers : transfers.slice(0, 3);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Transaction History</h2>
        <div className="text-gray-400 text-sm">
          {transfers.length} transaction{transfers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {transfers.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">No transaction history available</div>
          <div className="text-gray-500 text-sm">
            Transaction data will appear as the NFT is transferred
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedTransfers.map((transfer, index) => {
            const txType = getTransactionType(transfer);
            const isFirst = index === 0;
            const isLast = index === displayedTransfers.length - 1;
            
            return (
              <div key={`${transfer.blockHeight}-${index}`} className="relative">
                {/* Timeline Line */}
                {!isLast && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-600 z-0"></div>
                )}
                
                <div className="bg-gray-900/50 rounded-xl p-4 relative z-10">
                  <div className="flex items-start space-x-4">
                    {/* Transaction Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      txType.type === 'mint' 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'bg-blue-500/20 border border-blue-500/30'
                    }`}>
                      {txType.type === 'mint' ? (
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      )}
                    </div>

                    {/* Transaction Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-medium ${txType.color}`}>
                          {txType.label}
                        </h3>
                        <div className="text-gray-400 text-sm">
                          {formatDate(transfer.timestamp)}
                        </div>
                      </div>

                      {/* Transfer Details */}
                      <div className="space-y-2 text-sm">
                        {txType.type === 'mint' ? (
                          <div className="text-gray-300">
                            NFT created and minted to{' '}
                            <button
                              onClick={() => copyToClipboard(transfer.toId)}
                              className="text-[#00D4FF] hover:text-[#0099CC] font-mono"
                            >
                              {formatAddress(transfer.toId)}
                            </button>
                          </div>
                        ) : (
                          <div className="text-gray-300">
                            From{' '}
                            <button
                              onClick={() => copyToClipboard(transfer.fromId)}
                              className="text-[#00D4FF] hover:text-[#0099CC] font-mono"
                            >
                              {formatAddress(transfer.fromId)}
                            </button>
                            {' '}to{' '}
                            <button
                              onClick={() => copyToClipboard(transfer.toId)}
                              className="text-[#00D4FF] hover:text-[#0099CC] font-mono"
                            >
                              {formatAddress(transfer.toId)}
                            </button>
                          </div>
                        )}

                        {/* Block Information */}
                        <div className="flex items-center space-x-4 text-gray-400">
                          <div className="flex items-center space-x-1">
                            <span>Block:</span>
                            <span className="font-mono text-xs">
                              {transfer.blockHeight.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Core:</span>
                            <span className="font-mono text-xs">
                              {transfer.coreBlockHeight.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Show More/Less Button */}
          {transfers.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full py-3 text-[#00D4FF] hover:text-[#0099CC] transition-colors text-sm font-medium"
            >
              {expanded 
                ? `Show less` 
                : `Show ${transfers.length - 3} more transaction${transfers.length - 3 !== 1 ? 's' : ''}`
              }
            </button>
          )}
        </div>
      )}

      {/* Blockchain Verification */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="text-white font-medium">Verified on Dash Platform</div>
            <div className="text-gray-400 text-sm">
              All transactions are cryptographically verified and immutable
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}