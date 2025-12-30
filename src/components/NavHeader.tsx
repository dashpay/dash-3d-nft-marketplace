'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { UsernameDisplay } from '@/components/auth/UsernameDisplay';

interface NavHeaderProps {
  className?: string;
}

export function NavHeader({ className = '' }: NavHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, isAuthenticated } = useStore();

  if (!isAuthenticated) return null;

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { href: '/gallery', label: 'Gallery', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { href: '/mint', label: 'Mint', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    )},
  ];

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-2xl bg-[#050508]/80 border-b border-white/[0.06] ${className}`}>
      <div className="section-container">
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-4 hover:opacity-90 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#008de4] to-[#00D4FF] flex items-center justify-center shadow-lg shadow-[#008de4]/25 group-hover:shadow-[#008de4]/40 transition-shadow">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-xl tracking-tight">Dash 3D</span>
              <span className="text-[#00D4FF] font-bold text-xl ml-1.5">NFT</span>
            </div>
          </button>

          {/* Navigation Links - Premium Pill Style */}
          <div className="hidden md:block">
            <div className="nav-pills">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`nav-pill ${pathname === item.href ? 'nav-pill-active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {/* User Badge - Desktop */}
            <div
              className="hidden lg:flex items-center rounded-2xl bg-[#12121a] border border-white/[0.08] hover:border-white/[0.15] hover:bg-[#16162a] transition-all duration-300 cursor-pointer"
              style={{ padding: '12px 24px 12px 16px', gap: '16px' }}
            >
              {/* Icon container */}
              <div
                className="rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] grid place-items-center"
                style={{ width: '40px', height: '40px', flexShrink: 0 }}
              >
                <svg
                  className="text-white"
                  style={{ width: '20px', height: '20px' }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              {/* Text */}
              <div className="flex flex-col justify-center">
                <span
                  className="uppercase tracking-wider text-[#64748b] font-medium"
                  style={{ fontSize: '10px', lineHeight: '1.2' }}
                >
                  Account
                </span>
                <UsernameDisplay
                  className="font-semibold text-white"
                  style={{ fontSize: '14px', lineHeight: '1.2', marginTop: '2px' }}
                  showFullId={false}
                  maxWidth="90px"
                />
              </div>
            </div>

            {/* Mobile Nav */}
            <div className="flex md:hidden items-center gap-1.5 bg-white/[0.03] rounded-2xl p-1.5 border border-white/[0.06]">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-[#008de4] to-[#00D4FF] text-white shadow-lg shadow-[#008de4]/30'
                      : 'text-[#64748b] hover:text-white hover:bg-white/[0.06]'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </div>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="group flex items-center rounded-2xl bg-[#1a1a2e] border border-white/[0.08] hover:border-white/[0.15] hover:bg-[#1e1e35] transition-all duration-300"
              style={{ padding: '12px 24px 12px 16px', gap: '16px' }}
              title="Sign out"
            >
              {/* Icon container */}
              <div
                className="rounded-xl bg-white/[0.05] border border-white/[0.08] grid place-items-center group-hover:bg-red-500/10 group-hover:border-red-500/20 transition-all duration-300"
                style={{ width: '40px', height: '40px', flexShrink: 0 }}
              >
                <svg
                  className="text-[#64748b] group-hover:text-red-400 transition-colors duration-300"
                  style={{ width: '20px', height: '20px' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              {/* Text label */}
              <span
                className="hidden sm:block font-semibold text-[#94a3b8] group-hover:text-white transition-colors duration-300"
                style={{ fontSize: '14px', lineHeight: '1', whiteSpace: 'nowrap' }}
              >
                Sign out
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavHeader;
