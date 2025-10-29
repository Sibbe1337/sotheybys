import PropertySearch from '@/components/Property/PropertySearch';
import { locales, type Locale } from '@/i18n/config';
import { LinearAPIClient } from '@/lib/infrastructure/linear-api/client';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';
import { GetProperties } from '@/lib/application/get-properties.usecase';
import { PropertyVM } from '@/lib/presentation/property.view-model';
import { log } from '@/lib/logger';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

interface PropertiesPageProps {
  params: { locale: Locale };
}

export default async function PropertiesPage({ params }: PropertiesPageProps) {
  const { locale } = params;
  let allProperties: any[] = []; // Legacy format for backward compatibility with PropertySearch
  
  try {
    // 🏗️ NEW ARCHITECTURE: Use clean architecture layers
    const apiUrl = process.env.NEXT_PUBLIC_LINEAR_API_URL || process.env.LINEAR_API_URL || '';
    const apiKey = process.env.LINEAR_API_KEY;
    
    const client = new LinearAPIClient(apiUrl, apiKey);
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
    
    // 🎨 TRANSFORM TO VIEW MODELS for backward compatibility with PropertySearch
    // TODO Phase 2: Refactor PropertySearch to use PropertyCardVM directly
    allProperties = saleProperties.map(property => ({
      id: property.id,
      slug: property.slug,
      title: property.address[locale] || property.address.fi,
      city: property.city[locale] || property.city.fi,
      price: property.pricing.sales,
      debtFreePrice: property.pricing.debtFree,
      area: property.dimensions.living,
      propertyType: property.meta.typeCode,
      featuredImage: {
        node: {
          sourceUrl: property.media.images.find(img => !img.floorPlan)?.url || property.media.images[0]?.url || '',
          altText: property.address[locale] || property.address.fi
        }
      },
      images: property.media.images,
      // Keep ACF structure for backward compatibility
      acfRealEstate: {
        property: {
          address: property.address[locale] || property.address.fi,
          city: property.city[locale] || property.city.fi,
          price: property.pricing.sales.toString(),
          debtFreePrice: property.pricing.debtFree.toString(),
          area: property.dimensions.living.toString(),
          propertyType: property.meta.apartmentType?.[locale] || property.meta.apartmentType?.fi || property.meta.typeCode,
          rent: property.meta.rent?.toString() || null,
        }
      }
    }));
    
  } catch (error) {
    console.error('Error fetching properties:', error);
    log('❌ Error fetching properties:', error);
  }

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

      {/* Property Search Component with Visual Filters */}
      <PropertySearch properties={allProperties} language={locale} />
    </main>
  );
}