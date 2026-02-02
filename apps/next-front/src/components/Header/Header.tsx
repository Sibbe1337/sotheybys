'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, Link } from '@/lib/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname as useNextPathname } from 'next/navigation';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  url: string;
  target?: string;
  childItems?: {
    nodes: MenuItem[];
  };
}

interface HeaderProps {
  menuItems?: MenuItem[];
  locale?: 'fi' | 'sv' | 'en';
}

export default function Header({ menuItems, locale: propLocale }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const localeFromHook = useLocale() as 'fi' | 'sv' | 'en';
  
  // 🔥 LINUS FIX: Use prop locale if provided (from server), fallback to hook
  const locale = propLocale || localeFromHook;
  
  // ✅ CRITICAL FIX: Strip any locale prefix from pathname as safeguard
  // This prevents double locale prefixes like /en/sv/kohde/...
  const cleanPathname = pathname
    .replace(/^\/(fi|sv|en)/, '') // Remove leading locale
    .replace(/^$/, '/');          // Ensure at least /
  
  // ✅ FIX: Use locale directly - now from prop or hook
  const currentLang = locale;

  // 🔥 LINUS-NIVÅ FIX: For language switcher, use full pathname with locale
  // This handles dynamic routes like /kohde/[slug] correctly
  const fullPathname = useNextPathname(); // Includes locale: /sv/kohde/slug
  const pathnameWithoutLocale = fullPathname.replace(/^\/(fi|sv|en)/, '') || '/';
  
  // Build language switcher URLs manually to handle dynamic routes
  const languageSwitcherUrls = {
    fi: `/fi${pathnameWithoutLocale}`,
    sv: `/sv${pathnameWithoutLocale}`,
    en: `/en${pathnameWithoutLocale}`,
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // 🔥 LINUS FIX: Use filesystem paths (Finnish names) - App Router limitation
  // App Router uses filesystem-based routes, cannot use pathname mappings
  // All routes MUST match filesystem structure: kohteet, henkilosto, myymassa, etc.
  const getMenuItemsForLanguage = (lang: string): MenuItem[] => {
    // ALL LOCALES use same Finnish filesystem paths
    // Labels match the old website: sothebysrealty.fi/sv/ and sothebysrealty.fi/en/
      return [
      { id: '1', label: lang === 'sv' ? 'Hem' : lang === 'en' ? 'Home' : 'Koti', path: '/', url: '/' },
        { 
          id: '2', 
        label: lang === 'sv' ? 'Objekt' : lang === 'en' ? 'Properties' : 'Kohteet', 
        path: '/kohteet', 
        url: '/kohteet',
          childItems: {
            nodes: [
            { 
              id: '2-1', 
              label: lang === 'sv' ? 'Objekt till salu' : lang === 'en' ? 'Properties for sale' : 'Myyntikohteet', 
              path: '/kohteet', 
              url: '/kohteet' 
            },
            { 
              id: '2-2', 
              label: lang === 'sv' ? 'Hyresobjekt' : lang === 'en' ? 'Rental listings' : 'Vuokrakohteet', 
              path: '/kohteet/vuokrakohteet', 
              url: '/kohteet/vuokrakohteet' 
            },
            { 
              id: '2-3', 
              label: lang === 'sv' ? 'Köpuppdrag' : lang === 'en' ? 'Purchase Mandate' : 'Ostotoimeksiannot', 
              path: '/kohteet/ostotoimeksiannot', 
              url: '/kohteet/ostotoimeksiannot' 
            },
            { 
              id: '2-4', 
              label: lang === 'sv' ? 'Referenser' : lang === 'en' ? 'References' : 'Referenssit', 
              path: '/kohteet/referenssit', 
              url: '/kohteet/referenssit' 
            },
            ]
          }
        },
      { 
        id: '3', 
        label: lang === 'sv' ? 'Sälj med oss' : lang === 'en' ? 'Sell with us' : 'Myymässä', 
        path: '/myymassa', 
        url: '/myymassa' 
      },
      { 
        id: '4', 
        label: lang === 'sv' ? 'Internationellt' : lang === 'en' ? 'International' : 'Kansainvälisesti', 
        path: '/kansainvalisesti', 
        url: '/kansainvalisesti' 
      },
      { 
        id: '5', 
        label: lang === 'sv' ? 'Personal' : lang === 'en' ? 'Personnel' : 'Henkilöstö', 
        path: '/henkilosto', 
        url: '/henkilosto' 
      },
        { 
          id: '6', 
        label: lang === 'sv' ? 'Kontakta oss' : lang === 'en' ? 'Contact us' : 'Ota yhteyttä', 
        path: '/yhteystiedot', 
        url: '/yhteystiedot',
          childItems: {
            nodes: [
            { 
              id: '6-1', 
              label: lang === 'sv' ? 'Om oss' : lang === 'en' ? 'About' : 'Yritys', 
              path: '/yritys', 
              url: '/yritys' 
            },
            { 
              id: '6-2', 
              label: lang === 'sv' ? 'Jobba hos oss' : lang === 'en' ? 'Join us' : 'Meille töihin', 
              path: '/en/meille-toihin',  // 🔥 LINUS FIX: Careers page is ONLY in English
              url: '/en/meille-toihin' 
            },
            ]
          }
        },
      ];
  };

  // ✅ LINUS FIX: Always use dynamic menu items based on current language
  // This ensures menu updates when language changes
  const items = getMenuItemsForLanguage(currentLang);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Scroll listener för komprimerande header - THROTTLED for performance
  useEffect(() => {
    let ticking = false;
    let lastScrollY = 0;
    
    const handleScroll = () => {
      lastScrollY = window.scrollY;
      
      if (!ticking) {
        // Use requestAnimationFrame for smooth 60fps throttling
        requestAnimationFrame(() => {
          setIsScrolled(lastScrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Landscape orientation detector för mobil - THROTTLED for performance
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const checkOrientation = () => {
      // Debounce resize events to prevent excessive re-renders
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const isLandscapeMode = window.innerWidth > window.innerHeight && window.innerWidth < 1024;
        setIsLandscape(isLandscapeMode);
        // Don't auto-close menu in landscape - let user control it
      }, 100); // 100ms debounce
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation, { passive: true });
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return (
    <header 
      key={currentLang}
      className={`sticky top-0 z-50 bg-[var(--color-primary)] text-white transition-all duration-300 ${
        isScrolled || isLandscape ? 'shadow-lg' : ''
      }`}
    >
      {/* TOP BAR - RAD 1 (Language + Search) - Dölj på mobil när scrollad ELLER landscape */}
      <div className={`md:border-b md:border-white/10 transition-all duration-300 ${
        isScrolled || isLandscape ? 'hidden md:block md:py-1' : 'block'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-end gap-6 py-2">
            {/* Language Switcher - 🔥 LINUS FIX: Use native Link for dynamic routes */}
            <div className="hidden md:flex items-center gap-3 text-xs [font-family:'freight-sans-pro',sans-serif]">
              <NextLink
                href={languageSwitcherUrls.fi}
                prefetch={true}
                className={`transition-opacity ${currentLang === 'fi' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
              >
                Suomi
              </NextLink>
              <span className="text-white/40">|</span>
              <NextLink
                href={languageSwitcherUrls.sv}
                prefetch={true}
                className={`transition-opacity ${currentLang === 'sv' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
              >
                Svenska
              </NextLink>
              <span className="text-white/40">|</span>
              <NextLink
                href={languageSwitcherUrls.en}
                prefetch={true}
                className={`transition-opacity ${currentLang === 'en' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
              >
                English
              </NextLink>
            </div>
            
            {/* Search Box */}
            <input
              type="text"
              className="hidden md:block bg-white text-gray-900 px-4 py-1.5 text-xs w-56 focus:outline-none focus:ring-1 focus:ring-white/30"
              placeholder={currentLang === 'sv' ? 'Sök...' : currentLang === 'en' ? 'Search...' : 'Hae...'}
            />
          </div>
        </div>
      </div>

      {/* MAIN HEADER BAR - RAD 2 (Logo + Navigation) - Compressed on mobile scroll */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'py-2 md:py-4' : 'py-4'
        }`}>
          {/* Logo - Smaller on mobile scroll (Dennis fix: save screen space) */}
          <Link 
            href="/" 
            locale={currentLang}
            className="flex items-center flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src="/images/logos/logo-white.png"
              alt="Snellman Sotheby's International Realty"
              width={550}
              height={165}
              className={`transition-all duration-300 w-auto ${
                isScrolled ? 'h-12 md:h-20' : 'h-16 md:h-24'
              }`}
              priority
              quality={100}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center gap-1">
              {items.map((item) => {
                const isActive = pathname === item.path || 
                               (item.path !== '/' && pathname.startsWith(item.path));
                
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
                      className={`flex items-center py-2 px-5 text-sm font-bold uppercase tracking-[0.2em]
                                 transition-all duration-200 [font-family:'freight-sans-pro',sans-serif] ${
                                   isActive 
                                     ? 'text-[var(--color-gold)]' 
                                     : 'text-white hover:text-[var(--color-gold)]'
                                 }`}
                      target={item.target}
                    >
                      {item.label}
                    </Link>
                    
                    {/* Dropdown menu */}
                    {item.childItems && item.childItems.nodes.length > 0 && activeDropdown === item.id && (
                      <div className="absolute top-full left-0 mt-0 w-64 bg-[#f5f3f0] shadow-lg z-50">
                        <ul className="py-2">
                          {item.childItems.nodes.map((childItem) => {
                            const childPath = childItem.path || childItem.url;
                            // 🔥 LINUS FIX: Use NextLink for paths that already include locale (e.g., /en/meille-toihin)
                            const hasLocalePrefix = childPath.match(/^\/(fi|sv|en)\//);
                            
                            return (
                              <li key={childItem.id}>
                                {hasLocalePrefix ? (
                                  <NextLink
                                    href={childPath}
                                    prefetch={true}
                                    className="block px-4 py-3 text-sm text-gray-700 hover:text-[var(--color-gold)] hover:bg-gray-50 transition-colors [font-family:'freight-sans-pro',sans-serif]"
                                    target={childItem.target}
                                  >
                                    {childItem.label}
                                  </NextLink>
                                ) : (
                                  <Link
                                    href={childPath as any}
                                    locale={currentLang}
                                    prefetch={true}
                                    className="block px-4 py-3 text-sm text-gray-700 hover:text-[var(--color-gold)] hover:bg-gray-50 transition-colors [font-family:'freight-sans-pro',sans-serif]"
                                    target={childItem.target}
                                  >
                                    {childItem.label}
                                  </Link>
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

          {/* Mobile Menu Button - Larger touch area for landscape mode */}
          <button 
            className="lg:hidden text-white p-3 -mr-2 z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              className="w-7 h-7"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Statisk storlek */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[var(--color-primary)]">
          <nav className="max-w-[1400px] mx-auto px-6 py-2">
            {/* Mobile Navigation */}
            {items.map((item) => {
              const isActive = pathname === item.path;
              const hasChildren = item.childItems && item.childItems.nodes.length > 0;
              const isExpanded = expandedMobileMenu === item.id;
              
              return (
                <div key={item.id}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={(item.path || item.url) as any}
                      locale={currentLang}
                      prefetch={true}
                      className={`block py-3 text-sm font-bold tracking-[0.15em] uppercase border-b border-white/10 flex-1
                               [font-family:'freight-sans-pro',sans-serif] ${isActive 
                                 ? 'text-[var(--color-gold)]' 
                                 : 'text-white hover:text-[var(--color-gold)]'
                               }`}
                      target={item.target}
                      onClick={() => {
                        if (!hasChildren) {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={() => setExpandedMobileMenu(isExpanded ? null : item.id)}
                        className="p-3 text-white/80 hover:text-white"
                      >
                        <svg 
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Mobile dropdown items */}
                  {hasChildren && isExpanded && item.childItems && (
                    <div className="pl-4 bg-white/5">
                      {item.childItems.nodes.map((childItem) => {
                        const childPath = childItem.path || childItem.url;
                        // 🔥 LINUS FIX: Use NextLink for paths that already include locale (e.g., /en/meille-toihin)
                        const hasLocalePrefix = childPath.match(/^\/(fi|sv|en)\//);
                        
                        return hasLocalePrefix ? (
                          <NextLink
                            key={childItem.id}
                            href={childPath}
                            className="block py-2 text-sm text-white/80 hover:text-[var(--color-gold)] border-b border-white/5 [font-family:'freight-sans-pro',sans-serif]"
                            target={childItem.target}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {childItem.label}
                          </NextLink>
                        ) : (
                          <Link
                            key={childItem.id}
                            href={childPath as any}
                            locale={currentLang}
                            className="block py-2 text-sm text-white/80 hover:text-[var(--color-gold)] border-b border-white/5 [font-family:'freight-sans-pro',sans-serif]"
                            target={childItem.target}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {childItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Mobile Language Switcher - 🔥 LINUS FIX: Use native Link for dynamic routes */}
            <div className="mt-4 pt-4">
              <div className="flex items-center justify-center gap-4 text-xs pb-4">
                <NextLink
                  href={languageSwitcherUrls.fi}
                  className={`transition-opacity [font-family:'freight-sans-pro',sans-serif] ${currentLang === 'fi' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Suomi
                </NextLink>
                <span className="text-white/40">|</span>
                <NextLink
                  href={languageSwitcherUrls.sv}
                  className={`transition-opacity [font-family:'freight-sans-pro',sans-serif] ${currentLang === 'sv' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Svenska
                </NextLink>
                <span className="text-white/40">|</span>
                <NextLink
                  href={languageSwitcherUrls.en}
                  className={`transition-opacity [font-family:'freight-sans-pro',sans-serif] ${currentLang === 'en' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  English
                </NextLink>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
