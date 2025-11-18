'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CarouselArrowButton } from '../ui/CarouselArrowButton';

interface PropertyCardCarouselProps {
  images: Array<{ url: string; thumb?: string; floorPlan?: boolean }>;
  alt: string;
  onImageClick?: () => void;
}

export function PropertyCardCarousel({ images, alt, onImageClick }: PropertyCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Filter out floor plans + LIMIT TO 3 IMAGES (Dennis 2025-11-10)
  const photoImages = images.filter(img => !img.floorPlan).slice(0, 3);
  const displayImages = photoImages.length > 0 ? photoImages : images.slice(0, 1);

  // Auto-rotate on hover (desktop)
  useEffect(() => {
    if (!isHovered || displayImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isHovered, displayImages.length]);

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const currentImage = displayImages[currentIndex] || displayImages[0];

  return (
    <div 
      className="relative aspect-[4/3] bg-gray-100 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onImageClick}
    >
      <Image
        key={`carousel-${currentIndex}-${currentImage.url}`}
        src={currentImage.url}
        alt={alt}
        fill
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={75}
        priority={false}
      />

      {/* Navigation arrows - show on hover if multiple images */}
      {displayImages.length > 1 && isHovered && (
        <>
          <CarouselArrowButton 
            direction="left" 
            onClick={goToPrevious} 
            variant="dark"
            className="!w-8 !h-8"
          />
          <CarouselArrowButton 
            direction="right" 
            onClick={goToNext} 
            variant="dark"
            className="!w-8 !h-8"
          />
        </>
      )}

      {/* Dennis 2025-11-10: Dots/bollar borttagna - ska INTE synas */}

      {/* Image counter */}
      {displayImages.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1}/{displayImages.length}
        </div>
      )}
    </div>
  );
}

