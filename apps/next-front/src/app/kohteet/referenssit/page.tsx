import PropertyGrid from '@/components/Property/PropertyGrid';
import { getClient } from '@/lib/wordpress';
import { gql } from '@apollo/client';
import Link from 'next/link';

export const revalidate = 60;

const GET_REFERENCE_PROPERTIES = gql`
  query GetReferenceProperties {
    posts(first: 100, where: { categoryName: "referenssit" }) {
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

// Sample reference properties based on the actual site
const sampleReferences = [
  {
    id: 'ref-1',
    title: 'Skutholminkaari 5',
    slug: 'skutholminkaari-5-ref',
    featuredImage: {
      node: {
        sourceUrl: 'https://d33xsej2pkrh3b.cloudfront.net/640x427,fit,q85,f=webp/oviproprodmedia/Production/realty/b5c2b5f1-5e17-4a3f-8c7f-5f5e5c5e5c5e/skutholmin.jpg',
        altText: 'Skutholminkaari 5'
      }
    },
    acfRealEstate: {
      property: {
        address: 'Skutholminkaari 5',
        city: 'Helsinki',
        area: 198,
        propertyType: 'Omakotitalo',
        status: 'Myyty',
        description: '5h, khh, tupak, vh, kph, s, terassi, wc, p'
      }
    }
  },
  {
    id: 'ref-2',
    title: 'Heikkiläntie 1 C',
    slug: 'heikkilantie-1-c-ref',
    featuredImage: {
      node: {
        sourceUrl: 'https://d33xsej2pkrh3b.cloudfront.net/640x427,fit,q85,f=webp/oviproprodmedia/Production/realty/c5e5c5e5-5e17-4a3f-8c7f-5f5e5c5e5c5e/heikkila.jpg',
        altText: 'Heikkiläntie 1 C'
      }
    },
    acfRealEstate: {
      property: {
        address: 'Heikkiläntie 1 C',
        city: 'Helsinki',
        area: 141,
        propertyType: 'Kerrostalo',
        status: 'Myyty',
        description: '3mh, oh, rt, k, kph, 2 wc, lasitettu parveke ja terassi'
      }
    }
  },
  {
    id: 'ref-3',
    title: 'Albertinkatu 19 B',
    slug: 'albertinkatu-19-b-ref',
    featuredImage: {
      node: {
        sourceUrl: 'https://d33xsej2pkrh3b.cloudfront.net/640x427,fit,q85,f=webp/oviproprodmedia/Production/realty/d5e5c5e5-5e17-4a3f-8c7f-5f5e5c5e5c5e/albertin.jpg',
        altText: 'Albertinkatu 19 B'
      }
    },
    acfRealEstate: {
      property: {
        address: 'Albertinkatu 19 B',
        city: 'Helsinki',
        area: 108,
        propertyType: 'Kerrostalo',
        status: 'Myyty',
        description: '2-3h, k, 2 kph/wc, et.'
      }
    }
  }
];

export default async function ReferencesPage() {
  let referenceProperties = [];
  
  // Try to fetch from WordPress
  try {
    const { data } = await getClient().query({
      query: GET_REFERENCE_PROPERTIES,
    });
    if (data?.posts?.nodes && data.posts.nodes.length > 0) {
      referenceProperties = data.posts.nodes;
    }
  } catch (error) {
    console.error('Error fetching reference properties:', error);
  }
  
  // Use sample data if no WordPress data
  if (referenceProperties.length === 0) {
    referenceProperties = sampleReferences;
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
            <PropertyGrid properties={referenceProperties} showStatus={true} />
            
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
