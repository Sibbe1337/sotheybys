'use client';

import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import Image from 'next/image';

interface PropertyMapProps {
  properties: any[];
  language: 'fi' | 'sv' | 'en';
}

export default function PropertyMap({ properties, language }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  
  // Google Maps API key från environment variable
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Default center (Helsinki)
  const defaultCenter = { lat: 60.1699, lng: 24.9384 };

  // Hitta center baserat på properties
  const center = properties.length > 0 && properties[0].acfRealEstate?.property?.location?.latitude
    ? {
        lat: parseFloat(properties[0].acfRealEstate.property.location.latitude),
        lng: parseFloat(properties[0].acfRealEstate.property.location.longitude)
      }
    : defaultCenter;

  if (!apiKey) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
        <svg className="w-12 h-12 mx-auto mb-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
          {language === 'fi' ? 'Google Maps API-nyckel saknas' : language === 'sv' ? 'Google Maps API-nyckel saknas' : 'Google Maps API key missing'}
        </h3>
        <p className="text-yellow-800 mb-4">
          {language === 'fi' 
            ? 'Lisää NEXT_PUBLIC_GOOGLE_MAPS_API_KEY .env.local-tiedostoon' 
            : language === 'sv'
            ? 'Lägg till NEXT_PUBLIC_GOOGLE_MAPS_API_KEY i .env.local'
            : 'Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local'}
        </p>
        <a 
          href="https://developers.google.com/maps/documentation/javascript/get-api-key"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
        >
          {language === 'fi' ? 'Hanki API-nyckel' : language === 'sv' ? 'Skaffa API-nyckel' : 'Get API key'}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <APIProvider apiKey={apiKey}>
        <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
          <Map
            defaultCenter={center}
            defaultZoom={12}
            mapId="snellman-sothebys-map"
            gestureHandling="greedy"
          >
            {properties.map((property) => {
              const lat = property.acfRealEstate?.property?.location?.latitude;
              const lng = property.acfRealEstate?.property?.location?.longitude;
              
              if (!lat || !lng) return null;

              const position = {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
              };

              const address = property.address || property.acfRealEstate?.property?.address || '';
              const city = property.city || property.acfRealEstate?.property?.city || '';
              const price = property.debtFreePrice || property.price || 
                           property.acfRealEstate?.property?.debtFreePrice || 
                           property.acfRealEstate?.property?.price || 0;
              const image = property.featuredImage?.node?.sourceUrl || 
                           property.acfRealEstate?.property?.images?.[0]?.sourceUrl ||
                           '/images/defaults/property-placeholder.jpg';

              return (
                <AdvancedMarker
                  key={property.id}
                  position={position}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="bg-[var(--color-primary)] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg cursor-pointer hover:bg-[var(--color-primary-dark)] transition-colors">
                    {price > 0 ? `${(price / 1000).toFixed(0)}k €` : '•'}
                  </div>
                </AdvancedMarker>
              );
            })}

            {selectedProperty && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedProperty.acfRealEstate?.property?.location?.latitude),
                  lng: parseFloat(selectedProperty.acfRealEstate?.property?.location?.longitude)
                }}
                onCloseClick={() => setSelectedProperty(null)}
              >
                <div className="p-2 max-w-xs">
                  <div className="relative w-full h-40 mb-3">
                    <Image
                      src={selectedProperty.featuredImage?.node?.sourceUrl || 
                           selectedProperty.acfRealEstate?.property?.images?.[0]?.sourceUrl ||
                           '/images/defaults/property-placeholder.jpg'}
                      alt={selectedProperty.address || selectedProperty.acfRealEstate?.property?.address || ''}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {selectedProperty.address || selectedProperty.acfRealEstate?.property?.address || ''}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedProperty.city || selectedProperty.acfRealEstate?.property?.city || ''}
                  </p>
                  <p className="text-lg font-semibold text-[var(--color-primary)] mb-3">
                    {(selectedProperty.debtFreePrice || selectedProperty.price || 
                      selectedProperty.acfRealEstate?.property?.debtFreePrice || 
                      selectedProperty.acfRealEstate?.property?.price || 0).toLocaleString('fi-FI')} €
                  </p>
                  <a
                    href={`/${language}/property/${selectedProperty.slug}`}
                    className="block w-full text-center px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-dark)] transition-colors text-sm"
                  >
                    {language === 'fi' ? 'Katso kohde' : language === 'sv' ? 'Se objekt' : 'View property'}
                  </a>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
      </APIProvider>

      {/* Property list under map */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          const price = property.debtFreePrice || property.price || 
                       property.acfRealEstate?.property?.debtFreePrice || 
                       property.acfRealEstate?.property?.price || 0;
          const area = property.livingArea || property.area || 
                      property.acfRealEstate?.property?.area || '';
          const address = property.address || property.acfRealEstate?.property?.address || '';
          const city = property.city || property.acfRealEstate?.property?.city || '';
          const image = property.featuredImage?.node?.sourceUrl || 
                       property.acfRealEstate?.property?.images?.[0]?.sourceUrl ||
                       '/images/defaults/property-placeholder.jpg';

          return (
            <a
              key={property.id}
              href={`/kohde/${property.slug}?lang=${language}`}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-200"
              onClick={() => {
                const lat = property.acfRealEstate?.property?.location?.latitude;
                const lng = property.acfRealEstate?.property?.location?.longitude;
                if (lat && lng) {
                  setSelectedProperty(property);
                }
              }}
            >
              <div className="relative h-48">
                <Image
                  src={image}
                  alt={address}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-light text-gray-900 mb-1">{address}</h3>
                <p className="text-sm text-gray-600 mb-3">{city}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-light text-[var(--color-primary)]">
                    {price > 0 ? `${price.toLocaleString('fi-FI')} €` : ''}
                  </p>
                  {area && <p className="text-sm text-gray-600">{area} m²</p>}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

