'use client';

import { useState } from 'react';
import { Link } from '@/lib/navigation';
import NextLink from 'next/link';
import type { MenuItem } from './menu-items';

interface Props {
  items: MenuItem[];
  currentLang: 'fi' | 'sv' | 'en';
  pathname: string;
}

export default function DesktopNav({ items, currentLang, pathname }: Props) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden xl:flex items-center">
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));

          return (
            <li
              key={item.id}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={(item.path || item.url) as any}
                locale={currentLang}
                prefetch={true}
                className={`flex items-center py-2 px-5 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-200 [font-family:'freight-sans-pro',sans-serif] ${
                  isActive ? 'text-[var(--color-gold)]' : 'text-white hover:text-[var(--color-gold)]'
                }`}
                target={item.target}
              >
                {item.label}
              </Link>

              {item.childItems && item.childItems.nodes.length > 0 && activeDropdown === item.id && (
                <div className="absolute top-full left-0 mt-0 w-64 bg-[#f5f3f0] shadow-lg z-50">
                  <ul className="py-2">
                    {item.childItems.nodes.map((child) => {
                      const childPath = child.path || child.url;
                      const hasLocalePrefix = childPath.match(/^\/(fi|sv|en)\//);
                      const cls = "block px-4 py-3 text-sm text-gray-700 hover:text-[var(--color-gold)] hover:bg-gray-50 transition-colors [font-family:'freight-sans-pro',sans-serif]";

                      return (
                        <li key={child.id}>
                          {hasLocalePrefix ? (
                            <NextLink href={childPath} prefetch={true} className={cls} target={child.target}>{child.label}</NextLink>
                          ) : (
                            <Link href={childPath as any} locale={currentLang} prefetch={true} className={cls} target={child.target}>{child.label}</Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
