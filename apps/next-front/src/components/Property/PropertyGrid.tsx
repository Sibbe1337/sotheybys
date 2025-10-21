import PropertyCard from './PropertyCard';
import { type SupportedLanguage, getHomepageTranslation } from '@/lib/homepage-translations';

interface Property {
  id: string;
  title: string;
  slug: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
    };
  };
  acfRealEstate?: {
    property?: {
      price?: string;
      address?: string;
      city?: string;
      bedrooms?: number;
      bathrooms?: number;
      area?: number;
      propertyType?: string;
      status?: string;
      description?: string;
    };
    agent?: {
      name?: string;
      email?: string;
      phone?: string;
      photo?: {
        sourceUrl: string;
        altText?: string;
      };
    };
  };
}

interface PropertyGridProps {
  properties: Property[];
  showStatus?: boolean;
  language?: SupportedLanguage;
}

export default function PropertyGrid({ properties, showStatus = true, language = 'fi' }: PropertyGridProps) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-light">{getHomepageTranslation('noPropertiesFound', language)}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title}
          slug={property.slug}
          excerpt={property.acfRealEstate?.property?.description || ''}
          featuredImage={property.featuredImage}
          property={{
            ...property.acfRealEstate?.property,
            price: property.acfRealEstate?.property?.price ? Number(property.acfRealEstate.property.price) : undefined
          }}
          agent={property.acfRealEstate?.agent}
          language={language}
        />
      ))}
    </div>
  );
}