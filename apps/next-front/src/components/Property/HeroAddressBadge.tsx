'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/domain/property.types';

interface HeroAddressBadgeProps {
  address: string;
  postalCode: string;
  city: string;
  slug: string;
  locale: Locale;
}

/**
 * Hero Address Badge - Dennis feedback
 * Clickable address badge displayed at bottom-left of hero carousel
 * On click, opens the property detail page
 */
export function HeroAddressBadge({ address, postalCode, city, slug, locale }: HeroAddressBadgeProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Show badge after mount to avoid SSR mismatch
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  const fullAddress = `${address}, ${postalCode} ${city}`;
  const href = `/${locale}/kohde/${slug}`;

  return (
    <Link
      href={href}
      className="absolute bottom-4 left-4 bg-[#002349]/90 hover:bg-[#002349] text-white px-4 py-3 rounded shadow-lg transition-colors cursor-pointer backdrop-blur-sm block"
      aria-label={`View property: ${fullAddress}`}
    >
      {/* Robert 2025-11-25: Address on two lines only - whitespace-nowrap prevents line breaks */}
      <div className="text-left">
        <div className="text-sm font-semibold whitespace-nowrap">{address}</div>
        <div className="text-xs opacity-90 whitespace-nowrap">{postalCode} {city}</div>
      </div>
    </Link>
  );
}
