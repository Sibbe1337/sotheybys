import PropertySearch from '@/components/Property/PropertySearch';
import PropertyHeroCarousel from '@/components/Property/PropertyHeroCarousel';
import FeaturedPropertyGrid from '@/components/Property/FeaturedPropertyGrid';
import { locales, type Locale } from '@/i18n/config';
import { fetchSaleProperties } from '@/lib/server/fetch-properties';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300; // Regenerate every 5 minutes

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

interface PropertiesPageProps {
  params: { locale: Locale };
}

export default async function PropertiesPage({ params }: PropertiesPageProps) {
  const { locale } = params;
  
  // ✅ SERVER ACTION: Fetch sale properties (no CORS, no duplication)
  const allProperties = await fetchSaleProperties(locale);

  // ✅ SPEC: Get 6 latest properties for hero carousel
  const latestSix = allProperties.slice(0, 6);
  
  // Get 3 featured properties for the grid (same as homepage)
  const featuredThree = allProperties.slice(0, 3);
  
  // Translation helper
  const getTranslation = (key: string) => {
    const translations: Record<string, Record<Locale, string>> = {
      title: {
        fi: 'Objekt till salu',
        sv: 'Objekt till salu',
        en: 'Properties for Sale'
      },
      subtitle: {
        fi: 'Utforska vårt noggrant utvalda sortiment av lyxfastigheter på de mest eftertraktade platserna i Finland',
        sv: 'Utforska vårt noggrant utvalda sortiment av lyxfastigheter på de mest eftertraktade platserna i Finland',
        en: 'Explore our carefully curated selection of luxury properties in Finland\'s most sought-after locations'
      }
    };
    return translations[key]?.[locale] || translations[key]?.fi || '';
  };
  
  return (
    <main className="flex-1">
      {/* ✅ HERO CAROUSEL: Show latest 6 properties one at a time (like current website) */}
      {latestSix.length > 0 && (
        <PropertyHeroCarousel 
          properties={latestSix} 
          locale={locale}
          autoPlayInterval={5000}
        />
      )}

      {/* Property Search Component with Visual Filters */}
      <PropertySearch properties={allProperties} language={locale} />

      {/* Featured Properties Section - Same as Homepage */}
      {featuredThree.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-gray-900 mb-4">
                {getTranslation('title')}
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto font-light">
                {getTranslation('subtitle')}
              </p>
            </div>
            <FeaturedPropertyGrid properties={featuredThree} locale={locale} />
          </div>
        </section>
      )}
    </main>
  );
}