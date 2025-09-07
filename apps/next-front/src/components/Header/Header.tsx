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

// Menu items based on the original site
const defaultMenuItems: MenuItem[] = [
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
        { id: '2-1', label: 'Myyntikohteet', url: '/kohteet', path: '/kohteet' },
        { id: '2-2', label: 'Vuokrakohteet', url: '/kohteet/vuokrakohteet', path: '/kohteet/vuokrakohteet' },
        { id: '2-3', label: 'Ostotoimeksiannot', url: '/kohteet/ostotoimeksiannot', path: '/kohteet/ostotoimeksiannot' },
        { id: '2-4', label: 'Referenssit', url: '/kohteet/referenssit', path: '/kohteet/referenssit' },
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
        { id: '6-1', label: 'Yritys', url: '/yritys', path: '/yritys' },
        { id: '6-2', label: 'Meille töihin', url: '/meille-toihin', path: '/meille-toihin' },
      ]
    }
  },
];

export default function Header() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Fetch menu items from WordPress
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu/PRIMARY');
        if (response.ok) {
          const items = await response.json();
          if (items && items.length > 0) {
            setMenuItems(items);
          }
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    
    fetchMenuItems();
  }, []);

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
    <>
      {/* Top bar with language switcher */}
      <div className="bg-[#002349] text-white text-xs py-2">
        <div className="container mx-auto px-4 flex justify-end items-center space-x-4">
          <Link href="/sv" className="hover:text-white/80 transition-colors">
            Svenska
          </Link>
          <span className="text-white/40">|</span>
          <Link href="/en" className="hover:text-white/80 transition-colors">
            English
          </Link>
        </div>
      </div>

      <header className="bg-[#002349] text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center group"
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              <ul className="flex items-center space-x-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.path || 
                                 (item.path !== '/' && pathname.startsWith(item.path));
                  const hasChildren = item.childItems && item.childItems.nodes.length > 0;
                  
                  return (
                    <li 
                      key={item.id} 
                      className="relative"
                      onMouseEnter={() => hasChildren && setActiveDropdown(item.id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <Link
                        href={item.path || item.url}
                        className={`block px-4 py-2 text-[13px] uppercase tracking-wider font-normal
                                   transition-colors duration-200 ${
                                     isActive 
                                       ? 'text-white' 
                                       : 'text-white/90 hover:text-white'
                                   }`}
                        target={item.target}
                      >
                        {item.label}
                        {hasChildren && (
                          <span className="ml-1 text-[10px]">▼</span>
                        )}
                      </Link>
                      
                      {/* Dropdown Menu */}

                      {hasChildren && activeDropdown === item.id && item.childItems && (
                        <ul className="absolute left-0 top-full bg-[#002349] min-w-[200px] shadow-xl">
                          {item.childItems.nodes.map((child) => (
                            <li key={child.id}>
                              <Link
                                href={child.path || child.url}
                                className="block px-4 py-3 text-[13px] text-white/90 
                                         hover:text-white hover:bg-white/10 
                                         transition-colors duration-200 
                                         border-b border-white/10 last:border-0"
                                target={child.target}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Search Icon */}
              <button 
                className="ml-6 p-2 text-white/90 hover:text-white transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 relative z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span 
                  className={`block h-0.5 bg-white transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span 
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span 
                  className={`block h-0.5 bg-white transform transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden bg-[#002349] overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <nav className="container mx-auto px-4 py-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.path || 
                             (item.path !== '/' && pathname.startsWith(item.path));
              
              return (
                <div key={item.id}>
                  <Link
                    href={item.path || item.url}
                    className={`block py-3 text-sm uppercase tracking-wider border-b border-white/10
                             ${isActive 
                               ? 'text-white' 
                               : 'text-white/80 hover:text-white'
                             }`}
                    target={item.target}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  
                  {/* Mobile Submenu */}
                  {item.childItems && item.childItems.nodes.length > 0 && (
                    <div className="pl-4">
                      {item.childItems.nodes.map((child) => (
                        <Link
                          key={child.id}
                          href={child.path || child.url}
                          className="block py-2 text-sm text-white/60 
                                   hover:text-white transition-colors duration-200"
                          target={child.target}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}