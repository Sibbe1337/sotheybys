/**
 * PROPERTY GRID - NEW ARCHITECTURE
 * 
 * Renders a grid of PropertyCardNew components.
 * Uses Property domain objects directly.
 */

import type { Property, Locale } from '@/lib/domain/property.types';
import PropertyCardNew from './PropertyCardNew';

interface PropertyGridNewProps {
  properties: Property[];
  locale: Locale;
}

export default function PropertyGridNew({ properties, locale }: PropertyGridNewProps) {
  if (!properties || properties.length === 0) {
    const emptyMessage = {
      fi: 'Ei kohteita saatavilla',
      sv: 'Inga objekt tillgängliga',
      en: 'No properties available'
    };
    
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-light">{emptyMessage[locale]}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {properties.map((property) => (
        <PropertyCardNew 
          key={property.id} 
          property={property} 
          locale={locale} 
        />
      ))}
    </div>
  );
}

