import Link from 'next/link';

export const revalidate = 60;

export default function PurchaseAssignmentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-6">
                Ostotoimeksiannot
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-light">
                Autamme sinua löytämään unelmiesi kodin
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-700 font-light leading-relaxed mb-8">
                  Etsimme asiakkaillemme jatkuvasti laadukkaita koteja ja sijoituskohteita. 
                  Jos olet ostamassa asuntoa, voimme auttaa sinua löytämään juuri sinulle 
                  sopivan kodin laajasta verkostostamme.
                </p>

                <h2 className="text-2xl font-light text-gray-900 mb-6 mt-12">
                  Miksi käyttää ostotoimeksiantoa?
                </h2>
                
                <ul className="space-y-4 mb-12">
                  <li className="flex items-start">
                    <span className="text-[#1a3a4a] mr-3 mt-1">•</span>
                    <span className="text-gray-700 font-light">
                      Pääset käsiksi kohteisiin ennen niiden julkista markkinointia
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#1a3a4a] mr-3 mt-1">•</span>
                    <span className="text-gray-700 font-light">
                      Säästät aikaa - me etsimme puolestasi
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#1a3a4a] mr-3 mt-1">•</span>
                    <span className="text-gray-700 font-light">
                      Hyödynnät kansainvälistä verkostoamme
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#1a3a4a] mr-3 mt-1">•</span>
                    <span className="text-gray-700 font-light">
                      Saat asiantuntija-apua koko ostoprosessin ajan
                    </span>
                  </li>
                </ul>

                <div className="bg-gray-50 p-8 rounded-lg mb-12">
                  <h3 className="text-xl font-light text-gray-900 mb-4">
                    Näin ostotoimeksianto toimii
                  </h3>
                  <ol className="space-y-3">
                    <li className="text-gray-700 font-light">
                      <span className="font-medium">1.</span> Tapaamme ja kartoitamme toiveesi
                    </li>
                    <li className="text-gray-700 font-light">
                      <span className="font-medium">2.</span> Etsimme aktiivisesti sopivia kohteita
                    </li>
                    <li className="text-gray-700 font-light">
                      <span className="font-medium">3.</span> Esittelemme löytämämme vaihtoehdot
                    </li>
                    <li className="text-gray-700 font-light">
                      <span className="font-medium">4.</span> Autamme kaupantekoprosessissa
                    </li>
                  </ol>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center mt-16">
                <h3 className="text-2xl font-light text-gray-900 mb-6">
                  Kiinnostaako ostotoimeksianto?
                </h3>
                <p className="text-lg text-gray-600 font-light mb-8">
                  Ota yhteyttä, niin keskustellaan tarpeistasi tarkemmin.
                </p>
                <Link
                  href="/yhteystiedot"
                  className="inline-flex items-center gap-2 px-8 py-4 
                           bg-[#1a3a4a] text-white hover:bg-[#0f2633] 
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
          </div>
        </section>
      </main>    </div>
  );
}
