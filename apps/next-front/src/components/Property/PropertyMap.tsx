'use client';

import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import type { Property, Locale } from '@/lib/domain/property.types';
import { lpick } from '@/lib/domain/locale-utils';
import PropertyCard from './PropertyCard';
import type { CardVariant } from './PropertyCard';

interface PropertyMapProps {
  properties: Property[];
  language: 'fi' | 'sv' | 'en';
}

export default function PropertyMap({ properties, language }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Google Maps API key från environment variable
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Default center (Helsinki)
  const defaultCenter = { lat: 60.1699, lng: 24.9384 };

  // Get lat/lng from Property domain model
  const getLatLng = (property: Property) => {
    if (property.media.coordinates) {
      return {
        lat: property.media.coordinates.lat,
        lng: property.media.coordinates.lon
      };
    }
    return null;
  };

  // Check how many properties have coordinates
  const propertiesWithCoords = properties.filter(p => getLatLng(p) !== null);
  const firstPropertyCoords = propertiesWithCoords.length > 0 ? getLatLng(propertiesWithCoords[0]) : null;
  const center = firstPropertyCoords || defaultCenter;

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

  // ✅ Dennis fix: Show warning if no properties have coordinates
  if (propertiesWithCoords.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            {language === 'fi' ? 'Koordinaatit puuttuvat' : language === 'sv' ? 'Koordinater saknas' : 'Coordinates missing'}
          </h3>
          <p className="text-blue-800 mb-4">
            {language === 'fi' 
              ? 'Näillä kohteilla ei ole karttakoordinaatteja. Lisää koordinaatit Linear-järjestelmään nähdäksesi kohteet kartalla.' 
              : language === 'sv'
              ? 'Dessa objekt har inga kartkoordinater. Lägg till koordinater i Linear för att visa objekt på kartan.'
              : 'These properties have no map coordinates. Add coordinates in Linear to display properties on the map.'}
          </p>
          <p className="text-sm text-blue-700">
            {properties.length} {language === 'fi' ? 'kohdetta ilman koordinaatteja' : language === 'sv' ? 'objekt utan koordinater' : 'properties without coordinates'}
          </p>
        </div>

        {/* Show property list anyway */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => {
            const rent = property.meta.rent || property.rental?.monthlyRent || 0;
            const isRental = rent > 0;
            const typeCode = (property.meta.typeCode || '').toLowerCase();
            const isApartment = typeCode.includes('kerrostalo') || typeCode.includes('flat') || typeCode.includes('apartment');
            let variant: CardVariant = 'property';
            if (isRental) variant = 'rental';
            else if (isApartment) variant = 'apartment';
            
            const addressParts = [property.address[language] || property.address.fi, property.gate || ''].filter(Boolean);
            const title = addressParts.join(' ').trim();
            const images = (property.media.images || []).filter(img => !img.floorPlan).map(img => ({ url: img.url, alt: title }));
            const district = property.city[language] || property.city.fi;
            const apartmentTypeText = property.meta.apartmentType?.[language] || property.meta.apartmentType?.fi;
            const listingTypeLabel = property.meta.listingTypeLabel?.[language] || property.meta.listingTypeLabel?.fi || property.meta.typeCode;
            
            // Calculate "other area" from balcony + terrace
            const balconyArea = property.dimensions.balcony || 0;
            const terraceArea = property.dimensions.terrace || 0;
            const otherArea = balconyArea + terraceArea > 0 ? balconyArea + terraceArea : undefined;
            
            return (
              <PropertyCard
                key={property.id}
                href={`/${language}/kohde/${property.slug}`}
                locale={language}
                title={title}
                listingTypeLabel={listingTypeLabel}
                apartmentTypeText={apartmentTypeText}
                district={district}
                images={images}
                variant={variant}
                livingArea={property.dimensions.living}
                otherArea={otherArea}
                totalArea={property.dimensions.total}
                plotArea={property.dimensions.plot}
                askPrice={property.pricing.sales}
                debtFreePrice={property.pricing.debtFree}
                monthlyRent={rent}
                priorityFirstImage={index === 0}
              />
            );

          })}
        </div>
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
              const position = getLatLng(property);

              if (!position) return null;

              const price = property.pricing.debtFree || property.pricing.sales || 0;

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

            {selectedProperty && getLatLng(selectedProperty) && (
              <InfoWindow
                position={getLatLng(selectedProperty)!}
                onCloseClick={() => setSelectedProperty(null)}
              >
                <div className="p-2 max-w-xs">
                  <div className="relative w-full h-40 mb-3">
                    <Image
                      src={selectedProperty.media.images.find(img => !img.floorPlan)?.url || 
                           selectedProperty.media.images[0]?.url ||
                           '/images/defaults/property-placeholder.jpg'}
                      alt={lpick(selectedProperty.address, language as Locale)}
                      fill
                      className="object-cover rounded"
                      unoptimized
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {lpick(selectedProperty.address, language as Locale)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {lpick(selectedProperty.city, language as Locale)}
                  </p>
                  <p className="text-lg font-semibold text-[var(--color-primary)] mb-3">
                    {(selectedProperty.pricing.debtFree || selectedProperty.pricing.sales || 0).toLocaleString('fi-FI')} €
                  </p>
                  <Link
                    href={
                      language === 'sv' ? `/objekt/${selectedProperty.slug}` :
                      language === 'en' ? `/properties/${selectedProperty.slug}` :
                      `/kohde/${selectedProperty.slug}`
                    }
                    className="block w-full text-center px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-dark)] transition-colors text-sm"
                  >
                    {language === 'fi' ? 'Katso kohde' : language === 'sv' ? 'Se objekt' : 'View property'}
                  </Link>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
      </APIProvider>

      {/* Property list under map */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, index) => {
          const rent = property.meta.rent || property.rental?.monthlyRent || 0;
          const isRental = rent > 0;
          const typeCode = (property.meta.typeCode || '').toLowerCase();
          const isApartment = typeCode.includes('kerrostalo') || typeCode.includes('flat') || typeCode.includes('apartment');
          let variant: CardVariant = 'property';
          if (isRental) variant = 'rental';
          else if (isApartment) variant = 'apartment';
          
          const addressParts = [property.address[language] || property.address.fi, property.gate || ''].filter(Boolean);
          const title = addressParts.join(' ').trim();
          const images = (property.media.images || []).filter(img => !img.floorPlan).map(img => ({ url: img.url, alt: title }));
          const district = property.city[language] || property.city.fi;
          const apartmentTypeText = property.meta.apartmentType?.[language] || property.meta.apartmentType?.fi;
          const listingTypeLabel = property.meta.listingTypeLabel?.[language] || property.meta.listingTypeLabel?.fi || property.meta.typeCode;
          
          // Calculate "other area" from balcony + terrace
          const balconyArea = property.dimensions.balcony || 0;
          const terraceArea = property.dimensions.terrace || 0;
          const otherArea = balconyArea + terraceArea > 0 ? balconyArea + terraceArea : undefined;
          
          return (
            <PropertyCard
              key={property.id}
              href={`/${language}/kohde/${property.slug}`}
              locale={language}
              title={title}
              listingTypeLabel={listingTypeLabel}
              apartmentTypeText={apartmentTypeText}
              district={district}
              images={images}
              variant={variant}
              livingArea={property.dimensions.living}
              otherArea={otherArea}
              totalArea={property.dimensions.total}
              plotArea={property.dimensions.plot}
              askPrice={property.pricing.sales}
              debtFreePrice={property.pricing.debtFree}
              monthlyRent={rent}
            />
          );
        })}
      </div>
    </div>
  );
}

