'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);

  // Never render on server-side
  if (typeof window === 'undefined') {
    return <>{fallback}</>;
  }

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <div suppressHydrationWarning>{children}</div>;
}