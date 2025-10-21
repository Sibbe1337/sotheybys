import PropertyGrid from '@/components/Property/PropertyGrid';
import { fetchLinearListings, fetchTestLinearListings } from '@/lib/linear-api-adapter';
import { getClient } from '@/lib/wordpress';
import { gql } from '@apollo/client';

export const revalidate = 60;

const GET_RENTAL_PROPERTIES = gql`
  query GetRentalProperties {
    posts(first: 100, where: { categoryName: "vuokrakohteet" }) {
      nodes {
        id
        title
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        acfRealEstate {
          property {
            price
            address
            city
            bedrooms
            bathrooms
            area
            propertyType
            status
            description
          }
        }
      }
    }
  }
`;

export default async function RentalPropertiesPage() {
  let rentalProperties = [];
  
  try {
    const allListings = await fetchLinearListings('fi');
    
    // Filter for rental properties (vuokrakohteet)
    rentalProperties = allListings.filter(listing => {
      const type = listing.property?.saleType?.toLowerCase() || '';
      const status = listing.property?.status?.toLowerCase() || '';
      return (
        type.includes('vuokra') || 
        type.includes('rent') || 
        type.includes('hyra') || 
        status.includes('vuokra') ||
        status.includes('rent')
      );
    });
    
    console.log(`✅ Found ${rentalProperties.length} rental properties (Vuokrakohteet)`);
  } catch (error) {
    console.error('Error fetching rental properties from Linear:', error);
    rentalProperties = [];
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-6">
                Vuokrakohteet
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-light">
                Laadukkaat vuokra-asunnot parhailta alueilta
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="border-y border-gray-200 bg-white sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="py-4 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg font-light 
                               focus:outline-none focus:border-[#1a3a4a]">
                  <option value="">Kaikki tyypit</option>
                  <option value="kerrostalo">Kerrostalo</option>
                  <option value="omakotitalo">Omakotitalo</option>
                  <option value="rivitalo">Rivitalo</option>
                  <option value="paritalo">Paritalo</option>
                </select>
                
                <select className="px-4 py-2 border border-gray-300 rounded-lg font-light 
                               focus:outline-none focus:border-[#1a3a4a]">
                  <option value="">Kaikki alueet</option>
                  <option value="helsinki">Helsinki</option>
                  <option value="espoo">Espoo</option>
                  <option value="vantaa">Vantaa</option>
                  <option value="tampere">Tampere</option>
                  <option value="turku">Turku</option>
                </select>
                
                <select className="px-4 py-2 border border-gray-300 rounded-lg font-light 
                               focus:outline-none focus:border-[#1a3a4a]">
                  <option value="">Vuokrahinta</option>
                  <option value="0-1000">0 - 1000 €/kk</option>
                  <option value="1000-1500">1000 - 1500 €/kk</option>
                  <option value="1500-2000">1500 - 2000 €/kk</option>
                  <option value="2000+">Yli 2000 €/kk</option>
                </select>
              </div>
              
              <p className="text-gray-600 font-light">
                {rentalProperties.length} vuokrakohdetta
              </p>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            {rentalProperties.length > 0 ? (
              <PropertyGrid properties={rentalProperties} showStatus={true} language="fi" />
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 
                              rounded-full bg-gray-100 mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-light text-gray-900 mb-4">
                  Ei vuokrakohteita saatavilla
                </h2>
                <p className="text-gray-600 font-light mb-8">
                  Tällä hetkellä meillä ei ole vuokrakohteita tarjolla.<br />
                  Palaa myöhemmin uudelleen tai ota meihin yhteyttä.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/kohteet"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 
                             border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white 
                             transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                  >
                    Näytä myyntikohteet
                  </a>
                  <a 
                    href="/yhteystiedot"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 
                             bg-[#1a3a4a] text-white hover:bg-[#0f2633] 
                             transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                  >
                    Ota yhteyttä
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
    </main>
  );
}
