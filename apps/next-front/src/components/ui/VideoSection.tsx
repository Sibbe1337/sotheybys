'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface VideoSectionProps {
  videoId: string;
  title?: string;
  subtitle?: string;
  className?: string;
  aspectRatio?: '16:9' | '4:3' | '21:9';
  autoplay?: boolean;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  videoId,
  title,
  subtitle,
  className,
  aspectRatio = '16:9',
  autoplay = false,
}) => {
  const aspectRatioClasses = {
    '16:9': 'aspect-w-16 aspect-h-9',
    '4:3': 'aspect-w-4 aspect-h-3',
    '21:9': 'aspect-w-21 aspect-h-9',
  };

  // Extract video ID from YouTube URL if full URL is provided
  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : url;
  };

  const cleanVideoId = extractVideoId(videoId);

  return (
    <section className={cn('py-16 bg-white', className)}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-light text-[var(--color-primary)] mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-[var(--color-dark-gray)] font-light max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="max-w-6xl mx-auto">
          <div className={cn('relative overflow-hidden rounded-lg shadow-lg', aspectRatioClasses[aspectRatio])}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${cleanVideoId}${autoplay ? '?autoplay=1&mute=1' : ''}`}
              title={title || 'YouTube video player'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Aspect ratio plugin for Tailwind (add to tailwind.config.ts if not present)
// @tailwindcss/aspect-ratio
