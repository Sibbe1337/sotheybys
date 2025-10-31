'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';

type L = 'fi' | 'sv' | 'en';

export function LocaleLink({ 
  href, 
  children, 
  locale,
  ...rest 
}: ComponentProps<typeof Link> & { locale?: L }) {
  const pathname = usePathname() || '/fi';
  const current = (pathname.split('/')[1] as L) || 'fi';
  const Lc: L = locale ?? current;

  const prefix = (p: string) => 
    p.startsWith('/fi') || p.startsWith('/sv') || p.startsWith('/en') 
      ? p 
      : `/${Lc}${p.startsWith('/') ? p : `/${p}`}`;

  let finalHref: any = href;
  if (typeof href === 'string') {
    finalHref = prefix(href);
  } else if (href && typeof href === 'object' && 'pathname' in href && href.pathname) {
    finalHref = { ...href, pathname: prefix(String(href.pathname)) };
  }
  
  return <Link href={finalHref} {...rest}>{children}</Link>;
}
