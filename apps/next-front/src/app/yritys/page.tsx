import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export default function CompanyPage() {
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
                Avaamme uusia ovia vuodesta 2015
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
                    Kansainvälinen osaaminen paikallisella kokemuksella
                  </h2>
                  <div className="space-y-4 text-gray-700 font-light">
                    <p>
                      Snellman Sotheby's International Realty on osa maailman johtavaa 
                      luksuskiinteistöjen välitysketjua. Yhdistämme Sotheby's-brändin 
                      280 vuoden historian ja kansainvälisen verkoston voiman paikalliseen 
                      asiantuntemukseen.
                    </p>
                    <p>
                      Toimintamme perustuu henkilökohtaiseen palveluun, luottamukseen ja 
                      ehdottomaan ammattitaitoon. Jokainen asiakas on meille ainutlaatuinen, 
                      ja räätälöimme palvelumme vastaamaan juuri heidän tarpeitaan.
                    </p>
                    <p>
                      Vuodesta 2015 lähtien olemme palvelleet asiakkaitamme Suomessa ja 
                      auttaneet heitä löytämään unelmiensa kodin tai myymään kiinteistönsä 
                      parhaaseen mahdolliseen hintaan.
                    </p>
                  </div>
                </div>
                <div className="relative h-96 lg:h-[500px]">
                  <Image
                    src="/images/content/snellman-sothebys-yritys.jpg"
                    alt="Snellman Sotheby's toimisto"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Values Section */}
              <div className="mb-20">
                <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">
                  Arvomme
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">Luottamus</h3>
                    <p className="text-gray-600 font-light text-sm">
                      Rakennamme pitkäaikaisia asiakassuhteita luottamuksen pohjalta
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">Intohimo</h3>
                    <p className="text-gray-600 font-light text-sm">
                      Olemme intohimoisia työstämme ja sitoutuneita tuloksiin
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">Kansainvälisyys</h3>
                    <p className="text-gray-600 font-light text-sm">
                      Hyödynnämme globaalia verkostoamme paikallisesti
                    </p>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className="bg-gray-50 p-8 lg:p-12 rounded-lg">
                <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
                  Sotheby's - 280 vuotta historiaa
                </h2>
                <div className="max-w-3xl mx-auto space-y-4 text-gray-700 font-light">
                  <p>
                    Sotheby's perustettiin Lontoossa vuonna 1744, ja se on yksi maailman 
                    vanhimmista ja arvostetuimmista huutokaupoista. Vuosisatojen aikana 
                    Sotheby's on rakentanut maineen laadun, asiantuntemuksen ja 
                    luotettavuuden synonyyminä.
                  </p>
                  <p>
                    Sotheby's International Realty perustettiin vuonna 1976 palvelemaan 
                    Sotheby's-huutokaupan asiakkaita, jotka etsivät ainutlaatuisia koteja 
                    ympäri maailman. Tänään verkostoomme kuuluu yli 1100 toimistoa 84 
                    maassa ja alueella.
                  </p>
                  <p>
                    Snellman Sotheby's International Realty on ylpeä osa tätä arvostettua 
                    perinnettä, tuoden kansainvälisen osaamisen ja verkoston Suomen 
                    kiinteistömarkkinoille.
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
                Tervetuloa tutustumaan toimintaamme
              </h2>
              <p className="text-lg font-light mb-8 text-white/90">
                Olemme täällä sinua varten, oli kyse sitten kodista, sijoituksesta tai unelmasta.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/yhteystiedot"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           bg-white text-[#1a3a4a] hover:bg-gray-100 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  Ota yhteyttä
                </Link>
                <Link
                  href="/henkilosto"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           border border-white text-white hover:bg-white hover:text-[#1a3a4a] 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  Tapaa tiimimme
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>    </div>
  );
}
