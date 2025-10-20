'use client';

import Image from 'next/image';
import { LocaleLink } from '@/components/LocaleLink';
import { Property, Agent } from '@/lib/wordpress';
import { Price } from '@/components/ui/Price';
import { MetaRow } from '@/components/ui/MetaRow';
import { Button } from '@/components/ui/Button';
import { PropertyTypeChip } from '@/components/ui/PropertyTypeChip';

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
}

export default function PropertyCard({
  id,
  title,
  slug,
  excerpt,
  featuredImage,
  property,
  agent,
}: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <LocaleLink 
      href={`/property/${slug}`} 
      className="block bg-white rounded-lg shadow-md overflow-hidden card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
    >
      {/* Property Image */}
      {featuredImage && (
        <div className="relative h-48 w-full group">
          <Image
            src={featuredImage.node.sourceUrl}
            alt={featuredImage.node.altText || title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-4">
        {/* Price */}
        {property?.price && (
          <Price className="text-2xl mb-2" block>
            {formatPrice(property.price)}
          </Price>
        )}

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
            <PropertyTypeChip type={property.propertyType} />
          )}
        </div>

        {/* Property Details */}
        <MetaRow 
          items={[
            { value: property?.bedrooms ? `${property.bedrooms} mh` : '' },
            { value: property?.bathrooms ? `${property.bathrooms} kph` : '' },
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
            {agent.photo && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={agent.photo.sourceUrl}
                  alt={agent.photo.altText || agent.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{agent.name}</p>
              {agent.phone && (
                <p className="text-xs text-gray-600">{agent.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* View Property Button */}
        <div className="mt-4">
          <Button 
            variant="primary" 
            className="w-full"
            onClick={(e) => e.preventDefault()}
          >
            Katso kohde
          </Button>
        </div>
      </div>
    </LocaleLink>
  );
} 