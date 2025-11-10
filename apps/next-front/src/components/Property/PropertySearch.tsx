'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Link } from '@/lib/navigation';
import FeaturedPropertyCard from './FeaturedPropertyCard';
import FilterToggle from '../Filters/FilterToggle';
import type { Property, Locale } from '@/lib/domain/property.types';

type CardVariant = 'apartment' | 'property' | 'rental';

// Lazy load map for performance
const ListingMap = dynamic(() => import('../Map/ListingMap').then(mod => ({ default: mod.ListingMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#002349] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

interface PropertySearchProps {
  properties: Property[];
  language: 'fi' | 'sv' | 'en';
}

const PROPERTY_TYPES = [
  {
    id: 'all',
    label: { fi: 'Kaikki kohteet', sv: 'Alla objekt', en: 'All properties' },
    image: '/images/property-types/all.svg',
    filter: (p: Property) => {
      // Dennis 2025-11-10: "Kaikki kohteet" ska visa ALLA objekt till salu (14)
      // Inklusive lägenheter, hus, mökkiä, paritalot, maatilat etc
      // Exkludera ENDAST hyresobjekt
      const rent = p.meta.rent || 0;
      const isRental = rent > 0;
      const isOnSale = !p.meta.status || p.meta.status === 'ACTIVE' || p.meta.status === 'RESERVED';
      
      // Visa ALLA fastighetstyper som är till salu (inte hyra)
      return !isRental && isOnSale;
    }
  },
  {
    id: 'apartment',
    label: { fi: 'Asunnot', sv: 'Lägenheter', en: 'Apartments' },
    image: '/images/property-types/apartment.svg',
    filter: (p: Property) => {
      const rent = p.meta.rent || 0;
      const isOnSale = !p.meta.status || p.meta.status === 'ACTIVE' || p.meta.status === 'RESERVED';
      if (rent > 0 || !isOnSale) return false; // PDF spec s.3-4: exclude rentals and non-sale from listings
      const type = (p.meta.typeCode || '').toLowerCase();
      return type.includes('kerrostalo') || type.includes('flat') || type.includes('apartment');
    }
  },
  {
    id: 'house',
    label: { fi: 'Omakotitalot', sv: 'Villor', en: 'Houses' },
    image: '/images/property-types/house.svg',
    filter: (p: Property) => {
      const rent = p.meta.rent || 0;
      const isOnSale = !p.meta.status || p.meta.status === 'ACTIVE' || p.meta.status === 'RESERVED';
      if (rent > 0 || !isOnSale) return false; // PDF spec s.3-4: exclude rentals and non-sale from listings
      const type = (p.meta.typeCode || '').toLowerCase();
      return type.includes('omakotitalo') || type.includes('detached') || type.includes('villa');
    }
  },
  {
    id: 'townhouse',
    label: { fi: 'Rivitalot', sv: 'Radhus', en: 'Townhouses' },
    image: '/images/property-types/townhouse.svg',
    filter: (p: Property) => {
      const rent = p.meta.rent || 0;
      const isOnSale = !p.meta.status || p.meta.status === 'ACTIVE' || p.meta.status === 'RESERVED';
      if (rent > 0 || !isOnSale) return false;
      const type = (p.meta.typeCode || '').toLowerCase();
      return type.includes('rivi') || type.includes('row') || type.includes('townhouse') || type.includes('paritalo');
    }
  },
  {
    id: 'cottage',
    label: { fi: 'Mökit ja huvilat', sv: 'Stugor och villor', en: 'Cottages and villas' },
    image: '/images/property-types/cottage.svg',
    filter: (p: Property) => {
      const rent = p.meta.rent || 0;
      const isOnSale = !p.meta.status || p.meta.status === 'ACTIVE' || p.meta.status === 'RESERVED';
      if (rent > 0 || !isOnSale) return false;
      const type = (p.meta.typeCode || '').toLowerCase();
      return type.includes('mökki') || type.includes('huvila') || type.includes('cottage') || type.includes('cabin');
    }
  },
  {
    id: 'farm',
    label: { fi: 'Maatilat', sv: 'Gårdar', en: 'Farms' },
    image: '/images/property-types/farm.svg',
    filter: (p: Property) => {
      const rent = p.meta.rent || 0;
      const isOnSale = !p.meta.status || p.meta.status === 'ACTIVE' || p.meta.status === 'RESERVED';
      if (rent > 0 || !isOnSale) return false;
      const type = (p.meta.typeCode || '').toLowerCase();
      return type.includes('maatila') || type.includes('farm') || type.includes('estate');
    }
  }
  // Dennis 2025-11-10: Alla 14 objekt täcks nu av filter-kategorier
];

export default function PropertySearch({ properties, language }: PropertySearchProps) {
  // Calculate min/max values FIRST before useState (Dennis fix: sliders must initialize with real data)
  const priceMinMax = useMemo(() => {
    const prices = properties
      .map(p => p.pricing.debtFree || p.pricing.sales || 0)
      .filter(price => price > 0);
    return prices.length > 0
      ? { min: Math.floor(Math.min(...prices) / 10000) * 10000, max: Math.ceil(Math.max(...prices) / 10000) * 10000 }
      : { min: 0, max: 5000000 };
  }, [properties]);

  const areaMinMax = useMemo(() => {
    const areas = properties
      .map(p => p.dimensions.living || 0)
      .filter(area => area > 0);
    return areas.length > 0
      ? { min: Math.floor(Math.min(...areas) / 10) * 10, max: Math.ceil(Math.max(...areas) / 10) * 10 }
      : { min: 0, max: 1500 };
  }, [properties]);

  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([priceMinMax.min, priceMinMax.max]);
  const [areaRange, setAreaRange] = useState<[number, number]>([areaMinMax.min, areaMinMax.max]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [selectedArea, setSelectedArea] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(true); // Mobile collapsible state

  // DYNAMIC FACETS: Extract unique areas/cities and property types from properties
  const dynamicAreas = useMemo(() => {
    const areasSet = new Set<string>();
    properties.forEach(property => {
      const city = (property.city[language] || property.city.fi || '').trim();
      if (city) areasSet.add(city);
    });
    return Array.from(areasSet).sort();
  }, [properties, language]);

  // Dennis 2025-11-10: Count properties for each type
  const dynamicPropertyTypes = useMemo(() => {
    const typesMap = new Map<string, number>();
    properties.forEach(property => {
      PROPERTY_TYPES.forEach(typeConfig => {
        if (typeConfig.filter(property)) {
          typesMap.set(typeConfig.id, (typesMap.get(typeConfig.id) || 0) + 1);
        }
      });
    });
    return typesMap;
  }, [properties]);
  
  // Dennis 2025-11-10: Count for "Kaikki kohteet" (all on-sale properties)
  const allPropertiesCount = useMemo(() => {
    return properties.filter(p => PROPERTY_TYPES[0].filter(p)).length;
  }, [properties]);

  const filteredProperties = useMemo(() => {
    const filtered = properties.filter(property => {
      // Type filter (visa alla om "all" är valt)
      if (selectedType !== 'all') {
        const typeFilter = PROPERTY_TYPES.find(t => t.id === selectedType);
        if (!typeFilter?.filter(property)) return false;
      }

      // Price filter
      const price = property.pricing.debtFree || property.pricing.sales || 0;
      if (price > 0 && (price < priceRange[0] || price > priceRange[1])) return false;

      // Area filter
      const area = property.dimensions.living || 0;
      if (area > 0 && (area < areaRange[0] || area > areaRange[1])) return false;

      // Location filter
      if (selectedArea !== 'all') {
        const city = (property.city[language] || property.city.fi || '').toLowerCase();
        if (!city.includes(selectedArea.toLowerCase())) return false;
      }

      return true;
    });

    // Sort: Rental properties FIRST, then sale properties (by debt-free price descending)
    return filtered.sort((a, b) => {
      const aRent = a.meta.rent || 0;
      const bRent = b.meta.rent || 0;
      const aIsRental = aRent > 0;
      const bIsRental = bRent > 0;

      // Rentals first
      if (aIsRental && !bIsRental) return -1;
      if (!aIsRental && bIsRental) return 1;
      
      // Both are same type, sort by price (descending)
      return (b.pricing.debtFree || b.pricing.sales) - (a.pricing.debtFree || a.pricing.sales);
    });
  }, [properties, selectedType, priceRange, areaRange, selectedArea, language]);

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
      {/* Simplified Search Filters - NON-STICKY on mobile, static/optional sticky on desktop */}
      <section className="py-8 bg-white border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Dennis 2025-11-10: Search title FÖRE filtren */}
          <h2 className="text-2xl font-light text-gray-900 mb-6">{translations.searchTitle[language]}</h2>
          
          <FilterToggle locale={language}>
          {/* Row 1: Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Area Dropdown */}
            <div>
              <label className="block text-xs text-gray-600 mb-2 tracking-wider uppercase">{translations.area[language]}</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-none text-sm focus:outline-none focus:border-[var(--color-primary)]"
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
              <label className="block text-xs text-gray-600 mb-2 tracking-wider uppercase">{translations.propertyType[language]}</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-none text-sm focus:outline-none focus:border-[var(--color-primary)]"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">
                  {PROPERTY_TYPES[0].label[language]} ({allPropertiesCount})
                </option>
                {PROPERTY_TYPES
                  .slice(1)
                  .filter(type => {
                    const count = dynamicPropertyTypes.get(type.id) || 0;
                    return count > 0;
                  })
                  .map(type => {
                    const count = dynamicPropertyTypes.get(type.id) || 0;
                    return (
                      <option key={type.id} value={type.id}>
                        {type.label[language]} ({count})
                      </option>
                    );
                  })
                }
              </select>
            </div>
          </div>

          {/* Row 2: Price and Area Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Price Range Slider */}
            <div>
              <label className="block text-xs text-gray-600 mb-2 tracking-wider uppercase">{translations.priceRange[language]}</label>
              <div className="text-sm font-medium text-gray-900 mb-3">
                {priceRange[0].toLocaleString('fi-FI')} € - {priceRange[1].toLocaleString('fi-FI')} €
              </div>
              <div className="relative pt-1">
                {/* Background track */}
                <div className="absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2"></div>
                {/* Active track (between thumbs) */}
                <div 
                  className="absolute h-2 bg-[var(--color-primary)] rounded-full top-1/2 -translate-y-1/2"
                  style={{
                    left: `${((priceRange[0] - priceMinMax.min) / (priceMinMax.max - priceMinMax.min)) * 100}%`,
                    right: `${100 - ((priceRange[1] - priceMinMax.min) / (priceMinMax.max - priceMinMax.min)) * 100}%`
                  }}
                ></div>
                {/* Min slider (z-index 2) */}
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
                  className="dual-range-slider dual-range-slider-min"
                  style={{ zIndex: priceRange[0] > priceMinMax.max - 100000 ? 5 : 3 }}
                />
                {/* Max slider (z-index 4) */}
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
                  className="dual-range-slider dual-range-slider-max"
                  style={{ zIndex: 4 }}
                />
              </div>
            </div>

            {/* Area Range Slider */}
            <div>
              <label className="block text-xs text-gray-600 mb-2 tracking-wider uppercase">{translations.areaRange[language]}</label>
              <div className="text-sm font-medium text-gray-900 mb-3">
                {areaRange[0]} m² - {areaRange[1]} m²
              </div>
              <div className="relative pt-1">
                {/* Background track */}
                <div className="absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2"></div>
                {/* Active track (between thumbs) */}
                <div 
                  className="absolute h-2 bg-[var(--color-primary)] rounded-full top-1/2 -translate-y-1/2"
                  style={{
                    left: `${((areaRange[0] - areaMinMax.min) / (areaMinMax.max - areaMinMax.min)) * 100}%`,
                    right: `${100 - ((areaRange[1] - areaMinMax.min) / (areaMinMax.max - areaMinMax.min)) * 100}%`
                  }}
                ></div>
                {/* Min slider (z-index 2) */}
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
                  className="dual-range-slider dual-range-slider-min"
                  style={{ zIndex: areaRange[0] > areaMinMax.max - 100 ? 5 : 3 }}
                />
                {/* Max slider (z-index 4) */}
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
                  className="dual-range-slider dual-range-slider-max"
                  style={{ zIndex: 4 }}
                />
              </div>
            </div>
          </div>

          <style jsx>{`
            .dual-range-slider {
              position: absolute;
              width: 100%;
              height: 0;
              top: 50%;
              background: transparent;
              outline: none;
              pointer-events: none;
              -webkit-appearance: none;
              appearance: none;
              margin: 0;
              padding: 0;
            }

            .dual-range-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 18px;
              height: 18px;
              background: var(--color-primary, #002349);
              cursor: pointer;
              border-radius: 50%;
              pointer-events: all;
              border: 2px solid white;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
              margin-top: -9px; /* Half of height (18px / 2) to center perfectly on line */
              transform: translateY(0);
            }

            .dual-range-slider::-moz-range-thumb {
              width: 18px;
              height: 18px;
              background: var(--color-primary, #002349);
              cursor: pointer;
              border-radius: 50%;
              pointer-events: all;
              border: 2px solid white;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
              margin-top: -9px; /* Half of height (18px / 2) to center perfectly on line */
              transform: translateY(0);
            }

            .dual-range-slider::-webkit-slider-thumb:hover {
              transform: translateY(0) scale(1.1);
            }

            .dual-range-slider::-moz-range-thumb:hover {
              transform: translateY(0) scale(1.1);
            }

            .dual-range-slider::-webkit-slider-runnable-track {
              height: 0;
              background: transparent;
            }

            .dual-range-slider::-moz-range-track {
              height: 0;
              background: transparent;
            }
          `}</style>

          {/* View Mode Selector - Centered */}
          <div className="flex justify-center">
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
          </FilterToggle>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          {filteredProperties.length > 0 ? (
            <>
              {/* Grid View - Dennis 2025-11-10: SAMMA layout som huvudsidan (2 kolumner) */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredProperties.map((property, index) => {
                    // Determine card variant
                    const rent = property.meta.rent || property.rental?.monthlyRent || 0;
                    const isRental = rent > 0;
                    const typeCode = (property.meta.typeCode || '').toLowerCase();
                    const isApartment = typeCode.includes('kerrostalo') || typeCode.includes('flat') || typeCode.includes('apartment');
                    
                    let variant: CardVariant = 'property';
                    if (isRental) variant = 'rental';
                    else if (isApartment) variant = 'apartment';
                    
                    // Dennis 2025-11-10: Samma kort-layout som på hem-sidan
                    // Build full address: "Gatan Trapp, 00210 Helsinki"
                    const addressParts = [
                      property.address[language] || property.address.fi,
                      property.gate || '',
                    ].filter(Boolean);
                    const title = addressParts.join(' ').trim();
                    const postalCode = property.postalCode;
                    const city = property.city[language] || property.city.fi;
                    const fullAddress = postalCode 
                      ? `${title}, ${postalCode} ${city}`.trim()
                      : `${title}, ${city}`.trim();
                    
                    // Dennis 2025-11-10: ENDAST 3 första bilderna i karusellen
                    const images = (property.media.images || [])
                      .filter(img => !img.floorPlan)
                      .slice(0, 3)
                      .map(img => ({ url: img.url, alt: title }));
                    
                    // District
                    const district = property.district?.[language] || property.district?.fi;
                    
                    // Type labels
                    const propertyType = property.meta.listingTypeLabel?.[language] || property.meta.listingTypeLabel?.fi || property.meta.typeCode;
                    const apartmentType = property.meta.apartmentType?.[language] || property.meta.apartmentType?.fi;
                    
                    // Calculate "other area" from balcony + terrace  
                    const balconyArea = property.dimensions.balcony || 0;
                    const terraceArea = property.dimensions.terrace || 0;
                    const otherArea = balconyArea + terraceArea > 0 ? balconyArea + terraceArea : undefined;
                    
                    // Dennis 2025-11-10: MÄKLARINFO ska synas (samma som huvudsidan)
                    const agent = property.agent ? {
                      name: property.agent.name || '',
                      phone: property.agent.phone || '',
                      email: property.agent.email || '',
                      photoUrl: property.agent.photoUrl || undefined,
                    } : undefined;
                    
                    return (
                      <FeaturedPropertyCard
                        key={property.id}
                        href={`/${language}/kohde/${property.slug}`}
                        locale={language}
                        title={title}
                        fullAddress={fullAddress}
                        propertyType={propertyType}
                        apartmentType={apartmentType}
                        district={district}
                        images={images}
                        showCarousel={true}
                        variant={variant}
                        livingArea={property.dimensions.living}
                        otherArea={otherArea}
                        totalArea={property.dimensions.total}
                        plotArea={property.dimensions.plot}
                        askPrice={property.pricing.sales}
                        debtFreePrice={property.pricing.debtFree}
                        monthlyRent={rent}
                        agent={agent}
                      />
                    );
                  })}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-6">
                  {filteredProperties.map((property) => {
                    const price = property.pricing.debtFree || property.pricing.sales || 0;
                    const area = property.dimensions.living || 0;
                    const address = property.address[language] || property.address.fi;
                    const city = property.city[language] || property.city.fi;
                    const typeLabel = property.meta.listingTypeLabel?.[language] || property.meta.listingTypeLabel?.fi || property.meta.typeCode;
                    const image = property.media.images.find(img => !img.floorPlan)?.url || 
                                  property.media.images[0]?.url ||
                                  '/images/defaults/property-placeholder.jpg';

                    return (
                      <div key={property.id} className="flex gap-6 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative w-80 h-64 flex-shrink-0">
                          <Image
                            src={image}
                            alt={address}
                            fill
                            className="object-cover"
                            unoptimized={image.startsWith('http')}
                          />
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-2xl font-light text-gray-900 mb-2">{address}</h3>
                            <p className="text-gray-600 mb-4">{city}</p>
                            <div className="flex gap-6 text-sm text-gray-600 mb-4">
                              {area > 0 && <span>{area} m²</span>}
                              {typeLabel && <span>{typeLabel}</span>}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-3xl font-light text-[var(--color-primary)]">
                              {price > 0 ? `${price.toLocaleString('fi-FI')} €` : ''}
                            </p>
                            <Link
                              href={(
                                language === 'sv' ? `/objekt/${property.slug}` :
                                language === 'en' ? `/properties/${property.slug}` :
                                `/kohde/${property.slug}`
                              ) as any}
                              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-dark)] transition-colors"
                            >
                              {language === 'fi' ? 'Katso kohde' : language === 'sv' ? 'Se objekt' : 'View property'}
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Map View */}
              {viewMode === 'map' && (
                <div className="w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden">
                  <ListingMap properties={filteredProperties} locale={language} />
                </div>
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

