'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import PropertyGrid from './PropertyGrid';
import PropertyMap from './PropertyMap';

interface PropertySearchProps {
  properties: any[];
  language: 'fi' | 'sv' | 'en';
}

const PROPERTY_TYPES = [
  {
    id: 'all',
    label: { fi: 'Kaikki kohteet', sv: 'Alla objekt', en: 'All properties' },
    image: '/images/property-types/all.svg',
    filter: () => true
  },
  {
    id: 'apartment',
    label: { fi: 'Asunnot', sv: 'Lägenheter', en: 'Apartments' },
    image: '/images/property-types/apartment.svg',
    filter: (p: any) => {
      // Kolla båda format: root-nivå OCH acfRealEstate.property
      const type = (p.propertyType || p.acfRealEstate?.property?.propertyType || '').toLowerCase();
      const aptType = (p.apartmentType || p.acfRealEstate?.property?.apartmentType || '').toLowerCase();
      const allTypes = `${type} ${aptType}`;
      return allTypes.includes('asunto') || allTypes.includes('lägenhet') || allTypes.includes('apartment') || allTypes.includes('osake');
    }
  },
  {
    id: 'house',
    label: { fi: 'Omakotitalot', sv: 'Villor', en: 'Houses' },
    image: '/images/property-types/house.svg',
    filter: (p: any) => {
      // Kolla båda format: root-nivå OCH acfRealEstate.property
      const propertyType = (p.propertyType || p.acfRealEstate?.property?.propertyType || '').toLowerCase();
      const apartmentType = (p.apartmentType || p.acfRealEstate?.property?.apartmentType || '').toLowerCase();
      const estateType = (p.estateType || p.acfRealEstate?.property?.estateType || '').toLowerCase();
      const allTypes = `${propertyType} ${apartmentType} ${estateType}`;
      
      return allTypes.includes('omakoti') || allTypes.includes('villa') || allTypes.includes('house') || 
             allTypes.includes('kiinteistö') || allTypes.includes('egnahemshus') || 
             allTypes.includes('egendom') || allTypes.includes('fastighet');
    }
  },
  {
    id: 'townhouse',
    label: { fi: 'Rivitalot', sv: 'Radhus', en: 'Townhouses' },
    image: '/images/property-types/townhouse.svg',
    filter: (p: any) => {
      // Kolla båda format: root-nivå OCH acfRealEstate.property
      const type = (p.propertyType || p.acfRealEstate?.property?.propertyType || '').toLowerCase();
      const aptType = (p.apartmentType || p.acfRealEstate?.property?.apartmentType || '').toLowerCase();
      const allTypes = `${type} ${aptType}`;
      return allTypes.includes('rivi') || allTypes.includes('radhus') || allTypes.includes('townhouse');
    }
  },
  {
    id: 'rental',
    label: { fi: 'Vuokrakohteet', sv: 'Hyresobjekt', en: 'Rentals' },
    image: '/images/property-types/rental.svg',
    filter: (p: any) => {
      // Kolla båda format: root-nivå OCH acfRealEstate.property
      const rent = p.rent || p.acfRealEstate?.property?.rent;
      return rent && parseInt(rent) > 0;
    }
  }
];

