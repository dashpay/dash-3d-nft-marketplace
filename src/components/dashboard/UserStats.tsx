'use client';

import React from 'react';

interface UserStatsProps {
  ownedCount: number;
  mintedCount: number;
}

// Dash logo SVG icon
const DashIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
  </svg>
);

export function UserStats({ ownedCount, mintedCount }: UserStatsProps) {
  const stats = [
    {
      label: 'Owned NFTs',
      value: ownedCount,
      gradient: 'from-[#008de4] to-[#00D4FF]',
      shadowColor: 'shadow-[#008de4]/30',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      label: 'Minted NFTs',
      value: mintedCount,
      gradient: 'from-[#8B5CF6] to-[#A855F7]',
      shadowColor: 'shadow-[#8B5CF6]/30',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      label: 'Total Value',
      value: '12.5',
      suffix: 'DASH',
      gradient: 'from-[#008de4] to-[#0066aa]',
      shadowColor: 'shadow-[#008de4]/30',
      icon: <DashIcon />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="stat-card group"
        >
          <div className="flex items-center gap-6">
            {/* Icon with generous sizing */}
            <div className={`stat-icon bg-gradient-to-br ${stat.gradient} text-white shadow-xl ${stat.shadowColor} group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}>
              {stat.icon}
            </div>

            {/* Stats content */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="stat-value">
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className="text-lg font-semibold text-[#008de4]">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div className="stat-label mt-1">
                {stat.label}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
