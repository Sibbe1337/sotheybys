import PropertyGrid from '@/components/Property/PropertyGrid';
import { fetchLinearListings } from '@/lib/linear-api-adapter';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RentalPropertiesPage() {
  let rentalProperties = [];
  
  try {
    const allListings = await fetchLinearListings('sv');
    
    // Filter for rental properties (hyresobjekt)
    rentalProperties = allListings.filter(listing => {
      const type = listing.property?.saleType?.toLowerCase() || '';
      const status = listing.property?.status?.toLowerCase() || '';
      return (
        type.includes('hyra') || 
        type.includes('uthyr') || 
        type.includes('rental') || 
        status.includes('hyra') ||
        status.includes('uthyr')
      );
    });
    
    console.log(`✅ Found ${rentalProperties.length} rental properties (Hyresobjekt)`);
  } catch (error) {
    console.error('Error fetching rental properties from Linear:', error);
    rentalProperties = [];
  }

  return (
    <main className="flex-1 bg-white">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
            Din serviceinriktade hyresförmedling!
          </h1>
          <p className="text-xl font-light text-gray-700 leading-relaxed mb-12 max-w-4xl mx-auto">
            Är uthyrning av ditt hem eller kontorsutrymme aktuell? Våra professionella mäklare hjälper dig även när ditt hem eller investeringslägenhet är i behov av hyresgäst. Kontakta oss så diskuterar vi gärna uthyrning av lägenhet med dig.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sv/kontakta-oss"
              className="inline-block bg-[var(--color-primary)] text-white px-10 py-4 
                       hover:bg-[var(--color-primary-dark)] transition-colors 
                       uppercase tracking-wider text-sm font-light"
            >
              Kontakta oss
            </Link>
            <Link
              href="#hyresobjekt"
              className="inline-block border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 py-4 
                       hover:bg-[var(--color-primary)] hover:text-white transition-all 
                       uppercase tracking-wider text-sm font-light"
            >
              Hyresobjekt
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
            Välkommen till en extraordinär fastighetsannons!
          </h2>
          <p className="text-xl font-light text-gray-700 mb-8">
            Se alla våra fastigheter till salu.
          </p>
          <Link
            href="/sv/objekt"
            className="inline-block bg-[var(--color-primary)] text-white px-10 py-4 
                     hover:bg-[var(--color-primary-dark)] transition-colors 
                     uppercase tracking-wider text-sm font-light"
          >
            Hitta ditt drömhem
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
              Vi har alla olika behov och preferenser, vi diskuterar och anpassar enligt våra kunders önskemål och krav. Vår mission är att göra din dröm till verklighet.
            </p>
            <Link
              href="/sv/salj-med-oss"
              className="inline-block border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 py-4 
                       hover:bg-[var(--color-primary)] hover:text-white transition-all 
                       uppercase tracking-wider text-sm font-light"
            >
              Gör annonsen i ditt liv
            </Link>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
            Referenser
          </h2>
          <p className="text-lg font-light text-gray-600 mb-12">
            Ett urval av sålda objekt
          </p>
          <Link
            href="/sv/objekt/referenser"
            className="inline-block border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 py-4 
                     hover:bg-[var(--color-primary)] hover:text-white transition-all 
                     uppercase tracking-wider text-sm font-light"
          >
            Se mer
          </Link>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Välkommen som vår kund!
            </h2>
            <p className="text-lg font-light text-gray-700 leading-relaxed mb-12">
              Vill du hyra ut ditt hem eller dina affärslokaler till en pålitlig hyresgäst? Snellman Sotheby's International Realty erbjuder även hyresförmedling för krävande fastigheter.
            </p>
            <p className="text-lg font-light text-gray-700 mb-12">
              Din professionella hyresförmedlare betjänar dig måndag till fredag kl. 10 – 17,<br />
              samt övriga tider enligt överenskommelse.
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
                  00130 Helsingfors
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

      {/* Latest Rental Listings */}
      <section id="hyresobjekt" className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-12 text-center">
            Våra senaste hyresobjekt
          </h2>
          
          {rentalProperties.length > 0 ? (
            <PropertyGrid properties={rentalProperties} language="sv" />
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 font-light">
                Inga hyresobjekt tillgängliga för närvarande.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 text-center">
              Hyresvärd, kontakta oss!
            </h2>
            <p className="text-lg font-light text-gray-700 text-center mb-12">
              Låt oss veta hur vi kan hjälpa så återkommer vi så snart som möjligt.
            </p>
            <p className="text-base font-light text-gray-700 text-center mb-12">
              Vår service inkluderar hyresförmedling från början till slut, dvs. bland annat värderingar av lägenheten eller affärslokalen, sökning av hyresgäst som uppfyller dina kriterier samt upprättande av hyresavtal.
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Namn *"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="E-post *"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Telefon"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Meddelande *"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy-sv"
                    required
                    className="mt-1"
                  />
                  <label htmlFor="privacy-sv" className="text-sm text-gray-600">
                    Jag har läst{' '}
                    <Link href="/sv/integritetspolicy" className="text-[var(--color-primary)] hover:underline">
                      integritetspolicyn
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
                    Skicka meddelande
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
