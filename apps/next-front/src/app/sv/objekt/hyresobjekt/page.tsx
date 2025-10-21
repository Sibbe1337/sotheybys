import PropertyGrid from '@/components/Property/PropertyGrid';
import { fetchLinearListings } from '@/lib/linear-api-adapter';
import Link from 'next/link';

export const revalidate = 60;

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
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-[var(--color-primary)] text-white py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-light mb-6">
              Hyresobjekt
            </h1>
            <p className="text-xl lg:text-2xl font-light text-white/90 leading-relaxed">
              Exklusiva bostäder och fastigheter till uthyrning i Finland
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-lg text-gray-700 leading-relaxed">
              Upptäck vårt exklusiva utbud av hyresobjekt. Snellman Sotheby's International Realty 
              erbjuder högkvalitativa bostäder och fastigheter till uthyrning i Finlands mest 
              eftertraktade områden.
            </p>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <PropertyGrid properties={rentalProperties} language="sv" />
          
          {rentalProperties.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 font-light text-lg mb-8">
                Inga hyresobjekt tillgängliga för närvarande.
              </p>
              <Link 
                href="/sv/objekt"
                className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 rounded hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Se alla objekt
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[var(--color-primary)] text-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-light mb-6">
            Söker du ett hyresobjekt?
          </h2>
          <p className="text-xl font-light text-white/90 mb-8 max-w-2xl mx-auto">
            Kontakta oss så hjälper vi dig att hitta det perfekta hyresobjektet
          </p>
          <Link 
            href="/sv/kontakta-oss"
            className="inline-block bg-white text-[var(--color-primary)] px-10 py-4 rounded hover:bg-gray-100 transition-colors font-medium"
          >
            Kontakta oss
          </Link>
        </div>
      </section>
    </main>
  );
}
