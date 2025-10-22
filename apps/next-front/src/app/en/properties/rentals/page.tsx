import PropertyGrid from '@/components/Property/PropertyGrid';
import { fetchLinearListings } from '@/lib/linear-api-adapter';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RentalPropertiesPage() {
  let rentalProperties = [];
  
  try {
    const allListings = await fetchLinearListings('en');
    
    // Filter for rental properties
    // ✅ PRIMARY CHECK: Has rent field from Linear API
    rentalProperties = allListings.filter(listing => {
      const hasRent = listing.property?.rent && parseInt(listing.property.rent) > 0;
      const type = listing.property?.saleType?.toLowerCase() || '';
      const status = listing.property?.status?.toLowerCase() || '';
      
      return hasRent || (
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
    <main className="flex-1 bg-white">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
            Your serving rental brokerage!
          </h1>
          <p className="text-xl font-light text-gray-700 leading-relaxed mb-12 max-w-4xl mx-auto">
            Is renting your home or office space topical? Our professional brokers will also help you when your home or investment apartment is without a tenant. Contact us and we will be happy to discuss renting an apartment with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/en/contact-us"
              className="inline-block bg-[var(--color-primary)] text-white px-10 py-4 
                       hover:bg-[var(--color-primary-dark)] transition-colors 
                       uppercase tracking-wider text-sm font-light"
            >
              Contact us
            </Link>
            <Link
              href="#rentals"
              className="inline-block border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 py-4 
                       hover:bg-[var(--color-primary)] hover:text-white transition-all 
                       uppercase tracking-wider text-sm font-light"
            >
              Rental listings
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
            Welcome to an extraordinary property listing!
          </h2>
          <p className="text-xl font-light text-gray-700 mb-8">
            See all our properties for sale.
          </p>
          <Link
            href="/en/properties"
            className="inline-block bg-[var(--color-primary)] text-white px-10 py-4 
                     hover:bg-[var(--color-primary-dark)] transition-colors 
                     uppercase tracking-wider text-sm font-light"
          >
            Find your dream home
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
              We all have different needs and preferences, we discuss and customize according to our customers' wishes and requirements. Our mission is to make your dream come true.
            </p>
            <Link
              href="/en/sell-with-us"
              className="inline-block border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 py-4 
                       hover:bg-[var(--color-primary)] hover:text-white transition-all 
                       uppercase tracking-wider text-sm font-light"
            >
              Make the listing of your life
            </Link>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
            References
          </h2>
          <p className="text-lg font-light text-gray-600 mb-12">
            A sample of sold listings
          </p>
          <Link
            href="/en/properties/references"
            className="inline-block border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 py-4 
                     hover:bg-[var(--color-primary)] hover:text-white transition-all 
                     uppercase tracking-wider text-sm font-light"
          >
            See more
          </Link>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Welcome as our customer!
            </h2>
            <p className="text-lg font-light text-gray-700 leading-relaxed mb-12">
              Do you want to rent your home or business premises to a reliable tenant? Snellman Sotheby's International Realty also offers rental services for demanding properties.
            </p>
            <p className="text-lg font-light text-gray-700 mb-12">
              Your professional rental broker serves you from Monday to Friday 10 – 17,<br />
              as well as other times by appointment.
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

      {/* Latest Rental Listings */}
      <section id="rentals" className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-12 text-center">
            Our latest rental listings
          </h2>
          
          {rentalProperties.length > 0 ? (
            <PropertyGrid properties={rentalProperties} language="en" />
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 font-light">
                No rental properties available at the moment.
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
              Landlord, contact us!
            </h2>
            <p className="text-lg font-light text-gray-700 text-center mb-12">
              Please let us know how we can help and we will get back to you as soon as possible.
            </p>
            <p className="text-base font-light text-gray-700 text-center mb-12">
              Our service includes rental brokerage from start to finish, ie, among other things, appraisals of the apartment or Commercial spaces, the search for a tenant that meets your criteria, and the preparation of a lease agreement.
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Name *"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email *"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Message *"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy-en"
                    required
                    className="mt-1"
                  />
                  <label htmlFor="privacy-en" className="text-sm text-gray-600">
                    I have read the{' '}
                    <Link href="/en/privacy-policy" className="text-[var(--color-primary)] hover:underline">
                      Privacy Policy
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
                    Send message
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
