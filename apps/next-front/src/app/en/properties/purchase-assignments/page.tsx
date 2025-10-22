import Link from 'next/link';
import Image from 'next/image';
import ClientGoogleMap from '@/components/ClientGoogleMap';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PurchaseAssignmentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Video Section */}
        <section className="relative bg-[#3a3a3a] text-white py-32 lg:py-40">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-light mb-8" style={{ color: '#c9a961' }}>
                Our client is seeking
              </h1>
              
              {/* Video Placeholder */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="relative bg-[#2a2a2a] rounded-lg overflow-hidden" style={{ paddingBottom: '40%' }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-white/80 flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold">!</span>
                    </div>
                    <p className="text-white text-lg">This video is private</p>
                  </div>
                </div>
              </div>
              
              <Link
                href="/en/contact-us"
                className="inline-block border-2 border-[#c9a961] text-[#c9a961] px-8 py-3 
                         hover:bg-[#c9a961] hover:text-white transition-all duration-300 
                         uppercase tracking-wider text-sm font-light"
              >
                VIEW CURRENT PURCHASE MANDATES »
              </Link>
            </div>
          </div>
        </section>

        {/* Social Share & Title */}
        <section className="py-12 bg-white">
          <div className="max-w-[1400px] mx-auto px-6">
            {/* Social Icons */}
            <div className="flex justify-center gap-4 mb-12">
              <a href="https://www.facebook.com/SnellmanSIR/" target="_blank" rel="noopener noreferrer"
                 className="w-12 h-12 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] 
                          flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/snellman-sotheby's-international-realty/" target="_blank" rel="noopener noreferrer"
                 className="w-12 h-12 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] 
                          flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="mailto:info@sothebysrealty.fi"
                 className="w-12 h-12 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] 
                          flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </a>
            </div>

            {/* Title & Description */}
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-8">
                Purchase Mandates
              </h2>
              <p className="text-xl text-gray-700 font-light leading-relaxed mb-12">
                Our client, ie the buyer, pays the full commission. Have you considered selling your home?
              </p>
            </div>

            {/* Contact Cards */}
            <div className="max-w-6xl mx-auto">
              <p className="text-center text-lg text-gray-700 font-light mb-12">
                If you have any questions, you can always contact us by calling, sending an email or stopping by our office!
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-20">
                {/* Phone Card */}
                <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">📞</div>
                  <a href="tel:+358103156900" className="text-lg text-[var(--color-primary)] hover:underline font-light">
                    +358 (0)10 315 6900
                  </a>
                </div>

                {/* Address Card */}
                <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">📍</div>
                  <p className="text-lg text-gray-700 font-light">
                    Kasarmikatu 34,<br />
                    00130 Helsinki
                  </p>
                </div>

                {/* Email Card */}
                <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">✉️</div>
                  <a href="mailto:info@sothebysrealty.fi" className="text-lg text-[var(--color-primary)] hover:underline font-light">
                    info@sothebysrealty.fi
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Helsinki Office Section */}
        <section className="py-16 bg-[var(--color-primary)] text-white">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div>
                <h2 className="text-3xl lg:text-4xl font-light mb-6">
                  Our Helsinki Office
                </h2>
                <p className="text-lg font-light leading-relaxed mb-8 text-white/90">
                  In 2015 a new era began in Finland. Ab Snellman LKV Oy Sotheby's International Realty opened its doors to the Finnish market, with goals to bring real estate to a whole new level. In the office, located in the dynamic capital Helsinki, awaits a team motivated experts ready to make your dream come true. The office may be located in Southern Finland but our sales and operations cover the whole country. From the beautiful archipelago up to enchanting Lapland and everything in-between is ours to conquer.
                </p>
                <Link
                  href="https://maps.google.com/?q=Kasarmikatu+34,+00130+Helsinki"
                  target="_blank"
                  className="inline-block border-2 border-white text-white px-8 py-3 
                           hover:bg-white hover:text-[var(--color-primary)] transition-all duration-300 
                           uppercase tracking-wider text-sm font-light"
                >
                  DIRECTIONS »
                </Link>
              </div>

              {/* Google Maps */}
              <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
                <ClientGoogleMap
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.4469348473456!2d24.948847!3d60.165641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bcfef7f1a35%3A0x5e8a9b4e4e5c7d4f!2sSnellman%20Sotheby&#39;s%20International%20Realty!5e0!3m2!1sen!2sfi!4v1234567890123!5m2!1sen!2sfi"
                  title="Snellman Sotheby's International Realty Office"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
