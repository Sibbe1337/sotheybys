'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  path: string;
  target?: string;
  cssClasses?: string[];
  parentId?: string;
  childItems?: {
    nodes: MenuItem[];
  };
}

// Menu items for each language based on the original site
const menuTranslations = {
  fi: [
    { 
      id: '1', 
      label: 'Koti', 
      url: '/', 
      path: '/'
    },
    { 
      id: '2', 
      label: 'Kohteet', 
      url: '/kohteet', 
      path: '/kohteet',
      childItems: {
        nodes: [
          { 
            id: '2-1', 
            label: 'Myyntikohteet', 
            url: '/kohteet', 
            path: '/kohteet' 
          },
          { 
            id: '2-2', 
            label: 'Vuokrakohteet', 
            url: '/kohteet/vuokrakohteet', 
            path: '/kohteet/vuokrakohteet' 
          },
          { 
            id: '2-3', 
            label: 'Ostotoimeksiannot', 
            url: '/kohteet/ostotoimeksiannot', 
            path: '/kohteet/ostotoimeksiannot' 
          },
          { 
            id: '2-4', 
            label: 'Referenssit', 
            url: '/kohteet/referenssit', 
            path: '/kohteet/referenssit' 
          },
        ]
      }
    },
    { 
      id: '3', 
      label: 'Myymässä', 
      url: '/myymassa', 
      path: '/myymassa'
    },
    { 
      id: '4', 
      label: 'Kansainvälisesti', 
      url: '/kansainvalisesti', 
      path: '/kansainvalisesti'
    },
    { 
      id: '5', 
      label: 'Henkilöstö', 
      url: '/henkilosto', 
      path: '/henkilosto'
    },
    { 
      id: '6', 
      label: 'Ota yhteyttä', 
      url: '/yhteystiedot', 
      path: '/yhteystiedot',
      childItems: {
        nodes: [
          { 
            id: '6-1', 
            label: 'Yritys', 
            url: '/yritys', 
            path: '/yritys' 
          },
          { 
            id: '6-2', 
            label: 'Meille Töihin', 
            url: '/meille-toihin', 
            path: '/meille-toihin' 
          },
        ]
      }
    },
  ],
  sv: [
    { 
      id: '1', 
      label: 'Hem', 
      url: '/sv', 
      path: '/sv'
    },
    { 
      id: '2', 
      label: 'Objekt', 
      url: '/sv/objekt', 
      path: '/sv/objekt',
      childItems: {
        nodes: [
          { 
            id: '2-1', 
            label: 'Objekt till salu', 
            url: '/sv/objekt', 
            path: '/sv/objekt' 
          },
          { 
            id: '2-2', 
            label: 'Hyresobjekt', 
            url: '/sv/objekt/hyresobjekt', 
            path: '/sv/objekt/hyresobjekt' 
          },
          { 
            id: '2-3', 
            label: 'Köpuppdrag', 
            url: '/sv/objekt/kopuppdrag', 
            path: '/sv/objekt/kopuppdrag' 
          },
          { 
            id: '2-4', 
            label: 'Referenser', 
            url: '/sv/objekt/referenser', 
            path: '/sv/objekt/referenser' 
          },
        ]
      }
    },
    { 
      id: '3', 
      label: 'Sälj med oss', 
      url: '/sv/salj-med-oss', 
      path: '/sv/salj-med-oss'
    },
    { 
      id: '4', 
      label: 'Internationellt', 
      url: '/sv/internationellt', 
      path: '/sv/internationellt'
    },
    { 
      id: '5', 
      label: 'Personal', 
      url: '/sv/personal', 
      path: '/sv/personal'
    },
    { 
      id: '6', 
      label: 'Kontakta oss', 
      url: '/sv/kontakta-oss', 
      path: '/sv/kontakta-oss',
      childItems: {
        nodes: [
          { 
            id: '6-1', 
            label: 'Om oss', 
            url: '/sv/om-oss', 
            path: '/sv/om-oss' 
          },
          { 
            id: '6-2', 
            label: 'Jobba hos oss', 
            url: '/sv/jobba-hos-oss', 
            path: '/sv/jobba-hos-oss' 
          },
        ]
      }
    },
  ],
  en: [
    { 
      id: '1', 
      label: 'Home', 
      url: '/en', 
      path: '/en'
    },
    { 
      id: '2', 
      label: 'Properties', 
      url: '/en/properties', 
      path: '/en/properties',
      childItems: {
        nodes: [
          { 
            id: '2-1', 
            label: 'Properties for Sale', 
            url: '/en/properties', 
            path: '/en/properties' 
          },
          { 
            id: '2-2', 
            label: 'Rental Properties', 
            url: '/en/properties/rentals', 
            path: '/en/properties/rentals' 
          },
          { 
            id: '2-3', 
            label: 'Purchase Assignments', 
            url: '/en/properties/purchase-assignments', 
            path: '/en/properties/purchase-assignments' 
          },
          { 
            id: '2-4', 
            label: 'References', 
            url: '/en/properties/references', 
            path: '/en/properties/references' 
          },
        ]
      }
    },
    { 
      id: '3', 
      label: 'Sell with Us', 
      url: '/en/sell-with-us', 
      path: '/en/sell-with-us'
    },
    { 
      id: '4', 
      label: 'International', 
      url: '/en/international', 
      path: '/en/international'
    },
    { 
      id: '5', 
      label: 'Staff', 
      url: '/en/staff', 
      path: '/en/staff'
    },
    { 
      id: '6', 
      label: 'Contact Us', 
      url: '/en/contact-us', 
      path: '/en/contact-us',
      childItems: {
        nodes: [
          { 
            id: '6-1', 
            label: 'About Us', 
            url: '/en/about-us', 
            path: '/en/about-us' 
          },
          { 
            id: '6-2', 
            label: 'Work with Us', 
            url: '/en/work-with-us', 
            path: '/en/work-with-us' 
          },
        ]
      }
    },
  ]
};

