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
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium text-gray-900">{translations.forSale[locale]}</span>
            <span className="mx-2">›</span>
            <span className="truncate max-w-md">{fullAddress}</span>
          </div>

          {/* Contact Button */}
          <a
            href={mailtoLink}
            className="px-6 py-2 bg-[#002349] text-white font-semibold rounded hover:bg-[#001731] transition-colors whitespace-nowrap text-sm"
          >
            {translations.contact[locale]}
          </a>
        </div>
      </div>
    </div>
  );
}

