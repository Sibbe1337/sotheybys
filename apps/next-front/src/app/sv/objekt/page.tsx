import PropertyGrid from '@/components/Property/PropertyGrid';
import { fetchLinearListings, fetchTestLinearListings } from '@/lib/linear-api-adapter';
import { getClient } from '@/lib/wordpress';
import { gql } from '@apollo/client';

export const revalidate = 60;

const GET_ALL_PROPERTIES = gql`
  query GetAllProperties {
    posts(first: 100, where: { categoryName: "properties" }) {
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

export default async function PropertiesPage() {
  let allProperties = [];
  
  try {
    // Try to fetch from Linear API first
    const linearProperties = await fetchLinearListings();
    if (linearProperties && linearProperties.length > 0) {
      allProperties = linearProperties;
    } else {
      // Fallback to test API
      const testProperties = await fetchTestLinearListings();
      if (testProperties && testProperties.length > 0) {
        allProperties = testProperties;
      }
    }
  } catch (error) {
    console.error('Error fetching properties from Linear:', error);
  }
  
  // If no Linear properties, try WordPress
  if (allProperties.length === 0) {
    try {
      const { data } = await getClient().query({
        query: GET_ALL_PROPERTIES,
      });
      if (data?.posts?.nodes) {
        allProperties = data.posts.nodes;
      }
    } catch (error) {
      console.error('Error fetching properties from WordPress:', error);
    }
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-6">
              Alla objekt
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 font-light">
              Utforska vårt omfattande urval av noga utvalda fastigheter
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
                <option value="">Alla typer</option>
                <option value="höghus">Höghus</option>
                <option value="egnahemshus">Egnahemshus</option>
                <option value="radhus">Radhus</option>
                <option value="parhus">Parhus</option>
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-lg font-light 
                             focus:outline-none focus:border-[#1a3a4a]">
                <option value="">Alla områden</option>
                <option value="helsingfors">Helsingfors</option>
                <option value="esbo">Esbo</option>
                <option value="vanda">Vanda</option>
                <option value="tammerfors">Tammerfors</option>
                <option value="åbo">Åbo</option>
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-lg font-light 
                             focus:outline-none focus:border-[#1a3a4a]">
                <option value="">Prisordning</option>
                <option value="asc">Billigast först</option>
                <option value="desc">Dyrast först</option>
              </select>
            </div>
            
            <p className="text-gray-600 font-light">
              {allProperties.length} objekt
            </p>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <PropertyGrid properties={allProperties} showStatus={true} language="sv" />
          
          {allProperties.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 
                            rounded-full bg-gray-100 mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">
                Inga objekt tillgängliga
              </h2>
              <p className="text-gray-600 font-light">
                Kom tillbaka senare eller kontakta oss.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}