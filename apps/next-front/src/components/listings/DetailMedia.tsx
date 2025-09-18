'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { VideoCameraIcon, DocumentIcon, MapIcon, CubeIcon } from '@heroicons/react/24/outline';

interface DetailMediaProps {
  youtubeUrl?: string | null;
  virtualTourUrl?: string | null;
  brochureUrl?: string | null;
  floorPlanUrl?: string | null;
  className?: string;
}

export const DetailMedia: React.FC<DetailMediaProps> = ({
  youtubeUrl,
  virtualTourUrl,
  brochureUrl,
  floorPlanUrl,
  className
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'tour' | 'brochure' | 'floorplan'>('video');
  
  // Extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };
  
  // Check if virtual tour URL and brochure URL are the same
  const isVirtualTourSameAsBrochure = virtualTourUrl && brochureUrl && virtualTourUrl === brochureUrl;
  
  // Filter out duplicates
  const availableMedia = [
    youtubeUrl && { type: 'video' as const, url: youtubeUrl, label: 'Videokuvaus' },
    virtualTourUrl && !isVirtualTourSameAsBrochure && { type: 'tour' as const, url: virtualTourUrl, label: 'Virtuaaliesittely' },
    brochureUrl && { type: 'brochure' as const, url: brochureUrl, label: isVirtualTourSameAsBrochure ? 'Virtuaaliesittely / Selattava esite' : 'Selattava esite' },
    floorPlanUrl && { type: 'floorplan' as const, url: floorPlanUrl, label: 'Pohjapiirros' }
  ].filter(Boolean) as Array<{ type: 'video' | 'tour' | 'brochure' | 'floorplan'; url: string; label: string }>;
  
  if (availableMedia.length === 0) return null;
  
  const activeMedia = availableMedia.find(m => m.type === activeTab) || availableMedia[0];
  
  return (
    <div className={cn('bg-white rounded-lg shadow-sm overflow-hidden', className)}>
      {/* Tab Navigation */}
      {availableMedia.length > 1 && (
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {availableMedia.map((media) => (
              <button
                key={media.type}
                onClick={() => setActiveTab(media.type)}
                className={cn(
                  'flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors',
                  activeTab === media.type
                    ? 'border-[var(--brand-blue)] text-[var(--brand-blue)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  {media.type === 'video' && <VideoCameraIcon className="w-5 h-5" />}
                  {media.type === 'tour' && <CubeIcon className="w-5 h-5" />}
                  {media.type === 'brochure' && <DocumentIcon className="w-5 h-5" />}
                  {media.type === 'floorplan' && <MapIcon className="w-5 h-5" />}
                  {media.label}
                </span>
              </button>
            ))}
          </nav>
        </div>
      )}
      
      {/* Media Content */}
      <div className="p-6">
        {activeMedia.type === 'video' && youtubeUrl && (
          <div className="aspect-video relative">
            {(() => {
              const videoId = getYouTubeVideoId(youtubeUrl);
              if (videoId) {
                return (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    title="Property Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              }
              return (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--brand-blue)] hover:underline"
                  >
                    Avaa video uuteen ikkunaan
                  </a>
                </div>
              );
            })()}
          </div>
        )}
        
        {activeMedia.type === 'tour' && virtualTourUrl && (
          <div className="text-center">
            <a
              href={virtualTourUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-blue)] text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <CubeIcon className="w-5 h-5" />
              Avaa virtuaaliesittely
            </a>
          </div>
        )}
        
        {activeMedia.type === 'brochure' && brochureUrl && (
          <div className="text-center">
            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-blue)] text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <DocumentIcon className="w-5 h-5" />
              {isVirtualTourSameAsBrochure ? 'Avaa virtuaaliesittely / esite' : 'Avaa esite'}
            </a>
          </div>
        )}
        
        {activeMedia.type === 'floorplan' && floorPlanUrl && (
          <div className="text-center">
            <a
              href={floorPlanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-blue)] text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <MapIcon className="w-5 h-5" />
              Avaa pohjapiirros
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailMedia;
