'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: 'Mint New NFT',
      description: 'Create a unique 3D masterpiece on the blockchain',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
      ),
      action: () => router.push('/mint'),
      gradient: 'from-[#008de4] to-[#00D4FF]',
      shadowColor: 'shadow-[#008de4]/25',
      primary: true
    },
    {
      title: 'Browse Gallery',
      description: 'Explore and manage your NFT collection',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      action: () => router.push('/gallery'),
      gradient: 'from-[#8B5CF6] to-[#A855F7]',
      shadowColor: 'shadow-[#8B5CF6]/25'
    },
    {
      title: 'Marketplace',
      description: 'Discover and trade NFTs with other collectors',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      action: () => router.push('/gallery?tab=marketplace'),
      gradient: 'from-[#EC4899] to-[#F472B6]',
      shadowColor: 'shadow-[#EC4899]/25'
    }
  ];

  return (
    <div>
      <div className="mb-8 lg:mb-10">
        <h2 className="section-title">Quick Actions</h2>
        <p className="section-subtitle mb-0">Get started with common tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={action.action}
            className={`action-card group ${action.primary ? 'action-card-primary' : ''}`}
          >
            <div className="flex items-center gap-5">
              {/* Icon with generous padding */}
              <div className={`action-icon bg-gradient-to-br ${action.gradient} text-white shadow-xl ${action.shadowColor} group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}>
                {action.icon}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-1.5 group-hover:text-white transition-colors">
                  {action.title}
                </h3>
                <p className="text-[#64748b] text-sm leading-relaxed group-hover:text-[#94a3b8] transition-colors">
                  {action.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="text-[#475569] group-hover:text-white group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
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
