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
  const [isFilterOpen, setIsFilterOpen] = useState(true); // Mobile collapsible state

  // DYNAMIC FACETS: Extract unique areas/cities and property types from properties
  const dynamicAreas = useMemo(() => {
    const areasSet = new Set<string>();
    properties.forEach(property => {
      const city = (property.city || property.acfRealEstate?.property?.city || '').trim();
      const district = (property.districtFree || property.district || property.acfRealEstate?.property?.district || '').trim();
      if (city) areasSet.add(city);
      if (district && district !== city) areasSet.add(district);
    });
    return Array.from(areasSet).sort();
  }, [properties]);

  const dynamicPropertyTypes = useMemo(() => {
    const typesMap = new Map<string, number>();
    properties.forEach(property => {
      PROPERTY_TYPES.forEach(typeConfig => {
        if (typeConfig.id !== 'all' && typeConfig.filter(property)) {
          typesMap.set(typeConfig.id, (typesMap.get(typeConfig.id) || 0) + 1);
        }
      });
    });
    return typesMap;
  }, [properties]);

  // Calculate min/max values for sliders from actual property data
  const priceMinMax = useMemo(() => {
    const prices = properties
      .map(p => p.debtFreePrice || p.price || p.acfRealEstate?.property?.debtFreePrice || p.acfRealEstate?.property?.price || 0)
      .filter(price => price > 0);
    return prices.length > 0
      ? { min: Math.floor(Math.min(...prices) / 10000) * 10000, max: Math.ceil(Math.max(...prices) / 10000) * 10000 }
      : { min: 0, max: 5000000 };
  }, [properties]);

  const areaMinMax = useMemo(() => {
    const areas = properties
      .map(p => parseInt(String(p.livingArea || p.area || p.acfRealEstate?.property?.area || '0')))
      .filter(area => area > 0);
    return areas.length > 0
      ? { min: Math.floor(Math.min(...areas) / 10) * 10, max: Math.ceil(Math.max(...areas) / 10) * 10 }
      : { min: 0, max: 1500 };
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Type filter (visa alla om "all" är valt)
      if (selectedType !== 'all') {
        const typeFilter = PROPERTY_TYPES.find(t => t.id === selectedType);
        if (!typeFilter?.filter(property)) return false;
      }

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
    searchTitle: { fi: 'Hae kohteita', sv: 'Sok objekt', en: 'Search properties' },
    area: { fi: 'ALUE', sv: 'OMRADE', en: 'AREA' },
    allAreas: { fi: 'Kaikki alueet', sv: 'Alla omraden', en: 'All areas' },
    propertyType: { fi: 'KOHDETYYPPI', sv: 'OBJEKTTYP', en: 'PROPERTY TYPE' },
    priceRange: { fi: 'HINTAVALI', sv: 'PRISINTERVALL', en: 'PRICE RANGE' },
    areaRange: { fi: 'KOKOVALIT', sv: 'STORLEKSINTERVALL', en: 'SIZE RANGE' },
    resultsFound: { fi: 'kohdetta loytyi', sv: 'objekt hittades', en: 'properties found' }
  };

  return (
    <div>
      {/* Simplified Search Filters - Matching old website design */}
      <section className="py-6 bg-white border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Simple inline filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Area Dropdown */}
            <div>
              <label className="block text-xs text-gray-600 mb-1 tracking-wider uppercase">{translations.area[language]}</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-none text-sm focus:outline-none focus:border-[var(--color-primary)]"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="all">{translations.allAreas[language]}</option>
                {dynamicAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            {/* Property Type Dropdown */}
            <div>
              <label className="block text-xs text-gray-600 mb-1 tracking-wider uppercase">{translations.propertyType[language]}</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-none text-sm focus:outline-none focus:border-[var(--color-primary)]"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {PROPERTY_TYPES.map(type => {
                  const count = type.id === 'all' ? properties.length : (dynamicPropertyTypes.get(type.id) || 0);
                  return (
                    <option key={type.id} value={type.id}>
                      {type.label[language]} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Price Range Slider */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                {priceRange[0].toLocaleString('fi-FI')} € - {priceRange[1].toLocaleString('fi-FI')} €
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={priceMinMax.min}
                  max={priceMinMax.max}
                  step="50000"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    if (newMin <= priceRange[1]) {
                      setPriceRange([newMin, priceRange[1]]);
                    }
                  }}
                  className="flex-1 h-1 bg-gray-300 appearance-none cursor-pointer accent-[var(--color-primary)]"
                />
                <input
                  type="range"
                  min={priceMinMax.min}
                  max={priceMinMax.max}
                  step="50000"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    if (newMax >= priceRange[0]) {
                      setPriceRange([priceRange[0], newMax]);
                    }
                  }}
                  className="flex-1 h-1 bg-gray-300 appearance-none cursor-pointer accent-[var(--color-primary)]"
                />
              </div>
            </div>

            {/* Area Range Slider */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                {areaRange[0]} m² - {areaRange[1]} m²
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={areaMinMax.min}
                  max={areaMinMax.max}
                  step="10"
                  value={areaRange[0]}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    if (newMin <= areaRange[1]) {
                      setAreaRange([newMin, areaRange[1]]);
                    }
                  }}
                  className="flex-1 h-1 bg-gray-300 appearance-none cursor-pointer accent-[var(--color-primary)]"
                />
                <input
                  type="range"
                  min={areaMinMax.min}
                  max={areaMinMax.max}
                  step="10"
                  value={areaRange[1]}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    if (newMax >= areaRange[0]) {
                      setAreaRange([areaRange[0], newMax]);
                    }
                  }}
                  className="flex-1 h-1 bg-gray-300 appearance-none cursor-pointer accent-[var(--color-primary)]"
                />
              </div>
            </div>
          </div>

          {/* View Mode Selector - Simple and clean */}
          <div className="flex justify-end">
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 border-none rounded-none transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                aria-label="Grid view"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 border-none rounded-none transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                aria-label="List view"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2.5 border-none rounded-none transition-colors ${
                  viewMode === 'map'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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
                              href={`/kohde/${property.slug}?lang=${language}`}
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

