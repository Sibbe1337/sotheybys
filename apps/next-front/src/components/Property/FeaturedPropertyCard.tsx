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
  
  // Type & location
  propertyType?: string;      // "Kerrostalo" / "Mökki tai huvila"
  district?: string;          // "Lauttasaari" / "Sirkka"
  
  // Description
  apartmentType?: string;     // "5-6h, k, kph..."
  
  // Media - Dennis: Support both single image (Hem) and carousel (Objekt)
  image?: { url: string; alt?: string };  // Single image (Hem-fliken)
  images?: { url: string; alt?: string }[]; // Multiple images (Objekt-fliken)
  showCarousel?: boolean;     // true = show carousel with arrows (Objekt), false = single image (Hem)
  
  // Variant
  variant: 'apartment' | 'property' | 'rental';
  
  // Prices
  debtFreePrice?: number | null;  // Velaton hinta (Vh)
  askPrice?: number | null;        // Myyntihinta (Mh)
  monthlyRent?: number | null;     // Vuokra/kk
  
  // Areas
  livingArea?: number | null;      // m² (Bostadsyta)
  otherArea?: number | null;       // m² (Balkong + Terrass för lägenhet)
  totalArea?: number | null;       // m² (Total yta för fastighet)
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
    propertyType,
    district,
    apartmentType,
    image,
    images,
    showCarousel = false,
    variant,
    debtFreePrice,
    askPrice,
    monthlyRent,
    livingArea,
    otherArea,
    totalArea,
    plotArea,
    agent,
  } = props;

  // Dennis: Carousel for Objekt-fliken, single image for Hem-fliken
  const displayImages = images && images.length > 0 ? images : (image ? [image] : []);
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

  // Format plot (ha if >= 10000)
  const plot = (n?: number | null) => {
    if (typeof n !== 'number' || n <= 0) return '';
    if (n >= 10000) {
      const ha = (n / 10000).toFixed(4);
      return `${ha.replace('.', ',')} ha`;
    }
    return area(n);
  };

  // Price lines
  let priceDisplay = '';
  if (variant === 'rental' && monthlyRent) {
    const suffix = locale === 'fi' ? '/kk' : locale === 'sv' ? '/mån' : '/month';
    priceDisplay = `${money(monthlyRent)} ${suffix}`;
  } else if (variant === 'apartment' && (debtFreePrice || askPrice)) {
    const parts: string[] = [];
    if (debtFreePrice) parts.push(`Vh ${money(debtFreePrice)}`);
    if (askPrice) parts.push(`Mh ${money(askPrice)}`);
    priceDisplay = parts.join('  ');
  } else if (askPrice) {
    priceDisplay = `Mh ${money(askPrice)}`;
  }

  // Area display
  let areaDisplay = '';
  if (variant === 'property') {
    // "185 m² / 215 m² | 0,1299 ha"
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
  } else if (variant === 'rental') {
    areaDisplay = area(livingArea);
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
    <div className="group flex flex-col overflow-hidden rounded-none border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Image - Dennis: Carousel if showCarousel=true (Objekt), single if false (Hem) */}
      <div 
        className="relative block aspect-[16/10] w-full overflow-hidden bg-gray-100"
        onTouchStart={showCarousel && hasMultipleImages ? onTouchStart : undefined}
        onTouchMove={showCarousel && hasMultipleImages ? onTouchMove : undefined}
        onTouchEnd={showCarousel && hasMultipleImages ? onTouchEnd : undefined}
      >
        <Link href={href} className="block w-full h-full">
          <Image
            src={currentImage.url}
            alt={currentImage.alt || fullAddress}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Carousel controls - ONLY if showCarousel=true AND multiple images */}
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
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white/90 p-2 text-lg shadow-md transition-all z-10"
              aria-label="Previous image"
            >
              ‹
            </button>

            {/* Next button */}
            <button
              type="button"
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation();
                setIdx((idx + 1) % displayImages.length); 
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white/90 p-2 text-lg shadow-md transition-all z-10"
              aria-label="Next image"
            >
              ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 z-10">
              {displayImages.map((_, i) => (
                <span
                  key={i}
                  className={[
                    'h-1.5 w-1.5 rounded-full ring-1 ring-white',
                    i === idx ? 'bg-white' : 'bg-white/40',
                  ].join(' ')}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Title */}
        <Link href={href} className="mb-3">
          <h3 className="font-serif text-2xl font-light leading-tight text-gray-900 transition-colors group-hover:text-[var(--color-primary)]">
            {fullAddress}
          </h3>
        </Link>

        {/* Price */}
        {priceDisplay && (
          <p className="mb-3 text-lg font-semibold text-gray-900">{priceDisplay}</p>
        )}

        {/* Description */}
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

        {/* Dennis: "Katso kohde" tar upp hela bredden */}
        <Link
          href={href}
          className="mt-auto w-full rounded-none bg-[var(--color-primary)] px-4 py-3 text-center text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#001731]"
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

