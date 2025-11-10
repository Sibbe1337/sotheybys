/**
 * PROPERTY HERO CAROUSEL
 * 
 * Large carousel showing one property at a time
 * Matches the current website design exactly
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { Property, Locale } from '@/lib/domain/property.types';
import { lpick } from '@/lib/domain/locale-utils';
import { HeroAddressBadge } from './HeroAddressBadge';

interface PropertyHeroCarouselProps {
  properties: Property[];
  locale: Locale;
  autoPlayInterval?: number; // milliseconds
}

export default function PropertyHeroCarousel({ 
  properties, 
  locale,
  autoPlayInterval = 5000 
}: PropertyHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? properties.length - 1 : prevIndex - 1
    );
  }, [properties.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === properties.length - 1 ? 0 : prevIndex + 1
    );
  }, [properties.length]);

  // Auto-play
  useEffect(() => {
    if (isHovered || properties.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isHovered, goToNext, autoPlayInterval, properties.length]);

  if (properties.length === 0) {
    return null;
  }

  const currentProperty = properties[currentIndex];
  const address = lpick(currentProperty.address, locale);
  const gate = currentProperty.gate;
  const displayAddress = gate ? `${address} ${gate}` : address;
  const postalCode = currentProperty.postalCode;
  const city = lpick(currentProperty.city, locale);
  const slug = currentProperty.slug;
  const imageUrl = currentProperty.media.images.find(img => !img.floorPlan)?.url || 
                   currentProperty.media.images[0]?.url || 
                   '/images/defaults/placeholder-property.jpg';

  return (
    <div 
      className="relative w-full h-[500px] lg:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={address}
          fill
          className="object-cover"
          priority
          unoptimized={imageUrl.startsWith('http')}
        />
      </div>

      {/* Content Container - Removed text overlay per user request */}

      {/* Hero Address Badge - Dennis feedback: Show in bottom-left corner, opens property */}
      <div className="absolute bottom-8 left-8 z-10">
        <HeroAddressBadge
          address={displayAddress}
          postalCode={postalCode}
          city={city}
          slug={slug}
          locale={locale}
        />
      </div>

      {/* Navigation Arrows */}
      {properties.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all hover:scale-110"
            aria-label="Previous property"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all hover:scale-110"
            aria-label="Next property"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dennis 2025-11-10: Dots/bollar borttagna - ska INTE synas */}

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
        {currentIndex + 1} / {properties.length}
      </div>
    </div>
  );
}

