'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: 'Mint New NFT',
      description: 'Create a new 3D NFT',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      action: () => router.push('/mint'),
      gradient: 'from-[#00D4FF] to-[#0099CC]',
      primary: true
    },
    {
      title: 'Browse Gallery',
      description: 'Explore your collection',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      action: () => router.push('/gallery'),
      gradient: 'from-[#8B5CF6] to-[#6D28D9]'
    },
    {
      title: 'Marketplace',
      description: 'Buy and sell NFTs',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
        </svg>
      ),
      action: () => router.push('/gallery?tab=marketplace'),
      gradient: 'from-[#FF0080] to-[#CC0066]'
    }
  ];

  return (
    <div className="mb-12 lg:mb-16">
      <h2 className="text-2xl font-bold text-white mb-8 lg:mb-10">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {actions.map((action, index) => (
          <button
            key={action.title}
            onClick={action.action}
            className={`p-6 lg:p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 text-left group ${
              action.primary 
                ? 'bg-gradient-to-r from-[#00D4FF]/20 to-[#0099CC]/20' 
                : 'bg-white/5 hover:bg-white/10'
            } backdrop-blur-sm`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${action.gradient} text-white group-hover:scale-110 transition-transform duration-300`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  {action.description}
                </p>
              </div>
              <div className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}