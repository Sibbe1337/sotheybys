/**
 * Empty State Component
 * 
 * Per spec: Show empty state instead of 404 for missing data
 * Used when:
 * - Unknown locale (runtime)
 * - Missing property data (empty response)
 * - No results found
 */

import type { Locale } from '@/lib/domain/property.types';

interface EmptyStateProps {
  locale: Locale;
  type?: 'property-not-found' | 'no-results' | 'unknown-locale';
  className?: string;
}

export function EmptyState({ locale, type = 'property-not-found', className = '' }: EmptyStateProps) {
  const messages = {
    'property-not-found': {
      fi: {
        title: 'Kohdetta ei löytynyt',
        description: 'Etsimääsi kohdetta ei ole saatavilla. Se on saatettu poistaa tai siirtää.',
        cta: 'Palaa etusivulle'
      },
      sv: {
        title: 'Objektet hittades inte',
        description: 'Det objekt du söker är inte tillgängligt. Det kan ha tagits bort eller flyttats.',
        cta: 'Tillbaka till startsidan'
      },
      en: {
        title: 'Property Not Found',
        description: 'The property you are looking for is not available. It may have been removed or moved.',
        cta: 'Return to homepage'
      }
    },
    'no-results': {
      fi: {
        title: 'Ei tuloksia',
        description: 'Hakuehdoillasi ei löytynyt kohteita. Kokeile muuttaa hakuehtoja.',
        cta: 'Näytä kaikki kohteet'
      },
      sv: {
        title: 'Inga resultat',
        description: 'Inga objekt hittades med dina sökkriterier. Försök ändra sökkriterierna.',
        cta: 'Visa alla objekt'
      },
      en: {
        title: 'No Results',
        description: 'No properties found matching your search criteria. Try adjusting your filters.',
        cta: 'Show all properties'
      }
    },
    'unknown-locale': {
      fi: {
        title: 'Virheellinen kieli',
        description: 'Valitsemaasi kieltä ei ole saatavilla. Olemme ohjanneet sinut suomenkieliselle sivulle.',
        cta: 'Jatka'
      },
      sv: {
        title: 'Ogiltigt språk',
        description: 'Det språk du valde är inte tillgängligt. Vi har dirigerat dig till den svenska sidan.',
        cta: 'Fortsätt'
      },
      en: {
        title: 'Invalid Language',
        description: 'The language you selected is not available. We have redirected you to the English page.',
        cta: 'Continue'
      }
    }
  };

  const content = messages[type][locale];
  const homeUrl = `/${locale}`;

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center px-4 ${className}`}>
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-light text-gray-900 mb-4">
          {content.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 font-light mb-8">
          {content.description}
        </p>

        {/* CTA */}
        <a
          href={homeUrl}
          className="inline-block px-8 py-3 bg-[#002349] text-white font-medium hover:bg-[#001a35] transition-colors"
        >
          {content.cta}
        </a>
      </div>
    </div>
  );
}

