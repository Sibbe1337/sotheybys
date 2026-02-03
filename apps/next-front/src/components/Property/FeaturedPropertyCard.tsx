'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type Locale = 'fi' | 'sv' | 'en';

export interface FeaturedPropertyCardProps {
  // Links
  href: string;
  agentEmail?: string;
  agentPhone?: string;

  // Basic info
  locale: Locale;
  title: string;              // Full address WITH apartment number
  fullAddress: string;        // "Heikkiläntie 1 C 47, 00210 Helsinki"
  postalCode?: string;        // Postal code
  city?: string;              // City name
  
  // Type & location
  propertyType?: string;      // "Kerrostalo" / "Mökki tai huvila"
  district?: string;          // "Lauttasaari" / "Sirkka"
  
  // Description
  apartmentType?: string;     // "5-6h, k, kph..."
  marketingTitle?: string;    // Esittelytekstin otsikko / Marketing headline
  
  // Media - Dennis: Support both single image (Hem) and carousel (Objekt)
  image?: { url: string; alt?: string };  // Single image (Hem-fliken)
  images?: { url: string; alt?: string }[]; // Multiple images (Objekt-fliken)
  showCarousel?: boolean;     // true = show carousel with arrows (Objekt), false = single image (Hem)
  
  // Variant
  variant: 'apartment' | 'property' | 'rental' | 'commercial';
  
  // Prices
  debtFreePrice?: number | null;  // Velaton hinta (Vh)
  askPrice?: number | null;        // Myyntihinta (Mh)
  monthlyRent?: number | null;     // Vuokra/kk
  
  // Tarjouskauppa (bidding) - Dennis 2025-11-11
  biddingStartPrice?: number | null;  // Tarjouskaupan lähtöhinta
  biddingUrl?: string | null;         // Link to bidding
  
  // International marketing - Dennis 2025-11-11
  internationalUrl?: string | null;   // Global Listing URL
  
  // Areas
  livingArea?: number | null;      // m² (Bostadsyta)
  otherArea?: number | null;       // m² (Balkong + Terrass för lägenhet)
  totalArea?: number | null;       // m² (Total yta för fastighet / rental)
  businessArea?: number | null;    // m² (Liiketilan pinta-ala för commercial) - Dennis 2025-11-11
  plotArea?: number | null;        // m² (Tomtstorlek)
  
  // Agent
  agent?: {
    name: string;
    phone: string;
    email: string;
    photoUrl?: string;
  };
}

