import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export default function SellingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section with Background */}
        <section 
          className="relative h-[600px] flex items-center justify-center text-white"
          style={{
            backgroundImage: 'url("/images/international/helsinki-waterfront.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/70 to-[var(--color-primary)]/50"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-thin mb-8">
              Myymässä
            </h1>
            <p className="text-lg md:text-xl font-light leading-relaxed mb-12 max-w-3xl mx-auto">
              Haluamme luoda kestävän asiakassuhteen, jossa otamme huomioon pienimmätkin 
              tarpeesi ja toiveesi. Keskustelemme avoimesti ja kuuntelemme huolella, sillä tehtävämme 
              on tehdä unelmistasi totta.
            </p>
            <Link 
              href="/yhteystiedot"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 
                       hover:bg-white hover:text-[var(--color-primary)] transition-all duration-300 
                       font-light uppercase tracking-wider text-sm"
            >
              TEE ELÄMÄSI ASUNTOKAUPAT &gt;
            </Link>
          </div>
        </section>

        {/* Social Media Icons */}
        <section className="py-6 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-6">
              <a 
                href="https://www.facebook.com/Snellmansothebysrealty/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center
                         text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/snellman-sothebys-international-realty" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center
                         text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="mailto:info@sothebysrealty.fi"
                className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center
                         text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Tervetuloa onnistuneeseen asuntokauppaan!
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-gray-700">
                <a href="tel:+358103156900" className="hover:text-[var(--color-primary)] transition-colors font-light">
                  +358 (0)10 315 6900
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a href="https://goo.gl/maps/8HptT8TwUp42" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-[var(--color-primary)] transition-colors font-light">
                  Kasarmikatu 34,<br className="md:hidden" />
                  00130 Helsinki
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a href="mailto:info@sothebysrealty.fi" className="hover:text-[var(--color-primary)] transition-colors font-light">
                  info@sothebysrealty.fi
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Form and Mission Section Side by Side */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {/* Valuation Form */}
              <div className="bg-gray-100 p-8 lg:p-12">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
                  Sovi maksuton arviokäynti!
                </h2>
                <p className="text-gray-700 font-light mb-2">
                  Tiedätkö asuntosi markkina-arvon?
                </p>
                <p className="text-gray-700 font-light mb-8">
                  Kutsu meidät maksuttomalle arviokäynnille – saat alueen asiantuntevimman lausunnon.
                </p>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Etunimi"
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Sukunimi"
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Sähköposti"
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Puhelinnumero"
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                  </div>
                  
                  <textarea
                    placeholder="Viesti"
                    rows={6}
                    className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light resize-none"
                  />
                  
                  <button
                    type="submit"
                    className="w-full bg-[var(--color-primary)] text-white px-6 py-3 hover:bg-[var(--color-primary-dark)] 
                             transition-colors duration-300 font-light"
                  >
                    Lähetä
                  </button>
                </form>
              </div>

              {/* Mission Section */}
              <div className="bg-white p-8 lg:p-12">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
                  Kunniatehtävä
                </h2>
                <div className="space-y-4 text-gray-700 font-light leading-relaxed text-sm">
                  <p>
                    Snellman | Sotheby's International Realty Finland toimii osana maailman suurimpiin kuuluvaa, menestyksekästä 
                    kiinteistönvälitysketjua Sotheby's International Realty®, joten tarjoamme käyttöösi laajan kontaktiverkoston 
                    asiantuntijoineen. Myyntikanavamme kattavat tehokkaan maailmanlaajuisen markkinointiverkoston.
                  </p>
                  <p>
                    Olemme erikoistuneet arvoasuntoihin. Jokainen toimeksianto saa myyntikohteenamme aseman, joka takaa sille erityisen, tavallista 
                    laadukkaamman palvelun.
                  </p>
                  <p>
                    Tarjoamme käyttöösi laajan asiantuntemuksen niin kotimaan kuin kansainvälisilläkin markkinoilla. Edustamme alan parasta 
                    osaamista ja hoidamme sydämellä koko myyntiprosessin alusta loppuun asti. Takaamme, että käytössäsi on kauttamme alan 
                    moderneimmat ja tehokkaimmat markkinointikanavat sekä laaja asiakasverkosto. Näin saavutamme kohteellesi korkeimman 
                    mahdollisen myyntihinnan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Palvelumme
              </h2>
              <div className="space-y-4 text-gray-700 font-light leading-relaxed max-w-4xl mx-auto">
                <p>
                  Haluamme olla mukana elämäsi suuressa taloudellisessa päätöksenteossa, sen vaatimalla arvokkuudella. 
                  Voit aina olla vakuuttunut siitä, että saat asiantuntivimmat sekä luottamuksellisemmat neuvot kokeneilta välittäjiltämme.
                </p>
                <p>
                  Haluamme olla osa koko myyntiprosessia, aina maksuttomasta arviointikäynnistä kauppaan saakka. 
                  Tinkimätön tavoitteemme on, että yhteistyö on hedelmällistä ja että kaikki asiakkaamme palaavat meille tulevaisuudessakin.
                </p>
                <p className="pt-4">
                  Pyydä palvelutarjous maksuttomalla arviokäynnillä.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Palvelumme Column */}
              <div className="bg-white p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-8">
                  Palvelumme
                </h2>
                <div className="space-y-4 text-gray-700 font-light text-sm leading-relaxed">
                  <p>
                    Haluamme olla mukana elämäsi suuressa taloudellisessa päätöksenteossa, sen vaatimalla arvokkuudella. 
                    Voit aina olla vakuuttunut siitä, että saat asiantuntivimmat sekä luottamuksellisemmat neuvot kokeneilta välittäjiltämme.
                  </p>
                  <p>
                    Haluamme olla osa koko myyntiprosessia, aina maksuttomasta arviointikäynnistä kauppaan saakka. 
                    Tinkimätön tavoitteemme on, että yhteistyö on hedelmällistä ja että kaikki asiakkaamme palaavat meille tulevaisuudessakin.
                  </p>
                  <p className="pt-4">
                    Pyydä palvelutarjous maksuttomalla arviokäynnillä.
                  </p>
                </div>
              </div>

              {/* Palveluhinnasto Column */}
              <div className="bg-white p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-8">
                  Palveluhinnasto
                </h2>
                <div className="space-y-1 text-sm">
                  <div className="font-light text-gray-700 mb-4">
                    <div className="mb-2">Välitys- / Myyntitoimeksianto</div>
                    <div className="grid grid-cols-2 gap-y-1">
                      <div>Osakehuoneistot</div>
                      <div className="text-right">5 % sis. alv 25,5%*</div>
                      <div>Kiinteistöt</div>
                      <div className="text-right">6 % sis. alv 25,5%*</div>
                      <div>Etä- ja erikoiskohteet</div>
                      <div className="text-right">7 % sis. alv 25,5%*</div>
                      <div>Vuokraustoimeksianto</div>
                      <div className="text-right">2 kk vuokra sis. alv 25,5%*</div>
                      <div>Minimipalkkio</div>
                      <div className="text-right">5750 € sis. alv 25,5%*</div>
                      <div>Kansainvälinen näkyvyys</div>
                      <div className="text-right">+0,50 % sis. alv 25,5%**</div>
                    </div>
                  </div>
                  <div className="font-light text-gray-700 pt-4">
                    <div className="mb-2">Aloitusmaksu</div>
                    <div className="grid grid-cols-2 gap-y-1">
                      <div>Osakehuoneistot</div>
                      <div className="text-right">Alkaen 500 € sis. alv 25,5%*</div>
                      <div>Kiinteistöt / Etä- ja erikoiskohteet</div>
                      <div className="text-right">Alkaen 3000 € sis. alv 25,5%*</div>
                    </div>
                  </div>
                  <div className="pt-4 text-xs text-gray-600">
                    <p>* Tai sopimuksen mukaan</p>
                    <p>** Soveltuvin osin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Consumer Dispute Section */}
        <section className="py-12 bg-[var(--color-primary)] text-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl font-light mb-4">
                Kuluttajariita
              </h2>
              <p className="font-light mb-2">
                Sopimusta koskeva riita voidaan viedä kuluttajariitalautakunnan ratkaistavaksi.
              </p>
              <p className="font-light">
                Lisätietoa osoitteesta:{' '}
                <a href="https://www.kuluttajariita.fi" target="_blank" rel="noopener noreferrer" 
                   className="text-white underline hover:text-gray-200">
                  www.kuluttajariita.fi
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}