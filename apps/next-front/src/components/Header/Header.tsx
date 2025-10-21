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

export default function Header({ menuItems = [] }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<string>('fi');

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

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-primary)] text-white">
      {/* TOP BAR - RAD 1 (Language + Search) */}
      <div className="border-b border-white/10">
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

      {/* MAIN HEADER BAR - RAD 2 (Logo + Navigation) */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <LocaleLink 
            href="/" 
            className="flex items-center flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src="/sothebys-logo-white.svg"
              alt="Snellman Sotheby's International Realty"
              width={280}
              height={84}
              className="h-16 w-auto"
              priority
            />
          </LocaleLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center gap-1">
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
                      className={`flex items-center px-5 py-2 text-sm font-normal tracking-[0.2em] uppercase
                                 transition-all duration-200 [font-family:'freight-sans-pro',sans-serif] ${
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[var(--color-primary)] border-t border-white/10">
          <nav className="max-w-[1400px] mx-auto px-6 py-4">
            {/* Mobile Navigation */}
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const hasChildren = item.childItems && item.childItems.nodes.length > 0;
              const isExpanded = expandedMobileMenu === item.id;
              
              return (
                <div key={item.id}>
                  <div className="flex items-center justify-between">
                    <LocaleLink
                      href={item.path || item.url}
                      className={`block py-3 text-sm font-normal tracking-[0.15em] uppercase border-b border-white/10 flex-1
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
