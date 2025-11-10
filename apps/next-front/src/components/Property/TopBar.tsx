'use client';

import { t } from '@/lib/i18n/property-translations';
import type { Locale } from '@/lib/domain/property.types';

interface TopBarProps {
  address: string;
  postalCode: string;
  city: string;
  agentEmail?: string;
  locale: Locale;
}

/**
 * Top Bar - PDF spec s.3-4
 * Shows "Till salu › [address]" breadcrumb and "TA KONTAKT" button
 */
export function TopBar({ address, postalCode, city, agentEmail, locale }: TopBarProps) {
  const translations = {
    forSale: {
      fi: 'Myynnissä',
      sv: 'Till salu',
      en: 'For Sale'
    },
    contact: {
      fi: 'OTA YHTEYTTÄ',
      sv: 'TA KONTAKT',
      en: 'CONTACT US'
    }
  };

  const fullAddress = `${address}, ${postalCode} ${city}`;
  const contactSubject = `${translations.forSale[locale]}: ${fullAddress}`;
  const mailtoLink = agentEmail 
    ? `mailto:${agentEmail}?subject=${encodeURIComponent(contactSubject)}`
    : 'mailto:info@sothebysrealty.fi';

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Breadcrumb - Dennis: Better mobile truncation */}
          <div className="flex items-center text-xs sm:text-sm text-gray-600 min-w-0 flex-1">
            <span className="font-medium text-gray-900 whitespace-nowrap">{translations.forSale[locale]}</span>
            <span className="mx-1 sm:mx-2">›</span>
            <span className="truncate">{fullAddress}</span>
          </div>

          {/* Contact Button - Dennis: Smaller on mobile */}
          <a
            href={mailtoLink}
            className="px-3 sm:px-6 py-1.5 sm:py-2 bg-[#002349] text-white font-semibold rounded hover:bg-[#001731] transition-colors whitespace-nowrap text-xs sm:text-sm flex-shrink-0"
          >
            {translations.contact[locale]}
          </a>
        </div>
      </div>
    </div>
  );
}

