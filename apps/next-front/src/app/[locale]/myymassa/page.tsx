import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { VideoSection } from '@/components/ui/VideoSection';
import { locales, type Locale } from '@/i18n/config';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

// 🔥 LINUS FIX: Complete translations for Selling page
const translations = {
  fi: {
    title: 'Myymässä',
    heroText: 'Haluamme luoda kestävän asiakassuhteen, jossa otamme huomioon pienimmätkin tarpeesi ja toiveesi. Keskustelemme avoimesti ja kuuntelemme huolella, sillä tehtävämme on tehdä unelmistasi totta.',
    heroCTA: 'TEE ELÄMÄSI ASUNTOKAUPAT',
    attentionTitle: 'Älä vain saa sitä markkinoille. Anna sille ansaitsemansa huomio.',
    attentionText: 'Niille, jotka vaativat korotettua palvelua, jollaista ei muualla ole, on Sotheby\'s International Realty. Olemme alan parhaita välittäjiä, ja huolenpitomme tyyliin ja yksityiskohtiin on vertaansa vailla. Olemme täällä auttamassa sinua myymään kotisi mittakaavassa, jota et löydä muualta.',
    welcomeTitle: 'Tervetuloa onnistuneeseen asuntokauppaan!',
    formTitle: 'Sovi maksuton arviokäynti!',
    formSubtitle: 'Tiedätkö asuntosi markkina-arvon?',
    formText: 'Kutsu meidät maksuttomalle arviokäynnille – saat alueen asiantuntevimman lausunnon.',
    honorTitle: 'Kunniatehtävä',
    relationshipTitle: 'Arvokas asiakassuhde',
    promiseTitle: 'Palvelulupauksemme',
    pricingTitle: 'Palveluhinnasto',
    videoTitle: 'Miksi myydä kanssamme?',
    videoSubtitle: 'Katso miten autamme asiakkaitamme onnistuneeseen asuntokauppaan',
    disputeTitle: 'Kuluttajariita',
    disputeText: 'Sopimusta koskeva riita voidaan viedä kuluttajariitalautakunnan ratkaistavaksi.',
    disputeLink: 'Lisätietoa osoitteesta:',
  },
  sv: {
    title: 'Sälja',
    heroText: 'Vi vill skapa en hållbar kundrelation där vi tar hänsyn till dina minsta behov och önskemål. Vi diskuterar öppet och lyssnar noggrant, eftersom vår uppgift är att göra dina drömmar till verklighet.',
    heroCTA: 'GÖR DINA LIVS BOSTADSAFFÄRER',
    attentionTitle: 'Få inte bara ut den på marknaden. Ge den den uppmärksamhet den förtjänar.',
    attentionText: 'För dem som kräver förhöjd service som inte finns någon annanstans, finns Sotheby\'s International Realty. Vi är branschens bästa mäklare, och vår omsorg om stil och detaljer är oöverträffad. Vi är här för att hjälpa dig sälja ditt hem i en skala du inte hittar någon annanstans.',
    welcomeTitle: 'Välkommen till en framgångsrik bostadsaffär!',
    formTitle: 'Boka en gratis värdering!',
    formSubtitle: 'Känner du till ditt hems marknadsvärde?',
    formText: 'Bjud in oss för en kostnadsfri värdering – få områdets mest expertisutlåtande.',
    honorTitle: 'Hedersuppdrag',
    relationshipTitle: 'Värdefull kundrelation',
    promiseTitle: 'Vårt servicelöfte',
    pricingTitle: 'Prislista',
    videoTitle: 'Varför sälja med oss?',
    videoSubtitle: 'Se hur vi hjälper våra kunder till en framgångsrik bostadsaffär',
    disputeTitle: 'Konsumenttvist',
    disputeText: 'En tvist som rör avtalet kan tas upp för konsumenttvistnämnden.',
    disputeLink: 'Mer information på:',
  },
  en: {
    title: 'Selling',
    heroText: 'We want to create a lasting customer relationship where we consider your smallest needs and wishes. We discuss openly and listen carefully, as our mission is to make your dreams come true.',
    heroCTA: 'MAKE THE PROPERTY DEALS OF YOUR LIFE',
    attentionTitle: 'Don\'t just get it on the market. Give it the attention it deserves.',
    attentionText: 'For those who demand elevated service like nowhere else, there\'s Sotheby\'s International Realty. We are the industry\'s best agents, and our care for style and detail is unparalleled. We are here to help you sell your home on a scale you won\'t find elsewhere.',
    welcomeTitle: 'Welcome to a successful property transaction!',
    formTitle: 'Schedule a free appraisal!',
    formSubtitle: 'Do you know your property\'s market value?',
    formText: 'Invite us for a free appraisal – get the area\'s most expert opinion.',
    honorTitle: 'Honorary Mission',
    relationshipTitle: 'Valuable Customer Relationship',
    promiseTitle: 'Our Service Promise',
    pricingTitle: 'Service Pricing',
    videoTitle: 'Why sell with us?',
    videoSubtitle: 'See how we help our clients achieve successful property transactions',
    disputeTitle: 'Consumer Dispute',
    disputeText: 'A dispute concerning the contract can be submitted to the Consumer Disputes Board.',
    disputeLink: 'More information at:',
  },
};

