'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { CarouselArrowButton } from '../ui/CarouselArrowButton';

interface ImageCarouselProps {
  images: Array<{
    url: string;
    thumb?: string;
    floorPlan?: boolean;
  }>;
  title: string;
  propertyId?: string; // ✅ LINUS FIX: Force unique key per property
}

/**
 * Image carousel with user-friendly controls.
 * Clean, performant, intuitive.
 */
export function ImageCarousel({ images, title, propertyId }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 🔥 LINUS FIX: Reset index when images change (new property loaded)
  useEffect(() => {
    setCurrentIndex(0);
    setImageError(false);
  }, [images, propertyId]);

  if (!images || images.length === 0) return null;

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  // ✅ LINUS FIX: Unique key per property to force image reload
  const imageKey = `img-${propertyId || 'default'}-${currentIndex}`;
  
  // 🔥 PROXY FIX: Route images through our API to bypass CORS
  const getProxiedUrl = (url: string) => {
    if (url.startsWith('https://images.linear.fi/')) {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const currentImageUrl = getProxiedUrl(images[currentIndex].url);

  return (
    <>
      {/* Main Carousel - Fixed aspect ratio that works for both portrait and landscape images */}
      <section className="relative w-full bg-black">
        {/* Use 4:3 aspect ratio which works well for both portrait and landscape images */}
        {/* object-contain ensures the ENTIRE image is visible without cropping */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/10] overflow-hidden bg-black">
          {/* Use native img tag with API proxy to bypass CORS */}
          <img
            key={imageKey}
            src={currentImageUrl}
            alt={`${title} - Bild ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          
          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Navigation Arrows */}
        <CarouselArrowButton direction="left" onClick={goToPrev} variant="light" />
        <CarouselArrowButton direction="right" onClick={goToNext} variant="light" />

        {/* Image Counter + Fullscreen Button - Dennis 2025-11-12: Mindre på mobil */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 z-10">
          <div className="bg-black/60 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
          <button
            onClick={() => setIsFullscreen(true)}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
            aria-label="Visa i fullskärm"
          >
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Dennis 2025-11-10: Dots/bollar borttagna - ska INTE synas */}
      </section>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg z-20"
            aria-label="Stäng fullskärm"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-medium z-20">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg transition-all hover:scale-110 z-20"
            aria-label="Föregående bild"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg transition-all hover:scale-110 z-20"
            aria-label="Nästa bild"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Fullscreen Image */}
          <div className="relative w-full h-full p-4 flex items-center justify-center">
            <img
              key={imageKey}
              src={currentImageUrl}
              alt={`${title} - Bild ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
