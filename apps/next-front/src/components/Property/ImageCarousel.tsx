'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: Array<{
    url: string;
    thumb?: string;
    floorPlan?: boolean;
  }>;
  title: string;
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
  // Filter out floor plans and use them last
  const regularImages = images.filter(img => !img.floorPlan);
  const floorPlans = images.filter(img => img.floorPlan);
  const allImages = [...regularImages, ...floorPlans];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || allImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, allImages.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (allImages.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full bg-black">
      {/* Main Image Container - 16:9 aspect ratio */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={allImages[currentIndex].url}
          alt={`${title} - Bild ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
          quality={90}
          sizes="100vw"
        />

        {/* Gradient overlay at bottom for better dot visibility */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Navigation Arrows - Desktop only */}
      {allImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg transition-all hover:scale-110 z-10"
            aria-label="Föregående bild"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg transition-all hover:scale-110 z-10"
            aria-label="Nästa bild"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Touch indicators for mobile */}
      {allImages.length > 1 && (
        <div className="md:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-10">
          <div className="w-16 h-full bg-gradient-to-r from-black/20 to-transparent" />
          <div className="w-16 h-full bg-gradient-to-l from-black/20 to-transparent" />
        </div>
      )}

      {/* Dot Navigation */}
      {allImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
              } rounded-full`}
              aria-label={`Gå till bild ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-20">
        {currentIndex + 1} / {allImages.length}
      </div>

      {/* Swipe instruction for mobile - shows briefly on first load */}
      {allImages.length > 1 && (
        <div 
          className="md:hidden absolute inset-0 bg-black/50 flex items-center justify-center z-30 animate-fade-out pointer-events-none"
          style={{ animation: 'fadeOut 3s forwards' }}
        >
          <div className="text-white text-center">
            <div className="text-2xl mb-2">←  →</div>
            <div className="text-sm">Svep för att se fler bilder</div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
      `}</style>
    </section>
  );
}
