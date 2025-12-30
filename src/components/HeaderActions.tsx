'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { UsernameDisplay } from '@/components/auth/UsernameDisplay';

interface HeaderActionsProps {
  className?: string;
}

export function HeaderActions({ className = '' }: HeaderActionsProps) {
  const router = useRouter();
  const { logout } = useStore();

  return (
    <div className={`flex items-center gap-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-2.5 shadow-lg ${className}`}>
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#8B5CF6] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="hidden sm:block">
          <div className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Account</div>
          <UsernameDisplay className="text-xs font-bold text-white whitespace-nowrap" showFullId={false} />
        </div>
      </div>
      <Button onClick={() => router.push('/dashboard')} variant="ghost" size="sm" className="h-10">
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
        </svg>
        Dashboard
      </Button>
      <Button onClick={logout} variant="danger" size="sm" className="h-10">
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </Button>
    </div>
  );
}

export default HeaderActions;
