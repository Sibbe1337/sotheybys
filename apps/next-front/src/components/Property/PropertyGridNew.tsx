/**
 * PROPERTY GRID - NEW ARCHITECTURE
 * 
 * Dennis: Use FeaturedPropertyCard (same as Hem page) with agent info
 * Renders a grid of FeaturedPropertyCard components.
 */

import type { Property, Locale } from '@/lib/domain/property.types';
import FeaturedPropertyCard from './FeaturedPropertyCard';
import type { FeaturedPropertyCardProps } from './FeaturedPropertyCard';

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
        
        let variant: 'apartment' | 'property' | 'rental' = 'property';
        if (isRental) variant = 'rental';
        else if (isApartment) variant = 'apartment';
        
        // Dennis: NO apartment number (mäklarregler), only street + gate
        const addressParts = [
          property.address[locale] || property.address.fi,
          property.gate || '',
        ].filter(Boolean);
        const addressWithApt = addressParts.join(' ').trim();
        
        // Add postal code and city for full address
        const postalCode = property.postalCode;
        const city = property.city[locale] || property.city.fi;
        const fullAddress = postalCode 
          ? `${addressWithApt}, ${postalCode} ${city}`.trim()
          : `${addressWithApt}, ${city}`.trim();
        
        // Simple title (used as image alt)
        const title = addressWithApt;
        
        // Dennis 2025-11-10: ENDAST 3 första bilderna ska visas i karusellen
        const images = (property.media.images || [])
          .filter(img => !img.floorPlan)
          .slice(0, 3)  // MAX 3 bilder
          .map(img => ({ url: img.url, alt: title }));
        
        // Dennis: Get STADSDEL (district), NOT city
        const district = property.district?.[locale] || property.district?.fi;
        
        // Get apartment type (huoneistoselitelmä)
        const apartmentType = property.meta.apartmentType?.[locale] || property.meta.apartmentType?.fi;
        
        // Get listing type label (with fallback to prevent undefined)
        const propertyType = property.meta.listingTypeLabel?.[locale] 
          || property.meta.listingTypeLabel?.fi 
          || property.meta.typeCode 
          || (variant === 'apartment' ? 'Kerrostalo' : variant === 'rental' ? 'Vuokrakohde' : 'Kiinteistö');
        
        // Calculate "other area" from balcony + terrace
        const balconyArea = property.dimensions.balcony || 0;
        const terraceArea = property.dimensions.terrace || 0;
        const otherArea = balconyArea + terraceArea > 0 ? balconyArea + terraceArea : undefined;
        
        // Agent info
        const agent = property.agent ? {
          name: property.agent.name || '',
          phone: property.agent.phone || '',
          email: property.agent.email || '',
          photoUrl: property.agent.photoUrl || undefined,
        } : undefined;
        
        return (
          <FeaturedPropertyCard
            key={property.id}
            href={`/${locale}/kohde/${property.slug}`}
            locale={locale}
            title={title}
            fullAddress={fullAddress}
            postalCode={property.postalCode}
            city={property.city[locale] || property.city.fi}
            propertyType={propertyType}
            district={district}
            apartmentType={apartmentType}
            images={images}
            showCarousel={true}  // Dennis: Objekt-fliken allows browsing images without opening
            variant={variant}
            debtFreePrice={property.pricing.debtFree}
            askPrice={property.pricing.sales}
            monthlyRent={rent}
            livingArea={property.dimensions.living}
            otherArea={otherArea}
            totalArea={property.dimensions.total}
            plotArea={property.dimensions.plot}
            agent={agent}
          />
        );
      })}
    </div>
  );
}

