/**
 * PROPERTY GRID - NEW ARCHITECTURE
 * 
 * Renders a grid of PropertyCard components.
 * Uses Property domain objects directly.
 */

import type { Property, Locale } from '@/lib/domain/property.types';
import PropertyCard from './PropertyCard';
import type { CardVariant } from './PropertyCard';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => {
        // Determine card variant
        const rent = property.meta.rent || property.rental?.monthlyRent || 0;
        const isRental = rent > 0;
        const typeCode = (property.meta.typeCode || '').toLowerCase();
        const isApartment = typeCode.includes('kerrostalo') || typeCode.includes('flat') || typeCode.includes('apartment');
        
        let variant: CardVariant = 'property';
        if (isRental) variant = 'rental';
        else if (isApartment) variant = 'apartment';
        
        // Map address (without apartment number - Finnish law requirement)
        const addressParts = [
          property.address[locale] || property.address.fi,
          property.gate || '',
        ].filter(Boolean);
        const title = addressParts.join(' ').trim();
        
        // Map images (exclude floor plans)
        const images = (property.media.images || [])
          .filter(img => !img.floorPlan)
          .map(img => ({ url: img.url, alt: title }));
        
        // Get district from city
        const district = property.city[locale] || property.city.fi;
        
        // Get apartment type (huoneistoselitelmä)
        const apartmentTypeText = property.meta.apartmentTypeText?.[locale] || property.meta.apartmentTypeText?.fi;
        
        // Get listing type label
        const listingTypeLabel = property.meta.listingTypeLabel?.[locale] || property.meta.listingTypeLabel?.fi || property.meta.typeCode;
        
        return (
          <PropertyCard
            key={property.id}
            href={`/${locale}/kohde/${property.slug}`}
            locale={locale}
            title={title}
            listingTypeLabel={listingTypeLabel}
            apartmentTypeText={apartmentTypeText}
            district={district}
            images={images}
            variant={variant}
            livingArea={property.dimensions.living}
            otherArea={property.dimensions.other}
            plotArea={property.dimensions.plot}
            askPrice={property.pricing.sales}
            debtFreePrice={property.pricing.debtFree}
            monthlyRent={rent}
            priorityFirstImage={index === 0}
          />
        );
      })}
    </div>
  );
}

