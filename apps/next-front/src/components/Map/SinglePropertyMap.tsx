'use client';

import { useEffect, useRef, useState } from 'react';

interface SinglePropertyMapProps {
  lat: number;
  lng: number;
  title?: string;
}

/**
 * Single property map with Sotheby's branded "S" marker
 * Uses Google Maps JavaScript API for custom marker support
 */
export function SinglePropertyMap({ lat, lng, title }: SinglePropertyMapProps) {
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
      mapTypeControl: false,
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
    new google.maps.Marker({
      position: { lat, lng },
      map,
      title: title || 'Property location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(markerSvg),
        scaledSize: new google.maps.Size(44, 44),
        anchor: new google.maps.Point(22, 22),
      },
    });
  }, [isLoaded, lat, lng, title]);

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

