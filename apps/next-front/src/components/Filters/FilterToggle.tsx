'use client';

import { useState } from 'react';

interface FilterToggleProps {
  children: React.ReactNode;
  locale: 'fi' | 'sv' | 'en';
}

export default function FilterToggle({ children, locale }: FilterToggleProps) {
  const [open, setOpen] = useState(false);

  const labels = {
    show: { fi: 'Näytä suodattimet', sv: 'Visa filter', en: 'Show filters' },
    hide: { fi: 'Piilota suodattimet', sv: 'Dölj filter', en: 'Hide filters' },
  };

  return (
    <div className="md:block">
      {/* Mobile toggle button */}
      <button
        className="md:hidden mb-3 w-full rounded-none border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls="filter-panel"
      >
        <span>{open ? labels.hide[locale] : labels.show[locale]}</span>
        <svg
          className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter content - collapsible on mobile, always visible on desktop */}
      <div
        id="filter-panel"
        className={`${open ? 'block' : 'hidden'} md:block`}
      >
        {children}
      </div>
    </div>
  );
}

