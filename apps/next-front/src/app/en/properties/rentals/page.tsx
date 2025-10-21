import PropertyGrid from '@/components/Property/PropertyGrid';
import { fetchLinearListings } from '@/lib/linear-api-adapter';
import Link from 'next/link';

export const revalidate = 60;

export default async function RentalPropertiesPage() {
  let rentalProperties = [];
  
  try {
    const allListings = await fetchLinearListings('en');
    
    // Filter for rental properties
    rentalProperties = allListings.filter(listing => {
      const type = listing.property?.saleType?.toLowerCase() || '';
      const status = listing.property?.status?.toLowerCase() || '';
      return (
        type.includes('rent') || 
        type.includes('rental') || 
        type.includes('vuokra') ||
        type.includes('hyra') ||
        status.includes('rent') ||
        status.includes('rental')
      );
    });
    
    console.log(`✅ Found ${rentalProperties.length} rental properties (For Rent)`);
  } catch (error) {
    console.error('Error fetching rental properties from Linear:', error);
    rentalProperties = [];
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-[var(--color-primary)] text-white py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-light mb-6">
              Rental Properties
            </h1>
            <p className="text-xl lg:text-2xl font-light text-white/90 leading-relaxed">
              Exclusive residential properties and estates for rent in Finland
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-lg text-gray-700 leading-relaxed">
              Discover our exclusive selection of rental properties. Snellman Sotheby's International Realty 
              offers high-quality residential properties and estates for rent in Finland's most sought-after locations.
            </p>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <PropertyGrid properties={rentalProperties} language="en" />
          
          {rentalProperties.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 font-light text-lg mb-8">
                No rental properties available at the moment.
              </p>
              <Link 
                href="/en/properties"
                className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 rounded hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                View all properties
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[var(--color-primary)] text-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-light mb-6">
            Looking for a rental property?
          </h2>
          <p className="text-xl font-light text-white/90 mb-8 max-w-2xl mx-auto">
            Contact us and we'll help you find the perfect rental property
          </p>
          <Link 
            href="/en/contact-us"
            className="inline-block bg-white text-[var(--color-primary)] px-10 py-4 rounded hover:bg-gray-100 transition-colors font-medium"
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}
