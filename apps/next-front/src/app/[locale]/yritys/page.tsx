import Image from 'next/image';
import { Link } from '@/lib/navigation';
import HeroCarousel from '@/components/HeroCarousel';
import { locales, type Locale } from '@/i18n/config';

// ✅ LINUS FIX: Static generation for all locales
export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 3600; // Revalidate every hour

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

// Translations
const translations = {
  fi: {
    introTitle: 'Snellman Sotheby\'s International Realty®',
    introText: 'Tänä päivänä 84 maassa, 1100 välitystoimiston ja 26 100 välittäjän vahvuudella palveleva Sotheby\'s International Realty® kuuluu maailman suurimpiin kiinteistöalan brändeihin. Globaali verkostomme avaa asiakkaille eri puolilla maailmaa oven kansainvälisille arvokiinteistömarkkinoille.',
    officeTitle: 'Upea toimistomme palvelee',
    officeHours: 'teitä arkisin 10:00 – 17:00',
    officeExtra: 'sekä muina aikoina sopimuksen mukaan.',
    box1Title: 'Sotheby\'s Huutokauppatalo',
    box1Button: 'LUE LISÄÄ »',
    box2Title: 'Sotheby\'s International Realty®',
    box2Button: 'LUE LISÄÄ »',
    box3Title: 'Tutustu henkilökuntaamme',
    box3Button: 'OTA YHTEYTTÄ »',
    historyTitle: 'Sotheby\'s® & Sotheby\'s International Realty®',
    historyText: 'Vuonna 1744 perustetun, perinteikkään Sotheby\'s huutokauppakamarin rinnalle perustettiin vuonna 1976 kiinteistönvälitysketju, jonka toiminnan kulmakivenä on tarjota laatutietoisille asiakkaille kiinteistömarkkinoilla yhtä vahvaa markkinaosaamista ja palvelutasoa kuin taiteen ja antiikin välityksessä, yksilöllisesti ja hienovaraisesti.',
    aboutTitle: 'Snellman Sotheby\'s International Realty®',
    aboutText1: 'Snellman Sotheby\'s International Realty Finland aloitti toimintansa Helsingissä syksyllä 2015. Olemme yksi harvoista arvokiinteistöihin erikoistuneista välittäjistä, joka pystyy tarjoamaan laatutietoisille asiakkaille ainutlaatuisia kohteita ja yksilöityä palvelua niin Suomessa kuin ympäri maailmaa. Välitämme ainutlaatuisia kohteita, tyylillä.',
    aboutText2: 'Oletpa ostamassa tai myymässä asuntoa, kiinteistöä, vapaa-ajan kohdetta, maatilaa tai kokonaista kartanoaluetta, haluamme auttaa sinua tekemään elämäsi kaupat.',
    aboutText3: 'Olemme kotonamme niin kotikulmillasi kuin kansainvälisillä arvokiinteistömarkkinoilla.',
    philosophyTitle: 'Palvelufilosofiamme',
    philosophyText1: 'Unelma täydellisestä kodista on unelmiemme työtä, sillä koti on paikka, jossa saavutettavissa oleva elämänlaatu kiteytyy parhaiten. Parasta luksusta koti on silloin, kun siinä on jotakin erityistä verrattuna alueen muihin asuntoihin sekä silloin, kun se vastaa asukkaidensa elämäntyyliä ja unelmia. Eksklusiivinen koti on erityinen niin ratkaisuiltaan, rakennuksena kuin sijainniltaan.',
    philosophyText2: 'Kiinteistönvälittäjänä ja arvoasuntojen asiantuntijana olemme ylpeitä saadessamme yhdistää toisiinsa täydellisesti yhteensopivat kodit sekä asukkaat. Jokainen välittämämme koti on yhtä ainutlaatuinen kuin jokainen asiakkaamme.',
    philosophyText3: 'Suomessa olemme keskittyneet välittämään pääkaupunkiseudun ja sitä ympäröivän rannikkoalueen premium-asuntoja ja -kiinteistöjä. Valikoimaamme kuuluu muun muassa laadukkaita loft- ja penthouse-asuntoja sekä arvokkaita uudisrakennuskohteita. Lisäksi välitämme vapaa-ajankohteita rannikon huviloista Lapin hiihtomajoihin.',
    philosophyText4: 'Sotheby\'s International Realtyn osana meillä on osaamista sekä kotimaisista että kansainvälisistä kiinteistömarkkinoista. Halusitpa ostaa tai myydä asuntosi, huvilasi, vapaa-ajan asuntosi tai kartanosi, haluamme olla osa prosessia ja auttaa sinua tekemään elämäsi kaupat. Toivomme rakentavamme elinikäisen suhteen jokaisen asiakkaamme kanssa.',
    openDoorsTitle: 'Avaamme uusia ovia',
    address: 'Kasarmikatu 34, 00130 Helsinki',
  },
  sv: {
    introTitle: 'Snellman Sotheby\'s International Realty®',
    introText: 'I dagens läge har Sotheby\'s International Realty® verksamhet i 84 länder, med 1100 mäklarbyråer och 26 100 mäklare runt om i världen och sitter på ett av världens starkaste varumärken gällande fastigheter. Företaget följer ett franchise koncept som möjliggör tillträde på den globala marknaden för värdefastigheter runt om i hela världen.',
    officeTitle: 'Vårt högklassiga kontor',
    officeHours: 'betjänar Er på vardagar 10:00 – 17:00',
    officeExtra: 'på helgerna är vi öppna efter överenskommelse.',
    box1Title: 'Sotheby\'s ® Auktionshus',
    box1Button: 'Läs mera',
    box2Title: 'Sotheby\'s International Realty ®',
    box2Button: 'Läs mer',
    box3Title: 'Lär dig känna vår personal',
    box3Button: 'Kontakta oss',
    historyTitle: 'Sotheby\'s och Sotheby´s International Realty®',
    historyText: 'Sotheby\'s International Realty® har sitt ursprung i den engelska auktionsbyrån Sotheby\'s, grundad år 1744, världskänd för förmedling av enastående konstverk och antikviteter från alla håll i världen. Sotheby\'s är i dagens läge den näst äldsta verksamma auktionsbyrån i hela världen. Vid sidan om auktionsbyrån grundades år 1976 en fastighetsförmedlingskedja, där visionen låg i att erbjuda kvalitetsmedvetna kunder samma högklassiga kundservice och marknadskunskap som auktionsbyrån erbjuder, med fokus på fastigheter. Vi förmedlar de unikaste av objekt marknaden har att erbjuda och vi gör det med klass.',
    aboutTitle: 'Snellman Sotheby\'s International Realty®',
    aboutText1: 'Den dynamiska och trendiga huvudstaden Helsingfors, beläget vid kusten av Finska viken har för tillfället ett av Nordens största tillväxtpotential. Storhelsingfors hör likaså till en av de snabbast växande regioner i hela Europa. Vår huvudstad är mest känd för sin högteknologiska anda, trendiga kommerser och serveringar samt designkvarter blandat med historisk charm.',
    aboutText2: 'Förutom huvudstadsregionen består vårt land till stora delar av fantastiska naturområden som sträcker sig från skärgården i södra Finland till de otroliga fjällen i Lappland och marknaden är mer redo än någonsin för exponering till resten av världen via ett globalt sett starkt och betydelsefullt varumärke.',
    aboutText3: 'I och med att Snellman Sotheby\'s International Realty Finland är en del av världens största och mest framgångsrika fastighetsförmedlingskedjor, kan vi erbjuda ett marknadsperspektiv och möjligheter ingen annan kan nå upp till. Drömmar blir verklighet då våra unika säljobjekt i Finland samt runt om i hela världen kommer till ert förfogande.',
    philosophyTitle: 'Vår Servicefilosofi',
    philosophyText1: 'Att leverera drömmarnas hem åt våra kunder är vårt jobb men även vår största passion. Hemmet är den plats som reflekterar önskad livskvalitet allra bäst och vi strävar efter att koppla ihop våra kunders hem med deras drömmar och livsstil. Lyxiga hem förmedlar alltid något utöver det vanliga. Ett hem av denna standard är unikt ända från dess planläggning till dess estetiska innehåll och till dess geografiska läge.',
    philosophyText2: 'Som experter inom fastighetsförmedling är vi extremt stolta över att få koppla ihop rätt kund med rätt hem. Vi är av den åsikt att varje fastighet vi förmedlar är lika unik och normbrytande som varje kund vi har äran att få samarbeta med.',
    philosophyText3: 'I Finland koncentrerar vi oss än så länge på att förmedla premium fastigheter i huvudstadsregionen – Till våra säljobjekt hör allting från lyxiga takvåningar till värdefulla nybyggen. Förutom fastigheter i centrum förmedlar vi bland annat villor och fritidshus i Södra Finland samt stugor uppe i Lappland.',
    philosophyText4: 'Tack vare vår bakgrund som del av Sotheby\'s International Realty, besitter vi kunskap gällande både den inhemska marknaden likväl som den internationella marknaden för fastigheter. Oberoende önskar du köpa eller sälja din lägenhet, din villa, ditt fritidshus eller din herrgård, vill vi vara en del av processen och hjälpa dig verkställa ditt livs affär. Vi hoppas bygga en livslång relation med varenda kund vi arbetar med.',
    openDoorsTitle: 'Vi öppnar nya dörrar',
    address: 'Kaserngatan 34, 00130 Helsingfors',
  },
  en: {
    introTitle: 'Snellman Sotheby\'s International Realty®',
    introText: 'Today, Sotheby\'s International Realty operates in more than 84 countries, has 1100 offices and 26 100 brokers around the world and holds one of the strongest brands when it comes to real estate in the world. The company is following a franchise concept, making it possible to connect the real estate market on a global level.',
    officeTitle: 'Our wonderful office is open',
    officeHours: 'on weekdays 10:00 – 17:00',
    officeExtra: 'as well as other times by appointment.',
    box1Title: 'Sotheby\'s® Auction house',
    box1Button: 'Read more',
    box2Title: 'Sotheby\'s International Realty®',
    box2Button: 'Read more',
    box3Title: 'Get to know our personnel',
    box3Button: 'Contact us',
    historyTitle: 'Sotheby\'s and Sotheby\'s International Realty®',
    historyText: 'Sotheby\'s International Realty® has its origins in the English auction house Sotheby\'s, established back in 1744. Sotheby\'s is known for auctioning extraordinary artwork and valuable antiques with various origins. Today Sotheby\'s is the second oldest, still active, auction house in the whole world. Years later, a vision of conveying real estate with the same qualitative customer focus and market knowledge as the auction house offers, but with focus on extraordinary properties instead was born, and in 1977 Sotheby\'s International Realty was founded.',
    aboutTitle: 'Snellman Sotheby\'s International Realty®',
    aboutText1: 'Ab Snellman LKV Oy Sotheby\'s International Realty Finland opened their doors to the Finnish market in the fall 2015. We are one of few who specialize in sales of luxury real estate and we will make sure to provide you with the absolute best the market has to offer.',
    aboutText2: 'Why Finland? Helsinki – Finland\'s dynamic and trending capital, located by the Gulf of Finland, currently has one of the highest potential for expansion, not only in the Nordics but in whole of Europe. Prognosis also estimates that Helsinki will grow as an area tremendously during the upcoming decade.',
    aboutText3: 'Our capital is known for its high-tech atmosphere, trending commerce and fine-dine reputation along with its beautiful seaside and historically charming design blocks. Apart from the capital area, our country offers astonishing landscapes, from the unique archipelago in Southern Finland all the way up to the enchanting, arctic Lapland in the North. Finland is more ready than ever to be exposed to the rest of the world through a globally strong and meaningful brand.',
    philosophyTitle: 'Our service philosophy',
    philosophyText1: 'Finding the homes of our customers dreams is not only our job but also our greatest passion. Home is the place where you can reflect over your lifestyle and communicate wished quality of life in the best of ways. Luxurious homes like the ones we provide are unique from its planning stage to its esthetics and geographic location, and everyone has different views of what their dream home looks like. We know we have done a great work when we have connected the right people to the right home.',
    philosophyText2: 'In Finland we focus on premium properties in the capital area – To our sales portfolio we have a wide range of alternatives, from luxurious penthouse apartments to new development projects. Apart from properties in the center we convey private villas and weekend houses in Southern Finland as well as luxurious cottages in Northern Lapland.',
    philosophyText3: 'Regardless if your wish is to buy or sell your apartment, villa, island or yard, we want to be part of the process and help you make the best deal of your life. We hope to achieve a relationship that will last a lifetime with all our customers we have to honor to work with.',
    philosophyText4: '',
    openDoorsTitle: 'We open new doors.',
    address: 'Kasarmikatu 34, 00130 Helsinki',
  },
};

