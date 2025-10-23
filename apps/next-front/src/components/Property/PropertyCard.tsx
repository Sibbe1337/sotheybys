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
        {property?.rent && !isNaN(parseInt(property.rent)) && parseInt(property.rent) > 0 ? (
          // Rental property - show monthly rent (säkerställ att det är ett giltigt nummer)
          <Price className="text-2xl mb-2" block>
            {formatPrice(parseInt(property.rent))} / {getHomepageTranslation('month', language)}
          </Price>
        ) : property?.debtFreePrice ? (
          // Sale property - show DEBT-FREE price (skuldfritt pris) - PRIORITET
          <Price className="text-2xl mb-2" block>
            {formatPrice(property.debtFreePrice)}
          </Price>
        ) : property?.price ? (
          // Fallback to regular price if debtFreePrice is missing
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

        {/* Property Details - More comprehensive info */}
        <div className="space-y-2 mb-3">
          {/* Row 1: Living Area, Rooms */}
          <div className="flex items-center gap-4 text-sm text-gray-700">
            {property?.area && (
              <div className="flex items-center gap-1">
                <span className="font-semibold">{property.area}</span>
                <span className="text-gray-500">m²</span>
              </div>
            )}
            {property?.bedrooms && (
              <div className="flex items-center gap-1">
                <span className="font-semibold">{property.bedrooms}</span>
                <span className="text-gray-500">{getHomepageTranslation('rooms', language)}</span>
              </div>
            )}
          </div>

          {/* Row 2: Property Type, Location */}
          <div className="flex items-center gap-4 text-sm">
            {property?.propertyType && (
              <span className="text-gray-600">{property.propertyType}</span>
            )}
            {property?.city && (
              <span className="text-gray-600">{property.city}</span>
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