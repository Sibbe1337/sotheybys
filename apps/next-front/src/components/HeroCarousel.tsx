'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroCarouselProps {
  slides: Slide[];
  height?: string;
}

export default function HeroCarousel({ slides, height = 'h-[400px] md:h-[500px]' }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-advance carousel - only when tab is visible
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const startTimer = () => {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        startTimer();
      }
    };
    
    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className={`relative ${height} overflow-hidden`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl font-light mb-8 text-white/90">
              {slide.subtitle}
            </p>
            <Link
              href={slide.buttonLink}
              className="inline-block border border-white text-white px-8 py-3 hover:bg-white hover:text-[#001731] transition-all uppercase text-sm tracking-wider"
              prefetch={true}
            >
              {slide.buttonText}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <button 
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all z-20"
        aria-label="Previous slide"
      >
        <span className="text-white text-2xl">‹</span>
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all z-20"
        aria-label="Next slide"
      >
        <span className="text-white text-2xl">›</span>
      </button>
      
      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

