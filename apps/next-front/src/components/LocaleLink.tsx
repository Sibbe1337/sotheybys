'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ComponentProps } from 'react';

/**
 * LocaleLink - Preserves ?lang= query parameter across all navigation
 * 
 * Usage:
 *   <LocaleLink href="/property/pengerkatu-25">View Property</LocaleLink>
 * 
 * This ensures if user is on ?lang=sv, the link will be /property/pengerkatu-25?lang=sv
 */
export function LocaleLink({ 
  href, 
  children, 
  ...rest 
}: ComponentProps<typeof Link>) {
  const searchParams = useSearchParams();
  const currentLang = searchParams.get('lang') || 'fi';
  
  // Handle href as string or object
  let finalHref: string | { pathname: string; query: Record<string, string> };
  
  if (typeof href === 'string') {
    // Parse existing query params from href
    const [pathname, existingQuery] = href.split('?');
    const params = new URLSearchParams(existingQuery);
    
    // Add lang if not already present
    if (!params.has('lang')) {
      params.set('lang', currentLang);
    }
    
    finalHref = `${pathname}${params.toString() ? '?' + params.toString() : ''}`;
  } else if (typeof href === 'object' && 'pathname' in href && href.pathname) {
    // Handle object href
    const existingQuery = (href as any).query || {};
    const queryObj = typeof existingQuery === 'object' ? existingQuery : {};
    
    finalHref = {
      pathname: href.pathname as string,
      query: {
        ...queryObj,
        lang: queryObj.lang || currentLang,
      },
    };
  } else {
    finalHref = href as any;
  }
  
  return <Link href={finalHref} {...rest}>{children}</Link>;
}

/**
 * Hook to get current locale-aware router
 * Use this for programmatic navigation: router.push(..., { lang })
 */
export function useLocaleRouter() {
  const searchParams = useSearchParams();
  const currentLang = searchParams.get('lang') || 'fi';
  
  return {
    currentLang,
    pushWithLang: (pathname: string, query?: Record<string, string>) => {
      const params = new URLSearchParams({ ...query, lang: currentLang });
      window.location.href = `${pathname}?${params.toString()}`;
    },
  };
}

