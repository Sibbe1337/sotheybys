'use client';

import { useState } from 'react';
import { ImageCarousel } from './ImageCarousel';
import { SinglePropertyMap } from '@/components/Map/SinglePropertyMap';
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
  // Additional props for map info window
  address?: string;
  postalCode?: string;
  city?: string;
  livingArea?: number;
  price?: number;
  propertySlug?: string;
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
  locale,
  address,
  postalCode,
  city,
  livingArea,
  price,
  propertySlug
}: MediaTabsProps) {
  // Extract floor plan images from main images
  const photoImages = images.filter(img => !img.floorPlan);
  const floorImages = images.filter(img => img.floorPlan);
  const hasFloorPlan = floorImages.length > 0 || (floorPlans && floorPlans.length > 0);
  
  const [activeTab, setActiveTab] = useState<TabId>('photos');

  const tabs = [
    { id: 'photos' as TabId, label: t('media.photos', locale), enabled: true },
    { id: 'floor' as TabId, label: t('media.floor', locale), enabled: true },
    { id: 'map' as TabId, label: t('media.map', locale), enabled: true },
    { id: 'brochure' as TabId, label: t('media.brochure', locale), enabled: true },
    { id: 'video' as TabId, label: t('media.video', locale), enabled: true },
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
      {/* Fixed aspect ratio that works for both portrait and landscape images - entire image visible */}
      <div className="w-full bg-gray-50 overflow-hidden mb-2 aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/10]">
        {activeTab === 'photos' && photoImages.length > 0 && (
          <ImageCarousel images={photoImages} title={title} propertyId={propertyId} />
        )}
        
        {activeTab === 'floor' && (
          <div className="w-full h-full flex items-center justify-center p-4">
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
                allowFullScreen
                allow="fullscreen"
              />
            ) : (
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-medium mb-2">
                  {locale === 'sv' ? 'Planlösning ej tillgänglig' : locale === 'en' ? 'Floor plan not available' : 'Pohjapiirros ei saatavilla'}
                </p>
                <p className="text-sm text-gray-400">
                  {locale === 'sv' ? 'Kontakta mäklaren för mer information' : locale === 'en' ? 'Contact the agent for more information' : 'Ota yhteyttä välittäjään lisätietojen saamiseksi'}
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'map' && (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            {coordinates ? (
              <SinglePropertyMap 
                lat={coordinates.lat} 
                lng={coordinates.lon} 
                title={title}
                imageUrl={images.find(img => !img.floorPlan)?.url}
                address={address}
                postalCode={postalCode}
                city={city}
                area={livingArea}
                price={price}
                propertySlug={propertySlug}
                locale={locale}
              />
            ) : (
              <div className="text-center text-gray-500 p-8">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="font-medium mb-2">
                  {locale === 'sv' ? 'Kartdata ej tillgänglig' : locale === 'en' ? 'Map data not available' : 'Karttadata ei saatavilla'}
                </p>
                <p className="text-sm text-gray-400">
                  {locale === 'sv' ? 'GPS-koordinater saknas för denna fastighet' : locale === 'en' ? 'GPS coordinates missing for this property' : 'GPS-koordinaatit puuttuvat tälle kohteelle'}
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'brochure' && (
          <div className="w-full h-full flex items-center justify-center">
            {brochureUrl ? (
              <iframe 
                src={brochureUrl.replace('https://sothebysrealty.fi/', 'https://legacy.sothebysrealty.fi/').replace('https://www.sothebysrealty.fi/', 'https://legacy.sothebysrealty.fi/')} 
                className="w-full h-full border-0"
                title="Property brochure"
                allowFullScreen
                allow="fullscreen; autoplay; encrypted-media"
              />
            ) : (
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="font-medium mb-2">
                  {locale === 'sv' ? 'Broschyr ej tillgänglig' : locale === 'en' ? 'Brochure not available' : 'Esite ei saatavilla'}
                </p>
                <p className="text-sm text-gray-400">
                  {locale === 'sv' ? 'Kontakta mäklaren för mer information' : locale === 'en' ? 'Contact the agent for more information' : 'Ota yhteyttä välittäjään lisätietojen saamiseksi'}
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'video' && (
          <div className="w-full">
            {videoUrl ? (
              // Video same aspect ratio as images for consistency
              <div className="w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/10]">
                <iframe 
                  src={getEmbedUrl(videoUrl)} 
                  className="w-full h-full border-0"
                  title="Property video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="text-center text-gray-500 p-4 sm:p-8 h-full flex flex-col items-center justify-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="font-medium mb-2">
                  {locale === 'sv' ? 'Video ej tillgänglig' : locale === 'en' ? 'Video not available' : 'Video ei saatavilla'}
                </p>
                <p className="text-sm text-gray-400">
                  {locale === 'sv' ? 'Kontakta mäklaren för att boka visning' : locale === 'en' ? 'Contact the agent to book a viewing' : 'Ota yhteyttä välittäjään esittelyn varaamiseksi'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tab buttons - Dennis: UNDER bilderna (not above) */}
      {/* 
        RESPONSIVE LAYOUT STRATEGY:
        - Mobile & Tablet (portrait & landscape): Horizontal scroll (all buttons in one row, scrollable)
        - Desktop (>= 1280px): Single row with equal width (flex-1)
        This ensures consistent, enhetlig layout across ALL devices and orientations
      */}
      <div className="flex gap-2 mt-2 overflow-x-auto xl:overflow-x-visible pb-2 xl:pb-0 -mx-4 px-4 xl:mx-0 xl:px-0 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={!tab.enabled}
            className={`flex-shrink-0 xl:flex-1 px-6 py-3 rounded-none whitespace-nowrap font-bold uppercase tracking-wide transition-all text-xs sm:text-sm ${
              activeTab === tab.id 
                ? 'bg-[#002349] text-white shadow-md' 
                : tab.enabled 
                  ? 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-[#002349] active:text-white cursor-pointer' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

