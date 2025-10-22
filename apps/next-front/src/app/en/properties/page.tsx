import PropertySearch from '@/components/Property/PropertySearch';
import { fetchLinearListings } from '@/lib/linear-api-adapter';

export const revalidate = 60;

export default async function PropertiesPage() {
  let allProperties = [];
  
  try {
    // Fetch from Linear API - ENGLISH LANGUAGE
    const allListings = await fetchLinearListings('en');
    
    // ✅ FILTER OUT RENTAL PROPERTIES - Only show sale properties
    allProperties = allListings.filter(listing => {
      const rentValue = listing.acfRealEstate?.property?.rent;
      const hasRent = rentValue && 
                      rentValue.trim().length > 0 && 
                      rentValue !== '0' &&
                      rentValue !== 'null' &&
                      !rentValue.toLowerCase().includes('null');
      
      if (hasRent) {
        console.log(`🏠 RENTAL FOUND: ${listing.title} | Rent: "${rentValue}" | EXCLUDING from sale listings`);
      }
      return !hasRent; // Exclude properties with rent field
    });
    
    console.log(`✅ Filtered ${allProperties.length} sale properties (excluded rentals)`);
  } catch (error) {
    console.error('Error fetching properties from Linear:', error);
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-6">
              All Properties
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 font-light">
              Explore our extensive selection of carefully curated properties
            </p>
          </div>
        </div>
      </section>

      {/* Property Search Component with Visual Filters */}
      <PropertySearch properties={allProperties} language="en" />
    </main>
  );
}