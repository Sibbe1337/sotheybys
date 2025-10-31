'use client';

import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';

export type Locale = 'fi' | 'sv' | 'en';
export type CardVariant = 'apartment' | 'property' | 'rental';

export interface PropertyCardProps {
  href: string;                // Länk till detaljsidan
  locale: Locale;

  // Titel & meta
  title: string;               // T.ex. "Bernhardinkatu 1 B 27"
  listingTypeLabel?: string;   // T.ex. "Kerrostalo / Höghus / Apartment building"
  apartmentTypeText?: string;  // Huoneistoselitelmä (1h+kt …)
  district?: string;           // Kaupunginosa

  // Media
  images: { url: string; alt?: string }[];

  // Typ
  variant: CardVariant;

  // Mått
  livingArea?: number | null;  // m² (Bostadsyta)
  otherArea?: number | null;   // m² (Övrig yta - for apartments)
  totalArea?: number | null;   // m² (Total yta - for properties)
  plotArea?: number | null;    // m² (Tomtstorlek - for properties)

  // Priser
  askPrice?: number | null;          // Myyntihinta
  debtFreePrice?: number | null;     // Velaton hinta
  monthlyRent?: number | null;       // Hyra / month

  // Frivillig etikett (t.ex. "Ny")
  badge?: string;
  
  // LCP optimization (first card should have priority=true)
  priorityFirstImage?: boolean;
}

/* ------------------------------ Komponent ------------------------------ */

