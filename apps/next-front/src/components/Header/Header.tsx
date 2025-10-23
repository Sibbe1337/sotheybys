'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { LocaleLink } from '@/components/LocaleLink';

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
}

export default function Header({ menuItems }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<string>('fi');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // Multilingual menu items
  const getMenuItemsForLanguage = (lang: string): MenuItem[] => {
    if (lang === 'sv') {
      return [
        { id: '1', label: 'HEM', path: '/sv', url: '/sv' },
        { 
          id: '2', 
          label: 'OBJEKT', 
          path: '/sv/objekt', 
          url: '/sv/objekt',
          childItems: {
            nodes: [
              { id: '2-1', label: 'Försäljningsobjekt', path: '/sv/objekt', url: '/sv/objekt' },
              { id: '2-2', label: 'Hyresobjekt', path: '/sv/objekt/hyresobjekt', url: '/sv/objekt/hyresobjekt' },
              { id: '2-3', label: 'Köpuppdrag', path: '/sv/objekt/kopuppdrag', url: '/sv/objekt/kopuppdrag' },
              { id: '2-4', label: 'Referenser', path: '/sv/objekt/referenser', url: '/sv/objekt/referenser' },
            ]
          }
        },
        { id: '3', label: 'SÄLJA', path: '/sv/salj-med-oss', url: '/sv/salj-med-oss' },
        { id: '4', label: 'INTERNATIONELLT', path: '/sv/internationellt', url: '/sv/internationellt' },
        { id: '5', label: 'PERSONAL', path: '/sv/personal', url: '/sv/personal' },
        { 
          id: '6', 
          label: 'KONTAKTA OSS', 
          path: '/sv/kontakta-oss', 
          url: '/sv/kontakta-oss',
          childItems: {
            nodes: [
              { id: '6-1', label: 'Kontaktuppgifter', path: '/sv/kontakta-oss', url: '/sv/kontakta-oss' },
              { id: '6-2', label: 'Företaget', path: '/sv/om-oss', url: '/sv/om-oss' },
            ]
          }
        },
      ];
    } else if (lang === 'en') {
      return [
        { id: '1', label: 'HOME', path: '/en', url: '/en' },
        { 
          id: '2', 
          label: 'PROPERTIES', 
          path: '/en/properties', 
          url: '/en/properties',
          childItems: {
            nodes: [
              { id: '2-1', label: 'For Sale', path: '/en/properties', url: '/en/properties' },
              { id: '2-2', label: 'For Rent', path: '/en/properties/rentals', url: '/en/properties/rentals' },
              { id: '2-3', label: 'Purchase Assignments', path: '/en/properties/purchase-assignments', url: '/en/properties/purchase-assignments' },
              { id: '2-4', label: 'References', path: '/en/properties/references', url: '/en/properties/references' },
            ]
          }
        },
        { id: '3', label: 'SELLING', path: '/en/sell-with-us', url: '/en/sell-with-us' },
        { id: '4', label: 'INTERNATIONALLY', path: '/en/international', url: '/en/international' },
        { id: '5', label: 'STAFF', path: '/en/staff', url: '/en/staff' },
        { 
          id: '6', 
          label: 'CONTACT US', 
          path: '/en/contact-us', 
          url: '/en/contact-us',
          childItems: {
            nodes: [
              { id: '6-1', label: 'Contact Info', path: '/en/contact-us', url: '/en/contact-us' },
              { id: '6-2', label: 'About Us', path: '/en/about', url: '/en/about' },
            ]
          }
        },
      ];
    } else {
      // Finnish (default)
      return [
        { id: '1', label: 'KOTI', path: '/', url: '/' },
        { 
          id: '2', 
          label: 'KOHTEET', 
          path: '/kohteet', 
          url: '/kohteet',
          childItems: {
            nodes: [
              { id: '2-1', label: 'Myyntikohteet', path: '/kohteet', url: '/kohteet' },
              { id: '2-2', label: 'Vuokrakohteet', path: '/kohteet/vuokrakohteet', url: '/kohteet/vuokrakohteet' },
              { id: '2-3', label: 'Ostotoimeksiannot', path: '/kohteet/ostotoimeksiannot', url: '/kohteet/ostotoimeksiannot' },
              { id: '2-4', label: 'Referenssit', path: '/kohteet/referenssit', url: '/kohteet/referenssit' },
            ]
          }
        },
        { id: '3', label: 'MYYMÄSSÄ', path: '/myymassa', url: '/myymassa' },
        { id: '4', label: 'KANSAINVÄLISESTI', path: '/kansainvalisesti', url: '/kansainvalisesti' },
        { id: '5', label: 'HENKILÖSTÖ', path: '/henkilosto', url: '/henkilosto' },
        { 
          id: '6', 
          label: 'OTA YHTEYTTÄ', 
          path: '/ota-yhteytta', 
          url: '/ota-yhteytta',
          childItems: {
            nodes: [
              { id: '6-1', label: 'Yhteystiedot', path: '/yhteystiedot', url: '/yhteystiedot' },
              { id: '6-2', label: 'Yritys', path: '/yritys', url: '/yritys' },
            ]
          }
        },
      ];
    }
  };

  const items = menuItems || getMenuItemsForLanguage(currentLang);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    if (lang) {
      setCurrentLang(lang);
    }
  }, []);

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
    <header className={`sticky top-0 z-50 bg-[var(--color-primary)] text-white transition-all duration-300 ${
      isScrolled || isLandscape ? 'shadow-lg' : ''
    }`}>
      {/* TOP BAR - RAD 1 (Language + Search) - Dölj på mobil när scrollad ELLER landscape */}
      <div className={`border-b border-white/10 transition-all duration-300 ${
        isScrolled || isLandscape ? 'hidden md:block md:py-1' : 'block'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-end gap-6 py-2">
            {/* Language Switcher */}
            <div className="hidden md:flex items-center gap-3 text-xs [font-family:'freight-sans-pro',sans-serif]">
              <button 
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('lang', 'fi');
                  window.location.href = url.toString();
                }}
                className={`transition-opacity ${currentLang === 'fi' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
              >
                Suomi
              </button>
              <span className="text-white/40">|</span>
              <button 
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('lang', 'sv');
                  window.location.href = url.toString();
                }}
                className={`transition-opacity ${currentLang === 'sv' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
              >
                Svenska
              </button>
              <span className="text-white/40">|</span>
              <button 
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('lang', 'en');
                  window.location.href = url.toString();
                }}
                className={`transition-opacity ${currentLang === 'en' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
              >
                English
              </button>
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

      {/* MAIN HEADER BAR - RAD 2 (Logo + Navigation) - Komprimera på mobil när scrollad ELLER landscape */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isLandscape ? 'py-0.5' : isScrolled ? 'py-1 md:py-4' : 'py-4'
        }`}>
          {/* Logo - Mycket mindre på mobil landscape */}
          <LocaleLink 
            href="/" 
            className="flex items-center flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src="/images/logos/logo-white.png"
              alt="Snellman Sotheby's International Realty"
              width={isLandscape ? 150 : isScrolled ? 280 : 350}
              height={isLandscape ? 45 : isScrolled ? 84 : 105}
              className={isLandscape ? 'h-10 w-auto' : 'h-16 w-auto'}
              priority
              quality={100}
            />
          </LocaleLink>

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
                    <LocaleLink
                      href={item.path || item.url}
                      className={`flex items-center py-2 text-sm font-bold uppercase
                                 transition-all duration-200 [font-family:'freight-sans-pro',sans-serif] ${
                                   isLandscape ? 'px-2 text-xs tracking-[0.1em]' : 'px-5 tracking-[0.2em]'
                                 } ${
                                   isActive 
                                     ? 'text-[var(--color-gold)]' 
                                     : 'text-white hover:text-[var(--color-gold)]'
                                 }`}
                      target={item.target}
                    >
                      {item.label}
                    </LocaleLink>
                    
                    {/* Dropdown menu */}
                    {item.childItems && item.childItems.nodes.length > 0 && activeDropdown === item.id && (
                      <div className="absolute top-full left-0 mt-0 w-64 bg-[#f5f3f0] shadow-lg z-50">
                        <ul className="py-2">
                          {item.childItems.nodes.map((childItem) => (
                            <li key={childItem.id}>
                              <LocaleLink
                                href={childItem.path || childItem.url}
                                className="block px-4 py-3 text-sm text-gray-700 hover:text-[var(--color-gold)] hover:bg-gray-50 transition-colors [font-family:'freight-sans-pro',sans-serif]"
                                target={childItem.target}
                              >
                                {childItem.label}
                              </LocaleLink>
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

          {/* Mobile Menu Button - Mindre i landscape */}
          <button 
            className={`lg:hidden text-white ${isLandscape ? 'p-1' : 'p-2'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              className={isLandscape ? 'w-5 h-5' : 'w-6 h-6'}
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

      {/* Mobile Menu - Max-höjd och scroll i landscape */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden bg-[var(--color-primary)] border-t border-white/10 ${
          isLandscape ? 'max-h-[50vh] overflow-y-auto' : ''
        }`}>
          <nav className={`max-w-[1400px] mx-auto px-6 ${isLandscape ? 'py-2' : 'py-4'}`}>
            {/* Mobile Navigation */}
            {items.map((item) => {
              const isActive = pathname === item.path;
              const hasChildren = item.childItems && item.childItems.nodes.length > 0;
              const isExpanded = expandedMobileMenu === item.id;
              
              return (
                <div key={item.id}>
                  <div className="flex items-center justify-between">
                    <LocaleLink
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
                    </LocaleLink>
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
                        <LocaleLink
                          key={childItem.id}
                          href={childItem.path || childItem.url}
                          className="block py-2 text-sm text-white/80 hover:text-[var(--color-gold)] border-b border-white/5 [font-family:'freight-sans-pro',sans-serif]"
                          target={childItem.target}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {childItem.label}
                        </LocaleLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Mobile Language Switcher */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-center gap-4 text-xs">
                <button 
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('lang', 'fi');
                    window.location.href = url.toString();
                  }}
                  className={`transition-opacity [font-family:'freight-sans-pro',sans-serif] ${currentLang === 'fi' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
                >
                  Suomi
                </button>
                <span className="text-white/40">|</span>
                <button 
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('lang', 'sv');
                    window.location.href = url.toString();
                  }}
                  className={`transition-opacity [font-family:'freight-sans-pro',sans-serif] ${currentLang === 'sv' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
                >
                  Svenska
                </button>
                <span className="text-white/40">|</span>
                <button 
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('lang', 'en');
                    window.location.href = url.toString();
                  }}
                  className={`transition-opacity [font-family:'freight-sans-pro',sans-serif] ${currentLang === 'en' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
                >
                  English
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
