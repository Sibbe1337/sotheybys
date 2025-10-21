'use client';

import { useState, useEffect } from 'react';
import { LocaleLink } from '@/components/LocaleLink';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';

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

// Menu items for each language (using unified paths - no language prefix)
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
      url: '/', 
      path: '/'
    },
    { 
      id: '2', 
      label: 'Objekt', 
      url: '/kohteet', 
      path: '/kohteet',
      childItems: {
        nodes: [
          { 
            id: '2-1', 
            label: 'Objekt till salu', 
            url: '/kohteet', 
            path: '/kohteet' 
          },
          { 
            id: '2-2', 
            label: 'Hyresobjekt', 
            url: '/kohteet/vuokrakohteet', 
            path: '/kohteet/vuokrakohteet' 
          },
          { 
            id: '2-3', 
            label: 'Köpuppdrag', 
            url: '/kohteet/ostotoimeksiannot', 
            path: '/kohteet/ostotoimeksiannot' 
          },
          { 
            id: '2-4', 
            label: 'Referenser', 
            url: '/kohteet/referenssit', 
            path: '/kohteet/referenssit' 
          },
        ]
      }
    },
    { 
      id: '3', 
      label: 'Sälj med oss', 
      url: '/myymassa', 
      path: '/myymassa'
    },
    { 
      id: '4', 
      label: 'Internationellt', 
      url: '/kansainvalisesti', 
      path: '/kansainvalisesti'
    },
    { 
      id: '5', 
      label: 'Personal', 
      url: '/henkilosto', 
      path: '/henkilosto'
    },
    { 
      id: '6', 
      label: 'Kontakta oss', 
      url: '/yhteystiedot', 
      path: '/yhteystiedot',
      childItems: {
        nodes: [
          { 
            id: '6-1', 
            label: 'Om oss', 
            url: '/yritys', 
            path: '/yritys' 
          },
          { 
            id: '6-2', 
            label: 'Jobba hos oss', 
            url: '/meille-toihin', 
            path: '/meille-toihin' 
          },
        ]
      }
    },
  ],
  en: [
    { 
      id: '1', 
      label: 'Home', 
      url: '/', 
      path: '/'
    },
    { 
      id: '2', 
      label: 'Properties', 
      url: '/kohteet', 
      path: '/kohteet',
      childItems: {
        nodes: [
          { 
            id: '2-1', 
            label: 'Properties for Sale', 
            url: '/kohteet', 
            path: '/kohteet' 
          },
          { 
            id: '2-2', 
            label: 'Rental Properties', 
            url: '/kohteet/vuokrakohteet', 
            path: '/kohteet/vuokrakohteet' 
          },
          { 
            id: '2-3', 
            label: 'Purchase Assignments', 
            url: '/kohteet/ostotoimeksiannot', 
            path: '/kohteet/ostotoimeksiannot' 
          },
          { 
            id: '2-4', 
            label: 'References', 
            url: '/kohteet/referenssit', 
            path: '/kohteet/referenssit' 
          },
        ]
      }
    },
    { 
      id: '3', 
      label: 'Sell with Us', 
      url: '/myymassa', 
      path: '/myymassa'
    },
    { 
      id: '4', 
      label: 'International', 
      url: '/kansainvalisesti', 
      path: '/kansainvalisesti'
    },
    { 
      id: '5', 
      label: 'Staff', 
      url: '/henkilosto', 
      path: '/henkilosto'
    },
    { 
      id: '6', 
      label: 'Contact Us', 
      url: '/yhteystiedot', 
      path: '/yhteystiedot',
      childItems: {
        nodes: [
          { 
            id: '6-1', 
            label: 'About Us', 
            url: '/yritys', 
            path: '/yritys' 
          },
          { 
            id: '6-2', 
            label: 'Work with Us', 
            url: '/meille-toihin', 
            path: '/meille-toihin' 
          },
        ]
      }
    },
  ]
};

export default function Header() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentLang = (searchParams.get('lang') || 'fi') as 'fi' | 'sv' | 'en';
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuTranslations.fi);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);

  // Update menu items based on current language
  useEffect(() => {
    setMenuItems(menuTranslations[currentLang]);
  }, [currentLang]);

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
          <LocaleLink 
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
          </LocaleLink>

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
                      <LocaleLink
                        href={item.path || item.url}
                        className={`flex items-center px-3 py-2 text-sm font-normal tracking-wider uppercase
                                   transition-all duration-200 ${
                                     isActive 
                                       ? 'text-[var(--color-gold)] font-medium' 
                                       : 'text-white/90 hover:text-[var(--color-gold)]'
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
                                  className="block px-4 py-3 text-sm text-gray-700 hover:text-[var(--color-gold)] hover:bg-gray-50 transition-colors"
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
            
            {/* Language switcher and search */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-sm">
                <button 
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('lang', 'fi');
                    window.location.href = url.toString();
                  }}
                  className={`transition-opacity ${currentLang === 'fi' ? 'font-semibold' : 'hover:opacity-80'}`}
                >
                  Suomi
                </button>
                <span className="text-white/50">|</span>
                <button 
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('lang', 'sv');
                    window.location.href = url.toString();
                  }}
                  className={`transition-opacity ${currentLang === 'sv' ? 'font-semibold' : 'hover:opacity-80'}`}
                >
                  Svenska
                </button>
                <span className="text-white/50">|</span>
                <button 
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('lang', 'en');
                    window.location.href = url.toString();
                  }}
                  className={`transition-opacity ${currentLang === 'en' ? 'font-semibold' : 'hover:opacity-80'}`}
                >
                  English
                </button>
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
                  <LocaleLink
                    href={item.path || item.url}
                    className={`block py-3 text-sm font-normal tracking-wide uppercase border-b border-white/10 flex-1
                             ${isActive 
                               ? 'text-[var(--color-gold)] font-medium' 
                               : 'text-white/90 hover:text-[var(--color-gold)]'
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
                        className="block py-2 text-sm text-white/80 hover:text-[var(--color-gold)] border-b border-white/5"
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
            <div className="flex items-center justify-center gap-4 text-sm">
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
              <span className="text-white/50">|</span>
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
              <span className="text-white/50">|</span>
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
          </div>
        </nav>
      </div>
    </header>
  );
}