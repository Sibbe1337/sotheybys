import { Link } from '@/lib/navigation';
import Image from 'next/image';

export const revalidate = 60;

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-6">
                Snellman Sotheby's International Realty
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-light">
                Vi öppnar nya dörrar sedan 2015
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">
                    Internationell expertis med lokal erfarenhet
                  </h2>
                  <div className="space-y-4 text-gray-700 font-light">
                    <p>
                      Snellman Sotheby's International Realty är en del av världens ledande 
                      lyxfastighetsmäklarnätverk. Vi kombinerar Sotheby's-varumärkets 
                      280-åriga historia och kraften i vårt internationella nätverk med 
                      lokal expertis.
                    </p>
                    <p>
                      Vår verksamhet baseras på personlig service, förtroende och absolut 
                      professionalism. Varje kund är unik för oss, och vi skräddarsyr våra 
                      tjänster för att möta deras specifika behov.
                    </p>
                    <p>
                      Sedan 2015 har vi betjänat våra kunder i Finland och hjälpt dem att 
                      hitta sitt drömhem eller sälja sin fastighet till bästa möjliga pris.
                    </p>
                  </div>
                </div>
                <div className="relative h-96 lg:h-[500px]">
                  <Image
                    src="/images/content/snellman-sothebys-yritys.jpg"
                    alt="Snellman Sotheby's kontor"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Values Section */}
              <div className="mb-20">
                <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">
                  Våra värderingar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">Förtroende</h3>
                    <p className="text-gray-600 font-light text-sm">
                      Vi bygger långsiktiga kundrelationer baserade på förtroende
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">Passion</h3>
                    <p className="text-gray-600 font-light text-sm">
                      Vi är passionerade för vårt arbete och engagerade i resultat
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">Internationellt</h3>
                    <p className="text-gray-600 font-light text-sm">
                      Vi utnyttjar vårt globala nätverk lokalt
                    </p>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className="bg-gray-50 p-8 lg:p-12 rounded-lg">
                <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
                  Sotheby's - 280 år av historia
                </h2>
                <div className="max-w-3xl mx-auto space-y-4 text-gray-700 font-light">
                  <p>
                    Sotheby's grundades i London 1744 och är ett av världens äldsta och 
                    mest prestigefyllda auktionshus. Under århundradena har Sotheby's byggt 
                    upp ett rykte som synonym för kvalitet, expertis och tillförlitlighet.
                  </p>
                  <p>
                    Sotheby's International Realty grundades 1976 för att betjäna Sotheby's 
                    auktionskunder som sökte unika hem runt om i världen. Idag omfattar vårt 
                    nätverk över 1 100 kontor i 84 länder och territorier.
                  </p>
                  <p>
                    Snellman Sotheby's International Realty är stolt över att vara en del av 
                    detta ansedda arv och bringar internationell expertis och nätverk till den 
                    finska fastighetsmarknaden.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#1a3a4a] text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-light mb-6">
                Välkommen att utforska våra tjänster
              </h2>
              <p className="text-lg font-light mb-8 text-white/90">
                Vi är här för dig, oavsett om det gäller ett hem, en investering eller en dröm.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sv/kontakta-oss"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           bg-white text-[#1a3a4a] hover:bg-gray-100 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  Kontakta oss
                </Link>
                <Link
                  href="/sv/personal"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           border border-white text-white hover:bg-white hover:text-[#1a3a4a] 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  Möt vårt team
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>    
    </div>
  );
}