export default function PropertySearch({ properties, language }: PropertySearchProps) {
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [areaRange, setAreaRange] = useState([0, 1500]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [selectedArea, setSelectedArea] = useState('all');

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Type filter
      const typeFilter = PROPERTY_TYPES.find(t => t.id === selectedType);
      if (!typeFilter?.filter(property)) return false;

      // Price filter - kolla båda format
      const price = property.debtFreePrice || property.price || 
                    property.acfRealEstate?.property?.debtFreePrice || 
                    property.acfRealEstate?.property?.price || 0;
      if (price > 0 && (price < priceRange[0] || price > priceRange[1])) return false;

      // Area filter - kolla båda format
      const area = parseInt(String(property.livingArea || property.area || 
                                    property.acfRealEstate?.property?.area || '0'));
      if (area > 0 && (area < areaRange[0] || area > areaRange[1])) return false;

      // Location filter - kolla båda format
      if (selectedArea !== 'all') {
        const city = (property.city || property.acfRealEstate?.property?.city || '').toLowerCase();
        if (!city.includes(selectedArea.toLowerCase())) return false;
      }

      return true;
    });
  }, [properties, selectedType, priceRange, areaRange, selectedArea]);

  const translations = {
    searchTitle: { fi: 'Sök objekt', sv: 'Sök objekt', en: 'Search properties' },
    area: { fi: 'OMRÅDE', sv: 'OMRÅDE', en: 'AREA' },
    allAreas: { fi: 'Kaikki alueet', sv: 'Alla områden', en: 'All areas' },
    propertyType: { fi: 'OBJEKTTYP', sv: 'OBJEKTTYP', en: 'PROPERTY TYPE' },
    priceRange: { fi: 'PRISINTERVALL', sv: 'PRISINTERVALL', en: 'PRICE RANGE' },
    areaRange: { fi: 'STORLEKSINTERVALL', sv: 'STORLEKSINTERVALL', en: 'SIZE RANGE' },
    resultsFound: { fi: 'kohdetta löytyi', sv: 'objekt hittades', en: 'properties found' }
  };

  return (
    <div>
      {/* Visual Property Type Selector */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {PROPERTY_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`relative overflow-hidden rounded-lg group cursor-pointer transition-all
                  ${selectedType === type.id ? 'ring-4 ring-[var(--color-gold)] shadow-2xl scale-105' : 'hover:shadow-xl'}`}
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={type.image}
                    alt={type.label[language]}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="text-white text-base lg:text-lg font-semibold tracking-wider uppercase drop-shadow-lg">
                      {type.label[language]}
                    </h3>
                  </div>
                  {selectedType === type.id && (
                    <div className="absolute top-2 right-2 bg-[var(--color-gold)] text-white rounded-full p-2 z-10">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Search Filters */}
      <section className="py-8 bg-white border-y border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-2xl font-light mb-6 text-gray-900">{translations.searchTitle[language]}</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Area Dropdown */}
            <div>
              <label className="block text-sm text-gray-600 mb-2 font-light tracking-wider">{translations.area[language]}</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded font-light focus:outline-none focus:border-[var(--color-primary)]"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="all">{translations.allAreas[language]}</option>
                <option value="helsinki">Helsinki</option>
                <option value="espoo">Espoo</option>
                <option value="vantaa">Vantaa</option>
                <option value="tampere">Tampere</option>
                <option value="turku">Turku</option>
              </select>
            </div>

            {/* Property Type Dropdown */}
            <div>
              <label className="block text-sm text-gray-600 mb-2 font-light tracking-wider">{translations.propertyType[language]}</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded font-light focus:outline-none focus:border-[var(--color-primary)]"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {PROPERTY_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label[language]}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="lg:col-span-2">
              <label className="block text-sm text-gray-600 mb-2 font-light tracking-wider">
                {translations.priceRange[language]}: {priceRange[0].toLocaleString('fi-FI')} € - {priceRange[1].toLocaleString('fi-FI')} €
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="50000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
                />
              </div>
            </div>
          </div>

          {/* Area Range */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2 font-light tracking-wider">
              {translations.areaRange[language]}: {areaRange[0]} m² - {areaRange[1]} m²
            </label>
            <input
              type="range"
              min="0"
              max="1500"
              step="10"
              value={areaRange[1]}
              onChange={(e) => setAreaRange([0, parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
            />
          </div>

          {/* View Mode Selector & Results Count */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <p className="text-gray-700 font-light">
              <span className="font-semibold text-[var(--color-primary)]">{filteredProperties.length}</span> {translations.resultsFound[language]}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 border rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' 
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[var(--color-primary)]'
                }`}
                aria-label="Grid view"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 border rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' 
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[var(--color-primary)]'
                }`}
                aria-label="List view"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-3 border rounded transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' 
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[var(--color-primary)]'
                }`}
                aria-label="Map view"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          {filteredProperties.length > 0 ? (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <PropertyGrid properties={filteredProperties} language={language} />
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-6">
                  {filteredProperties.map((property: any) => {
                    const price = property.debtFreePrice || property.price || 
                                  property.acfRealEstate?.property?.debtFreePrice || 
                                  property.acfRealEstate?.property?.price || 0;
                    const area = property.livingArea || property.area || 
                                 property.acfRealEstate?.property?.area || '';
                    const address = property.address || property.acfRealEstate?.property?.address || '';
                    const city = property.city || property.acfRealEstate?.property?.city || '';
                    const propertyType = property.propertyType || property.acfRealEstate?.property?.propertyType || '';
                    const image = property.featuredImage?.node?.sourceUrl || 
                                  property.acfRealEstate?.property?.images?.[0]?.sourceUrl ||
                                  '/images/defaults/property-placeholder.jpg';

                    return (
                      <div key={property.id} className="flex gap-6 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative w-80 h-64 flex-shrink-0">
                          <Image
                            src={image}
                            alt={address}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-2xl font-light text-gray-900 mb-2">{address}</h3>
                            <p className="text-gray-600 mb-4">{city}</p>
                            <div className="flex gap-6 text-sm text-gray-600 mb-4">
                              {area && <span>{area} m²</span>}
                              {propertyType && <span>{propertyType}</span>}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-3xl font-light text-[var(--color-primary)]">
                              {price > 0 ? `${price.toLocaleString('fi-FI')} €` : ''}
                            </p>
                            <a
                              href={`/${language}/property/${property.slug}`}
                              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-dark)] transition-colors"
                            >
                              {language === 'fi' ? 'Katso kohde' : language === 'sv' ? 'Se objekt' : 'View property'}
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Map View */}
              {viewMode === 'map' && (
                <PropertyMap properties={filteredProperties} language={language} />
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">
                {language === 'fi' ? 'Ei hakutuloksia' : language === 'sv' ? 'Inga sökresultat' : 'No results found'}
              </h2>
              <p className="text-gray-600 font-light">
                {language === 'fi' 
                  ? 'Kokeile muuttaa hakuehtoja tai tyhjennä suodattimet.' 
                  : language === 'sv'
                  ? 'Försök ändra sökvillkoren eller rensa filtren.'
                  : 'Try changing your search criteria or clear the filters.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