// Path translations for language switching
const pathTranslations: { [key: string]: { fi: string; sv: string; en: string } } = {
  '/': { fi: '/', sv: '/sv', en: '/en' },
  '/kohteet': { fi: '/kohteet', sv: '/sv/objekt', en: '/en/properties' },
  '/myymassa': { fi: '/myymassa', sv: '/sv/salj-med-oss', en: '/en/sell-with-us' },
  '/kansainvalisesti': { fi: '/kansainvalisesti', sv: '/sv/internationellt', en: '/en/international' },
  '/henkilosto': { fi: '/henkilosto', sv: '/sv/personal', en: '/en/staff' },
  '/yhteystiedot': { fi: '/yhteystiedot', sv: '/sv/kontakta-oss', en: '/en/contact-us' },
  '/yritys': { fi: '/yritys', sv: '/sv/om-oss', en: '/en/about-us' },
  '/meille-toihin': { fi: '/meille-toihin', sv: '/sv/jobba-hos-oss', en: '/en/work-with-us' },
  // Swedish paths
  '/sv': { fi: '/', sv: '/sv', en: '/en' },
  '/sv/objekt': { fi: '/kohteet', sv: '/sv/objekt', en: '/en/properties' },
  '/sv/salj-med-oss': { fi: '/myymassa', sv: '/sv/salj-med-oss', en: '/en/sell-with-us' },
  '/sv/internationellt': { fi: '/kansainvalisesti', sv: '/sv/internationellt', en: '/en/international' },
  '/sv/personal': { fi: '/henkilosto', sv: '/sv/personal', en: '/en/staff' },
  '/sv/kontakta-oss': { fi: '/yhteystiedot', sv: '/sv/kontakta-oss', en: '/en/contact-us' },
  '/sv/om-oss': { fi: '/yritys', sv: '/sv/om-oss', en: '/en/about-us' },
  '/sv/jobba-hos-oss': { fi: '/meille-toihin', sv: '/sv/jobba-hos-oss', en: '/en/work-with-us' },
  // English paths
  '/en': { fi: '/', sv: '/sv', en: '/en' },
  '/en/properties': { fi: '/kohteet', sv: '/sv/objekt', en: '/en/properties' },
  '/en/sell-with-us': { fi: '/myymassa', sv: '/sv/salj-med-oss', en: '/en/sell-with-us' },
  '/en/international': { fi: '/kansainvalisesti', sv: '/sv/internationellt', en: '/en/international' },
  '/en/staff': { fi: '/henkilosto', sv: '/sv/personal', en: '/en/staff' },
  '/en/contact-us': { fi: '/yhteystiedot', sv: '/sv/kontakta-oss', en: '/en/contact-us' },
  '/en/about-us': { fi: '/yritys', sv: '/sv/om-oss', en: '/en/about-us' },
  '/en/work-with-us': { fi: '/meille-toihin', sv: '/sv/jobba-hos-oss', en: '/en/work-with-us' },
};