// Hero slides data
const getHeroSlides = (locale: string) => [
  {
    id: 1,
    image: '/images/content/snellman-sothebys-yritys-01.jpg',
    title: locale === 'fi' ? 'Kansainvälinen välittäjäsi paikallisesti' : locale === 'sv' ? 'Din internationella mäklare lokalt' : 'Your international agent locally',
    subtitle: locale === 'fi' ? '26 100 välittäjää 1100 välitystoimistossa 84 maassa ja alueella' : locale === 'sv' ? '26 100 mäklare 1100 kontor 84 länder och regioner' : '26,100 agents 1,100 offices 84 countries and territories',
    buttonText: locale === 'fi' ? 'AVAAMME UUSIA OVIA »' : locale === 'sv' ? 'VI ÖPPNAR NYA DÖRRAR »' : 'WE OPEN NEW DOORS »',
    buttonLink: '/kohteet'
  },
  {
    id: 2,
    image: '/images/content/snellman-sothebys-yritys.jpg',
    title: locale === 'fi' ? 'Tervetuloa onnistuneeseen asuntokauppaan!' : locale === 'sv' ? 'Välkommen till en extraordinär bostadsaffär!' : 'Welcome to successful property transactions!',
    subtitle: locale === 'fi' ? 'Katso kaikki myynnissä olevat kohteemme.' : locale === 'sv' ? 'Se alla våra objekt till salu.' : 'See all our properties for sale.',
    buttonText: locale === 'fi' ? 'LÖYDÄ UNELMIESI KOTI »' : locale === 'sv' ? 'HITTA DITT DRÖMHEM »' : 'FIND YOUR DREAM HOME »',
    buttonLink: '/kohteet'
  },
  {
    id: 3,
    image: '/images/content/snellman-sothebys-nakoalapaikka.jpg',
    title: 'Snellman Sotheby\'s International Realty®',
    subtitle: locale === 'fi' ? 'Edustamme Suomessa yhtä ainutlaatuisinta kiinteistönvälitysketjua maailmassa.' : locale === 'sv' ? 'Vi representerar i Finland en av de mest unika fastighetsmäklarkedjorna i världen.' : 'We represent in Finland one of the most unique real estate brokerage networks in the world.',
    buttonText: locale === 'fi' ? 'TUTUSTU TOIMINTAAMME »' : locale === 'sv' ? 'LÄR KÄNNA OSS »' : 'GET TO KNOW US »',
    buttonLink: '/henkilosto'
  },
  {
    id: 4,
    image: '/images/content/snellman-sothebys-kutsu-arviokaynnille.jpg',
    title: locale === 'fi' ? 'Myymässä asuntoasi?' : locale === 'sv' ? 'Säljer du din bostad?' : 'Selling your property?',
    subtitle: locale === 'fi' ? 'Kutsu meidät maksuttomalle arviokäynnille.' : locale === 'sv' ? 'Bjud in oss för ett kostnadsfritt värderingsbesök.' : 'Invite us for a free valuation visit.',
    buttonText: locale === 'fi' ? 'OTA YHTEYTTÄ »' : locale === 'sv' ? 'KONTAKTA OSS »' : 'CONTACT US »',
    buttonLink: '/yhteystiedot'
  }
];

