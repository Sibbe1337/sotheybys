import PropertyGrid from '@/components/Property/PropertyGrid';
import { fetchLinearListings } from '@/lib/linear-api-adapter';
import Link from 'next/link';

export const revalidate = 60;

export default async function ReferenserPage() {
  let referenceProperties = [];
  
  // Fetch sold properties from Linear API
  try {
    const allListings = await fetchLinearListings('sv');
    
    // Filter for sold properties (status: 'Såld')
    referenceProperties = allListings.filter(listing => {
      const status = listing.property?.status?.toLowerCase();
      return status === 'myyty' || status === 'såld' || status === 'sold';
    });
    
    // Sort by most recent first (if date available)
    referenceProperties.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
    
    console.log(`✅ Found ${referenceProperties.length} sold properties (Referenser - Swedish)`);
  } catch (error) {
    console.error('Error fetching sold properties from Linear:', error);
    referenceProperties = [];
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-6">
                Referenser
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-light">
                Ett urval av framgångsrika fastighetsaffärer
              </p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-700 font-light leading-relaxed">
                Vi är stolta över varje framgångsrik affär. Här är ett urval av 
                tidigare förmedlade fastigheter som har hittat sina nya ägare.
              </p>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <PropertyGrid properties={referenceProperties} showStatus={true} language="sv" />
            
            {referenceProperties.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 font-light">
                  Referenser uppdateras regelbundet.
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
                Vill du att ditt hem ska bli nästa referens?
              </h2>
              <p className="text-lg text-gray-600 font-light mb-8">
                Kontakta oss, så hjälper vi dig att sälja ditt hem till bästa pris.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sv/salj-med-oss"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           bg-[#1a3a4a] text-white hover:bg-[#0f2633] 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  Sälj ditt hem
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/sv/kontakta-oss"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  Kontakta oss
                </Link>
              </div>
            </div>
          </div>
        </section>
    </main>
  );
}
