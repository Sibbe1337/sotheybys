'use client';

import { useState, useEffect } from 'react';

const CONSENT_KEY = 'cookie-consent';

type ConsentStatus = 'pending' | 'accepted' | 'rejected';

export function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === 'accepted') {
        setStatus('accepted');
        loadAnalytics();
      } else if (stored === 'rejected') {
        setStatus('rejected');
      } else {
        // Small delay to avoid flash during page transitions/redirects
        const timer = setTimeout(() => setVisible(true), 500);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage not available (SSR)
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setStatus('accepted');
    setVisible(false);
    loadAnalytics();
  };

  const reject = () => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setStatus('rejected');
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#002349] text-white p-4 sm:p-6 shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm font-light leading-relaxed">
          <p>
            Käytämme evästeitä parantaaksemme sivuston toimintaa ja analysoidaksemme liikennettä. 
            Hyväksymällä sallit analytiikkaevästeiden käytön.{' '}
            <a href="/fi/tietosuojaseloste" className="underline hover:text-gray-300">
              Tietosuojaseloste
            </a>
          </p>
          <p className="mt-1 text-xs text-white/70">
            Vi använder cookies för att förbättra webbplatsen och analysera trafik. /
            We use cookies to improve the site and analyze traffic.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={reject}
            className="px-5 py-2.5 border border-white/40 text-white text-sm font-medium uppercase tracking-wider hover:bg-white/10 transition-colors"
          >
            Hylkää / Reject
          </button>
          <button
            onClick={accept}
            className="px-5 py-2.5 bg-white text-[#002349] text-sm font-medium uppercase tracking-wider hover:bg-gray-100 transition-colors"
          >
            Hyväksy / Accept
          </button>
        </div>
      </div>
    </div>
  );
}

function loadAnalytics() {
  const GA_ID = 'G-6YW3BK0MFG';
  
  if (document.querySelector(`script[src*="${GA_ID}"]`)) return;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_ID);
  };
}

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
