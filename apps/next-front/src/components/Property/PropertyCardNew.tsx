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
import { PropertyCardCarousel } from './PropertyCardCarousel';

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
    monthlyRent: locale === 'sv' ? 'Hyra/mån' : locale === 'en' ? 'Rent/month' : 'Vuokra/kk',
  };

  // Extract data
  const address = lpick(property.address, locale);
  const city = lpick(property.city, locale);
  const district = lpick(property.district, locale); // Stadsdel (e.g., Lauttasaari)
  const typeLabel = lpick(property.meta.listingTypeLabel, locale);
  const postalCode = property.postalCode;
  
  // ✅ MÄKLARE SPEC: Build address with gate letter ONLY (NOT apartment number)
  // Example: "Heikkiläntie 1 C, 00210 Helsinki" (not "Heikkiläntie 1 C 47")
  const streetAddress = property.gate 
    ? `${address} ${property.gate}`
    : address;
  const fullAddress = `${streetAddress}, ${postalCode} ${city}`;
  
  // Check if this is a property/estate (vs apartment) or rental
  const isEstate = isProperty(property);
  const isRental = !!property.rental;
  
  // Prices - Rentals show monthly rent, Properties show only Mh, Apartments show both Vh and Mh
  const salesPrice = fmtCurrency(property.pricing.sales, localeStr);
  const debtFreePrice = fmtCurrency(property.pricing.debtFree, localeStr);
  const monthlyRent = property.rental?.monthlyRent ? fmtCurrency(property.rental.monthlyRent, localeStr) : undefined;
  
  // Description
  // - For properties: show "Mökki tai huvila | 3 mh, oh, rt..."  (typeLabel | apartmentType)
  // - For apartments: show ONLY "5-6h, k, kph..." (NO typeLabel prefix)
  const apartmentDesc = lpick(property.meta.apartmentType, locale) || property.dimensions.rooms;
  const description = isEstate && typeLabel && apartmentDesc
    ? `${typeLabel} | ${apartmentDesc}`
    : apartmentDesc;
  
  // Area formatting
  const livingArea = fmtArea(property.dimensions.living, localeStr);
  
  // For estates/properties: calculate detailed area breakdown
  let otherAreas: string | undefined;
  let totalArea: string | undefined;
  let plotArea: string | undefined;
  
  if (isEstate && property.dimensions.plot && property.dimensions.plot > 0) {
    // Property/Estate formatting
    totalArea = property.dimensions.total ? fmtArea(property.dimensions.total, localeStr) : undefined;
    
    // Calculate "other areas" (yta för andra utrymmen = total - living)
    if (property.dimensions.total && property.dimensions.living) {
      const otherAreaValue = property.dimensions.total - property.dimensions.living;
      if (otherAreaValue > 0) {
        otherAreas = fmtArea(otherAreaValue, localeStr);
      }
    }
    
    // Plot area formatting
    plotArea = property.dimensions.plot >= 10000 
      ? `${(property.dimensions.plot / 10000).toFixed(4).replace('.', ',')} ha`
      : fmtArea(property.dimensions.plot, localeStr);
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
      {/* Property Image Carousel with Type Banner */}
      <Link href={propertyUrl} className="block relative">
        <PropertyCardCarousel 
          images={property.media.images}
          alt={imageAlt}
        />
        
        {/* Type Banner */}
        {typeLabel && (
          <div className="absolute top-4 left-0 bg-[#002349] text-white px-4 py-1.5 text-sm font-medium uppercase tracking-wide">
            {typeLabel}
          </div>
        )}
      </Link>

      {/* Property Details */}
      <div className="p-6 space-y-3">
        {/* Title - Full address with postal code and city */}
        <Link href={propertyUrl}>
          <h3 className="text-xl font-serif text-gray-900 leading-tight hover:text-gray-700 transition-colors">
            {fullAddress}
          </h3>
        </Link>

        {/* Price - Rentals show monthly rent, Properties show only Mh, Apartments show both Vh and Mh */}
        <div className="text-lg font-bold text-gray-900">
          {isRental ? (
            // Rental properties - monthly rent
            <span>{t.monthlyRent} {monthlyRent}</span>
          ) : isEstate ? (
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

        {/* Area - Compact single-line format per PDF spec */}
        <p className="text-sm text-gray-600">
          {isRental ? (
            // Rental: Boyta [m²]
            `${locale === 'sv' ? 'Boyta' : locale === 'en' ? 'Living area' : 'Asuinpinta-ala'} ${livingArea}`
          ) : isEstate ? (
            // Property: Boyta [m²] • Total yta [m²] • [Stad] • [Pris]
            <>
              {`${locale === 'sv' ? 'Boyta' : locale === 'en' ? 'Living area' : 'Asuinpinta-ala'} ${livingArea}`}
              {totalArea && ` • ${locale === 'sv' ? 'Total yta' : locale === 'en' ? 'Total area' : 'Kokonaispinta-ala'} ${totalArea}`}
              {district && ` • ${district}`}
            </>
          ) : (
            // Apartment: Boyta [m²] • [Stad] • [Skuldfritt pris]
            <>
              {`${locale === 'sv' ? 'Boyta' : locale === 'en' ? 'Living area' : 'Asuinpinta-ala'} ${livingArea}`}
              {district && ` • ${district}`}
            </>
          )}
        </p>


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

