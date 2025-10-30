import PropertySearch from '@/components/Property/PropertySearch';
import { locales, type Locale } from '@/i18n/config';
import type { Property } from '@/lib/domain/property.types';
import { LinearAPIClient } from '@/lib/infrastructure/linear-api/client';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';
import { GetProperties } from '@/lib/application/get-properties.usecase';
import { PropertyVM } from '@/lib/presentation/property.view-model';
import { log } from '@/lib/logger';

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
  let allProperties: Property[] = []; // ✅ NEW ARCHITECTURE: Property domain objects
  
  try {
    // 🏗️ NEW ARCHITECTURE: Use clean architecture layers
    const { getLinearAPIUrl, getLinearAPIKey, getLinearCompanyId } = await import('@/lib/config/linear-api.config');
    const apiUrl = getLinearAPIUrl();
    const apiKey = getLinearAPIKey();
    const companyId = getLinearCompanyId();
    
    const client = new LinearAPIClient(apiUrl, apiKey, companyId);
    const mapper = new LinearToPropertyMapper();
    const getPropertiesUseCase = new GetProperties(client, mapper);
    
    // Fetch properties using the new use case
    const domainProperties = await getPropertiesUseCase.execute(locale);
    
    log(`✅ Fetched ${domainProperties.length} properties via new use case`);
    
    // ✅ FILTER OUT RENTAL PROPERTIES - Only show sale properties
    const saleProperties = domainProperties.filter(property => {
      const hasRent = property.meta.rent && property.meta.rent > 0;
      if (hasRent) {
        log(`🏠 RENTAL FOUND: ${property.address.fi} | Rent: ${property.meta.rent} | EXCLUDING from sale listings`);
      }
      return !hasRent; // Exclude rental properties
    });
    
    log(`✅ Filtered ${saleProperties.length} sale properties (excluded rentals)`);
    
    // 💎 SORT BY PRICE: Most expensive first (Premium branding)
    // VIKTIGT: Använd SKULDFRITT PRIS (debtFree) som primär sortering
    saleProperties.sort((a, b) => {
      return b.pricing.debtFree - a.pricing.debtFree; // Descending order (highest first)
    });
    
    log(`💎 Sorted ${saleProperties.length} properties by price (highest first)`);
    
    // ✅ NEW ARCHITECTURE: Pass Property objects directly to PropertySearch (BILAGA 2)
    allProperties = saleProperties;
    
  } catch (error) {
    console.error('Error fetching properties:', error);
    log('❌ Error fetching properties:', error);
  }

  // ✅ SPEC: Get 6 latest properties for hero grid
  const latestSix = allProperties.slice(0, 6);
  
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-6">
              {locale === 'sv' ? 'Alla objekt' : locale === 'en' ? 'All properties' : 'Kaikki kohteet'}
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 font-light">
              {locale === 'sv' 
                ? 'Utforska vårt breda utbud av noggrant utvalda fastigheter' 
                : locale === 'en' 
                ? 'Explore our wide selection of carefully selected properties' 
                : 'Tutustu laajaan valikoimaamme huolella valittuja kiinteistöjä'}
            </p>
          </div>
        </div>
      </section>

      {/* ✅ SPEC: 6-Latest Grid (image-only cards) */}
      {latestSix.length > 0 && (
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-light text-gray-900 mb-6">
              {locale === 'sv' ? 'Senaste objekten' : locale === 'en' ? 'Latest Properties' : 'Uusimmat kohteet'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {latestSix.map((p) => {
                const imageUrl = p.media.images.find(img => !img.floorPlan)?.url || p.media.images[0]?.url || '';
                const propertyUrl = `/${locale}/kohde/${p.slug}`;
                const title = p.address[locale] || p.address.fi;
                
                return (
                  <a 
                    key={p.id} 
                    href={propertyUrl}
                    className="relative group block aspect-[4/3] overflow-hidden bg-gray-100"
                  >
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    {/* Info chip bottom-left */}
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-900">
                      {locale === 'sv' ? 'Info' : locale === 'en' ? 'Info' : 'Tiedot'}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Property Search Component with Visual Filters */}
      <PropertySearch properties={allProperties} language={locale} />
    </main>
  );
}