export default function Header() {
  const [currentLang, setCurrentLang] = useState<'fi' | 'sv' | 'en'>('fi');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuTranslations.fi);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const pathname = usePathname();
  
  // Helper function to get translated path
  const getTranslatedPath = (targetLang: 'fi' | 'sv' | 'en'): string => {
    // Check if we have a translation for the current path
    const translations = pathTranslations[pathname];
    if (translations) {
      return translations[targetLang];
    }
    
    // For property detail pages, handle the pattern /property/[slug]
    if (pathname.includes('/property/')) {
      const slug = pathname.split('/property/')[1];
      if (targetLang === 'fi') return `/property/${slug}`;
      if (targetLang === 'sv') return `/sv/property/${slug}`;
      if (targetLang === 'en') return `/en/property/${slug}`;
    }
    
    // Default fallback to homepage
    if (targetLang === 'fi') return '/';
    if (targetLang === 'sv') return '/sv';
    return '/en';
  };

  // Detect language from URL
  useEffect(() => {
    if (pathname.startsWith('/sv')) {
      setCurrentLang('sv');
      setMenuItems(menuTranslations.sv);
    } else if (pathname.startsWith('/en')) {
      setCurrentLang('en');
      setMenuItems(menuTranslations.en);
    } else {
      setCurrentLang('fi');
      setMenuItems(menuTranslations.fi);
    }
  }, [pathname]);

  // Comment out the API fetch to use only our default menu items
  // useEffect(() => {
  //   // Fetch menu items from WordPress
  //   const fetchMenuItems = async () => {
  //     try {
  //       const response = await fetch('/api/menu/PRIMARY');
  //       if (response.ok) {
  //         const items = await response.json();
  //         if (items && items.length > 0) {
  //           setMenuItems(items);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching menu items:', error);
  //     }
  //   };
  //   
  //   fetchMenuItems();
  // }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-primary)] text-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src="/images/logos/logo-white.png"
              alt="Snellman Sotheby's International Realty"
              width={300}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation and Right Section */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center">
              <ul className="flex items-center gap-2">
                {menuItems.map((item) => {
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
                        className={`flex items-center px-3 py-2 text-sm font-normal tracking-wider uppercase
                                   transition-all duration-200 ${
                                     isActive 
                                       ? 'text-white font-medium' 
                                       : 'text-white/80 hover:text-white'
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
                                  className="block px-4 py-3 text-sm text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors"
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
            
            {/* Language switcher and search */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Link 
                  href={getTranslatedPath('fi')} 
                  className={`transition-opacity ${currentLang === 'fi' ? 'font-semibold' : 'hover:opacity-80'}`}
                >
                  Suomi
                </Link>
                <span className="text-white/50">|</span>
                <Link 
                  href={getTranslatedPath('sv')} 
                  className={`transition-opacity ${currentLang === 'sv' ? 'font-semibold' : 'hover:opacity-80'}`}
                >
                  Svenska
                </Link>
                <span className="text-white/50">|</span>
                <Link 
                  href={getTranslatedPath('en')} 
                  className={`transition-opacity ${currentLang === 'en' ? 'font-semibold' : 'hover:opacity-80'}`}
                >
                  English
                </Link>
              </div>
              
              <input
                type="text"
                className="bg-white text-gray-900 px-3 py-1.5 rounded-sm text-sm w-48 focus:outline-none focus:ring-2 focus:ring-white/30"
                placeholder={currentLang === 'sv' ? 'Sök...' : currentLang === 'en' ? 'Search...' : 'Hae...'}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-white"
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
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden bg-[var(--color-primary)] border-t border-white/20 overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <nav className="max-w-[1400px] mx-auto px-6 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || 
                           (item.path !== '/' && pathname.startsWith(item.path));
            const hasChildren = item.childItems && item.childItems.nodes.length > 0;
            const isExpanded = expandedMobileMenu === item.id;
            
            return (
              <div key={item.id}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.path || item.url}
                    className={`block py-3 text-sm font-normal tracking-wide uppercase border-b border-white/10 flex-1
                             ${isActive 
                               ? 'text-white font-medium' 
                               : 'text-white/80 hover:text-white'
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
                        className="block py-2 text-sm text-white/70 hover:text-white border-b border-white/5"
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
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link 
                href={getTranslatedPath('fi')} 
                className={`transition-opacity ${currentLang === 'fi' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Suomi
              </Link>
              <span className="text-white/50">|</span>
              <Link 
                href={getTranslatedPath('sv')} 
                className={`transition-opacity ${currentLang === 'sv' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Svenska
              </Link>
              <span className="text-white/50">|</span>
              <Link 
                href={getTranslatedPath('en')} 
                className={`transition-opacity ${currentLang === 'en' ? 'font-semibold text-white' : 'text-white/80 hover:text-white'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                English
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}