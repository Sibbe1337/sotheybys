'use client';

import Image from 'next/image';

interface ImageCarouselProps {
  images: Array<{
    url: string;
    thumb?: string;
    floorPlan?: boolean;
  }>;
  title: string;
}

/**
 * Dead simple image carousel.
 * Uses native CSS scroll-snap. No bullshit timers, no complex state.
 * Linus would approve.
 */
export function ImageCarousel({ images, title }: ImageCarouselProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="relative w-full bg-black">
      {/* Scroll container with snap */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide aspect-[16/9]">
        {images.map((img, i) => (
          <div key={i} className="flex-shrink-0 w-full snap-center relative">
            <Image
              src={img.url}
              alt={`${title} - Bild ${i + 1}`}
              fill
              className="object-cover"
              priority={i === 0}
              quality={90}
              sizes="100vw"
            />
          </div>
        ))}
      </div>
      
      {/* Counter */}
      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-10">
        {images.length} bilder
      </div>
    </section>
  );
}
