'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import FeaturedPropertyCard from './FeaturedPropertyCard';
import FilterToggle from '../Filters/FilterToggle';
import type { Property } from '@/lib/domain/property.types';
import { isCommercial } from '@/lib/domain/property-type-helpers';
import { PROPERTY_TYPES } from '@/lib/domain/property-type-filters';

type CardVariant = 'apartment' | 'property' | 'rental' | 'commercial';

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

/** Map a Property to FeaturedPropertyCard props — shared by grid and list views */
function mapPropertyToCard(property: Property, language: 'fi' | 'sv' | 'en') {
  const rent = property.meta.rent || property.rental?.monthlyRent || 0;
  const isRental = rent > 0;
  const isCommercialProperty = isCommercial(property);
  const typeCode = (property.meta.typeCode || '').toLowerCase();
  const isApartment = typeCode.includes('kerrostalo') || typeCode.includes('flat') || typeCode.includes('apartment');

  let variant: CardVariant = 'property';
  if (isRental) variant = 'rental';
  else if (isCommercialProperty) variant = 'commercial';
  else if (isApartment) variant = 'apartment';

  const addressParts = [property.address[language] || property.address.fi, property.gate || ''].filter(Boolean);
  const title = addressParts.join(' ').trim();
  const postalCode = property.postalCode;
  const city = property.city[language] || property.city.fi;
  const fullAddress = postalCode ? `${title}, ${postalCode} ${city}`.trim() : `${title}, ${city}`.trim();
  const images = (property.media.images || []).filter(img => !img.floorPlan).slice(0, 3).map(img => ({ url: img.url, alt: title }));
  const district = property.district?.[language] || property.district?.fi;
  const propertyType = property.meta.listingTypeLabel?.[language] || property.meta.listingTypeLabel?.fi || property.meta.typeCode;
  const apartmentType = property.meta.apartmentType?.[language] || property.meta.apartmentType?.fi;
  const marketingTitle = property.descriptionTitle?.[language] || property.descriptionTitle?.fi;
  const balconyArea = property.dimensions.balcony || 0;
  const terraceArea = property.dimensions.terrace || 0;
  const otherArea = balconyArea + terraceArea > 0 ? balconyArea + terraceArea : undefined;
  const agent = property.agent ? { name: property.agent.name || '', phone: property.agent.phone || '', email: property.agent.email || '', photoUrl: property.agent.photoUrl || undefined } : undefined;

  return {
    key: property.id,
    href: `/${language}/kohde/${property.slug}`,
    locale: language,
    title, fullAddress, propertyType, apartmentType, marketingTitle, district, images,
    showCarousel: true,
    variant,
    livingArea: property.dimensions.living,
    otherArea,
    totalArea: property.dimensions.total,
    businessArea: property.dimensions.business,
    plotArea: property.dimensions.plot,
    askPrice: property.pricing.sales,
    debtFreePrice: property.pricing.debtFree,
    monthlyRent: rent,
    biddingStartPrice: property.pricing.biddingStartPrice,
    biddingUrl: property.pricing.biddingUrl,
    internationalUrl: property.internationalUrl,
    agent,
  };
}

