  import PropertySearch from '@/components/Property/PropertySearch';
import PropertyHeroCarousel from '@/components/Property/PropertyHeroCarousel';
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
    </main>
  );
}