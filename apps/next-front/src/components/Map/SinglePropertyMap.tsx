'use client';

import { useEffect, useRef, useState } from 'react';

interface SinglePropertyMapProps {
  lat: number;
  lng: number;
  title?: string;
  // New props for info window
  imageUrl?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  area?: number;
  price?: number;
  propertySlug?: string;
  locale?: 'fi' | 'sv' | 'en';
}

/**
 * Single property map with Sotheby's branded "S" marker and info window
 * Uses Google Maps JavaScript API for custom marker support
 */
export function SinglePropertyMap({ 
  lat, 
  lng, 
  title,
  imageUrl,
  address,
  postalCode,
  city,
  area,
  price,
  propertySlug,
  locale = 'fi'
}: SinglePropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError('Google Maps API key not configured');
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps');
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    // Create the map
    const map = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 15,
      styles: [
        // Subtle styling to match Sotheby's brand
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    // Create custom Sotheby's marker SVG
    const markerSvg = `
      <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="20" fill="#002349" stroke="white" stroke-width="3"/>
        <text x="22" y="29" text-anchor="middle" fill="white" font-size="22" font-weight="bold" font-family="Georgia, serif">S</text>
      </svg>
    `;

    // Create marker with custom icon
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      title: title || 'Property location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(markerSvg),
        scaledSize: new google.maps.Size(44, 44),
        anchor: new google.maps.Point(22, 22),
      },
    });

    // Build info window content with property details
    const fullAddress = [address, postalCode, city].filter(Boolean).join(', ');
    const formattedPrice = price ? new Intl.NumberFormat('fi-FI', { 
      style: 'decimal', 
      maximumFractionDigits: 0 
    }).format(price) + ' €' : '';
    const formattedArea = area ? `${area} m²` : '';

    // Determine the property URL based on locale
    const propertyUrl = propertySlug 
      ? `/${locale}/${locale === 'sv' ? 'objekt' : locale === 'en' ? 'properties' : 'kohde'}/${propertySlug}`
      : '';

    // Labels based on locale
    const additionalInfoLabel = locale === 'sv' ? 'YTTERLIGARE INFO' : locale === 'en' ? 'ADDITIONAL INFO' : 'LISÄTIETOJA';

    const infoWindowContent = `
      <div style="max-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        ${imageUrl ? `
          <div style="position: relative; width: 100%; height: 140px; margin-bottom: 12px; overflow: hidden; border-radius: 4px;">
            <img 
              src="${imageUrl}" 
              alt="${fullAddress}" 
              style="width: 100%; height: 100%; object-fit: cover;"
            />
            <button 
              onclick="this.closest('.gm-style-iw-c')?.querySelector('button[aria-label=Close]')?.click()"
              style="position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.5); border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px;"
            >×</button>
          </div>
        ` : ''}
        <div style="padding: 0 4px 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #1a1a1a; line-height: 1.3;">
            ${fullAddress || title || 'Property'}
          </h3>
          ${formattedArea ? `
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">
              ${formattedArea}
            </p>
          ` : ''}
          ${formattedPrice ? `
            <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #002349;">
              ${formattedPrice}
            </p>
          ` : ''}
          ${propertyUrl ? `
            <a 
              href="${propertyUrl}"
              style="display: inline-block; padding: 8px 16px; border: 1px solid #002349; color: #002349; text-decoration: none; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s;"
              onmouseover="this.style.backgroundColor='#002349'; this.style.color='white';"
              onmouseout="this.style.backgroundColor='transparent'; this.style.color='#002349';"
            >
              ${additionalInfoLabel} ›
            </a>
          ` : ''}
        </div>
      </div>
    `;

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
      maxWidth: 320,
    });

    // Open info window on marker click
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    // Optionally auto-open the info window
    // infoWindow.open(map, marker);

  }, [isLoaded, lat, lng, title, imageUrl, address, postalCode, city, area, price, propertySlug, locale]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="font-medium mb-2">Map unavailable</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapRef} className="w-full h-full" style={{ minHeight: '300px' }} />
  );
}
