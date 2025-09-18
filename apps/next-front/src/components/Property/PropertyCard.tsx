'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property, Agent } from '@/lib/wordpress';
import { HeartIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
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
  const [isSaved, setIsSaved] = useState(false);
  const [isInComparison, setIsInComparison] = useState(false);
  
  useEffect(() => {
    // Check if property is saved
    const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
    setIsSaved(savedProperties.includes(id));
    
    // Check if property is in comparison
    const comparisonProperties = JSON.parse(localStorage.getItem('comparisonProperties') || '[]');
    setIsInComparison(comparisonProperties.some((p: any) => p.id === id));
  }, [id]);
  
  // Listen for comparison updates from other components
  useEffect(() => {
    const handleComparisonUpdate = () => {
      const comparisonProperties = JSON.parse(localStorage.getItem('comparisonProperties') || '[]');
      setIsInComparison(comparisonProperties.some((p: any) => p.id === id));
    };
    
    window.addEventListener('comparisonUpdate', handleComparisonUpdate);
    return () => window.removeEventListener('comparisonUpdate', handleComparisonUpdate);
  }, [id]);
  
  const handleSaveProperty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
    
    if (isSaved) {
      const updated = savedProperties.filter((propId: string) => propId !== id);
      localStorage.setItem('savedProperties', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      savedProperties.push(id);
      localStorage.setItem('savedProperties', JSON.stringify(savedProperties));
      setIsSaved(true);
    }
  };
  
  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const comparisonProperties = JSON.parse(localStorage.getItem('comparisonProperties') || '[]');
    
    if (isInComparison) {
      const updated = comparisonProperties.filter((p: any) => p.id !== id);
      localStorage.setItem('comparisonProperties', JSON.stringify(updated));
      setIsInComparison(false);
    } else {
      if (comparisonProperties.length >= 4) {
        alert('Voit vertailla enintään 4 kohdetta kerrallaan');
        return;
      }
      
      const propertyData = {
        id,
        address: property?.address || '',
        askPrice: property?.price?.toString() || '',
        area: property?.area?.toString() || '',
        rooms: property?.bedrooms?.toString() || '',
        image: featuredImage?.node?.sourceUrl || '',
        marketingTitle: title
      };
      
      comparisonProperties.push(propertyData);
      localStorage.setItem('comparisonProperties', JSON.stringify(comparisonProperties));
      setIsInComparison(true);
    }
    
    window.dispatchEvent(new CustomEvent('comparisonUpdate'));
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link 
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
          
          {/* Action Buttons Overlay */}
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSaveProperty(e);
              }}
              className="p-2 bg-white/80 hover:bg-white rounded-lg shadow-md transition-all pointer-events-auto"
              title={isSaved ? "Poista tallennetuista" : "Tallenna kohde"}
            >
              {isSaved ? (
                <HeartIconSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-700" />
              )}
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleComparisonToggle(e);
              }}
              className={`p-2 rounded-lg shadow-md transition-all pointer-events-auto ${
                isInComparison 
                  ? 'bg-[#002349] hover:bg-[#003366]' 
                  : 'bg-white/80 hover:bg-white'
              }`}
              title={isInComparison ? "Poista vertailusta" : "Lisää vertailuun"}
            >
              <ScaleIcon className={`h-5 w-5 ${
                isInComparison ? 'text-white' : 'text-gray-700'
              }`} />
            </button>
          </div>
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
              {property.city && `, ${property.city}`}
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
            { value: property?.area ? `${property.area} m²` : '' }
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
    </Link>
  );
} 