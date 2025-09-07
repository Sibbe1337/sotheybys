import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export default function SellingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-6">
                Myy kotisi meillä
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-light">
                Kansainvälinen asiantuntemus paikallisella osaamisella
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">
                    Miksi valita Snellman Sotheby's International Realty?
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-2">
                        Kansainvälinen verkosto
                      </h3>
                      <p className="text-gray-700 font-light">
                        26 100 välittäjää 1100 välitystoimistossa 84 maassa ja alueella. 
                        Tavoitamme ostajat ympäri maailman.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-2">
                        Laadukas markkinointi
                      </h3>
                      <p className="text-gray-700 font-light">
                        Ammattimaiset valokuvat, virtuaaliesittelyt ja kohdennettu 
                        digitaalinen markkinointi varmistavat kotisi näkyvyyden.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-2">
                        Henkilökohtainen palvelu
                      </h3>
                      <p className="text-gray-700 font-light">
                        Jokainen koti on ainutlaatuinen. Räätälöimme myyntistrategian 
                        juuri sinun tarpeisiisi sopivaksi.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative h-96 lg:h-[500px]">
                  <Image
                    src="/images/content/snellman-sothebys-kutsu-arviokaynnille.jpg"
                    alt="Myy kotisi meillä"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Process Section */}
              <div className="mb-20">
                <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">
                  Näin myyntiprosessi etenee
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-light">1</span>
                    </div>
                    <h3 className="text-lg font-light text-gray-900 mb-2">Arviokäynti</h3>
                    <p className="text-gray-600 font-light text-sm">
                      Tutustumme kotiisi ja laadimme markkina-arvion
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-light">2</span>
                    </div>
                    <h3 className="text-lg font-light text-gray-900 mb-2">Markkinointi</h3>
                    <p className="text-gray-600 font-light text-sm">
                      Ammattimaiset kuvaukset ja kohdennettu markkinointi
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-light">3</span>
                    </div>
                    <h3 className="text-lg font-light text-gray-900 mb-2">Esittelyt</h3>
                    <p className="text-gray-600 font-light text-sm">
                      Järjestämme yksityisnäytöt potentiaalisille ostajille
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-light">4</span>
                    </div>
                    <h3 className="text-lg font-light text-gray-900 mb-2">Kaupanteko</h3>
                    <p className="text-gray-600 font-light text-sm">
                      Neuvottelemme parhaan hinnan ja hoidamme paperityöt
                    </p>
                  </div>
                </div>
              </div>

              {/* Services Grid */}
              <div className="bg-gray-50 p-8 lg:p-12 rounded-lg">
                <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
                  Palvelumme sisältää
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-[#1a3a4a] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 font-light">Ilmainen arviokäynti</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-[#1a3a4a] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 font-light">Ammattivalokuvaus</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-[#1a3a4a] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 font-light">Virtuaaliesittely</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-[#1a3a4a] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 font-light">Kansainvälinen markkinointi</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-[#1a3a4a] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 font-light">Stailaus-konsultointi</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-[#1a3a4a] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 font-light">Kaupantekopalvelut</span>
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
                Kutsu meidät maksuttomalle arviokäynnille
              </h2>
              <p className="text-lg font-light mb-8 text-white/90">
                Aloita kotisi myyntiprosessi ottamalla yhteyttä. 
                Arviokäynti on aina maksuton ja sitoumukseton.
              </p>
              <Link
                href="/yhteystiedot"
                className="inline-flex items-center gap-2 px-8 py-4 
                         bg-white text-[#1a3a4a] hover:bg-gray-100 
                         transition-colors duration-300 font-light tracking-wider uppercase text-sm"
              >
                Varaa arviokäynti
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
