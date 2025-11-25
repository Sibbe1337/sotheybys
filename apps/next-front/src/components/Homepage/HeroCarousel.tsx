'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/lib/navigation';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { CarouselArrowButton } from '../ui/CarouselArrowButton';

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
}

interface HeroCarouselProps {
  slides: Slide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const params = useParams();
  const locale = params?.locale || 'fi';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Set initialization flag after first render
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) {
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [slides.length, isAutoPlaying]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume autoplay after user interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1500 ${
            index === currentSlide 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105'
          }`}
        >
          {/* Background Image with Ken Burns Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              className={`object-cover transition-transform duration-[20s] ease-out ${
                index === currentSlide ? 'scale-110' : 'scale-100'
              }`}
              priority={index === 0}
              quality={90}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-16 sm:px-20 lg:px-24">
              <div className="max-w-4xl">
                {/* Subtitle - appears first */}
                {slide.subtitle && (
                  <div 
                    className={`overflow-hidden mb-4 ${
                      index === currentSlide ? '' : ''
                    }`}
                  >
                    <p 
                      className={`text-white/90 text-lg md:text-xl font-light tracking-wide transform transition-all duration-1000 ${
                        index === currentSlide 
                          ? 'translate-y-0 opacity-100' 
                          : 'translate-y-full opacity-0'
                      }`}
                      style={{ transitionDelay: (!hasInitialized && index === 0) ? '0ms' : '200ms' }}
                    >
                      {slide.subtitle}
                    </p>
                  </div>
                )}
                
                {/* Title */}
                <div className="overflow-hidden mb-8">
                  <h1 
                    className={`text-white text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-thin leading-none transform transition-all duration-1000 ${
                      index === currentSlide 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-full opacity-0'
                    }`}
                    style={{ transitionDelay: (!hasInitialized && index === 0) ? '0ms' : '400ms' }}
                  >
                    {slide.title}
                  </h1>
                </div>

                {/* Button */}
                {slide.buttonText && slide.buttonLink && (
                  <div 
                    className={`transform transition-all duration-1000 ${
                      index === currentSlide 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-10 opacity-0'
                    }`}
                    style={{ transitionDelay: (!hasInitialized && index === 0) ? '0ms' : '600ms' }}
                  >
                    {slide.buttonLink.startsWith('#') ? (
                      <a
                        href={slide.buttonLink}
                        className="group inline-flex items-center gap-3 text-white border border-white 
                                 px-8 py-4 transition-all duration-300 
                                 font-light tracking-wider uppercase text-sm relative overflow-hidden
                                 hover:border-white z-20"
                      >
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-[#002349]">
                          {slide.buttonText}
                        </span>
                        <svg 
                          className="w-5 h-5 transform transition-all duration-300 group-hover:translate-x-1 relative z-10 group-hover:text-[#002349]" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M17 8l4 4m0 0l-4 4m4-4H3" 
                          />
                        </svg>
                        <span 
                          className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 
                                   transition-transform duration-300 ease-out origin-left" 
                        />
                      </a>
                    ) : (
                      <Link
                        href={slide.buttonLink}
                        className="group inline-flex items-center gap-3 text-white border border-white 
                                 px-8 py-4 transition-all duration-300 
                                 font-light tracking-wider uppercase text-sm relative overflow-hidden
                                 hover:border-white z-20"
                      >
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-[#002349]">
                          {slide.buttonText}
                        </span>
                        <svg 
                          className="w-5 h-5 transform transition-all duration-300 group-hover:translate-x-1 relative z-10 group-hover:text-[#002349]" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M17 8l4 4m0 0l-4 4m4-4H3" 
                          />
                        </svg>
                        <span 
                          className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 
                                   transition-transform duration-300 ease-out origin-left" 
                        />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div 
          className="h-full bg-white/80 transition-all duration-300 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            transitionDuration: isAutoPlaying ? '6000ms' : '300ms' 
          }}
        />
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-500 ${
              index === currentSlide 
                ? 'w-12 h-3' 
                : 'w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span 
              className={`absolute inset-0 bg-white rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'opacity-100' 
                  : 'opacity-40 hover:opacity-60'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Navigation Arrows - Only visible on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <CarouselArrowButton direction="left" onClick={prevSlide} variant="light" />
        <CarouselArrowButton direction="right" onClick={nextSlide} variant="light" />
      </div>
    </div>
  );
}