export default function SellingPage({ params }: { params: { locale: Locale } }) {
  const t = translations[params.locale] || translations.fi;
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
              {t.title}
            </h1>
            <p className="text-lg md:text-xl font-light leading-relaxed mb-12 max-w-3xl mx-auto">
              {t.heroText}
            </p>
            <Link 
              href="/yhteystiedot"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 
                       hover:bg-white hover:text-[var(--color-primary)] transition-all duration-300 
                       font-light uppercase tracking-wider text-sm"
            >
              {t.heroCTA} &gt;
            </Link>
          </div>
        </section>

        {/* Attention Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
                {t.attentionTitle}
              </h2>
              <p className="text-lg text-gray-700 font-light leading-relaxed mb-8">
                {t.attentionText}
              </p>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                {t.welcomeTitle}
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
                  {t.formTitle}
                </h2>
                <p className="text-gray-700 font-light mb-2">
                  {t.formSubtitle}
                </p>
                <p className="text-gray-700 font-light mb-8">
                  {t.formText}
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
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacy-fi"
                      required
                      className="mt-1"
                    />
                    <label htmlFor="privacy-fi" className="text-sm text-gray-700 font-light">
                      Olen lukenut{' '}
                      <a href="/tietosuojaseloste" className="text-[var(--color-primary)] hover:underline">
                        Tietosuojaselosteen
                      </a>
                    </label>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="newsletter-fi"
                      className="mt-1"
                    />
                    <label htmlFor="newsletter-fi" className="text-sm text-gray-700 font-light">
                      Haluan vastaanottaa Snellman Sotheby's uutiskirjeen
                    </label>
                  </div>
                  
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
                  {t.honorTitle}
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

        {/* A Valuable Relationship Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 text-center">
                {t.relationshipTitle}
              </h2>
              <div className="space-y-6 text-gray-700 font-light leading-relaxed text-base">
                <p>
                  Toivomme, että yhteistyö kanssamme on aina pitkäaikainen suhde henkilökohtaisella tasolla. 
                  Pidämme jokaista asiakastamme ainutlaatuisena ja arvokkaana kaikilta osa-alueilta. 
                  Meillä kaikilla on erilaiset tarpeet ja toiveet, keskustelemme ja räätälöimme asiakkaidemme toiveiden ja vaatimusten mukaan. 
                  Tehtävämme on tehdä unelmastasi totta.
                </p>
                <p>
                  Snellman Sotheby's International Realty Finland kuuluu yhdeksi maailman arvostetuimmista 
                  kiinteistönvälitysketjuista. Jäsenyys Sotheby's International Realty®:ssä merkitsee jäsenyyttä globaalissa verkostossa, 
                  jolla on laaja asiantuntemus, elintärkeät kontaktit, poikkeukselliset myyntikanavat sekä pääsy tehokkaimpiin 
                  markkinointikanaviin.
                </p>
                <p>
                  Olemme erikoistuneet luksus- ja arvoasuntoihin, ja tarjoamme sinulle markkinoiden haluttuimpia koteja. 
                  Kokeneet tiimimme jäsenet kunnioittavat aina mahdollisuutta jakaa asiantuntemuksensa kanssasi, 
                  ja haluamme olla mukana prosessissa alusta loppuun. Takaamme pääsyn uusimpiin markkinointikanaviin, 
                  oikeaan asiakasverkostoon, korkeimpaan mahdolliseen hintaan ja tietysti kokemuksen, jonka muistat mielellään.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Service Promise Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 text-center">
                {t.promiseTitle}
              </h2>
              <div className="space-y-6 text-gray-700 font-light leading-relaxed text-base">
                <p>
                  Haluamme tukea sinua, kun olet tekemässä yhtä elämäsi tärkeimmistä taloudellisista päätöksistä 
                  ja varmistaa, että teet oikean valinnan. Takaamme, että saat kokeneiden asiantuntijoidemme mielipiteen 
                  ja tuen koko prosessin ajan. Korkein toiveemme on, että kaikki asiakkaamme tuntevat olonsa mukavaksi 
                  kanssamme ja että yhteistyö tulevaisuudessa on luonnollinen päätös jokaiselle asiakkaallemme.
                </p>
                <p>
                  Älä unohda pyytää palvelutarjousta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-12 text-center">
                {t.pricingTitle}
              </h2>
              
              <div className="bg-gray-50 p-8 md:p-12 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left pb-4 font-light text-lg">Välittäjä / Myyntitoimeksiannot</th>
                      <th className="text-right pb-4 font-light text-lg"></th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Osakehuoneistot</td>
                      <td className="py-3 text-right font-light">5 % sis. alv 25,5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Kiinteistöt</td>
                      <td className="py-3 text-right font-light">6 % sis. alv 25,5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Etä- ja erikoiskohteet</td>
                      <td className="py-3 text-right font-light">7 % sis. alv 25,5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Vuokraustoimeksianto</td>
                      <td className="py-3 text-right font-light">2 kk vuokra sis. alv 25,5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Minimipalkkio</td>
                      <td className="py-3 text-right font-light">5750 € sis. alv 25,5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Kansainvälinen näkyvyys</td>
                      <td className="py-3 text-right font-light">+0,50 % sis. alv 25,5%**</td>
                    </tr>
                  </tbody>
                </table>
                
                <table className="w-full mt-8">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left pb-4 font-light text-lg">Aloitusmaksu</th>
                      <th className="text-right pb-4 font-light text-lg"></th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Osakehuoneistot</td>
                      <td className="py-3 text-right font-light">Alkaen 500 € sis. alv 25,5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Kiinteistöt / Etä- ja erikoiskohteet</td>
                      <td className="py-3 text-right font-light">Alkaen 3000 € sis. alv 25,5%*</td>
                    </tr>
                  </tbody>
                </table>
                
                <div className="mt-8 text-sm text-gray-600 font-light">
                  <p>* Tai sopimuksen mukaan</p>
                  <p>** Soveltuvin osin</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <VideoSection 
          videoId="hdXkBWw9wk0"
          title={t.videoTitle}
          subtitle={t.videoSubtitle}
        />

        {/* Consumer Dispute Section */}
        <section className="py-12 bg-[var(--color-primary)] text-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl font-light mb-4">
                {t.disputeTitle}
              </h2>
              <p className="font-light mb-2">
                {t.disputeText}
              </p>
              <p className="font-light">
                {t.disputeLink}{' '}
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