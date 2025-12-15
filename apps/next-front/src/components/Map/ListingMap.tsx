'use client';

import { useEffect, useRef, useState } from 'react';
import type { Property } from '@/lib/domain/property.types';

interface ListingMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  locale: 'fi' | 'sv' | 'en';
}

export function ListingMap({ properties, onPropertyClick, locale }: ListingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setError('Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.');
      return;
    }

    // Check if already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps');
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    // Filter properties with coordinates
    const propertiesWithCoords = properties.filter(p => p.media.coordinates);
    
    if (propertiesWithCoords.length === 0) {
      setError('No properties with coordinates found');
      return;
    }

    // Calculate center (average of all coordinates)
    const avgLat = propertiesWithCoords.reduce((sum, p) => sum + (p.media.coordinates?.lat || 0), 0) / propertiesWithCoords.length;
    const avgLon = propertiesWithCoords.reduce((sum, p) => sum + (p.media.coordinates?.lon || 0), 0) / propertiesWithCoords.length;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: { lat: avgLat, lng: avgLon },
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });

    setMap(mapInstance);
  }, [isLoaded, map, properties]);

  // Add markers
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const newMarkers: google.maps.Marker[] = [];
    const infoWindow = new google.maps.InfoWindow();

    properties.forEach(property => {
      if (!property.media.coordinates) return;

      const { lat, lon } = property.media.coordinates;
      
      // Sotheby's branded marker - simple circle with "S" (matching old design)
      const marker = new google.maps.Marker({
        position: { lat, lng: lon },
        map,
        title: property.address[locale] || property.address.fi,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="17" fill="#002349" stroke="white" stroke-width="2"/>
              <text x="18" y="24" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Georgia, serif">S</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(36, 36),
          anchor: new google.maps.Point(18, 18),
        },
      });

      // Create info window content with image and more details
      const address = property.address[locale] || property.address.fi;
      const city = property.city[locale] || property.city.fi;
      const price = property.rental 
        ? `${property.rental.monthlyRent?.toLocaleString()} €/kk`
        : `${property.pricing.debtFree?.toLocaleString()} €`;
      const area = property.dimensions.living ? `${property.dimensions.living} m²` : '';
      const imageUrl = property.media.images?.[0]?.url || '';
      const propertyUrl = `/${locale}/kohde/${property.slug}`;
      const viewText = locale === 'sv' ? 'VISA OBJEKT »' : locale === 'en' ? 'VIEW PROPERTY »' : 'KATSO KOHDE »';
      
      const content = `
        <div style="padding: 0; min-width: 250px; max-width: 300px; font-family: 'freight-text-pro', Georgia, serif;">
          ${imageUrl ? `<img src="${imageUrl}" alt="${address}" style="width: 100%; height: 120px; object-fit: cover; display: block;"/>` : ''}
          <div style="padding: 12px;">
            <h3 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">${address}</h3>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #666;">${city}</p>
            ${area ? `<p style="margin: 0 0 4px 0; font-size: 13px; color: #444;">${area}</p>` : ''}
            <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #002349;">${price}</p>
            <a href="${propertyUrl}" style="display: inline-block; background: #002349; color: white; padding: 8px 16px; font-size: 11px; text-decoration: none; letter-spacing: 0.5px;">${viewText}</a>
          </div>
        </div>
      `;

      marker.addListener('click', () => {
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
        
        if (onPropertyClick) {
          onPropertyClick(property);
        }
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      map.fitBounds(bounds);
    }

    return () => {
      infoWindow.close();
    };
  }, [map, properties, isLoaded, locale, onPropertyClick]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <p className="text-gray-600 mb-4">{error}</p>
          {error.includes('API key') && (
            <a 
              href="https://developers.google.com/maps/documentation/javascript/get-api-key"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#002349] underline"
            >
              Get API Key
            </a>
          )}
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#002349] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full min-h-[600px]" />;
}

