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
      {/* Content - Dennis: Images FIRST, then buttons below */}
      {/* Dennis 2025-11-12: Ta bort min-h constraints så bilder/video täcker hela framen */}
      <div className="w-full bg-gray-50 rounded-lg overflow-hidden mb-4">
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
        
        {activeTab === 'brochure' && (
          <div className="w-full h-full min-h-[600px] flex items-center justify-center">
            {brochureUrl ? (
              <iframe 
                src={brochureUrl} 
                className="w-full h-[600px] border-0"
                title="Property brochure"
              />
            ) : (
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="font-medium">
                  {locale === 'sv' ? 'Broschyr ej tillgänglig' : locale === 'en' ? 'Brochure not available' : 'Esite ei saatavilla'}
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'video' && (
          <div className="w-full">
            {videoUrl ? (
              // Dennis 2025-11-12: Video täcker hela framen, ingen padding/black bars
              <div className="w-full aspect-video">
                <iframe 
                  src={getEmbedUrl(videoUrl)} 
                  className="w-full h-full border-0"
                  title="Property video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="font-medium">
                  {locale === 'sv' ? 'Video ej tillgänglig' : locale === 'en' ? 'Video not available' : 'Video ei saatavilla'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tab buttons - Dennis: UNDER bilderna (not above), MOBILE: scrollable horizontal */}
      {/* Dennis 2025-11-12: Grid på desktop (3 top, 2 bottom), scroll på mobil */}
      <div className="flex sm:grid sm:grid-cols-3 gap-2 mt-4 overflow-x-auto sm:overflow-x-visible pb-2 scrollbar-hide relative z-10 -mx-3 px-3 sm:mx-0 sm:px-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 md:px-6 py-2 rounded-full whitespace-nowrap font-medium transition-colors text-xs sm:text-sm md:text-base flex-shrink-0 sm:flex-shrink cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-[#002349] text-white' 
                : tab.enabled 
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400' 
                  : 'bg-gray-200/50 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

