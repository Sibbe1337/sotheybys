'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, Link } from '@/lib/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';

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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // 🔥 LINUS FIX: Use semantic path keys - next-intl handles locale translation!
  // All paths are now semantic keys that map to localized URLs via pathnames.ts
  const getMenuItemsForLanguage = (lang: string): MenuItem[] => {
    if (lang === 'sv') {
      return [
        { id: '1', label: 'HEM', path: '/', url: '/' },
        { 
          id: '2', 
          label: 'OBJEKT', 
          path: '/properties', 
          url: '/properties',
          childItems: {
            nodes: [
              { id: '2-1', label: 'Försäljningsobjekt', path: '/properties', url: '/properties' },
              { id: '2-2', label: 'Hyresobjekt', path: '/properties/rentals', url: '/properties/rentals' },
              { id: '2-3', label: 'Köpuppdrag', path: '/properties/purchase-assignments', url: '/properties/purchase-assignments' },
              { id: '2-4', label: 'Referenser', path: '/properties/references', url: '/properties/references' },
            ]
          }
        },
        { id: '3', label: 'SÄLJA', path: '/sell', url: '/sell' },
        { id: '4', label: 'INTERNATIONELLT', path: '/international', url: '/international' },
        { id: '5', label: 'PERSONAL', path: '/staff', url: '/staff' },
        { 
          id: '6', 
          label: 'KONTAKTA OSS', 
          path: '/contact', 
          url: '/contact',
          childItems: {
            nodes: [
              { id: '6-1', label: 'Kontaktuppgifter', path: '/contact/info', url: '/contact/info' },
              { id: '6-2', label: 'Företaget', path: '/about', url: '/about' },
            ]
          }
        },
      ];
    } else if (lang === 'en') {
      return [
        { id: '1', label: 'HOME', path: '/', url: '/' },
        { 
          id: '2', 
          label: 'PROPERTIES', 
          path: '/properties', 
          url: '/properties',
          childItems: {
            nodes: [
              { id: '2-1', label: 'For Sale', path: '/properties', url: '/properties' },
              { id: '2-2', label: 'For Rent', path: '/properties/rentals', url: '/properties/rentals' },
              { id: '2-3', label: 'Purchase Assignments', path: '/properties/purchase-assignments', url: '/properties/purchase-assignments' },
              { id: '2-4', label: 'References', path: '/properties/references', url: '/properties/references' },
            ]
          }
        },
        { id: '3', label: 'SELLING', path: '/sell', url: '/sell' },
        { id: '4', label: 'INTERNATIONALLY', path: '/international', url: '/international' },
        { id: '5', label: 'STAFF', path: '/staff', url: '/staff' },
        { 
          id: '6', 
          label: 'CONTACT US', 
          path: '/contact', 
          url: '/contact',
          childItems: {
            nodes: [
              { id: '6-1', label: 'Contact Info', path: '/contact/info', url: '/contact/info' },
              { id: '6-2', label: 'About Us', path: '/about', url: '/about' },
            ]
          }
        },
      ];
    } else {
      // Finnish (default) - also uses semantic keys
      return [
        { id: '1', label: 'KOTI', path: '/', url: '/' },
        { 
          id: '2', 
          label: 'KOHTEET', 
          path: '/properties', 
          url: '/properties',
          childItems: {
            nodes: [
              { id: '2-1', label: 'Myyntikohteet', path: '/properties', url: '/properties' },
              { id: '2-2', label: 'Vuokrakohteet', path: '/properties/rentals', url: '/properties/rentals' },
              { id: '2-3', label: 'Ostotoimeksiannot', path: '/properties/purchase-assignments', url: '/properties/purchase-assignments' },
              { id: '2-4', label: 'Referenssit', path: '/properties/references', url: '/properties/references' },
            ]
          }
        },
        { id: '3', label: 'MYYMÄSSÄ', path: '/sell', url: '/sell' },
        { id: '4', label: 'KANSAINVÄLISESTI', path: '/international', url: '/international' },
        { id: '5', label: 'HENKILÖSTÖ', path: '/staff', url: '/staff' },
        { 
          id: '6', 
          label: 'OTA YHTEYTTÄ', 
          path: '/contact', 
          url: '/contact',
          childItems: {
            nodes: [
              { id: '6-1', label: 'Yhteystiedot', path: '/contact/info', url: '/contact/info' },
              { id: '6-2', label: 'Yritys', path: '/about', url: '/about' },
            ]
          }
        },
      ];
    }
  };

  // ✅ LINUS FIX: Always use dynamic menu items based on current language
  // This ensures menu updates when language changes
  const items = getMenuItemsForLanguage(currentLang);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Scroll listener för komprimerande header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Landscape orientation detector för mobil
  useEffect(() => {
    const checkOrientation = () => {
      const isLandscapeMode = window.innerWidth > window.innerHeight && window.innerWidth < 1024;
      setIsLandscape(isLandscapeMode);
      
      // Stäng mobilmenyn automatiskt i landscape för att inte täcka skärmen
      if (isLandscapeMode && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, [isMobileMenuOpen]);

  return (
    <header 
      key={currentLang}
      className={`sticky top-0 z-50 bg-[var(--color-primary)] text-white transition-all duration-300 ${
        isScrolled || isLandscape ? 'shadow-lg' : ''
      }`}
    >
      {/* TOP BAR - RAD 1 (Language + Search) - Dölj på mobil när scrollad ELLER landscape */}
      <div className={`border-b border-white/10 transition-all duration-300 ${
        isScrolled || isLandscape ? 'hidden md:block md:py-1' : 'block'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-end gap-6 py-2">
            {/* Language Switcher */}
            <div className="hidden md:flex items-center gap-3 text-xs [font-family:'freight-sans-pro',sans-serif]">
              <Link
                href={cleanPathname}
                locale="fi"
                className={`transition-opacity ${currentLang === 'fi' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
              >
                Suomi
              </Link>
              <span className="text-white/40">|</span>
              <Link
                href={cleanPathname}
                locale="sv"
                className={`transition-opacity ${currentLang === 'sv' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
              >
                Svenska
              </Link>
              <span className="text-white/40">|</span>
              <Link
                href={cleanPathname}
                locale="en"
                className={`transition-opacity ${currentLang === 'en' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
              >
                English
              </Link>
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
                      href={item.path || item.url}
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
                          {item.childItems.nodes.map((childItem) => (
                            <li key={childItem.id}>
                              <Link
                                href={childItem.path || childItem.url}
                                className="block px-4 py-3 text-sm text-gray-700 hover:text-[var(--color-gold)] hover:bg-gray-50 transition-colors [font-family:'freight-sans-pro',sans-serif]"
                                target={childItem.target}
                              >
                                {childItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile Menu Button - Statisk storlek */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6"
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
        <div className="lg:hidden bg-[var(--color-primary)] border-t border-white/10">
          <nav className="max-w-[1400px] mx-auto px-6 py-4">
            {/* Mobile Navigation */}
            {items.map((item) => {
              const isActive = pathname === item.path;
              const hasChildren = item.childItems && item.childItems.nodes.length > 0;
              const isExpanded = expandedMobileMenu === item.id;
              
              return (
                <div key={item.id}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.path || item.url}
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
                      {item.childItems.nodes.map((childItem) => (
                        <Link
                          key={childItem.id}
                          href={childItem.path || childItem.url}
                          className="block py-2 text-sm text-white/80 hover:text-[var(--color-gold)] border-b border-white/5 [font-family:'freight-sans-pro',sans-serif]"
                          target={childItem.target}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {childItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Mobile Language Switcher */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-center gap-4 text-xs">
                <Link
                  href={cleanPathname}
                  locale="fi"
                  className={`transition-opacity [font-family:'freight-sans-pro',sans-serif] ${currentLang === 'fi' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Suomi
                </Link>
                <span className="text-white/40">|</span>
                <Link
                  href={cleanPathname}
                  locale="sv"
                  className={`transition-opacity [font-family:'freight-sans-pro',sans-serif] ${currentLang === 'sv' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Svenska
                </Link>
                <span className="text-white/40">|</span>
                <Link
                  href={cleanPathname}
                  locale="en"
                  className={`transition-opacity [font-family:'freight-sans-pro',sans-serif] ${currentLang === 'en' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  English
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
