/**
 * Auto-Translate Banner Component
 * 
 * Per spec: Display visible banner when translation is auto-generated
 * "📝 Automatisk översättning / Automatic translation"
 */

import type { Locale } from '@/lib/domain/property.types';

interface AutoTranslateBannerProps {
  locale: Locale;
  className?: string;
}

export function AutoTranslateBanner({ locale, className = '' }: AutoTranslateBannerProps) {
  const messages = {
    fi: '📝 Automaattinen käännös – Alkuperäinen sisältö saattaa olla tarkempi',
    sv: '📝 Automatisk översättning – Originalinnehållet kan vara mer exakt',
    en: '📝 Automatic translation – Original content may be more accurate'
  };

  return (
    <div 
      className={`bg-amber-50 border border-amber-200 rounded-none px-4 py-3 mb-4 ${className}`}
      role="alert"
    >
      <p className="text-sm text-amber-800 flex items-start gap-2">
        <span className="text-base shrink-0" aria-hidden="true">📝</span>
        <span>
          {messages[locale]}
        </span>
      </p>
    </div>
  );
}

/**
 * Inline auto-translate badge (for shorter notices)
 */
export function AutoTranslateBadge({ locale }: { locale: Locale }) {
  const labels = {
    fi: 'Käännetty automaattisesti',
    sv: 'Automatiskt översatt',
    en: 'Auto-translated'
  };

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-sm">
      <span aria-hidden="true">📝</span>
      {labels[locale]}
    </span>
  );
}

