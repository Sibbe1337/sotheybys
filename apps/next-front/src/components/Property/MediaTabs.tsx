'use client';

import { useState } from 'react';
import { ImageCarousel } from './ImageCarousel';
import { t } from '@/lib/i18n/property-translations';
import type { Locale } from '@/lib/domain/property.types';

interface MediaTabsProps {
  images: Array<{ url: string; thumb?: string; floorPlan?: boolean }>;
  title: string;  // For ImageCarousel
  propertyId?: string;  // For ImageCarousel key
  floorPlans?: string[];
  coordinates?: { lat: number; lon: number };
  brochureUrl?: string;
  videoUrl?: string;
  locale: Locale;
}

type TabId = 'photos' | 'floor' | 'map' | 'brochure' | 'video';

export function MediaTabs({ 
  images, 
  title,
  propertyId,
  floorPlans, 
  coordinates, 
  brochureUrl, 
  videoUrl, 
  locale 
}: MediaTabsProps) {
  // Extract floor plan images from main images
  const photoImages = images.filter(img => !img.floorPlan);
  const floorImages = images.filter(img => img.floorPlan);
  const hasFloorPlan = floorImages.length > 0 || (floorPlans && floorPlans.length > 0);
  
  const [activeTab, setActiveTab] = useState<TabId>('photos');

  const tabs = [
    { id: 'photos' as TabId, label: t('media.photos', locale), enabled: photoImages.length > 0 },
    { id: 'floor' as TabId, label: t('media.floor', locale), enabled: hasFloorPlan },
    { id: 'map' as TabId, label: t('media.map', locale), enabled: !!coordinates },
    { id: 'brochure' as TabId, label: t('media.brochure', locale), enabled: !!brochureUrl },
    { id: 'video' as TabId, label: t('media.video', locale), enabled: !!videoUrl },
  ];

  // Helper to get YouTube/Vimeo embed URL
  const getEmbedUrl = (url: string): string => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    // Default: return as-is
    return url;
  };

  return (
    <div className="w-full">
      {/* Tab buttons - PDF spec s.14-15: Always visible, scroll horizontally on mobile */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => tab.enabled && setActiveTab(tab.id)}
            disabled={!tab.enabled}
            className={`px-4 md:px-6 py-2 rounded-full whitespace-nowrap font-medium transition-colors text-sm md:text-base flex-shrink-0 ${
              activeTab === tab.id 
                ? 'bg-[#002349] text-white' 
                : tab.enabled 
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px] bg-gray-50 rounded-lg overflow-hidden">
        {activeTab === 'photos' && photoImages.length > 0 && (
          <ImageCarousel images={photoImages} title={title} propertyId={propertyId} />
        )}
        
        {activeTab === 'floor' && hasFloorPlan && (
          <div className="w-full h-full min-h-[400px] flex items-center justify-center p-4">
            {floorImages.length > 0 ? (
              <img 
                src={floorImages[0].url} 
                alt="Floor plan" 
                className="max-w-full max-h-[600px] object-contain"
              />
            ) : floorPlans && floorPlans.length > 0 ? (
              <iframe 
                src={floorPlans[0]} 
                className="w-full h-[600px] border-0"
                title="Floor plan PDF"
              />
            ) : null}
          </div>
        )}
        
        {activeTab === 'map' && (
          <div className="w-full h-[500px] flex items-center justify-center">
            {coordinates ? (
              <iframe
                title="Property Location Map"
                src={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lon}&output=embed&z=15`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              // PDF spec s.9: Fallback when no coordinates
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="font-medium">
                  {locale === 'sv' ? 'Kartdata ej tillgänglig' : locale === 'en' ? 'Map data not available' : 'Karttadata ei saatavilla'}
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'brochure' && brochureUrl && (
          <div className="w-full h-full min-h-[600px]">
            <iframe 
              src={brochureUrl} 
              className="w-full h-[600px] border-0"
              title="Property brochure"
            />
          </div>
        )}
        
        {activeTab === 'video' && videoUrl && (
          <div className="w-full aspect-video max-w-5xl mx-auto bg-black">
            <iframe 
              src={getEmbedUrl(videoUrl)} 
              className="w-full h-full border-0"
              title="Property video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
}

