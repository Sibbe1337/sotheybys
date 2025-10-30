/**
 * PROPERTY CARD - DENNIS SPECIFICATION (Oct 2025)
 * 
 * This component renders property cards EXACTLY as specified:
 * 1. Image (clickable)
 * 2. Full Address (street + apartment + postal code + city)
 * 3. Price (ALWAYS both: Vh X € Mh Y €)
 * 4. Description (huoneistoselitelmä only - NO objektstyp prefix)
 * 5. Area (141 m² + 31 m² or 185 m² / 215 m² | 0,1299 ha)
 * 6. Type 🏢 + District 📍 (stadsdel, NOT city)
 * 7. Agent (photo + name + phone + "Ota yhteyttä" link)
 * 8. Button "Katso kohde »"
 */

'use client';

import Image from 'next/image';
import { Link } from '@/lib/navigation';
import type { Property, Locale } from '@/lib/domain/property.types';
import { lpick } from '@/lib/domain/locale-utils';
import { fmtCurrency } from '@/lib/presentation/formatters/currency';
import { fmtArea } from '@/lib/presentation/formatters/area';
import { isProperty } from '@/lib/domain/property-type-helpers';

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
  const district = lpick(property.district, locale); // Stadsdel (e.g., Lauttasaari)
  const typeLabel = lpick(property.meta.listingTypeLabel, locale);
  const postalCode = property.postalCode;
  
  // Build full address with apartment identifier, postal code and city
  // Example: "Heikkiläntie 1 C 47, 00210 Helsinki"
  const streetAddress = property.apartmentIdentifier 
    ? `${address} ${property.apartmentIdentifier}`
    : address;
  const fullAddress = `${streetAddress}, ${postalCode} ${city}`;
  
  // Check if this is a property/estate (vs apartment)
  const isEstate = isProperty(property);
  
  // Prices - Properties show only Mh, Apartments show both Vh and Mh
  const salesPrice = fmtCurrency(property.pricing.sales, localeStr);
  const debtFreePrice = fmtCurrency(property.pricing.debtFree, localeStr);
  
  // Description
  // - For properties: show "Mökki tai huvila | 3 mh, oh, rt..."  (typeLabel | apartmentType)
  // - For apartments: show ONLY "5-6h, k, kph..." (NO typeLabel prefix)
  const apartmentDesc = lpick(property.meta.apartmentType, locale) || property.dimensions.rooms;
  const description = isEstate && typeLabel && apartmentDesc
    ? `${typeLabel} | ${apartmentDesc}`
    : apartmentDesc;
  
  // Area formatting
  const livingArea = fmtArea(property.dimensions.living, localeStr);
  let areaDisplay = livingArea;
  
  // Check if property has plot (is estate/house vs apartment)
  if (property.dimensions.plot && property.dimensions.plot > 0) {
    // ESTATE: "185 m² / 215 m² | 0,1299 ha"
    const totalArea = property.dimensions.total ? fmtArea(property.dimensions.total, localeStr) : undefined;
    const plotArea = property.dimensions.plot >= 10000 
      ? `${(property.dimensions.plot / 10000).toFixed(4).replace('.', ',')} ha`
      : fmtArea(property.dimensions.plot, localeStr);
    
    // Show format: living / total | plot (e.g., "185 m² / 215 m² | 0,1299 ha")
    areaDisplay = totalArea 
      ? `${livingArea} / ${totalArea} | ${plotArea}`
      : `${livingArea} | ${plotArea}`;
  } else if (property.dimensions.balcony || property.dimensions.terrace) {
    // APARTMENT: "141 m² + 31 m²"
    const extraArea = (property.dimensions.balcony || 0) + (property.dimensions.terrace || 0);
    if (extraArea > 0) {
      areaDisplay = `${livingArea} + ${fmtArea(extraArea, localeStr)}`;
    }
  }
  
  // ✅ LINUS FIX: Language-specific URLs for SEO
  // Rewrites in next.config.js map these to /kohde/ internally
  const propertyPaths = {
    fi: `/kohde/${property.slug}`,      // Finnish: /fi/kohde/slug
    sv: `/objekt/${property.slug}`,     // Swedish: /sv/objekt/slug
    en: `/properties/${property.slug}`, // English: /en/properties/slug
  };
  const propertyUrl = propertyPaths[locale];
  
  // Contact URL
  const contactUrl = `${propertyUrl}#contact`;
  
  // Image
  const imageUrl = property.media.images.find(img => !img.floorPlan)?.url || property.media.images[0]?.url || FALLBACK_IMG;
  const imageAlt = fullAddress;

  return (
    <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative group">
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
        {/* Title - Full address with postal code and city */}
        <Link href={propertyUrl}>
          <h3 className="text-xl font-serif text-gray-900 leading-tight hover:text-gray-700 transition-colors">
            {fullAddress}
          </h3>
        </Link>

        {/* Price - Properties show only Mh, Apartments show both Vh and Mh */}
        <div className="text-lg font-bold text-gray-900">
          {isEstate ? (
            // Properties (estates) - only sales price
            <span>{t.mh} {salesPrice}</span>
          ) : (
            // Apartments - both debt-free and sales price
            <>
              <span>{t.vh} {debtFreePrice}</span>
              <span className="ml-4">{t.mh} {salesPrice}</span>
            </>
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
          {district && (
            <span className="inline-flex items-center gap-1.5">
              📍 {district}
            </span>
          )}
        </div>

        {/* Agent Info - Horizontal layout with photo and contact link */}
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
            <Link
              href={contactUrl}
              className="px-3 py-1.5 text-sm font-medium text-[#002349] border border-[#002349] hover:bg-[#002349] hover:text-white transition-colors"
            >
              {t.contact}
            </Link>
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

