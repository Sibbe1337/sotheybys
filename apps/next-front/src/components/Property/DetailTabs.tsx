'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Hook for managing tab navigation with query parameters
 * Preserves locale prefix and other query params
 */
export function useTabRouting() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  
  return (nextTab: string) => {
    const q = new URLSearchParams(search as any);
    q.set('tab', nextTab);
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  };
}

/**
 * Hook to get the active tab from query parameters
 */
export function useActiveTab(defaultTab = 'overview') {
  const search = useSearchParams();
  return search.get('tab') ?? defaultTab;
}

