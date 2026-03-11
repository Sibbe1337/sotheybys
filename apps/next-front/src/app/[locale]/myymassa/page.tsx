    import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { VideoSection } from '@/components/ui/VideoSection';
import { locales, type Locale } from '@/i18n/config';
import type { Metadata } from 'next';
import { InlineContactForm } from '@/components/forms/InlineContactForm';

const meta = {
  fi: {
    title: 'Myy kanssamme | Snellman Sotheby\'s International Realty',
    description: 'Haluatko myydä asuntosi? Kutsu meidät maksuttomalle arviokäynnille. Kansainvälinen verkosto ja paikallinen asiantuntemus.',
  },
  sv: {
    title: 'Sälj med oss | Snellman Sotheby\'s International Realty',
    description: 'Vill du sälja din bostad? Bjud in oss för ett kostnadsfritt värderingsbesök. Internationellt nätverk och lokal expertis.',
  },
  en: {
    title: 'Sell With Us | Snellman Sotheby\'s International Realty',
    description: 'Want to sell your property? Invite us for a free valuation visit. International network and local expertise.',
  },
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = meta[(params.locale as keyof typeof meta)] || meta.fi;
  return { title: t.title, description: t.description };
}

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
    honorText4: '',
    relationshipTitle: 'Arvokas asiakassuhde',
    relationshipText1: 'Toivomme, että yhteistyö kanssamme on aina pitkäaikainen suhde henkilökohtaisella tasolla. Pidämme jokaista asiakastamme ainutlaatuisena ja arvokkaana kaikilta osa-alueilta. Meillä kaikilla on erilaiset tarpeet ja toiveet, keskustelemme ja räätälöimme asiakkaidemme toiveiden ja vaatimusten mukaan. Tehtävämme on tehdä unelmastasi totta.',
    relationshipText2: 'Snellman Sotheby\'s International Realty Finland kuuluu yhdeksi maailman arvostetuimmista kiinteistönvälitysketjuista. Jäsenyys Sotheby\'s International Realty®:ssä merkitsee jäsenyyttä globaalissa verkostossa, jolla on laaja asiantuntemus, elintärkeät kontaktit, poikkeukselliset myyntikanavat sekä pääsy tehokkaimpiin markkinointikanaviin.',
    relationshipText3: 'Olemme erikoistuneet luksus- ja arvoasuntoihin, ja tarjoamme sinulle markkinoiden haluttuimpia koteja. Kokeneet tiimimme jäsenet kunnioittavat aina mahdollisuutta jakaa asiantuntemuksensa kanssasi, ja haluamme olla mukana prosessissa alusta loppuun. Takaamme pääsyn uusimpiin markkinointikanaviin, oikeaan asiakasverkostoon, korkeimpaan mahdolliseen hintaan ja tietysti kokemuksen, jonka muistat mielellään.',
    servicesTitle: 'Palvelumme',
    servicesText1: 'Haluamme olla mukana elämäsi suuressa taloudellisessa päätöksenteossa, sen vaatimalla arvokkuudella. Voit aina olla vakuuttunut siitä, että saat asiantuntivimmat sekä luottamuksellisemmat neuvot kokeneilta välittäjiltämme.',
    servicesText2: 'Haluamme olla osa koko myyntiprosessia, aina maksuttomasta arviointikäynnistä kauppaan saakka. Tinkimätön tavoitteemme on, että yhteistyö on hedelmällistä ja että kaikki asiakkaamme palaavat meille tulevaisuudessakin.',
    servicesText3: 'Pyydä palvelutarjous maksuttomalla arviokäynnillä.',
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
    pricingValue1: '5 % sis. alv 25,5%*',
    pricingValue2: '6 % sis. alv 25,5%*',
    pricingValue3: '7 % sis. alv 25,5%*',
    pricingValue4: '2 kk vuokra sis. alv 25,5%*',
    pricingValue5: '5750 € sis. alv 25,5%*',
    pricingValue6: '+0,50 % sis. alv 25,5%**',
    pricingValue7: 'Alkaen 500 € sis. alv 25,5%*',
    pricingValue8: 'Alkaen 3000 € sis. alv 25,5%*',
    videoTitle: 'Miksi myydä kanssamme?',
    videoSubtitle: 'Katso miten autamme asiakkaitamme onnistuneeseen asuntokauppaan',
    addressStreet: 'Kasarmikatu 34,',
    addressCity: '00130 Helsinki',
    recaptchaText: 'Tämän sivun suojaa reCAPTCHA, mikä tarkoittaa, että Googlen',
    recaptchaPrivacy: 'tietosuojakäytännöt',
    recaptchaAnd: 'ja',
    recaptchaTerms: 'käyttöehdot',
    recaptchaApply: 'ovat voimassa.',
  },
  sv: {
    title: 'Sälj med oss',
    heroText: 'Alla har vi olika behov och preferenser och vi diskuterar och skräddarsyr efter kundens behov och önskan. Vår uppgift är att göra din dröm till verklighet.',
    heroCTA: 'GÖR DITT LIVS BOSTADSAFFÄR',
    welcomeTitle: 'Välkommen till en lyckad bostadsförsäljning!',
    formTitle: 'Kontakta oss för en kostnadsfri värdering!',
    formSubtitle: 'Vet du vad är din fastighet eller lägenhet är värd?',
    formText: 'Kontakta oss för en kostnadsfri värdering – Våra experter hjälper dig att slutföra ditt livs viktigaste affär.',
    firstName: 'Förnamn',
    lastName: 'Efternamn',
    email: 'Email',
    phone: 'Telefonnummer',
    message: 'Meddelande',
    privacyText: 'Jag har bekantat mig med Privacy Policyn',
    privacyLink: 'Tietosuojaseloste',
    newsletterText: 'Jag vill motta Snellman Sotheby\'s nyhetsbrev',
    submitButton: 'Skicka',
    honorTitle: 'Ett värdefullt samarbete',
    honorText1: 'Att samarbeta med oss innebär ett långvarigt förhållande på personlig nivå. Vi betraktar alla våra kunder som unika på sitt eget sätt. Alla har vi olika behov och preferenser och vi diskuterar och skräddarsyr efter kundens behov och önskan. Vår uppgift är att göra din dröm till verklighet.',
    honorText2: 'Ab Snellman LKV Oy Sotheby\'s International Realty Finland verkar inom ramen för en av världens största och mest framgångsrika fastighetsförmedlingskedjor. Medlemskap i Sotheby\'s International Realty® innebär tillträde till ett globalt varumärke och ett enormt nätverk av kontakter, expertis och försäljningskanaler såväl som enastående marknadsföringsmöjligheter.',
    honorText3: 'Vi specialiserar oss på förmedling av de lyxigaste av hem som existerar på marknaden och varje hem och kontext som förknippas med Snellman Sotheby\'s International Realty garanterar något utöver det vanliga.',
    honorText4: 'Vi erbjuder våra kunder expertis gällande marknaden både på nationell och internationell nivå samtidigt som vi levererar kundservice av högsta standard. Vi representerar branschens bästa och sköter hela försäljningsprocessen från början till slut. Vi garanterar att du får till ditt förfogande de senaste och mest effektiva marknadsföringskanalerna, rätt kundnätverk, högsta möjliga försäljningspris samt en oförglömlig upplevelse då du samarbetar med oss.',
    relationshipTitle: 'Vårt tjänstelöfte',
    relationshipText1: 'Vi erbjuder våra kunder expertis gällande marknaden både på nationell och internationell nivå samtidigt som vi levererar kundservice av högsta standard. Vi representerar branschens bästa och sköter hela försäljningsprocessen från början till till slut. Vi garanterar att du får till ditt förfogande de senaste och mest effektiva marknadsföringskanalerna, rätt kundnätverk, högsta möjliga försäljningspris samt en oförglömlig upplevelse då du samarbetar med oss.',
    relationshipText2: 'Vi vill vara med då du gör ett av ditt livs största ekonomiska beslut. Vi garanterar att du får våra erfarna experters åsikt och stöd längs hela processen. Vår önskan är att alla våra kunder trivs med oss och att det blir ett naturligt val att samarbeta med oss även i framtiden. Glöm inte att be ett service erbjudande av oss.',
    relationshipText3: '',
    promiseTitle: 'Vårt tjänstelöfte',
    promiseText1: 'Vi vill vara med då du gör ett av ditt livs största ekonomiska beslut. Vi garanterar att du får våra erfarna experters åsikt och stöd längs hela processen. Vår önskan är att alla våra kunder trivs med oss och att det blir ett naturligt val att samarbeta med oss även i framtiden.',
    promiseText2: 'Glöm inte att be ett service erbjudande av oss.',
    pricingTitle: 'Prislista',
    pricingBroker: 'Förmedlings- / Försäljningsuppdrag',
    pricingApartments: 'Aktielägenheter',
    pricingProperties: 'Fastigheter',
    pricingRemote: 'Fjärr- och specialobjekt',
    pricingRental: 'Uppdrag för hyreslägenhet',
    pricingMinimum: 'Minimiarvode',
    pricingInternational: 'Internationell synlighet',
    pricingStartFee: 'Startavgift',
    pricingPropertiesRemote: 'Fastigheter / Fjärr- och specialobjekt',
    pricingNote1: '* Eller enligt överenskommelse',
    pricingNote2: '** När tillämpligt',
    pricingValue1: '5 % inkl. moms 25,5%*',
    pricingValue2: '6 % inkl. moms 25,5%*',
    pricingValue3: '7 % inkl. moms 25,5%*',
    pricingValue4: '2 månaders hyra inkl. moms 25,5%*',
    pricingValue5: '5750 € inkl. moms 25,5%*',
    pricingValue6: '+0,50 % inkl. moms 25,5%**',
    pricingValue7: 'Från 500 € inkl. moms 25,5%*',
    pricingValue8: 'Från 3000 € inkl. moms 25,5%*',
    videoTitle: 'Varför sälja med oss?',
    videoSubtitle: 'Se hur vi hjälper våra kunder till en framgångsrik bostadsaffär',
    addressStreet: 'Kaserngatan 34,',
    addressCity: '00130 Helsingfors',
    servicesTitle: 'Vårt tjänstelöfte',
    servicesText1: 'Vi vill vara med då du gör ett av ditt livs största ekonomiska beslut. Vi garanterar att du får våra erfarna experters åsikt och stöd längs hela processen. Vår önskan är att alla våra kunder trivs med oss och att det blir ett naturligt val att samarbeta med oss även i framtiden.',
    servicesText2: 'Glöm inte att be ett service erbjudande av oss.',
    recaptchaText: 'Denna sida skyddas av reCAPTCHA, vilket innebär att Googles',
    recaptchaPrivacy: 'sekretesspolicy',
    recaptchaAnd: 'och',
    recaptchaTerms: 'användarvillkor',
    recaptchaApply: 'gäller.',
  },
  en: {
    title: 'Sell with us',
    heroText: 'We all have different needs and preferences, we discuss and customize according to our customers\' wishes and requirements. Our mission is to make your dream come true.',
    heroCTA: 'MAKE THE SALE OF YOUR LIFE',
    welcomeTitle: 'Dont just get it on the market. Get it the attention it deserves.',
    formTitle: 'Contact us for a complimentary appraisal!',
    formSubtitle: 'Are you considering buying or selling? Are you looking for properties to invest in?',
    formText: 'Let us know how we can help and we will get in touch.',
    firstName: 'First name',
    lastName: 'Surname',
    email: 'Email',
    phone: 'Phone number',
    message: 'Message',
    privacyText: 'I have read the',
    privacyLink: 'Tietosuojaseloste',
    newsletterText: 'I want to receive the Snellman Sotheby\'s Newsletter',
    submitButton: 'Send',
    honorTitle: 'A valuable relationship',
    honorText1: 'Our wish is that cooperation with us always equals a long-term relationship on a personal level. We regard every single one of our customers as unique and valuable, all aspects considered. We all have different needs and preferences, and we discuss and customize according to our customers\' wishes and requirements. Our mission is to make your dream come true.',
    honorText2: 'Snellman Sotheby\'s International Realty Finland is part of one of the most prestigious real estate chains in the world. Membership in Sotheby\'s International Realty® equals membership in a global network with excessive expertise, vital contacts, extraordinary sales channels as well as access to the most effective marketing channels available.',
    honorText3: 'We specialize in luxury and high-end real estate and we provide you the most desirable of homes that the market has to offer. Our experienced team members are always honored to share their expertise with you and we wish to be part of the process from beginning to end. We guarantee you access to the latest marketing channels, the correct customer network, the highest possible price and of course an experience you will fondly remember.',
    honorText4: '',
    relationshipTitle: 'Our Servicepromise',
    relationshipText1: 'We want to support you when you are about to make one of the most important financial decisions of your life and make sure you take the right choice. We guarantee that you get our experienced experts opinion and support throughout the whole process. Our highest wish is that all our customers feel comfortable with us and that cooperation in the future will be a natural decision for every one of our customers.',
    relationshipText2: 'Please do not forget to ask for a service offer.',
    relationshipText3: '',
    promiseTitle: 'Our Servicepromise',
    promiseText1: 'We want to support you when you are about to make one of the most important financial decisions of your life and make sure you take the right choice. We guarantee that you get our experienced experts opinion and support throughout the whole process. Our highest wish is that all our customers feel comfortable with us and that cooperation in the future will be a natural decision for every one of our customers.',
    promiseText2: 'Please do not forget to ask for a service offer.',
    pricingTitle: 'Price list',
    pricingBroker: 'Broker / Sales assignments',
    pricingApartments: 'Apartments',
    pricingProperties: 'Properties',
    pricingRemote: 'Long-distance and special listings',
    pricingRental: 'Assignment for rentals',
    pricingMinimum: 'Minimum fee',
    pricingInternational: 'International visibility',
    pricingStartFee: 'Start-up fee',
    pricingPropertiesRemote: 'Properties / Long-distance and special listings',
    pricingNote1: '* According to agreement',
    pricingNote2: '** When applicable',
    pricingValue1: '5 % incl. VAT 25.5%*',
    pricingValue2: '6 % incl. VAT 25.5%*',
    pricingValue3: '7 % incl. VAT 25.5%*',
    pricingValue4: '2 months rent incl. VAT 25.5%*',
    pricingValue5: '5750 € incl. VAT 25.5%*',
    pricingValue6: '+0.50 % incl. VAT 25.5%**',
    pricingValue7: 'From 500 € incl. VAT 25.5%*',
    pricingValue8: 'From 3000 € incl. VAT 25.5%*',
    videoTitle: 'Why sell with us?',
    videoSubtitle: 'See how we help our clients achieve successful property transactions',
    addressStreet: 'Kasarmikatu 34,',
    addressCity: '00130 Helsinki',
    servicesTitle: 'Our Servicepromise',
    servicesText1: 'We want to support you when you are about to make one of the most important financial decisions of your life and make sure you take the right choice. We guarantee that you get our experienced experts opinion and support throughout the whole process.',
    servicesText2: 'Our highest wish is that all our customers feel comfortable with us and that cooperation in the future will be a natural decision for every one of our customers. Please do not forget to ask for a service offer.',
    recaptchaText: 'This page is protected by reCAPTCHA, which means that Google\'s',
    recaptchaPrivacy: 'privacy policy',
    recaptchaAnd: 'and',
    recaptchaTerms: 'terms of service',
    recaptchaApply: 'apply.',
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
            backgroundImage: 'url("/images/content/myymassa-banner.jpg")',
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
              locale={params.locale}
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
                  {t.addressStreet}<br className="md:hidden" />
                  {t.addressCity}
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a href="mailto:info@sothebysrealty.fi" className="hover:text-[var(--color-primary)] transition-colors font-light">
                  info@sothebysrealty.fi
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Form and Mission Section - 2x2 grid on desktop like original site */}
        <section className="py-0">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Box 1: Valuation Form - Gray background (#CCC) */}
              <div style={{ backgroundColor: '#CCCCCC' }} className="p-8 lg:p-16">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
                  {t.formTitle}
                </h2>
                <p className="text-gray-700 font-light mb-2">
                  {t.formSubtitle}
                </p>
                <p className="text-gray-700 font-light mb-8">
                  {t.formText}
                </p>
                
                <InlineContactForm
                  language={params.locale as 'fi' | 'sv' | 'en'}
                  translations={{
                    firstName: t.firstName,
                    lastName: t.lastName,
                    email: t.email,
                    phone: t.phone,
                    message: t.message,
                    privacyText: t.privacyText,
                    privacyLink: t.privacyLink,
                    newsletterText: t.newsletterText,
                    submitButton: t.submitButton,
                  }}
                />
              </div>

              {/* Box 2: Kunniatehtävä - White background (#FFF) */}
              <div style={{ backgroundColor: '#FFFFFF' }} className="p-8 lg:p-16">
                <h2 className="heading-secondary mb-8">
                  {t.honorTitle}
                </h2>
                <div className="space-y-4 text-gray-700 font-light leading-relaxed text-sm">
                  <p>{t.honorText1}</p>
                  <p>{t.honorText2}</p>
                  <p>{t.honorText3}</p>
                  {t.honorText4 && <p>{t.honorText4}</p>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Palvelumme Section - 2 columns matching original design */}
        <section id="palvelut" className="py-0">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column - Palvelumme */}
              <div className="bg-white p-8 lg:py-16 lg:px-12 xl:px-20">
                <h2 className="heading-secondary mb-8 text-right">
                  {t.servicesTitle}
                </h2>
                <div className="text-sm text-gray-600 leading-relaxed text-right space-y-4">
                  <p>{t.servicesText1}</p>
                  <p>{t.servicesText2}</p>
                </div>
              </div>

              {/* Right Column - Palveluhinnasto */}
              <div className="bg-[#CCCCCC] p-8 lg:py-16 lg:px-12 xl:px-20">
                <h2 className="heading-secondary mb-8">
                  {t.pricingTitle}
                </h2>
              
                <div className="text-sm">
                  {/* Välittäjä / Myyntitoimeksiannot */}
                  <div className="mb-6">
                    <p className="text-gray-900 mb-3">{t.pricingBroker}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-700 pl-6">{t.pricingApartments}</span>
                        <span className="text-gray-900 font-semibold whitespace-nowrap">{t.pricingValue1}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-700 pl-6">{t.pricingProperties}</span>
                        <span className="text-gray-900 font-semibold whitespace-nowrap">{t.pricingValue2}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-700 pl-6">{t.pricingRemote}</span>
                        <span className="text-gray-900 font-semibold whitespace-nowrap">{t.pricingValue3}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-700 pl-6">{t.pricingRental}</span>
                        <span className="text-gray-900 font-semibold whitespace-nowrap">{t.pricingValue4}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-700 pl-6">{t.pricingMinimum}</span>
                        <span className="text-gray-900 font-semibold whitespace-nowrap">{t.pricingValue5}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-700 pl-6">{t.pricingInternational}</span>
                        <span className="text-gray-900 font-semibold whitespace-nowrap">{t.pricingValue6}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Aloitusmaksu */}
                  <div className="mb-6">
                    <p className="text-gray-900 mb-3">{t.pricingStartFee}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-700 pl-6">{t.pricingApartments}</span>
                        <span className="text-gray-900 font-semibold whitespace-nowrap">{t.pricingValue7}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-700 pl-6">{t.pricingPropertiesRemote}</span>
                        <span className="text-gray-900 font-semibold whitespace-nowrap">{t.pricingValue8}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes */}
                  <div className="text-xs text-gray-600 mt-8">
                    <p>{t.pricingNote1}</p>
                    <p>{t.pricingNote2}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}