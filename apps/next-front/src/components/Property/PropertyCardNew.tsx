/**
 * PROPERTY CARD - BILAGA 2 SPECIFICATION
 * 
 * This component renders property cards EXACTLY as specified in BILAGA 2:
 * 1. Image with "Ota yhteyttä" link (top right)
 * 2. Address with Type • City
 * 3. Price (Vh X € Mh Y € or just Mh X €)
 * 4. Description (huoneistoselitelmä)
 * 5. Area (141 m² + 31 m² or 185 m² / 215 m² | 0,1299 ha)
 * 6. Type 🏢 + Location 📍
 * 7. Agent (photo + name + phone)
 * 8. Button "Katso kohde »"
 */

'use client';

import Image from 'next/image';
import { Link } from '@/lib/navigation';
import type { Property, Locale } from '@/lib/domain/property.types';
import { lpick } from '@/lib/domain/locale-utils';
import { fmtCurrency } from '@/lib/presentation/formatters/currency';
import { fmtArea } from '@/lib/presentation/formatters/area';

interface PropertyCardNewProps {
  property: Property;
  locale: Locale;
}

const FALLBACK_IMG = '/images/defaults/placeholder-property.jpg';

export default function PropertyCardNew({ property, locale }: PropertyCardNewProps) {
  const localeStr = locale === 'sv' ? 'sv-SE' : locale === 'en' ? 'en-GB' : 'fi-FI';
  
  // Translations
  const t = {
    viewProperty: locale === 'sv' ? 'Se objekt »' : locale === 'en' ? 'View property »' : 'Katso kohde »',
    contact: locale === 'sv' ? 'Kontakta' : locale === 'en' ? 'Contact' : 'Ota yhteyttä',
    vh: locale === 'sv' ? 'Sf' : locale === 'en' ? 'Df' : 'Vh', // Velaton hinta / Skuldfri / Debt-free
    mh: locale === 'sv' ? 'Fp' : locale === 'en' ? 'Ap' : 'Mh', // Myyntihinta / Försäljningspris / Asking price
  };

  // Extract data
  const address = lpick(property.address, locale);
  const city = lpick(property.city, locale);
  const typeLabel = lpick(property.meta.listingTypeLabel, locale);
  const postalCode = property.postalCode;
  
  // Build full address with apartment identifier (e.g., "Heikkiläntie 1 C 47")
  const fullAddress = property.apartmentIdentifier 
    ? `${address} ${property.apartmentIdentifier}`
    : address;
  
  // Prices
  const salesPrice = fmtCurrency(property.pricing.sales, localeStr);
  const debtFreePrice = property.pricing.debt > 0 ? fmtCurrency(property.pricing.debtFree, localeStr) : undefined;
  
  // Description (objekttyp | huoneistoselitelmä)
  // Dennis requirement: "objekttypen saknas fortfarande före huoneistoselitelmän (ex ska det stå Höghus | 5h, kök, badrum..)"
  const apartmentDesc = lpick(property.meta.apartmentType, locale) || property.dimensions.rooms;
  const description = typeLabel && apartmentDesc 
    ? `${typeLabel} | ${apartmentDesc}`
    : apartmentDesc || typeLabel;
  
  // Area formatting
  const livingArea = fmtArea(property.dimensions.living, localeStr);
  let areaDisplay = livingArea;
  
  // Check if property has plot (is estate/house vs apartment)
  if (property.dimensions.plot && property.dimensions.plot > 0) {
    // ESTATE: "185 m² / 215 m² | 0,1299 ha"
    const totalArea = property.dimensions.total ? fmtArea(property.dimensions.total, localeStr) : undefined;
    const plotArea = property.dimensions.plot >= 10000 
      ? `${(property.dimensions.plot / 10000).toFixed(4).replace('.', ',')} ha`
      : `${fmtArea(property.dimensions.plot, localeStr)}`;
    
    areaDisplay = `${livingArea}${totalArea ? ` / ${totalArea}` : ''} | ${plotArea}`;
  } else if (property.dimensions.balcony || property.dimensions.terrace) {
    // APARTMENT: "141 m² + 31 m²"
    const extraArea = (property.dimensions.balcony || 0) + (property.dimensions.terrace || 0);
    if (extraArea > 0) {
      areaDisplay = `${livingArea} + ${fmtArea(extraArea, localeStr)}`;
    }
  }
  
  // Property URL
  const propertyUrl = `/kohde/${property.slug}`;
  
  // Contact URL
  const contactUrl = `${propertyUrl}#contact`;
  
  // Image
  const imageUrl = property.media.images.find(img => !img.floorPlan)?.url || property.media.images[0]?.url || FALLBACK_IMG;
  const imageAlt = fullAddress;

  return (
    <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative group">
      {/* Contact Link - Top Right (positioned over image) */}
      <Link
        href={contactUrl}
        className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-900 hover:bg-white transition-colors shadow-sm"
      >
        {t.contact}
      </Link>

      {/* Property Image */}
      <Link href={propertyUrl} className="block relative aspect-[4/3] bg-gray-100">
        <Image
          key={`card-${property.id || property.slug}-${imageUrl}`}
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          priority={false}
        />
      </Link>

      {/* Property Details */}
      <div className="p-6 space-y-3">
        {/* Title - Address Type • City */}
        <Link href={propertyUrl}>
          <h3 className="text-xl font-serif text-gray-900 leading-tight hover:text-gray-700 transition-colors">
            {fullAddress} {typeLabel} • {city}
          </h3>
        </Link>

        {/* Price - Show both Vh and Mh if debt exists, otherwise just Mh */}
        <div className="text-lg font-bold text-gray-900">
          {debtFreePrice ? (
            <>
              <span>{t.vh} {debtFreePrice}</span>
              <span className="ml-4">{t.mh} {salesPrice}</span>
            </>
          ) : (
            <span>{t.mh} {salesPrice}</span>
          )}
        </div>

        {/* Description - Huoneistoselitelmä / Room description */}
        {description && (
          <p className="text-sm text-gray-700 leading-relaxed">
            {description}
          </p>
        )}

        {/* Area */}
        <p className="text-sm text-gray-700">
          {areaDisplay}
        </p>

        {/* Type + Location with emoji icons */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          {typeLabel && (
            <span className="inline-flex items-center gap-1.5">
              🏢 {typeLabel}
            </span>
          )}
          {city && (
            <span className="inline-flex items-center gap-1.5">
              📍 {city}
            </span>
          )}
        </div>

        {/* Agent Info - Horizontal layout with photo */}
        {property.agent && property.agent.name && (
          <div className="flex items-center gap-3 pt-3 pb-3 border-t border-gray-200">
            {property.agent.photoUrl && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={property.agent.photoUrl}
                  alt={property.agent.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{property.agent.name}</p>
              {property.agent.phone && (
                <p className="text-sm text-gray-600 mt-0.5">{property.agent.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* Button */}
        <Link href={propertyUrl} className="block">
          <button className="w-full py-3 bg-[#002349] text-white font-medium hover:bg-[#001a35] transition-colors text-base">
            {t.viewProperty}
          </button>
        </Link>
      </div>
    </div>
  );
}

