import PropertySearch from '@/components/Property/PropertySearch';
import PropertyHeroCarousel from '@/components/Property/PropertyHeroCarousel';
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