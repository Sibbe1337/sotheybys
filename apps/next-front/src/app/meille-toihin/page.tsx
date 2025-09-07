import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] lg:h-[70vh] bg-gray-900">
          <Image
            src="/images/content/snellman-sothebys-nakoalapaikka.jpg"
            alt="Työskentele kanssamme"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin mb-6">
                Näköalapaikka kansainväliseen kiinteistönvälitykseen
              </h1>
              <p className="text-xl lg:text-2xl font-light text-white/90 max-w-3xl mx-auto">
                Liity osaksi Suomen johtavaa luksuskiinteistöjen välitysketjua
              </p>
            </div>
          </div>
        </section>

        {/* Why Work With Us Section */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
                  Miksi työskennellä Snellman Sotheby's International Realtyssä?
                </h2>
                <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
                  Tarjoamme ainutlaatuisen mahdollisuuden työskennellä kansainvälisessä 
                  ympäristössä, jossa yhdistyvät paikallistuntemus ja globaali osaaminen.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    Kansainvälinen verkosto
                  </h3>
                  <p className="text-gray-600 font-light text-sm">
                    Pääset osaksi maailman johtavaa luksuskiinteistöjen verkostoa
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    Jatkuva koulutus
                  </h3>
                  <p className="text-gray-600 font-light text-sm">
                    Tarjoamme laajan valikoiman koulutuksia ja kehittymismahdollisuuksia
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    Loistava työyhteisö
                  </h3>
                  <p className="text-gray-600 font-light text-sm">
                    Tiimimme koostuu alan huippuammattilaisista
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    Työkalut menestykseen
                  </h3>
                  <p className="text-gray-600 font-light text-sm">
                    Käytössäsi on alan parhaat työkalut ja järjestelmät
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    Kilpailukykyinen palkkaus
                  </h3>
                  <p className="text-gray-600 font-light text-sm">
                    Palkitsemme onnistumisesta ja tarjoamme hyvät ansaintamahdollisuudet
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    Kasvumahdollisuudet
                  </h3>
                  <p className="text-gray-600 font-light text-sm">
                    Tuemme henkilökohtaista ja ammatillista kasvuasi
                  </p>
                </div>
              </div>

              {/* Open Positions */}
              <div className="mb-20">
                <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">
                  Avoimet työpaikat
                </h2>
                
                <div className="bg-gray-50 p-8 rounded-lg mb-8">
                  <h3 className="text-xl font-light text-gray-900 mb-4">
                    Kiinteistönvälittäjä
                  </h3>
                  <p className="text-gray-700 font-light mb-4">
                    Etsimme kokeneita kiinteistönvälittäjiä vahvistamaan tiimiämme. 
                    Tarjoamme erinomaisen työympäristön, kansainvälisen verkoston tuen 
                    ja alan parhaat työkalut.
                  </p>
                  <Link
                    href="/yhteystiedot"
                    className="inline-flex items-center gap-2 text-[#1a3a4a] hover:text-[#0f2633] 
                             font-light transition-colors"
                  >
                    Lue lisää ja hae
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg">
                  <h3 className="text-xl font-light text-gray-900 mb-4">
                    Avoin hakemus
                  </h3>
                  <p className="text-gray-700 font-light mb-4">
                    Kiinnostaako sinua työskentely kanssamme? Voit lähettää meille 
                    avoimen hakemuksen, ja otamme yhteyttä sopivan tilaisuuden avautuessa.
                  </p>
                  <Link
                    href="/yhteystiedot"
                    className="inline-flex items-center gap-2 text-[#1a3a4a] hover:text-[#0f2633] 
                             font-light transition-colors"
                  >
                    Lähetä avoin hakemus
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
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
                Haluatko kuulla lisää?
              </h2>
              <p className="text-lg font-light mb-8 text-white/90">
                Ota yhteyttä ja keskustellaan mahdollisuuksista
              </p>
              <Link
                href="/yhteystiedot"
                className="inline-flex items-center gap-2 px-8 py-4 
                         bg-white text-[#1a3a4a] hover:bg-gray-100 
                         transition-colors duration-300 font-light tracking-wider uppercase text-sm"
              >
                Ota yhteyttä
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>    </div>
  );
}
