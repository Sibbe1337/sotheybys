'use client';

import { useState, useEffect } from 'react';

interface HeroAddressBadgeProps {
  address: string;
  postalCode: string;
  city: string;
}

/**
 * Hero Address Badge - PDF spec s.2
 * Clickable address badge displayed at bottom-left of hero image
 * On click, scrolls to top of page
 */
export function HeroAddressBadge({ address, postalCode, city }: HeroAddressBadgeProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Show badge after mount to avoid SSR mismatch
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClick = () => {
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  const fullAddress = `${address}, ${postalCode} ${city}`;

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-4 left-4 bg-[#002349]/90 hover:bg-[#002349] text-white px-4 py-3 rounded shadow-lg transition-colors cursor-pointer backdrop-blur-sm"
      aria-label={`Address: ${fullAddress}`}
    >
      <div className="text-left">
        <div className="text-sm font-semibold">{address}</div>
        <div className="text-xs opacity-90">{postalCode} {city}</div>
      </div>
    </button>
  );
}


