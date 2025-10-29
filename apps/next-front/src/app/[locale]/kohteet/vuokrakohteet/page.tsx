import PropertyGrid from '@/components/Property/PropertyGrid';
import { Link } from '@/lib/navigation';
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

interface RentalPropertiesPageProps {
  params: { locale: Locale };
}

export default async function RentalPropertiesPage({ params }: RentalPropertiesPageProps) {
  const { locale } = params;
  let rentalProperties: any[] = [];
  
  try {
    // 🏗️ NEW ARCHITECTURE: Use clean architecture layers
    const { getLinearAPIUrl, getLinearAPIKey, getLinearCompanyId } = await import('@/lib/config/linear-api.config');
    const apiUrl = getLinearAPIUrl();
    const apiKey = getLinearAPIKey();
    const companyId = getLinearCompanyId();
    
    const client = new LinearAPIClient(apiUrl, apiKey, companyId);
    const mapper = new LinearToPropertyMapper();
    const getPropertiesUseCase = new GetProperties(client, mapper);
    
    // Fetch all properties using the new use case
    const domainProperties = await getPropertiesUseCase.execute(locale);
    
    log(`✅ Fetched ${domainProperties.length} properties via new use case`);
    
    // ✅ FILTER FOR RENTAL PROPERTIES - Only show properties with rent
    const rentalDomainProperties = domainProperties.filter(property => {
      const isRental = PropertyVM.isRental(property);
      if (isRental) {
        log(`🏠 RENTAL FOUND: ${property.address.fi} | Rent: ${property.meta.rent} | INCLUDING in rental listings`);
      }
      return isRental;
    });
    
    log(`✅ Found ${rentalDomainProperties.length} rental properties (Vuokrakohteet)`);
    
    // 💎 SORT BY RENT: Most expensive first (Premium branding)
    rentalDomainProperties.sort((a, b) => {
      return (b.meta.rent || 0) - (a.meta.rent || 0); // Descending order (highest first)
    });
    
    log(`💎 Sorted ${rentalDomainProperties.length} rental properties by rent (highest first)`);
    
    // 🎨 TRANSFORM TO VIEW MODELS for backward compatibility with PropertyGrid
    // TODO Phase 4: Refactor PropertyGrid to use PropertyCardVM directly
    rentalProperties = rentalDomainProperties.map(property => ({
      id: property.id,
      slug: property.slug,
      title: property.address[locale] || property.address.fi,
      city: property.city[locale] || property.city.fi,
      price: property.meta.rent,
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
          rent: property.meta.rent?.toString() || null,
          area: property.dimensions.living.toString(),
          propertyType: property.meta.apartmentType?.[locale] || property.meta.apartmentType?.fi || property.meta.typeCode,
        }
      }
    }));
    
  } catch (error) {
    console.error('Error fetching rental properties:', error);
  }

  return (
    <main className="flex-1 bg-white">
      {/* Latest Rental Listings - MOVED TO TOP */}
      <section id="vuokrakohteet" className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-12 text-center">
            Vuokrakohteet
          </h1>

          {rentalProperties.length > 0 ? (
            <PropertyGrid properties={rentalProperties} language="fi" />
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 font-light">
                Ei vuokrakohteita saatavilla tällä hetkellä.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
            Palveleva vuokranvälityksesi!
          </h1>
          <p className="text-xl font-light text-gray-700 leading-relaxed mb-12 max-w-4xl mx-auto">
            Onko kotisi tai toimistotilasi vuokraaminen ajankohtaista? Ammattitaitoiset välittäjämme auttavat sinua myös silloin, kun kotisi tai sijoitusasuntosi on vuokralaisen tarpeessa. Ota yhteyttä, niin keskustellaan mielellämme asunnon vuokraamisesta kanssasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/yhteystiedot"
              className="inline-block bg-[var(--color-primary)] text-white px-10 py-4 
                       hover:bg-[var(--color-primary-dark)] transition-colors 
                       uppercase tracking-wider text-sm font-light"
            >
              Ota yhteyttä
            </Link>
            <Link
              href="#vuokrakohteet"
              className="inline-block border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 py-4 
                       hover:bg-[var(--color-primary)] hover:text-white transition-all 
                       uppercase tracking-wider text-sm font-light"
            >
              Vuokrakohteet
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
            Tervetuloa poikkeukselliseen kiinteistöilmoitukseen!
          </h2>
          <p className="text-xl font-light text-gray-700 mb-8">
            Katso kaikki myytävät kiinteistömme.
          </p>
          <Link
            href="/kohteet"
            className="inline-block bg-[var(--color-primary)] text-white px-10 py-4 
                     hover:bg-[var(--color-primary-dark)] transition-colors 
                     uppercase tracking-wider text-sm font-light"
          >
            Löydä unelmiesi koti
          </Link>
        </div>
      </section>

      {/* Company Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Snellman Sotheby's International Realty®
            </h2>
            <p className="text-lg font-light text-gray-700 leading-relaxed mb-8">
              Meillä kaikilla on erilaiset tarpeet ja toiveet, keskustelemme ja räätälöimme asiakkaidemme toiveiden ja vaatimusten mukaan. Tehtävämme on tehdä unelmastasi totta.
            </p>
            <Link
              href="/myymassa"
              className="inline-block border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 py-4 
                       hover:bg-[var(--color-primary)] hover:text-white transition-all 
                       uppercase tracking-wider text-sm font-light"
            >
              Tee elämäsi ilmoitus
            </Link>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
            Referenssit
          </h2>
          <p className="text-lg font-light text-gray-600 mb-12">
            Näyte myydyistä kohteista
          </p>
          <Link
            href="/kohteet/referenssit"
            className="inline-block border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 py-4 
                     hover:bg-[var(--color-primary)] hover:text-white transition-all 
                     uppercase tracking-wider text-sm font-light"
          >
            Katso lisää
          </Link>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Tervetuloa asiakkaaksemme!
            </h2>
            <p className="text-lg font-light text-gray-700 leading-relaxed mb-12">
              Haluatko vuokrata kotisi tai liiketilasi luotettavalle vuokralaiselle? Snellman Sotheby's International Realty tarjoaa vuokrauspalveluja myös vaativille kiinteistöille.
            </p>
            <p className="text-lg font-light text-gray-700 mb-12">
              Ammattitaitoinen vuokranvälittäjäsi palvelee sinua maanantaista perjantaihin klo 10 – 17,<br />
              sekä muina aikoina sopimuksen mukaan.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl mb-4">📞</div>
                <a href="tel:+358103156900" className="text-lg text-[var(--color-primary)] hover:underline font-light">
                  +358 (0)10 315 6900
                </a>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">📍</div>
                <p className="text-lg text-gray-700 font-light">
                  Kasarmikatu 34,<br />
                  00130 Helsinki
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">✉️</div>
                <a href="mailto:info@sothebysrealty.fi" className="text-lg text-[var(--color-primary)] hover:underline font-light">
                  info@sothebysrealty.fi
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 text-center">
              Vuokranantaja, ota yhteyttä!
            </h2>
            <p className="text-lg font-light text-gray-700 text-center mb-12">
              Kerro meille miten voimme auttaa, niin palaamme asiaan mahdollisimman pian.
            </p>
            <p className="text-base font-light text-gray-700 text-center mb-12">
              Palveluumme kuuluu vuokranvälitys alusta loppuun, eli mm. asunnon tai liiketilan arvioinnit, kriteerejäsi vastaavan vuokralaisen etsintä sekä vuokrasopimuksen laatiminen.
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Nimi *"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Sähköposti *"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Puhelin"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Viesti *"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="mt-1"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600">
                    Olen lukenut{' '}
                    <Link href="/tietosuojaseloste" className="text-[var(--color-primary)] hover:underline">
                      Tietosuojaselosteen
                    </Link>
                  </label>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-[var(--color-primary)] text-white px-12 py-4 
                             hover:bg-[var(--color-primary-dark)] transition-colors 
                             uppercase tracking-wider text-sm font-light"
                  >
                    Lähetä viesti
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
