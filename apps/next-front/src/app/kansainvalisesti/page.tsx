import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export default function InternationalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] lg:h-[70vh] bg-gray-900">
          <Image
            src="/images/content/sothebys-international-realty-verkosto.jpg"
            alt="Sotheby's International Realty Network"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin mb-6">
                Kansainvälinen verkosto
              </h1>
              <p className="text-xl lg:text-2xl font-light text-white/90 max-w-3xl mx-auto">
                26 100 välittäjää • 1100 toimistoa • 84 maata ja aluetta
              </p>
            </div>
          </div>
        </section>

        {/* Global Presence Section */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
                  Globaali läsnäolo, paikallinen asiantuntemus
                </h2>
                <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
                  Sotheby's International Realty on maailman johtava luksuskiinteistöjen 
                  välitysketju. Verkostomme ulottuu kaikkialle merkittävimpiin kaupunkeihin 
                  ja kohteisiin ympäri maailman.
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-thin text-[#1a3a4a] mb-2">
                    26,100
                  </div>
                  <p className="text-gray-600 font-light">Välittäjää</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-thin text-[#1a3a4a] mb-2">
                    1,100
                  </div>
                  <p className="text-gray-600 font-light">Toimistoa</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-thin text-[#1a3a4a] mb-2">
                    84
                  </div>
                  <p className="text-gray-600 font-light">Maata ja aluetta</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-thin text-[#1a3a4a] mb-2">
                    280+
                  </div>
                  <p className="text-gray-600 font-light">Vuotta historiaa</p>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                <div>
                  <h3 className="text-2xl font-light text-gray-900 mb-6">
                    Mitä kansainvälinen verkosto tarkoittaa sinulle?
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="text-[#1a3a4a] mr-3 mt-1">•</span>
                      <p className="text-gray-700 font-light">
                        <strong className="font-medium">Globaali näkyvyys:</strong> Kotisi 
                        näkyy potentiaalisille ostajille ympäri maailman
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-[#1a3a4a] mr-3 mt-1">•</span>
                      <p className="text-gray-700 font-light">
                        <strong className="font-medium">Eksklusiivinen markkinointi:</strong> Pääsy 
                        ainutlaatuisiin markkinointikanaviin ja -alustoihin
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-[#1a3a4a] mr-3 mt-1">•</span>
                      <p className="text-gray-700 font-light">
                        <strong className="font-medium">Kansainväliset ostajat:</strong> Tavoitamme 
                        ostajat, jotka etsivät kotia Suomesta
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-[#1a3a4a] mr-3 mt-1">•</span>
                      <p className="text-gray-700 font-light">
                        <strong className="font-medium">Verkosto-osaaminen:</strong> Hyödynnämme 
                        kollegoidemme osaamista ympäri maailman
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative h-96">
                  <Image
                    src="/images/content/sothebys-maailmankartta.jpg"
                    alt="Sotheby's Global Network"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Marketing Channels */}
              <div className="bg-gray-50 p-8 lg:p-12 rounded-lg mb-20">
                <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">
                  Kansainväliset markkinointikanavamme
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-lg font-light text-gray-900 mb-2">
                      Sothebysrealty.com
                    </h4>
                    <p className="text-gray-600 font-light text-sm">
                      Maailman johtava luksuskiinteistöportaali
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-lg font-light text-gray-900 mb-2">
                      Robb Report & WSJ
                    </h4>
                    <p className="text-gray-600 font-light text-sm">
                      Eksklusiivinen media-kumppanuus
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-lg font-light text-gray-900 mb-2">
                      Globaali verkosto
                    </h4>
                    <p className="text-gray-600 font-light text-sm">
                      Suorat yhteydet välittäjiin maailmanlaajuisesti
                    </p>
                  </div>
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
                Hyödynnä kansainvälinen verkostomme
              </h2>
              <p className="text-lg font-light mb-8 text-white/90">
                Olitpa ostamassa tai myymässä, kansainvälinen verkostomme on käytettävissäsi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/myymassa"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           bg-white text-[#1a3a4a] hover:bg-gray-100 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  Myy kansainvälisesti
                </Link>
                <Link
                  href="/kohteet"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           border border-white text-white hover:bg-white hover:text-[#1a3a4a] 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  Selaa kohteita
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>    </div>
  );
}
