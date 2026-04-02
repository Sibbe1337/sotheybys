'use client';

import { useState } from 'react';
import { Link } from '@/lib/navigation';
import NextLink from 'next/link';
import type { MenuItem } from './menu-items';

interface Props {
  items: MenuItem[];
  currentLang: 'fi' | 'sv' | 'en';
  pathname: string;
  languageSwitcherUrls: { fi: string; sv: string; en: string };
  onClose: () => void;
}

export default function MobileMenu({ items, currentLang, pathname, languageSwitcherUrls, onClose }: Props) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  return (
    <div className="xl:hidden bg-[var(--color-primary)]">
      <nav className="max-w-[1400px] mx-auto px-6 py-2">
        {items.map((item) => {
          const isActive = pathname === item.path;
          const hasChildren = item.childItems && item.childItems.nodes.length > 0;
          const isExpanded = expandedMenu === item.id;

          return (
            <div key={item.id}>
              <div className="flex items-center justify-between">
                <Link
                  href={(item.path || item.url) as any}
                  locale={currentLang}
                  prefetch={true}
                  className={`block py-3 text-sm font-bold tracking-[0.15em] uppercase border-b border-white/10 flex-1 [font-family:'freight-sans-pro',sans-serif] ${
                    isActive ? 'text-[var(--color-gold)]' : 'text-white hover:text-[var(--color-gold)]'
                  }`}
                  target={item.target}
                  onClick={() => { if (!hasChildren) onClose(); }}
                >
                  {item.label}
                </Link>
                {hasChildren && (
                  <button onClick={() => setExpandedMenu(isExpanded ? null : item.id)} className="p-3 text-white/80 hover:text-white">
                    <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>

              {hasChildren && isExpanded && item.childItems && (
                <div className="pl-4 bg-white/5">
                  {item.childItems.nodes.map((child) => {
                    const childPath = child.path || child.url;
                    const hasLocalePrefix = childPath.match(/^\/(fi|sv|en)\//);
                    const cls = "block py-2 text-sm text-white/80 hover:text-[var(--color-gold)] border-b border-white/5 [font-family:'freight-sans-pro',sans-serif]";

                    return hasLocalePrefix ? (
                      <NextLink key={child.id} href={childPath} className={cls} target={child.target} onClick={onClose}>{child.label}</NextLink>
                    ) : (
                      <Link key={child.id} href={childPath as any} locale={currentLang} className={cls} target={child.target} onClick={onClose}>{child.label}</Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Mobile Language Switcher */}
        <div className="mt-4 pt-4">
          <div className="flex items-center justify-center gap-4 text-xs pb-4">
            {(['fi', 'sv', 'en'] as const).map((lang, i) => (
              <span key={lang} className="contents">
                {i > 0 && <span className="text-white/40">|</span>}
                <NextLink
                  href={languageSwitcherUrls[lang]}
                  className={`transition-opacity [font-family:'freight-sans-pro',sans-serif] ${currentLang === lang ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
                  onClick={onClose}
                >
                  {lang === 'fi' ? 'Suomi' : lang === 'sv' ? 'Svenska' : 'English'}
                </NextLink>
              </span>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