export default function FeaturedPropertyCard(props: FeaturedPropertyCardProps) {
  const {
    href,
    locale,
    fullAddress,
    postalCode,
    city,
    propertyType,
    district,
    apartmentType,
    marketingTitle,
    image,
    images,
    showCarousel = false,
    variant,
    debtFreePrice,
    askPrice,
    monthlyRent,
    biddingStartPrice,
    biddingUrl,
    internationalUrl,
    livingArea,
    otherArea,
    totalArea,
    businessArea,  // Dennis 2025-11-11: Commercial premises area
    plotArea,
    agent,
  } = props;

  // Dennis: Carousel for Objekt-fliken, single image for Hem-fliken
  // Dennis 2025-11-10: ENDAST 3 första bilderna ska visas i karusellen
  const allImages = images && images.length > 0 ? images : (image ? [image] : []);
  const displayImages = allImages.slice(0, 3);  // Begränsa till 3 bilder
  const hasMultipleImages = displayImages.length > 1;
  const { idx, setIdx, onTouchStart, onTouchMove, onTouchEnd } = useMiniCarousel(displayImages.length);
  const currentImage = displayImages[idx] || displayImages[0];

  // Locale mapping
  const L = locale === 'sv' ? 'sv-SE' : locale === 'en' ? 'en-GB' : 'fi-FI';

  // Format money
  const money = (n?: number | null) =>
    typeof n === 'number'
      ? new Intl.NumberFormat(L, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
      : '';

  // Format area
  const area = (n?: number | null) => (typeof n === 'number' && n > 0 ? `${n.toLocaleString(L)} m²` : '');

  // Format plot - Dennis 2025-11-10: Smart unit based on size
  // < 10 000 m² → m², ≥ 10 000 m² → ha
  const plot = (n?: number | null) => {
    if (typeof n !== 'number' || n <= 0) return '';
    
    // Dennis: Under 10 000 m² → visa i m², annars i ha
    if (n < 10000) {
      const formatted = new Intl.NumberFormat(L, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(n);
      return `${formatted} m²`;
    }
    
    // ≥ 10 000 m² → convert to hectares
    const ha = n / 10000;
    const formatted = new Intl.NumberFormat(L, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(ha);
    return `${formatted} ha`;
  };

  // Dennis 2025-11-11: Tarjouskauppa price label translations
  const biddingLabel = {
    fi: 'TARJOUSKAUPPA LÄHTÖHINTA',
    sv: 'BUDGIVNING MED START FRÅN',
    en: 'OPENING BIDS STARTING AT'
  };

  // Price lines
  let priceDisplay = '';
  let priceLabelOverride = ''; // For tarjouskauppa special label
  
  // Dennis 2025-11-11: If this is a tarjouskauppa property, show bidding start price with special label
  if (biddingStartPrice && biddingStartPrice > 0) {
    priceLabelOverride = biddingLabel[locale];
    priceDisplay = money(biddingStartPrice);
  } else if (variant === 'rental' && monthlyRent) {
    const suffix = locale === 'fi' ? '/kk' : locale === 'sv' ? '/mån' : '/month';
    priceDisplay = `${money(monthlyRent)} ${suffix}`;
  } else if (variant === 'apartment' && debtFreePrice) {
    // Dennis 2025-11-24: Show ONLY debt-free price for apartments, no prefix
    priceDisplay = money(debtFreePrice);
  } else if (variant === 'property' && (debtFreePrice || askPrice)) {
    // Dennis 2025-11-24: Show ONLY sales price for properties, no prefix
    priceDisplay = money(debtFreePrice ?? askPrice);
  } else if (askPrice) {
    priceDisplay = money(askPrice);
  }

  // Area display
  // Dennis 2025-11-11: Different logic for commercial, rental, property, apartment
  let areaDisplay = '';
  if (variant === 'commercial') {
    // Commercial: Show businessArea (or totalArea as fallback)
    // "180 m²" (Affärslokalens area / Business premises area)
    const commercialArea = businessArea || totalArea;
    areaDisplay = area(commercialArea);
  } else if (variant === 'rental') {
    // Rental: Show both livingArea AND totalArea if both exist
    // "141 m² • Total 185 m²"
    const parts: string[] = [];
    if (livingArea) parts.push(area(livingArea));
    if (totalArea && totalArea !== livingArea) {
      const totalLabel = locale === 'fi' ? 'Yht.' : locale === 'sv' ? 'Total' : 'Total';
      parts.push(`${totalLabel} ${area(totalArea)}`);
    }
    areaDisplay = parts.join(' • ');
  } else if (variant === 'property') {
    // Property: "185 m² / 215 m² | 0,1299 ha"
    const parts: string[] = [];
    if (livingArea) parts.push(area(livingArea));
    if (totalArea) parts.push(area(totalArea));
    const areaPart = parts.join(' / ');
    const plotPart = plot(plotArea);
    if (areaPart && plotPart) {
      areaDisplay = `${areaPart} | ${plotPart}`;
    } else if (areaPart) {
      areaDisplay = areaPart;
    } else if (plotPart) {
      areaDisplay = plotPart;
    }
  } else {
    // Apartment: "141 m² + 31 m²"
    const parts: string[] = [];
    if (livingArea) parts.push(area(livingArea));
    if (otherArea) parts.push(area(otherArea));
    areaDisplay = parts.join(' + ');
  }

  // Translations
  const contactText = locale === 'fi' ? 'Ota yhteyttä' : locale === 'sv' ? 'Kontakta' : 'Contact';
  const viewText = locale === 'fi' ? 'Katso kohde »' : locale === 'sv' ? 'Se objekt »' : 'View property »';

  return (
    <div className="group flex flex-col overflow-hidden rounded-none border border-gray-200 bg-white shadow-sm transition hover:shadow-md select-none">
      {/* Image - Dennis: Carousel if showCarousel=true (Objekt), single if false (Hem) */}
      <div 
        className="relative block aspect-[16/10] w-full overflow-hidden bg-gray-100"
        onTouchStart={showCarousel && hasMultipleImages ? onTouchStart : undefined}
        onTouchMove={showCarousel && hasMultipleImages ? onTouchMove : undefined}
        onTouchEnd={showCarousel && hasMultipleImages ? onTouchEnd : undefined}
      >
        {/* Image with Link - z-0 so buttons can be on top */}
        <Link href={href} className="absolute inset-0 z-0">
          <Image
            src={currentImage.url}
            alt={currentImage.alt || fullAddress}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Carousel controls - z-20 to be above Link, cursor-pointer for UX */}
        {showCarousel && hasMultipleImages && (
          <>
            {/* Previous button */}
            <button
              type="button"
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation();
                setIdx((idx - 1 + displayImages.length) % displayImages.length); 
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white border border-gray-200 shadow-sm transition-all z-20 cursor-pointer"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next button */}
            <button
              type="button"
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation();
                setIdx((idx + 1) % displayImages.length); 
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white border border-gray-200 shadow-sm transition-all z-20 cursor-pointer"
              aria-label="Next image"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Title */}
        <Link href={href} className="mb-3">
          <div>
            <h3 className="font-serif text-2xl font-light leading-tight text-gray-900 transition-colors group-hover:text-[var(--color-primary)]">
              {fullAddress.split(',')[0].trim()}
            </h3>
            {postalCode && city && (
              <p className="text-sm text-gray-600 mt-1">{postalCode} {city}</p>
            )}
          </div>
        </Link>

        {/* Price - Dennis 2025-11-11: Show tarjouskauppa label if applicable */}
        {priceDisplay && (
          <div className="mb-3">
            {priceLabelOverride && (
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                {priceLabelOverride}
              </p>
            )}
            <p className="text-lg font-semibold text-gray-900">{priceDisplay}</p>
          </div>
        )}

        {/* Marketing Title removed from cards - too cluttered, show on detail page only */}

        {/* Room description (huoneistoselitelmä) */}
        {apartmentType && (
          <p className="mb-2 text-sm leading-relaxed text-gray-600">{apartmentType}</p>
        )}

        {/* Area */}
        {areaDisplay && (
          <p className="mb-4 text-sm font-medium text-gray-700">{areaDisplay}</p>
        )}

        {/* Icons row */}
        <div className="mb-6 flex items-center gap-4 text-sm text-gray-600">
          {propertyType && (
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>{propertyType}</span>
            </div>
          )}
          {district && (
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{district}</span>
            </div>
          )}
        </div>

        {/* Dennis: Agent med "Ota yhteyttä" på samma rad */}
        {agent && (
          <div className="mb-3 flex items-center gap-3 border-t border-gray-100 pt-4">
            {agent.photoUrl && (
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src={agent.photoUrl}
                  alt={agent.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 text-sm">
              <p className="font-semibold text-gray-900">{agent.name}</p>
              <p className="text-gray-600">{agent.phone}</p>
            </div>
            {/* Dennis: "Ota yhteyttä" flyttad till höger bredvid mäklarinfo */}
            <a
              href={`tel:${agent.phone.replace(/\s/g, '')}`}
              className="flex-shrink-0 rounded-none border border-gray-900 px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
            >
              {contactText}
            </a>
          </div>
        )}

        {/* Dennis 2025-11-11: SEURAA TARJOUSKAUPPA button (only for bidding properties) */}
        {/* Dennis 2025-11-13: Kantiga knappar, enhetlig stil */}
        {/* Dennis 2025-01-29: Mer avstånd mellan knappar */}
        {biddingUrl && (
          <a
            href={biddingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full rounded-none bg-[#8e740b] px-4 py-3 text-center text-xs sm:text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#6d5708] shadow-sm hover:shadow-md"
          >
            {locale === 'fi' ? 'SEURAA TARJOUSKAUPPAA' : locale === 'sv' ? 'FÖLJ BUDGIVNINGEN' : 'FOLLOW BIDDING'}
          </a>
        )}
        
        {/* Dennis 2025-11-11: GLOBAL LISTING button (only if published internationally) */}
        {/* Dennis 2025-01-29: Mer avstånd mellan knappar */}
        {internationalUrl && (
          <a
            href={internationalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full rounded-none bg-gray-800 px-4 py-3 text-center text-xs sm:text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-black shadow-sm hover:shadow-md"
          >
            GLOBAL LISTING
          </a>
        )}

        {/* Dennis: "Katso kohde" tar upp hela bredden */}
        {/* Dennis 2025-11-13: Enhetlig stil - font-bold, tracking-wide */}
        {/* Dennis 2025-01-29: Mer avstånd från andra knappar */}
        <Link
          href={href}
          className="mt-3 w-full rounded-none bg-[#002349] px-4 py-3 text-center text-xs sm:text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#001731] shadow-sm hover:shadow-md"
        >
          {viewText}
        </Link>
      </div>
    </div>
  );
}

// ============================================================================
// Carousel Hook (Dennis: Manual navigation only, NO auto-play)
// ============================================================================

function useMiniCarousel(length: number) {
  const [idx, setIdx] = React.useState(0);
  const startX = React.useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.touches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) {
      setIdx(i => (dx > 0 ? (i - 1 + length) % length : (i + 1) % length));
      startX.current = null;
    }
  };
  const onTouchEnd = () => { startX.current = null; };

  return { idx, setIdx, onTouchStart, onTouchMove, onTouchEnd };
}

