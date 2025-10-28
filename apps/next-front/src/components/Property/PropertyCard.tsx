'use client';

import Image from 'next/image';
import { LocaleLink } from '@/components/LocaleLink';
import { Property, Agent } from '@/lib/wordpress';
import { Price } from '@/components/ui/Price';
import { MetaRow } from '@/components/ui/MetaRow';
import { Button } from '@/components/ui/Button';
import { PropertyTypeChip } from '@/components/ui/PropertyTypeChip';
import { getHomepageTranslation, type SupportedLanguage } from '@/lib/homepage-translations';
import ImageCarousel, { type CarouselImage } from './ImageCarousel';

// ============================================================================
// IMAGE RESOLVER - Prevents 400 errors from missing/malformed image paths
// ============================================================================
const FALLBACK_IMG = '/images/defaults/placeholder-property.jpg';

function resolveLocalImage(src?: string): string {
  if (!src) return FALLBACK_IMG;
  
  // If looks like an absolute remote URL, pass through
  if (/^https?:\/\//i.test(src)) return src;
  
  // Normalize leading slashes and case-sensitive public path
  const clean = src.startsWith('/') ? src : `/${src}`;
  
  // Our images live under /public/images/... — keep that prefix
  return clean.replace(/\/+/g, '/');
}

interface PropertyCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
      mediaDetails?: {
        width?: number;
        height?: number;
      };
    };
  };
  property?: Property;
  agent?: Agent;
  language?: SupportedLanguage;
}

export default function PropertyCard({
  id,
  title,
  slug,
  excerpt,
  featuredImage,
  property,
  agent,
  language = 'fi',
}: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Debug logging for rent and agent
  if (property?.rent) {
    console.log('💰 PropertyCard rent debug:', {
      title,
      rent: property.rent,
      rentType: typeof property.rent,
      rentParsed: parseInt(property.rent),
      rentIsValid: !isNaN(parseInt(property.rent))
    });
  }
  
  if (agent) {
    console.log('🎨 PropertyCard agent data:', {
      title,
      hasAgent: !!agent,
      agentName: agent.name,
      hasPhoto: !!agent.photo,
      photoSourceUrl: agent.photo?.sourceUrl,
      photoAltText: agent.photo?.altText
    });
  }

  // Generate correct property URL - use /kohde/ route with language parameter for all languages
  const getPropertyUrl = () => {
    return `/kohde/${slug}?lang=${language}`;
  };

  // Prepare images for carousel - use gallery if available, otherwise use featuredImage
  const carouselImages: CarouselImage[] = [];
  if (property?.gallery && property.gallery.length > 0) {
    // Use gallery images
    property.gallery.forEach((img) => {
      carouselImages.push({
        sourceUrl: resolveLocalImage(img.sourceUrl),
        altText: img.altText || `${title} - ${property?.address || ''}`
      });
    });
  } else if (featuredImage) {
    // Fallback to featured image
    carouselImages.push({
      sourceUrl: resolveLocalImage(featuredImage.node.sourceUrl),
      altText: featuredImage.node.altText || `${title} - ${property?.address || ''} ${property?.city || ''} - Snellman Sotheby's International Realty`.trim()
    });
  }

  return (
    <LocaleLink
      href={getPropertyUrl()}
      className="block bg-white rounded-none shadow-md overflow-hidden card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
    >
      {/* Property Image Carousel */}
      {carouselImages.length > 0 && (
        <ImageCarousel images={carouselImages} />
      )}

      <div className="p-5">
        {/* Title - Large serif font matching old site */}
        <h3 className="text-xl font-serif mb-3 text-gray-900 leading-tight">
          {title}
        </h3>

        {/* Prices - Show both Vh and Mh for sale properties */}
        <div className="mb-2">
          {(() => {
            // Check if it's a rental property
            if (property?.rent) {
              const rentStr = property.rent.toString();
              const digitsOnly = rentStr.replace(/[^\d]/g, '');
              const rentAmount = digitsOnly ? parseInt(digitsOnly) : 0;

              if (rentAmount > 0) {
                return (
                  <p className="text-base font-normal text-gray-900">
                    {formatPrice(rentAmount)} / {getHomepageTranslation('month', language)}
                  </p>
                );
              }
            }

            // Sale property - show BOTH Velaton hinta AND Myyntihinta
            const debtFree = property?.debtFreePrice;
            const salePrice = property?.price;

            if (debtFree && salePrice && debtFree !== salePrice) {
              // Show both: "Vh X € Mh Y €"
              return (
                <p className="text-base font-normal text-gray-900">
                  <span>Vh {formatPrice(debtFree)}</span>
                  <span className="ml-3">Mh {formatPrice(salePrice)}</span>
                </p>
              );
            } else if (salePrice) {
              // Show only Myyntihinta: "Mh X €"
              return (
                <p className="text-base font-normal text-gray-900">
                  Mh {formatPrice(salePrice)}
                </p>
              );
            }

            return null;
          })()}
        </div>

        {/* TypeOfApartment / Huoneistoselitelmä - Room description */}
        {property?.typeOfApartment && (
          <p className="text-sm text-gray-700 mb-2 leading-relaxed">
            {property.typeOfApartment}
          </p>
        )}

        {/* Size - Simple text format matching old site */}
        {property?.area && (
          <p className="text-sm text-gray-700 mb-3">
            {(() => {
              // Detect if property is an estate (Fastighet) vs apartment (Lägenhet)
              const propertyTypeStr = property.propertyType?.toLowerCase() || '';
              const isEstate = propertyTypeStr.includes('fastighet') ||
                               propertyTypeStr.includes('villa') ||
                               propertyTypeStr.includes('rakennus') ||
                               propertyTypeStr.includes('talo') ||
                               propertyTypeStr.includes('hus') ||
                               propertyTypeStr.includes('mökki');

              // For ESTATES: Show "185 m² / 215 m² | 0,1299 ha" format
              if (isEstate) {
                return `${property.area} m²${property.totalArea ? ` / ${property.totalArea} m²` : ''}${property.plotArea ? ` | ${property.plotArea}` : ''}`;
              }

              // For APARTMENTS: Show "141 m² + 31 m²" format
              return `${property.area}${property.otherArea ? ` + ${property.otherArea}` : ''} m²`;
            })()}
          </p>
        )}

        {/* Property Type & District with icons */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
          {property?.propertyType && (
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {property.propertyType}
            </span>
          )}
          {(property?.districtFree || property?.district) && (
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.districtFree || property.district}
            </span>
          )}
        </div>

        {/* Agent Info - Horizontal layout with photo */}
        {agent && agent.name && (
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
            {agent.photo?.sourceUrl && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={agent.photo.sourceUrl}
                  alt={agent.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{agent.name}</p>
              {agent.phone && (
                <p className="text-sm text-gray-600">{agent.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* View Property Button - Dark blue matching old site */}
        <Button
          variant="primary"
          className="w-full py-3 text-base font-normal bg-[#002349] hover:bg-[#001a35]"
        >
          Katso kohde »
        </Button>
      </div>
    </LocaleLink>
  );
} 