type LocaleType = 'fi' | 'sv' | 'en';

// ✅ SERVER COMPONENT - pre-rendered at build time
export default function CompanyPage({ params }: { params: { locale: string } }) {
  const locale = (params.locale || 'fi') as LocaleType;
  const t = translations[locale] || translations.fi;
  const heroSlides = getHeroSlides(locale);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        
        {/* Hero Carousel - Client Component */}
        <HeroCarousel slides={heroSlides} />

        {/* Social Icons - static */}
        <section className="py-8 bg-white">
          <div className="flex justify-center gap-4">
            <a href="https://www.facebook.com/snellmansothebysrealty" target="_blank" rel="noopener noreferrer"
               className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#002349] hover:text-[#002349] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/snellman-sotheby-s-international-realty" target="_blank" rel="noopener noreferrer"
               className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#002349] hover:text-[#002349] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="mailto:info@sothebysrealty.fi"
               className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#002349] hover:text-[#002349] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </section>

        {/* Intro Section - static */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                {t.introTitle}
              </h2>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                {t.introText}
              </p>
            </div>
          </div>
        </section>

        {/* Office Hours - static */}
        <section className="py-6 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-gray-600 font-light text-sm">
              <p className="mb-1">{t.officeTitle}</p>
              <p className="mb-1">{t.officeHours}</p>
              <p>{t.officeExtra}</p>
            </div>
          </div>
        </section>

        {/* Contact Info Bar - static */}
        <section className="py-6 bg-white border-t border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm text-gray-700">
              <a href="tel:+358103156900" className="hover:text-[#002349] transition-colors">
                +358 (0)10 315 6900
              </a>
              <span className="hidden md:inline text-gray-300">|</span>
              <span>{t.address}</span>
              <span className="hidden md:inline text-gray-300">|</span>
              <a href="mailto:info@sothebysrealty.fi" className="hover:text-[#002349] transition-colors">
                info@sothebysrealty.fi
              </a>
            </div>
          </div>
        </section>

        {/* Three Promo Boxes - static */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Box 1 - Auction House */}
              <div className="relative h-[250px] group overflow-hidden">
                <Image
                  src="/images/content/snellman-sothebys-auction-house.jpg"
                  alt={t.box1Title}
                  fill
                  className="object-cover grayscale group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-6">
                  <h3 className="text-xl font-light mb-4 text-center">{t.box1Title}</h3>
                  <a href="https://www.sothebys.com" target="_blank" rel="noopener noreferrer"
                     className="border border-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-white hover:text-[#002349] transition-all">
                    {t.box1Button}
                  </a>
                </div>
              </div>
              
              {/* Box 2 - SIR */}
              <div className="relative h-[250px] group overflow-hidden">
                <Image
                  src="/images/content/snellman-sothebys-sothebys-international-realty.jpg"
                  alt={t.box2Title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#002349]/70 flex flex-col items-center justify-center text-white p-6">
                  <h3 className="text-xl font-light mb-4 text-center">{t.box2Title}</h3>
                  <a href="https://www.sothebysrealty.com" target="_blank" rel="noopener noreferrer"
                     className="border border-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-white hover:text-[#002349] transition-all">
                    {t.box2Button}
                  </a>
                </div>
              </div>
              
              {/* Box 3 - Staff */}
              <div className="relative h-[250px] group overflow-hidden">
                <Image
                  src="/images/content/snellman-sothebys-valittajat-2025-11-dark.png"
                  alt={t.box3Title}
                  fill
                  className="object-cover grayscale group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-6">
                  <h3 className="text-xl font-light mb-4 text-center">{t.box3Title}</h3>
                  <Link href="/henkilosto" prefetch={true}
                     className="border border-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-white hover:text-[#002349] transition-all">
                    {t.box3Button}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sotheby's History Section - static */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-light text-gray-900 mb-6">
                {t.historyTitle}
              </h2>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                {t.historyText}
              </p>
            </div>
          </div>
        </section>

        {/* About Section - Image Left, Text Right - static */}
        <section className="bg-[#001731] text-white">
          <div className="flex flex-col lg:flex-row">
            {/* Left - Image */}
            <div className="lg:w-1/2 relative h-[300px] lg:h-auto lg:min-h-[400px]">
              <Image
                src="/images/content/snellman-sothebys-yritys.jpg"
                alt="Office"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <Image
                  src="/images/logos/logo-white.png"
                  alt="Snellman Sotheby's"
                  width={200}
                  height={50}
                  className="opacity-80"
                />
              </div>
            </div>
            
            {/* Right - Text */}
            <div className="lg:w-1/2 py-12 px-8 lg:px-16">
              <h3 className="text-2xl font-light mb-6">
                {t.aboutTitle}
              </h3>
              <div className="space-y-4 text-sm font-light leading-relaxed text-white/90">
                <p>{t.aboutText1}</p>
                <p>{t.aboutText2}</p>
                <p>{t.aboutText3}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Philosophy Section - Text Left, Image Right - static */}
        <section className="bg-white">
          <div className="flex flex-col lg:flex-row">
            {/* Left - Text */}
            <div className="lg:w-1/2 py-12 px-8 lg:px-16 bg-gray-50">
              <h3 className="text-2xl font-light text-gray-900 mb-6">
                {t.philosophyTitle}
              </h3>
              <div className="space-y-4 text-sm font-light leading-relaxed text-gray-600">
                <p>{t.philosophyText1}</p>
                <p>{t.philosophyText2}</p>
                <p>{t.philosophyText3}</p>
                {t.philosophyText4 && <p>{t.philosophyText4}</p>}
              </div>
            </div>
            
            {/* Right - Image */}
            <div className="lg:w-1/2 relative h-[300px] lg:h-auto lg:min-h-[400px]">
              <Image
                src="/images/content/snellman-sothebys-yritys-01.jpg"
                alt="Service"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 flex items-end justify-end p-8">
                <Image
                  src="/images/logos/logo-white.png"
                  alt="Snellman Sotheby's"
                  width={180}
                  height={45}
                  className="opacity-80"
                />
              </div>
            </div>
          </div>
        </section>

        {/* "We Open New Doors" Section - with image background like original */}
        <section className="relative py-20 text-white">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/content/snellman-sothebys-yritys.jpg"
              alt=""
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#001731]/80"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 flex items-center">
            {/* Logo on left */}
            <div className="hidden lg:block flex-shrink-0 mr-8">
              <Image
                src="/images/logos/logo-white.png"
                alt="Snellman Sotheby's"
                width={200}
                height={50}
                className="opacity-80"
              />
            </div>
            
            {/* Title centered */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-light text-center lg:text-left">
                {t.openDoorsTitle}
              </h2>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
