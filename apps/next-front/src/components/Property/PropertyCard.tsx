'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property, Agent } from '@/lib/wordpress';
import { HeartIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface PropertyCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
              onClick={handleSaveProperty}
              className="p-2 bg-white/80 hover:bg-white rounded-lg shadow-md transition-all"
              title={isSaved ? "Poista tallennetuista" : "Tallenna kohde"}
            >
              {isSaved ? (
                <HeartIconSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-700" />
              )}
            </button>
            
            <button
              onClick={handleComparisonToggle}
              className={`p-2 rounded-lg shadow-md transition-all ${
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
          <div className="text-2xl font-bold text-primary-600 mb-2">
            {formatPrice(property.price)}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          <Link href={`/property/${slug}`} className="hover:text-primary-600 transition-colors">
            {title}
          </Link>
        </h3>

        {/* Address */}
        {property?.address && (
          <p className="text-gray-600 mb-2">
            {property.address}
            {property.city && `, ${property.city}`}
          </p>
        )}

        {/* Property Details */}
        {(property?.bedrooms || property?.bathrooms || property?.area) && (
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            {property.bedrooms && (
              <span className="flex items-center gap-1">






                {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center gap-1">
                {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
              </span>
            )}
            {property.area && (
              <span className="flex items-center gap-1">
                {property.area} m²
              </span>
            )}
          </div>
        )}

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
          <Link
            href={`/property/${slug}`}
            className="inline-block w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            View Property
          </Link>
        </div>
      </div>
    </div>
  );
} 