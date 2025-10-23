'use client';

import Image from 'next/image';
import { LocaleLink } from '@/components/LocaleLink';
import { Property, Agent } from '@/lib/wordpress';
import { Price } from '@/components/ui/Price';
import { MetaRow } from '@/components/ui/MetaRow';
import { Button } from '@/components/ui/Button';
import { PropertyTypeChip } from '@/components/ui/PropertyTypeChip';
import { getHomepageTranslation, type SupportedLanguage } from '@/lib/homepage-translations';

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

  return (
    <LocaleLink 
      href={`/property/${slug}`} 
      className="block bg-white rounded-lg shadow-md overflow-hidden card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
    >
      {/* Property Image */}
      {featuredImage && (
        <div className="relative h-48 w-full group">
          <Image
            src={resolveLocalImage(featuredImage.node.sourceUrl)}
            alt={`${title} - ${property?.address || ''} ${property?.city || ''} - Snellman Sotheby's International Realty`.trim()}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e: any) => { 
              e.currentTarget.src = FALLBACK_IMG; 
            }}
          />
        </div>
      )}

      <div className="p-4">
        {/* Price or Rent */}
        {(() => {
          // Check if it's a rental property
          if (property?.rent) {
            // Extract number from rent string (e.g., "3 €/kk" -> 3, "1500" -> 1500)
            const rentMatch = property.rent.toString().match(/\d+/);
            const rentAmount = rentMatch ? parseInt(rentMatch[0]) : 0;
            
            // Only show rent if it's realistic (>= 100€/month)
            // This filters out bad data like "3 €/kk"
            if (rentAmount >= 100) {
              return (
                <Price className="text-2xl mb-2" block>
                  {formatPrice(rentAmount)} / {getHomepageTranslation('month', language)}
                </Price>
              );
            }
          }
          
          // Sale property - show DEBT-FREE price (skuldfritt pris) - PRIORITET
          if (property?.debtFreePrice) {
            return (
              <Price className="text-2xl mb-2" block>
                {formatPrice(property.debtFreePrice)}
              </Price>
            );
          }
          
          // Fallback to regular price if debtFreePrice is missing
          if (property?.price) {
            return (
              <Price className="text-2xl mb-2" block>
                {formatPrice(property.price)}
              </Price>
            );
          }
          
          return null;
        })()}

        {/* Title */}
        <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
          <span className="hover:underline">
            {title}
          </span>
        </h3>

        {/* Address and Property Type */}
        <div className="flex items-start justify-between mb-2">
          {property?.address && (
            <p className="text-gray-600">
              {property.address}
              {property.location?.postCode && property.city && `, ${property.location.postCode} ${property.city}`}
              {!property.location?.postCode && property.city && `, ${property.city}`}
            </p>
          )}
          {property?.propertyType && (
            <PropertyTypeChip type={property.propertyType} language={language} />
          )}
        </div>

        {/* Property Details - More comprehensive info with better mobile layout */}
        <div className="space-y-3 mb-4">
          {/* Row 1: Living Area & Rooms - Always visible */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {property?.area && (
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="font-semibold text-gray-900">{property.area}</span>
                <span className="text-gray-600 text-sm">m²</span>
              </div>
            )}
            {property?.bedrooms && (
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-semibold text-gray-900">{property.bedrooms}</span>
                <span className="text-gray-600 text-sm">{getHomepageTranslation('rooms', language)}</span>
              </div>
            )}
          </div>

          {/* Row 2: Additional info - Better mobile wrapping */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {property?.propertyType && (
              <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {property.propertyType}
              </span>
            )}
            {property?.city && (
              <span className="inline-flex items-center gap-1 text-gray-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.city}
              </span>
            )}
          </div>
        </div>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {excerpt.replace(/<[^>]*>/g, '')}
          </p>
        )}

        {/* Agent Info */}
        {agent && agent.name && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            {agent.photo?.sourceUrl && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={agent.photo.sourceUrl}
                  alt={`${agent.name} - Fastighetsmäklare / Kiinteistönvälittäjä - Snellman Sotheby's International Realty`}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    console.error('❌ Agent photo failed to load:', agent.photo?.sourceUrl);
                  }}
                  onLoad={() => {
                    console.log('✅ Agent photo loaded successfully:', agent.photo?.sourceUrl);
                  }}
                />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{agent.name}</p>
              {agent.phone && (
                <p className="text-xs text-gray-600">{agent.phone}</p>
              )}
            </div>
            {agent.email && (
              <a 
                href={`mailto:${agent.email}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-[var(--color-primary)] hover:underline font-medium"
                title={getHomepageTranslation('contactAgent', language)}
              >
                {getHomepageTranslation('contact', language)}
              </a>
            )}
          </div>
        )}

        {/* View Property Button - Smaller on mobile */}
        <div className="mt-4">
          <Button 
            variant="primary" 
            className="w-full py-2 sm:py-3 text-sm sm:text-base"
          >
            {getHomepageTranslation('viewProperty', language)}
          </Button>
        </div>
      </div>
    </LocaleLink>
  );
} 