export default function PropertySearch({ properties, language }: PropertySearchProps) {
  const priceMinMax = useMemo(() => {
    const prices = properties.map(p => p.pricing.debtFree || p.pricing.sales || 0).filter(p => p > 0);
    return prices.length > 0
      ? { min: Math.floor(Math.min(...prices) / 10000) * 10000, max: Math.ceil(Math.max(...prices) / 10000) * 10000 }
      : { min: 0, max: 5000000 };
  }, [properties]);

  const areaMinMax = useMemo(() => {
    const areas = properties.map(p => p.dimensions.living || 0).filter(a => a > 0);
    return areas.length > 0
      ? { min: Math.floor(Math.min(...areas) / 10) * 10, max: Math.ceil(Math.max(...areas) / 10) * 10 }
      : { min: 0, max: 1500 };
  }, [properties]);

  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([priceMinMax.min, priceMinMax.max]);
  const [areaRange, setAreaRange] = useState<[number, number]>([areaMinMax.min, areaMinMax.max]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [selectedArea, setSelectedArea] = useState('all');

  const dynamicAreas = useMemo(() => {
    const areasSet = new Set<string>();
    properties.forEach(p => {
      const city = (p.city[language] || p.city.fi || '').trim();
      if (city) areasSet.add(city);
    });
    const loc = language === 'sv' ? 'sv-SE' : language === 'en' ? 'en-GB' : 'fi-FI';
    return Array.from(areasSet).sort((a, b) => a.localeCompare(b, loc));
  }, [properties, language]);

  const dynamicPropertyTypes = useMemo(() => {
    const map = new Map<string, number>();
    properties.forEach(p => { PROPERTY_TYPES.forEach(t => { if (t.filter(p)) map.set(t.id, (map.get(t.id) || 0) + 1); }); });
    return map;
  }, [properties]);

  const allCount = useMemo(() => properties.filter(p => PROPERTY_TYPES[0].filter(p)).length, [properties]);

  const filteredProperties = useMemo(() => {
    const filtered = properties.filter(property => {
      if (selectedType !== 'all') {
        const typeFilter = PROPERTY_TYPES.find(t => t.id === selectedType);
        if (!typeFilter?.filter(property)) return false;
      }
      const price = property.pricing.debtFree || property.pricing.sales || 0;
      if (price > 0 && (price < priceRange[0] || price > priceRange[1])) return false;
      const area = property.dimensions.living || 0;
      if (area > 0 && (area < areaRange[0] || area > areaRange[1])) return false;
      if (selectedArea !== 'all') {
        const city = (property.city[language] || property.city.fi || '').toLowerCase();
        if (!city.includes(selectedArea.toLowerCase())) return false;
      }
      return true;
    });
    return filtered.sort((a, b) => {
      const aRent = a.meta.rent || 0; const bRent = b.meta.rent || 0;
      if ((aRent > 0) !== (bRent > 0)) return aRent > 0 ? -1 : 1;
      return (b.pricing.debtFree || b.pricing.sales) - (a.pricing.debtFree || a.pricing.sales);
    });
  }, [properties, selectedType, priceRange, areaRange, selectedArea, language]);

  const t = {
    searchTitle: { fi: 'Hae kohteita', sv: 'Sök objekt', en: 'Search properties' },
    area: { fi: 'ALUE', sv: 'OMRÅDE', en: 'AREA' },
    allAreas: { fi: 'Kaikki alueet', sv: 'Alla områden', en: 'All areas' },
    propertyType: { fi: 'KOHDETYYPPI', sv: 'OBJEKTTYP', en: 'PROPERTY TYPE' },
    priceLabel: { fi: 'HINTAVÄLI', sv: 'PRISINTERVALL', en: 'PRICE RANGE' },
    areaLabel: { fi: 'KOKO', sv: 'STORLEKSINTERVALL', en: 'SIZE RANGE' },
  };

  return (
    <div>
      {/* Search Filters */}
      <section className="py-8 bg-white border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-2xl font-light text-gray-900 mb-6">{t.searchTitle[language]}</h2>

          <FilterToggle locale={language}>
            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs text-gray-600 mb-2 tracking-wider uppercase">{t.area[language]}</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-none text-sm focus:outline-none focus:border-[var(--color-primary)]" value={selectedArea} onChange={e => setSelectedArea(e.target.value)}>
                  <option value="all">{t.allAreas[language]}</option>
                  {dynamicAreas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-2 tracking-wider uppercase">{t.propertyType[language]}</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-none text-sm focus:outline-none focus:border-[var(--color-primary)]" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                  <option value="all">{PROPERTY_TYPES[0].label[language]} ({allCount})</option>
                  {PROPERTY_TYPES.slice(1).filter(tp => (dynamicPropertyTypes.get(tp.id) || 0) > 0).map(tp => (
                    <option key={tp.id} value={tp.id}>{tp.label[language]} ({dynamicPropertyTypes.get(tp.id)})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Range Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <RangeSlider label={t.priceLabel[language]} min={priceMinMax.min} max={priceMinMax.max} step={50000} value={priceRange} onChange={setPriceRange} format={v => `${v.toLocaleString('fi-FI')} €`} />
              <RangeSlider label={t.areaLabel[language]} min={areaMinMax.min} max={areaMinMax.max} step={10} value={areaRange} onChange={setAreaRange} format={v => `${v} m²`} />
            </div>

            {/* View Mode Selector */}
            <div className="flex justify-center">
              <div className="flex gap-1">
                {(['grid', 'list', 'map'] as const).map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)} className={`p-2.5 border-none rounded-none transition-colors ${viewMode === mode ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`} aria-label={`${mode} view`}>
                    {mode === 'grid' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                    {mode === 'list' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>}
                    {mode === 'map' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>}
                  </button>
                ))}
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
              {(viewMode === 'grid' || viewMode === 'list') && (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'grid grid-cols-1 gap-8'}>
                  {filteredProperties.map(property => {
                    const props = mapPropertyToCard(property, language);
                    return <FeaturedPropertyCard {...props} key={props.key} />;
                  })}
                </div>
              )}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">
                {language === 'fi' ? 'Ei hakutuloksia' : language === 'sv' ? 'Inga sökresultat' : 'No results found'}
              </h2>
              <p className="text-gray-600 font-light">
                {language === 'fi' ? 'Kokeile muuttaa hakuehtoja tai tyhjennä suodattimet.' : language === 'sv' ? 'Försök ändra sökvillkoren eller rensa filtren.' : 'Try changing your search criteria or clear the filters.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/** Reusable dual-thumb range slider */
function RangeSlider({ label, min, max, step, value, onChange, format }: {
  label: string; min: number; max: number; step: number;
  value: [number, number]; onChange: (v: [number, number]) => void;
  format: (v: number) => string;
}) {
  const pctLeft = ((value[0] - min) / (max - min)) * 100;
  const pctRight = 100 - ((value[1] - min) / (max - min)) * 100;

  return (
    <div>
      <label className="block text-xs text-gray-600 mb-2 tracking-wider uppercase">{label}</label>
      <div className="text-sm font-medium text-gray-900 mb-3">{format(value[0])} - {format(value[1])}</div>
      <div className="relative pt-1">
        <div className="absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2"></div>
        <div className="absolute h-2 bg-[var(--color-primary)] rounded-full top-1/2 -translate-y-1/2" style={{ left: `${pctLeft}%`, right: `${pctRight}%` }}></div>
        <input type="range" min={min} max={max} step={step} value={value[0]}
          onChange={e => { const v = parseInt(e.target.value); if (v <= value[1]) onChange([v, value[1]]); }}
          className="dual-range-slider" style={{ zIndex: value[0] > max - step * 2 ? 5 : 3 }} />
        <input type="range" min={min} max={max} step={step} value={value[1]}
          onChange={e => { const v = parseInt(e.target.value); if (v >= value[0]) onChange([value[0], v]); }}
          className="dual-range-slider" style={{ zIndex: 4 }} />
      </div>
      <style jsx>{`
        .dual-range-slider { position: absolute; width: 100%; height: 0; top: 50%; background: transparent; outline: none; pointer-events: none; -webkit-appearance: none; appearance: none; margin: 0; padding: 0; }
        .dual-range-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; background: var(--color-primary, #002349); cursor: pointer; border-radius: 50%; pointer-events: all; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3); margin-top: -9px; }
        .dual-range-slider::-moz-range-thumb { width: 18px; height: 18px; background: var(--color-primary, #002349); cursor: pointer; border-radius: 50%; pointer-events: all; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3); margin-top: -9px; }
        .dual-range-slider::-webkit-slider-thumb:hover { transform: scale(1.1); }
        .dual-range-slider::-moz-range-thumb:hover { transform: scale(1.1); }
        .dual-range-slider::-webkit-slider-runnable-track { height: 0; background: transparent; }
        .dual-range-slider::-moz-range-track { height: 0; background: transparent; }
      `}</style>
    </div>
  );
}
