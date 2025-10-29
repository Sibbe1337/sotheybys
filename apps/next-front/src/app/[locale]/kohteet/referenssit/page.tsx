import PropertyGrid from '@/components/Property/PropertyGrid';
import { Link } from '@/lib/navigation';
import { locales, type Locale } from '@/i18n/config';
import { LinearAPIClient } from '@/lib/infrastructure/linear-api/client';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';
import { GetProperties } from '@/lib/application/get-properties.usecase';
import { log } from '@/lib/logger';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

interface ReferencesPageProps {
  params: { locale: Locale };
}

export default async function ReferencesPage({ params }: ReferencesPageProps) {
  const { locale } = params;
  let referenceProperties: any[] = [];
  
  // Fetch sold properties from Linear API
  try {
    // 🏗️ NEW ARCHITECTURE: Use clean architecture layers
    const { getLinearAPIUrl, getLinearAPIKey } = await import('@/lib/config/linear-api.config');
    const apiUrl = getLinearAPIUrl();
    const apiKey = getLinearAPIKey();
    
    const client = new LinearAPIClient(apiUrl, apiKey);
    const mapper = new LinearToPropertyMapper();
    const getPropertiesUseCase = new GetProperties(client, mapper);
    
    // Fetch all properties using the new use case
    const domainProperties = await getPropertiesUseCase.execute(locale);
    
    log(`✅ Fetched ${domainProperties.length} properties via new use case`);
    
    // ✅ FILTER FOR SOLD PROPERTIES - status === 'SOLD'
    const soldDomainProperties = domainProperties.filter(property => {
      const isSold = property.meta.status === 'SOLD';
      if (isSold) {
        log(`🏆 SOLD PROPERTY FOUND: ${property.address.fi}`);
      }
      return isSold;
    });
    
    log(`✅ Found ${soldDomainProperties.length} sold properties (Referenser)`);
    
    // 💎 SORT BY PRICE: Most expensive first (Premium branding)
    // Show most prestigious sales first
    soldDomainProperties.sort((a, b) => {
      return b.pricing.debtFree - a.pricing.debtFree; // Descending order (highest first)
    });
    
    log(`💎 Sorted ${soldDomainProperties.length} sold properties by price (highest first)`);
    
    // 🎨 TRANSFORM TO VIEW MODELS for backward compatibility with PropertyGrid
    // TODO Phase 4: Refactor PropertyGrid to use PropertyCardVM directly
    referenceProperties = soldDomainProperties.map(property => ({
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
          status: 'SOLD',
        }
      },
      property: {
        status: 'SOLD'
      }
    }));
    
  } catch (error) {
    console.error('Error fetching sold properties:', error);
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-6">
                Referenssit
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-light">
                Valikoima onnistuneesti välittämistämme kohteista
              </p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-700 font-light leading-relaxed">
                Olemme ylpeitä jokaisesta onnistuneesta kaupasta. Tässä valikoima 
                aiemmin välittämistämme kohteista, jotka ovat löytäneet uudet omistajat.
              </p>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <PropertyGrid properties={referenceProperties} showStatus={true} language="fi" />
            
            {referenceProperties.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 font-light">
                  Referenssejä päivitetään säännöllisesti.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-light text-gray-900 mb-6">
                Haluatko kodistasi seuraavan referenssin?
              </h2>
              <p className="text-lg text-gray-600 font-light mb-8">
                Ota yhteyttä, niin autamme sinua myymään kotisi parhaaseen hintaan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/myymassa"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           bg-[#1a3a4a] text-white hover:bg-[#0f2633] 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  Myy kotisi
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/yhteystiedot"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  Ota yhteyttä
                </Link>
              </div>
            </div>
          </div>
        </section>
    </main>
  );
}
