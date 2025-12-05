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
    welcomeTitle: 'Tervetuloa onnistuneeseen asuntokauppaan!',
    formTitle: 'Sovi maksuton arviokäynti!',
    formSubtitle: 'Tiedätkö asuntosi markkina-arvon?',
    formText: 'Kutsu meidät maksuttomalle arviokäynnille – saat alueen asiantuntevimman lausunnon.',
    firstName: 'Etunimi',
    lastName: 'Sukunimi',
    email: 'Sähköposti',
    phone: 'Puhelinnumero',
    message: 'Viesti',
    privacyText: 'Olen lukenut',
    privacyLink: 'Tietosuojaselosteen',
    newsletterText: 'Haluan vastaanottaa Snellman Sotheby\'s uutiskirjeen',
    submitButton: 'Lähetä',
    honorTitle: 'Kunniatehtävä',
    honorText1: 'Snellman | Sotheby\'s International Realty Finland toimii osana maailman suurimpiin kuuluvaa, menestyksekästä kiinteistönvälitysketjua Sotheby\'s International Realty®, joten tarjoamme käyttöösi laajan kontaktiverkoston asiantuntijoineen. Myyntikanavamme kattavat tehokkaan maailmanlaajuisen markkinointiverkoston.',
    honorText2: 'Olemme erikoistuneet arvoasuntoihin. Jokainen toimeksianto saa myyntikohteenamme aseman, joka takaa sille erityisen, tavallista laadukkaamman palvelun.',
    honorText3: 'Tarjoamme käyttöösi laajan asiantuntemuksen niin kotimaan kuin kansainvälisilläkin markkinoilla. Edustamme alan parasta osaamista ja hoidamme sydämellä koko myyntiprosessin alusta loppuun asti. Takaamme, että käytössäsi on kauttamme alan moderneimmat ja tehokkaimmat markkinointikanavat sekä laaja asiakasverkosto. Näin saavutamme kohteellesi korkeimman mahdollisen myyntihinnan.',
    relationshipTitle: 'Arvokas asiakassuhde',
    relationshipText1: 'Toivomme, että yhteistyö kanssamme on aina pitkäaikainen suhde henkilökohtaisella tasolla. Pidämme jokaista asiakastamme ainutlaatuisena ja arvokkaana kaikilta osa-alueilta. Meillä kaikilla on erilaiset tarpeet ja toiveet, keskustelemme ja räätälöimme asiakkaidemme toiveiden ja vaatimusten mukaan. Tehtävämme on tehdä unelmastasi totta.',
    relationshipText2: 'Snellman Sotheby\'s International Realty Finland kuuluu yhdeksi maailman arvostetuimmista kiinteistönvälitysketjuista. Jäsenyys Sotheby\'s International Realty®:ssä merkitsee jäsenyyttä globaalissa verkostossa, jolla on laaja asiantuntemus, elintärkeät kontaktit, poikkeukselliset myyntikanavat sekä pääsy tehokkaimpiin markkinointikanaviin.',
    relationshipText3: 'Olemme erikoistuneet luksus- ja arvoasuntoihin, ja tarjoamme sinulle markkinoiden haluttuimpia koteja. Kokeneet tiimimme jäsenet kunnioittavat aina mahdollisuutta jakaa asiantuntemuksensa kanssasi, ja haluamme olla mukana prosessissa alusta loppuun. Takaamme pääsyn uusimpiin markkinointikanaviin, oikeaan asiakasverkostoon, korkeimpaan mahdolliseen hintaan ja tietysti kokemuksen, jonka muistat mielellään.',
    promiseTitle: 'Palvelulupauksemme',
    promiseText1: 'Haluamme tukea sinua, kun olet tekemässä yhtä elämäsi tärkeimmistä taloudellisista päätöksistä ja varmistaa, että teet oikean valinnan. Takaamme, että saat kokeneiden asiantuntijoidemme mielipiteen ja tuen koko prosessin ajan. Korkein toiveemme on, että kaikki asiakkaamme tuntevat olonsa mukavaksi kanssamme ja että yhteistyö tulevaisuudessa on luonnollinen päätös jokaiselle asiakkaallemme.',
    promiseText2: 'Älä unohda pyytää palvelutarjousta.',
    pricingTitle: 'Palveluhinnasto',
    pricingBroker: 'Välittäjä / Myyntitoimeksiannot',
    pricingApartments: 'Osakehuoneistot',
    pricingProperties: 'Kiinteistöt',
    pricingRemote: 'Etä- ja erikoiskohteet',
    pricingRental: 'Vuokraustoimeksianto',
    pricingMinimum: 'Minimipalkkio',
    pricingInternational: 'Kansainvälinen näkyvyys',
    pricingStartFee: 'Aloitusmaksu',
    pricingPropertiesRemote: 'Kiinteistöt / Etä- ja erikoiskohteet',
    pricingNote1: '* Tai sopimuksen mukaan',
    pricingNote2: '** Soveltuvin osin',
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
    welcomeTitle: 'Välkommen till en framgångsrik bostadsaffär!',
    formTitle: 'Boka en gratis värdering!',
    formSubtitle: 'Känner du till ditt hems marknadsvärde?',
    formText: 'Bjud in oss för en kostnadsfri värdering – få områdets mest expertisutlåtande.',
    firstName: 'Förnamn',
    lastName: 'Efternamn',
    email: 'E-post',
    phone: 'Telefonnummer',
    message: 'Meddelande',
    privacyText: 'Jag har läst',
    privacyLink: 'Integritetspolicyn',
    newsletterText: 'Jag vill ta emot Snellman Sotheby\'s nyhetsbrev',
    submitButton: 'Skicka',
    honorTitle: 'Hedersuppdrag',
    honorText1: 'Snellman | Sotheby\'s International Realty Finland verkar som en del av en av världens största och mest framgångsrika fastighetsmäklarkedjor, Sotheby\'s International Realty®. Vi erbjuder därför tillgång till ett omfattande kontaktnätverk med experter. Våra försäljningskanaler täcker ett effektivt globalt marknadsföringsnätverk.',
    honorText2: 'Vi är specialiserade på värdefulla bostäder. Varje uppdrag får en position hos oss som säljare som garanterar en särskild service av högre kvalitet än vanligt.',
    honorText3: 'Vi erbjuder omfattande expertis på både inhemska och internationella marknader. Vi representerar branschens bästa kompetens och hanterar hela försäljningsprocessen från början till slut med hjärtat. Vi garanterar att du genom oss har tillgång till branschens modernaste och mest effektiva marknadsföringskanaler samt ett brett kundnätverk. På så sätt uppnår vi högsta möjliga försäljningspris för din fastighet.',
    relationshipTitle: 'Värdefull kundrelation',
    relationshipText1: 'Vi hoppas att samarbetet med oss alltid är en långsiktig relation på personlig nivå. Vi betraktar varje kund som unik och värdefull i alla avseenden. Vi har alla olika behov och önskemål, vi diskuterar och skräddarsyr enligt våra kunders önskemål och krav. Vår uppgift är att göra din dröm till verklighet.',
    relationshipText2: 'Snellman Sotheby\'s International Realty Finland hör till en av världens mest ansedda fastighetsmäklarkedjor. Medlemskap i Sotheby\'s International Realty® innebär medlemskap i ett globalt nätverk med bred expertis, viktiga kontakter, exceptionella försäljningskanaler och tillgång till de mest effektiva marknadsföringskanalerna.',
    relationshipText3: 'Vi är specialiserade på lyxbostäder och värdefulla hem, och erbjuder dig marknadens mest eftertraktade bostäder. Våra erfarna teammedlemmar respekterar alltid möjligheten att dela sin expertis med dig, och vi vill vara med i processen från början till slut. Vi garanterar tillgång till de senaste marknadsföringskanalerna, rätt kundnätverk, högsta möjliga pris och naturligtvis en upplevelse som du gärna minns.',
    promiseTitle: 'Vårt servicelöfte',
    promiseText1: 'Vi vill stödja dig när du fattar ett av livets viktigaste ekonomiska beslut och säkerställa att du gör rätt val. Vi garanterar att du får våra erfarna experters åsikt och stöd under hela processen. Vår högsta önskan är att alla våra kunder känner sig bekväma med oss och att framtida samarbete är ett naturligt val för varje kund.',
    promiseText2: 'Glöm inte att begära ett serviceerbjudande.',
    pricingTitle: 'Prislista',
    pricingBroker: 'Mäklare / Försäljningsuppdrag',
    pricingApartments: 'Aktielägenheter',
    pricingProperties: 'Fastigheter',
    pricingRemote: 'Avlägsna och specialobjekt',
    pricingRental: 'Uthyrningsuppdrag',
    pricingMinimum: 'Minimiarvode',
    pricingInternational: 'Internationell synlighet',
    pricingStartFee: 'Startavgift',
    pricingPropertiesRemote: 'Fastigheter / Avlägsna och specialobjekt',
    pricingNote1: '* Eller enligt avtal',
    pricingNote2: '** I tillämpliga fall',
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
    welcomeTitle: 'Welcome to a successful property transaction!',
    formTitle: 'Schedule a free appraisal!',
    formSubtitle: 'Do you know your property\'s market value?',
    formText: 'Invite us for a free appraisal – get the area\'s most expert opinion.',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone number',
    message: 'Message',
    privacyText: 'I have read the',
    privacyLink: 'Privacy Policy',
    newsletterText: 'I want to receive Snellman Sotheby\'s newsletter',
    submitButton: 'Send',
    honorTitle: 'Honorary Mission',
    honorText1: 'Snellman | Sotheby\'s International Realty Finland operates as part of one of the world\'s largest and most successful real estate brokerage chains, Sotheby\'s International Realty®. We therefore offer access to an extensive network of experts. Our sales channels cover an effective global marketing network.',
    honorText2: 'We specialize in valuable properties. Each assignment receives a position with us as a seller that guarantees a special service of higher quality than usual.',
    honorText3: 'We offer extensive expertise in both domestic and international markets. We represent the industry\'s best competence and handle the entire sales process from start to finish with heart. We guarantee that through us you have access to the industry\'s most modern and effective marketing channels and a broad customer network. This way we achieve the highest possible selling price for your property.',
    relationshipTitle: 'Valuable Customer Relationship',
    relationshipText1: 'We hope that cooperation with us is always a long-term relationship on a personal level. We consider each customer unique and valuable in all respects. We all have different needs and wishes, we discuss and tailor according to our customers\' wishes and requirements. Our mission is to make your dream come true.',
    relationshipText2: 'Snellman Sotheby\'s International Realty Finland is one of the world\'s most prestigious real estate brokerage chains. Membership in Sotheby\'s International Realty® means membership in a global network with extensive expertise, vital contacts, exceptional sales channels and access to the most effective marketing channels.',
    relationshipText3: 'We specialize in luxury and valuable homes, and offer you the market\'s most sought-after properties. Our experienced team members always respect the opportunity to share their expertise with you, and we want to be involved in the process from start to finish. We guarantee access to the latest marketing channels, the right customer network, the highest possible price and of course an experience you will gladly remember.',
    promiseTitle: 'Our Service Promise',
    promiseText1: 'We want to support you when making one of life\'s most important financial decisions and ensure that you make the right choice. We guarantee that you will receive the opinion and support of our experienced experts throughout the process. Our highest wish is that all our customers feel comfortable with us and that future cooperation is a natural choice for every customer.',
    promiseText2: 'Don\'t forget to request a service quote.',
    pricingTitle: 'Service Pricing',
    pricingBroker: 'Broker / Sales Assignments',
    pricingApartments: 'Share apartments',
    pricingProperties: 'Properties',
    pricingRemote: 'Remote and special properties',
    pricingRental: 'Rental assignment',
    pricingMinimum: 'Minimum fee',
    pricingInternational: 'International visibility',
    pricingStartFee: 'Starting fee',
    pricingPropertiesRemote: 'Properties / Remote and special properties',
    pricingNote1: '* Or by agreement',
    pricingNote2: '** As applicable',
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
            backgroundImage: 'url("/images/content/snellman-sothebys-merry-christmas-2023-web.jpg")',
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

        {/* Form and Mission Section - 2 columns on desktop like original site */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
                      placeholder={t.firstName}
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                    <input
                      type="text"
                      placeholder={t.lastName}
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder={t.email}
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                    <input
                      type="tel"
                      placeholder={t.phone}
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                  </div>
                  
                  <textarea
                    placeholder={t.message}
                    rows={6}
                    className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light resize-none"
                  />
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacy"
                      required
                      className="mt-1"
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-700 font-light">
                      {t.privacyText}{' '}
                      <a href="/tietosuojaseloste" className="text-[var(--color-primary)] hover:underline">
                        {t.privacyLink}
                      </a>
                    </label>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="newsletter"
                      className="mt-1"
                    />
                    <label htmlFor="newsletter" className="text-sm text-gray-700 font-light">
                      {t.newsletterText}
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-[var(--color-primary)] text-white px-6 py-3 hover:bg-[var(--color-primary-dark)] 
                             transition-colors duration-300 font-light"
                  >
                    {t.submitButton}
                  </button>
                </form>
              </div>

              {/* Mission Section - Kunniatehtävä + Arvokas asiakassuhde */}
              <div className="bg-white p-8 lg:p-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 leading-relaxed">
                  {t.honorTitle}
                </h2>
                <div className="space-y-4 text-gray-700 font-light leading-relaxed text-base mb-8">
                  <p>{t.honorText1}</p>
                  <p>{t.honorText2}</p>
                  <p>{t.honorText3}</p>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-4 leading-relaxed">
                {t.relationshipTitle}
              </h2>
                <div className="space-y-4 text-gray-700 font-light leading-relaxed text-base">
                <p>{t.relationshipText1}</p>
                <p>{t.relationshipText2}</p>
                <p>{t.relationshipText3}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Palvelumme and Palveluhinnasto - 2 columns like old design */}
        <section className="py-0">
          <div className="container mx-auto px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Palvelulupauksemme - Left Column */}
              <div className="bg-white p-8 lg:p-16">
                <h2 className="text-3xl font-light text-gray-900 mb-6 text-right">
                  {t.promiseTitle}
                </h2>
                <div className="space-y-4 text-gray-700 font-light leading-relaxed text-right">
                  <p>{t.promiseText1}</p>
                  <p>{t.promiseText2}</p>
                </div>
              </div>

              {/* Palveluhinnasto - Right Column */}
              <div className="bg-gray-100 p-8 lg:p-16">
                <h2 className="text-3xl font-light text-gray-900 mb-6">
                  {t.pricingTitle}
                </h2>
              
                <div className="">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left pb-2 font-normal text-gray-900">{t.pricingBroker}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr>
                        <td className="py-2 font-light pl-4">{t.pricingApartments}</td>
                        <td className="py-2 text-right font-bold">5 % sis. alv 25,5%*</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-light pl-4">{t.pricingProperties}</td>
                        <td className="py-2 text-right font-bold">6 % sis. alv 25,5%*</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-light pl-4">{t.pricingRemote}</td>
                        <td className="py-2 text-right font-bold">7 % sis. alv 25,5%*</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-light">{t.pricingRental}</td>
                        <td className="py-2 text-right font-bold">2 kk vuokra sis. alv 25,5%*</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-light">{t.pricingMinimum}</td>
                        <td className="py-2 text-right font-bold">5750 € sis. alv 25,5%*</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-light">{t.pricingInternational}</td>
                        <td className="py-2 text-right font-bold">+0,50 % sis. alv 25,5%**</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <table className="w-full mt-6 text-sm">
                    <thead>
                      <tr>
                        <th className="text-left pb-2 font-normal text-gray-900">{t.pricingStartFee}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr>
                        <td className="py-2 font-light pl-4">{t.pricingApartments}</td>
                        <td className="py-2 text-right font-bold">Alkaen 500 € sis. alv 25,5%*</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-light pl-4">{t.pricingPropertiesRemote}</td>
                        <td className="py-2 text-right font-bold">Alkaen 3000 € sis. alv 25,5%*</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="mt-6 text-xs text-gray-600 font-light">
                    <p><strong>{t.pricingNote1}</strong></p>
                    <p><strong>{t.pricingNote2}</strong></p>
                  </div>
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