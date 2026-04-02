'use client';

import { useState, useEffect } from 'react';
import { usePathname, Link } from '@/lib/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname as useNextPathname } from 'next/navigation';
import { getMenuItemsForLanguage } from './menu-items';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';

interface HeaderProps {
  menuItems?: any[];
  locale?: 'fi' | 'sv' | 'en';
}

export default function Header({ locale: propLocale }: HeaderProps) {
  const pathname = usePathname();
  const localeFromHook = useLocale() as 'fi' | 'sv' | 'en';
  const currentLang = propLocale || localeFromHook;

  const fullPathname = useNextPathname();
  const pathnameWithoutLocale = fullPathname.replace(/^\/(fi|sv|en)/, '') || '/';
  const languageSwitcherUrls = {
    fi: `/fi${pathnameWithoutLocale}`,
    sv: `/sv${pathnameWithoutLocale}`,
    en: `/en${pathnameWithoutLocale}`,
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  const items = getMenuItemsForLanguage(currentLang);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setIsScrolled(window.scrollY > 50); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const check = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsLandscape(window.innerWidth > window.innerHeight && window.innerWidth < 1280), 100);
    };
    check();
    window.addEventListener('resize', check, { passive: true });
    window.addEventListener('orientationchange', check);
    return () => { clearTimeout(timeout); window.removeEventListener('resize', check); window.removeEventListener('orientationchange', check); };
  }, []);

  return (
    <header
      key={currentLang}
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 bg-[var(--color-primary)] text-white transition-all duration-300 ${isScrolled || isLandscape ? 'shadow-lg' : ''}`}
    >
      {/* Top Bar — Language + Search (desktop only) */}
      <div className={`hidden md:block md:border-b md:border-white/10 transition-all duration-300 ${isScrolled || isLandscape ? 'md:py-1' : ''}`}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-end gap-6 py-2">
            <div className="hidden md:flex items-center gap-3 text-xs [font-family:'freight-sans-pro',sans-serif]">
              {(['fi', 'sv', 'en'] as const).map((lang, i) => (
                <span key={lang} className="contents">
                  {i > 0 && <span className="text-white/40">|</span>}
                  <NextLink href={languageSwitcherUrls[lang]} prefetch={true} className={`transition-opacity ${currentLang === lang ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}>
                    {lang === 'fi' ? 'Suomi' : lang === 'sv' ? 'Svenska' : 'English'}
                  </NextLink>
                </span>
              ))}
            </div>
            <input type="text" className="hidden md:block bg-white text-gray-900 px-4 py-1.5 text-xs w-56 focus:outline-none focus:ring-1 focus:ring-white/30" placeholder={currentLang === 'sv' ? 'Sök...' : currentLang === 'en' ? 'Search...' : 'Hae...'} />
          </div>
        </div>
      </div>

      {/* Main Bar — Logo + Nav */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-2 md:py-4' : 'py-4'}`}>
          <Link href="/" locale={currentLang} className="flex items-center flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <Image src="/images/logos/logo-white.png" alt="Snellman Sotheby's International Realty" width={550} height={165} className={`transition-all duration-300 w-auto ${isScrolled ? 'h-12 md:h-20' : 'h-16 md:h-24'}`} priority quality={100} />
          </Link>

          <DesktopNav items={items} currentLang={currentLang} pathname={pathname} />

          <button className="xl:hidden text-white p-3 -mr-2 z-50 relative" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <MobileMenu items={items} currentLang={currentLang} pathname={pathname} languageSwitcherUrls={languageSwitcherUrls} onClose={() => setIsMobileMenuOpen(false)} />
      )}
    </header>
  );
}
