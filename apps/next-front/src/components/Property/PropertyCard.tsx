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

  // Debug logging for agent photo
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
        {property?.rent ? (
          // Rental property - show monthly rent
          <Price className="text-2xl mb-2" block>
            {formatPrice(parseInt(property.rent))} / {getHomepageTranslation('month', language)}
          </Price>
        ) : property?.price ? (
          // Sale property - show sale price
          <Price className="text-2xl mb-2" block>
            {formatPrice(property.price)}
          </Price>
        ) : null}

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

        {/* Property Details */}
        <MetaRow 
          items={[
            { value: property?.bedrooms ? `${property.bedrooms} ${getHomepageTranslation('bedrooms', language)}` : '' },
            { value: property?.bathrooms ? `${property.bathrooms} ${getHomepageTranslation('bathrooms', language)}` : '' },
            { value: property?.area ? (String(property.area).includes('m²') || String(property.area).includes('m2') ? property.area : `${property.area} m²`) : '' }
          ]}
          className="mb-3"
        />

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

        {/* View Property Button */}
        <div className="mt-4">
          <Button 
            variant="primary" 
            className="w-full"
          >
            {getHomepageTranslation('viewProperty', language)}
          </Button>
        </div>
      </div>
    </LocaleLink>
  );
} 