export default function PropertyCard({
  href,
  locale,
  title,
  listingTypeLabel,
  apartmentTypeText,
  district,
  images,
  variant,
  livingArea,
  otherArea,
  totalArea,
  plotArea,
  askPrice,
  debtFreePrice,
  monthlyRent,
  badge,
  priorityFirstImage = false,
}: PropertyCardProps) {
  const L = mapLocale(locale);

  // Bildkarusell
  const { idx, setIdx, onTouchStart, onTouchMove, onTouchEnd } = useMiniCarousel(images.length);

  // Area-sträng - OLIKA FORMAT för olika typer
  const areaStr = variant === 'property' 
    ? formatPropertyArea(livingArea, totalArea, plotArea, L)  // "185 m² / 215 m² | 0.3399 ha"
    : variant === 'rental'
    ? fmtArea(livingArea, L)  // Hyresobjekt: Visa bara boyta "0 m²"
    : joinPlus(fmtArea(livingArea, L), fmtArea(otherArea, L, true));  // Lägenhet: "141 m² + 31 m²"

  // Huvudpris + sekundär rad enligt typ
  const { mainPrice, subPrice, perSqm, rentSuffix } = priceLines({
    variant, L, livingArea, askPrice, debtFreePrice, monthlyRent,
  });

  // Typ | huoneistoselitelmä | stadsdel - filter out "Uppgift saknas" etc
  const nonEmpty = (v?: string | null) => {
    if (!v) return false;
    const s = v.trim();
    return s !== '' && !['Ei ilmoitettu', 'Ej angivet', 'Not specified', 'Uppgift saknas', '—'].includes(s);
  };
  
  const metaRow = [
    listingTypeLabel,
    apartmentTypeText,
    district,
  ].filter(nonEmpty).join(' | ');

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-none border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
      aria-label={title}
    >
      {/* Media */}
      <div
        className="relative aspect-[4/3] w-full select-none bg-gray-100"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Bild */}
        {images[idx] ? (
          <Image
            src={images[idx].url}
            alt={images[idx].alt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority={priorityFirstImage && idx === 0}
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-gray-400">No image</div>
        )}

        {/* Badge */}
        {badge && (
          <span className="absolute left-2 top-2 rounded-none bg-black/80 px-2 py-1 text-xs text-white">
            {badge}
          </span>
        )}

        {/* Karusellkontroller */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setIdx((idx - 1 + images.length) % images.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-none bg-white/85 px-2 py-1 text-sm ring-1 ring-gray-300 hover:bg-white"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setIdx((idx + 1) % images.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-none bg-white/85 px-2 py-1 text-sm ring-1 ring-gray-300 hover:bg-white"
              aria-label="Next image"
            >
              ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={[
                    'h-1.5 w-1.5 rounded-none ring-1 ring-white',
                    i === idx ? 'bg-white' : 'bg-white/40',
                  ].join(' ')}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Innehåll */}
      <div className="space-y-2 p-3">
        {/* Titel */}
        <h3 className="line-clamp-1 text-base font-semibold text-gray-900">{title}</h3>

        {/* Meta-rad */}
        {metaRow && <p className="line-clamp-1 text-sm text-gray-600">{metaRow}</p>}

        {/* Area - visa alltid area-sträng för alla typer */}
        {areaStr && <p className="text-sm text-gray-700">{areaStr}</p>}

        {/* Prisrad */}
        <div className="mt-1 space-y-0.5">
          {mainPrice && (
            <p className="text-base font-semibold text-gray-900">
              {mainPrice} {rentSuffix}
              {perSqm && <span className="ml-2 text-sm font-normal text-gray-600">({perSqm})</span>}
            </p>
          )}
          {subPrice && <p className="text-sm text-gray-600">{subPrice}</p>}
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------ Prislogik ------------------------------- */

function priceLines(
  { variant, L, livingArea, askPrice, debtFreePrice, monthlyRent }:
  { variant: CardVariant; L: string; livingArea?: number | null; askPrice?: number | null; debtFreePrice?: number | null; monthlyRent?: number | null; }
) {
  const perSqm = (value?: number | null) =>
    value && livingArea && livingArea > 0 ? `${Math.round(value / livingArea).toLocaleString(L)} €/m²` : '';

  if (variant === 'rental') {
    const suffix = L.startsWith('fi') ? '€/kk' : L.startsWith('sv') ? '€/månad' : '€/month';
    return {
      mainPrice: currency(monthlyRent, L),
      subPrice: '',
      perSqm: perSqm(monthlyRent ?? undefined),
      rentSuffix: ` ${suffix}`,
    };
  }

  if (variant === 'apartment') {
    const main = currency(debtFreePrice, L);           // Velaton hinta först
    const secondary = currency(askPrice, L);           // Myyntihinta
    return {
      mainPrice: main,
      subPrice: secondary ? label(L, 'myyntihinta') + ' ' + secondary : '',
      perSqm: perSqm(debtFreePrice ?? undefined),
      rentSuffix: '',
    };
  }

  // property
  return {
    mainPrice: currency(debtFreePrice ?? askPrice, L), // Endast velaton hinta enligt krav
    subPrice: '',
    perSqm: perSqm(debtFreePrice ?? askPrice ?? undefined),
    rentSuffix: '',
  };
}

/* ------------------------------- Hooks ---------------------------------- */

function useMiniCarousel(length: number) {
  const [idx, setIdx] = React.useState(0);
  const startX = React.useRef<number | null>(null);

  // enkel autoplay (pausas automatiskt vid touch)
  React.useEffect(() => {
    if (length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % length), 3500);
    return () => clearInterval(t);
  }, [length]);

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

/* ----------------------------- Helpers/format --------------------------- */

function mapLocale(l: Locale) { return l === 'sv' ? 'sv-SE' : l === 'en' ? 'en-GB' : 'fi-FI'; }

function currency(n?: number | null, locale = 'fi-FI') {
  if (typeof n !== 'number') return '';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function fmtArea(n?: number | null, locale = 'fi-FI', isOther = false) {
  if (typeof n !== 'number' || n <= 0) return '';
  const s = `${n.toLocaleString(locale)} m²`;
  return isOther ? `+ ${s}` : s;
}

function fmtPlot(n?: number | null, locale = 'fi-FI') {
  if (typeof n !== 'number' || n <= 0) return '';
  if (n >= 10000) return `${(n / 10000).toLocaleString(locale, { maximumFractionDigits: 2 })} ha`;
  return `${n.toLocaleString(locale)} m²`;
}

function joinPlus(a: string, b: string) {
  return [a, b].filter(Boolean).join(' ');
}

// Format area for properties: "185 m² / 215 m² | 0.3399 ha"
function formatPropertyArea(living?: number | null, total?: number | null, plot?: number | null, locale = 'fi-FI'): string {
  const parts: string[] = [];
  
  // Living / Total area part
  if (living && total) {
    parts.push(`${living.toLocaleString(locale)} m² / ${total.toLocaleString(locale)} m²`);
  } else if (living) {
    parts.push(`${living.toLocaleString(locale)} m²`);
  } else if (total) {
    parts.push(`${total.toLocaleString(locale)} m²`);
  }
  
  // Plot area part (with ha conversion if >= 10000 m²)
  if (plot) {
    const plotStr = fmtPlot(plot, locale);
    if (plotStr) parts.push(plotStr);
  }
  
  return parts.join(' | ');
}

function label(locale: string, k: 'myyntihinta') {
  if (k === 'myyntihinta') return locale.startsWith('sv') ? 'Försäljningspris' : locale.startsWith('en') ? 'Sales price' : 'Myyntihinta';
  return k;
}

