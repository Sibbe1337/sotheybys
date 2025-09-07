import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl, getPlaceholderImage } from '@/config/images';

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
    };
  };
}

interface PropertyGridProps {
  properties: Property[];
  showStatus?: boolean;
}

export default function PropertyGrid({ properties, showStatus = true }: PropertyGridProps) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-light">Kohteita ei löytynyt.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {properties.map((property, index) => {
        const propertyData = property.acfRealEstate?.property;
        const imageUrl = property.featuredImage?.node?.sourceUrl || 
                        getPlaceholderImage('property');
        const address = propertyData?.address || property.title;
        const city = propertyData?.city || '';
        const area = propertyData?.area || '';
        const description = propertyData?.description || '';
        const price = propertyData?.price;
        const bedrooms = propertyData?.bedrooms;
        const bathrooms = propertyData?.bathrooms;
        
        return (
          <Link 
            key={property.id} 
            href={`/kohde/${property.slug}`}
            className="group cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image Container with Advanced Hover Effects */}
            <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
              {/* Main Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 
                         group-hover:scale-110"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 
                            translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <div className="text-white space-y-3">
                  <h3 className="text-2xl font-light tracking-wide">
                    {address}
                  </h3>
                  
                  {/* Property Details */}
                  <div className="flex flex-wrap items-center gap-4 text-sm font-light">
                    {area && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {area} m²
                      </span>
                    )}
                    {bedrooms && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        {bedrooms} mh
                      </span>
                    )}
                    {bathrooms && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {bathrooms} kph
                      </span>
                    )}
                  </div>
                  
                  {/* View Button */}
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-sm font-light uppercase tracking-wider 
                                   border-b border-white/60 pb-1 group-hover:gap-3 transition-all duration-300">
                      Näytä kohde
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Status Badge */}
              {showStatus && propertyData?.status && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs 
                                 font-light uppercase tracking-wider">
                    {propertyData.status}
                  </span>
                </div>
              )}
            </div>
            
            {/* Property Info */}
            <div className="mt-4 space-y-2">
              <h4 className="text-xl font-light text-gray-900 group-hover:text-[#1a3a4a] 
                           transition-colors duration-300">
                {address}{city && `, ${city}`}
              </h4>
              
              {/* Quick Info */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                {area && (
                  <span className="font-light">{area} m²</span>
                )}
                {bedrooms && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="font-light">{bedrooms} makuuhuonetta</span>
                  </>
                )}
                {propertyData?.propertyType && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="font-light">{propertyData.propertyType}</span>
                  </>
                )}
              </div>
              
              {/* Description */}
              {description && (
                <p className="text-gray-600 font-light text-sm line-clamp-2">
                  {description}
                </p>
              )}
              
              {/* Price */}
              {price && (
                <p className="text-2xl font-light text-gray-900 mt-3">
                  {parseInt(price) > 10000 
                    ? new Intl.NumberFormat('fi-FI', { 
                        style: 'currency', 
                        currency: 'EUR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(parseInt(price))
                    : price
                  }
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}