'use client';

import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { useState, useEffect } from 'react';

// Hero carousel slides
const heroSlides = [
  {
    id: 1,
    image: '/images/content/snellman-sothebys-yritys-01.jpg',
    title: {
      fi: 'Kansainvälinen välittäjäsi paikallisesti',
      sv: 'Din internationella mäklare lokalt',
      en: 'Your international agent locally'
    },
    subtitle: {
      fi: '26 100 välittäjää 1100 välitystoimistossa 84 maassa ja alueella',
      sv: '26 100 mäklare 1100 kontor 84 länder och regioner',
      en: '26,100 agents 1,100 offices 84 countries and territories'
    },
    buttonText: {
      fi: 'AVAAMME UUSIA OVIA »',
      sv: 'VI ÖPPNAR NYA DÖRRAR »',
      en: 'WE OPEN NEW DOORS »'
    },
    buttonLink: '/kohteet'
  },
  {
    id: 2,
    image: '/images/content/snellman-sothebys-yritys.jpg',
    title: {
      fi: 'Tervetuloa onnistuneeseen asuntokauppaan!',
      sv: 'Välkommen till en framgångsrik bostadsaffär!',
      en: 'Welcome to a successful property transaction!'
    },
    subtitle: {
      fi: 'Katso kaikki myynnissä olevat kohteemme.',
      sv: 'Se alla våra objekt till salu.',
      en: 'See all our properties for sale.'
    },
    buttonText: {
      fi: 'LÖYDÄ UNELMIESI KOTI »',
      sv: 'HITTA DITT DRÖMHEM »',
      en: 'FIND YOUR DREAM HOME »'
    },
    buttonLink: '/kohteet'
  },
  {
    id: 3,
    image: '/images/content/snellman-sothebys-nakoalapaikka.jpg',
    title: {
      fi: 'Snellman Sotheby\'s International Realty®',
      sv: 'Snellman Sotheby\'s International Realty®',
      en: 'Snellman Sotheby\'s International Realty®'
    },
    subtitle: {
      fi: 'Edustamme Suomessa yhtä ainutlaatuisinta kiinteistönvälitysketjua maailmassa.',
      sv: 'Vi representerar i Finland en av de mest unika fastighetsmäklarkedjorna i världen.',
      en: 'We represent in Finland one of the most unique real estate brokerage networks in the world.'
    },
    buttonText: {
      fi: 'TUTUSTU TOIMINTAAMME »',
      sv: 'LÄR KÄNNA OSS »',
      en: 'GET TO KNOW US »'
    },
    buttonLink: '/henkilosto'
  },
  {
    id: 4,
    image: '/images/content/snellman-sothebys-kutsu-arviokaynnille.jpg',
    title: {
      fi: 'Myymässä asuntoasi?',
      sv: 'Säljer du din bostad?',
      en: 'Selling your property?'
    },
    subtitle: {
      fi: 'Kutsu meidät maksuttomalle arviokäynnille.',
      sv: 'Bjud in oss för ett kostnadsfritt värderingsbesök.',
      en: 'Invite us for a free valuation visit.'
    },
    buttonText: {
      fi: 'OTA YHTEYTTÄ »',
      sv: 'KONTAKTA OSS »',
      en: 'CONTACT US »'
    },
    buttonLink: '/yhteystiedot'
  }
];

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
    
    openDoorsTitle: 'Avaamme uusia ovia',
  },
  sv: {
    introTitle: 'Snellman Sotheby\'s International Realty®',
    introText: 'Idag med 84 länder, 1100 kontor och 26 100 mäklare är Sotheby\'s International Realty® ett av världens största fastighetsmärken. Vårt globala nätverk öppnar dörren till internationella lyxfastighetsmarknader för kunder runt om i världen.',
    officeTitle: 'Vårt fantastiska kontor betjänar',
    officeHours: 'er vardagar 10:00 – 17:00',
    officeExtra: 'samt övriga tider enligt överenskommelse.',
    
    box1Title: 'Sotheby\'s Auktionshus',
    box1Button: 'LÄS MER »',
    box2Title: 'Sotheby\'s International Realty®',
    box2Button: 'LÄS MER »',
    box3Title: 'Lär känna vår personal',
    box3Button: 'KONTAKTA »',
    
    historyTitle: 'Sotheby\'s® & Sotheby\'s International Realty®',
    historyText: 'Vid sidan av det traditionella Sotheby\'s auktionshuset som grundades 1744, grundades 1976 en fastighetsmäklarkedja vars hörnsten är att erbjuda kvalitetsmedvetna kunder samma starka marknadskunskap och servicenivå på fastighetsmarknaden som inom konst- och antikförmedling, individuellt och diskret.',
    
    aboutTitle: 'Snellman Sotheby\'s International Realty®',
    aboutText1: 'Snellman Sotheby\'s International Realty Finland startade sin verksamhet i Helsingfors hösten 2015. Vi är en av få mäklare specialiserade på värdefulla fastigheter som kan erbjuda kvalitetsmedvetna kunder unika objekt och individuell service både i Finland och runt om i världen. Vi förmedlar unika objekt, med stil.',
    aboutText2: 'Oavsett om du köper eller säljer en bostad, fastighet, fritidsobjekt, gård eller ett helt herrgårdsområde, vill vi hjälpa dig att göra livets affär.',
    aboutText3: 'Vi är hemma både i ditt närområde och på internationella lyxfastighetsmarknader.',
    
    philosophyTitle: 'Vår servicefilosofi',
    philosophyText1: 'Drömmen om det perfekta hemmet är vårt drömarbete, eftersom hemmet är platsen där den uppnåeliga livskvaliteten kristalliseras bäst. Bästa lyxen är hemmet när det har något speciellt jämfört med andra bostäder i området och när det motsvarar invånarnas livsstil och drömmar. Ett exklusivt hem är speciellt både i lösningar, som byggnad och i läge.',
    philosophyText2: 'Som fastighetsmäklare och expert på värdebostäder är vi stolta över att få förena perfekt kompatibla hem och invånare. Varje hem vi förmedlar är lika unikt som varje kund.',
    philosophyText3: 'I Finland har vi koncentrerat oss på att förmedla premium-bostäder och fastigheter i huvudstadsregionen och det omgivande kustområdet. Vårt sortiment inkluderar bland annat högkvalitativa loft- och takvåningar samt värdefulla nybyggnadsobjekt. Dessutom förmedlar vi fritidsobjekt från kustvillor till Lapplands skidboenden.',
    
    openDoorsTitle: 'Vi öppnar nya dörrar',
  },
  en: {
    introTitle: 'Snellman Sotheby\'s International Realty®',
    introText: 'Today with 84 countries, 1,100 offices and 26,100 agents, Sotheby\'s International Realty® is one of the world\'s largest real estate brands. Our global network opens the door to international luxury real estate markets for clients around the world.',
    officeTitle: 'Our beautiful office serves',
    officeHours: 'you on weekdays 10:00 – 17:00',
    officeExtra: 'and at other times by appointment.',
    
    box1Title: 'Sotheby\'s Auction House',
    box1Button: 'READ MORE »',
    box2Title: 'Sotheby\'s International Realty®',
    box2Button: 'READ MORE »',
    box3Title: 'Meet our staff',
    box3Button: 'CONTACT »',
    
    historyTitle: 'Sotheby\'s® & Sotheby\'s International Realty®',
    historyText: 'Alongside the traditional Sotheby\'s auction house founded in 1744, a real estate brokerage chain was founded in 1976 whose cornerstone is to offer quality-conscious customers the same strong market knowledge and service level in the real estate market as in art and antique brokerage, individually and discreetly.',
    
    aboutTitle: 'Snellman Sotheby\'s International Realty®',
    aboutText1: 'Snellman Sotheby\'s International Realty Finland started its operations in Helsinki in the fall of 2015. We are one of the few brokers specializing in valuable properties that can offer quality-conscious customers unique properties and individualized service both in Finland and around the world. We broker unique properties, with style.',
    aboutText2: 'Whether you are buying or selling a home, property, vacation property, farm or an entire manor area, we want to help you make the deal of your life.',
    aboutText3: 'We are at home both in your local area and in international luxury real estate markets.',
    
    philosophyTitle: 'Our Service Philosophy',
    philosophyText1: 'The dream of the perfect home is our dream work, because home is the place where achievable quality of life is best crystallized. The best luxury is home when it has something special compared to other homes in the area and when it matches its residents\' lifestyle and dreams. An exclusive home is special in solutions, as a building and in location.',
    philosophyText2: 'As a real estate broker and expert in valuable homes, we are proud to bring together perfectly compatible homes and residents. Every home we broker is as unique as every customer.',
    philosophyText3: 'In Finland, we have focused on brokering premium apartments and properties in the capital region and the surrounding coastal area. Our selection includes high-quality loft and penthouse apartments as well as valuable new construction properties. In addition, we broker vacation properties from coastal villas to Lapland ski accommodations.',
    
    openDoorsTitle: 'We open new doors',
  },
};

type Locale = 'fi' | 'sv' | 'en';

export default function CompanyPage({ params }: { params: { locale: string } }) {
  const locale = (params.locale || 'fi') as Locale;
  const t = translations[locale] || translations.fi;
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        
        {/* Hero Carousel */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt=""
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center text-white">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
                  {slide.title[locale]}
                </h1>
                <p className="text-lg md:text-xl font-light mb-8 text-white/90">
                  {slide.subtitle[locale]}
                </p>
                <Link
                  href={slide.buttonLink as any}
                  className="inline-block border border-white text-white px-8 py-3 hover:bg-white hover:text-[#001731] transition-all uppercase text-sm tracking-wider"
                >
                  {slide.buttonText[locale]}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all z-20"
          >
            <span className="text-white text-2xl">‹</span>
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all z-20"
          >
            <span className="text-white text-2xl">›</span>
          </button>
          
          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Social Icons */}
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

        {/* Intro Section */}
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

        {/* Office Hours */}
        <section className="py-6 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-gray-600 font-light text-sm">
              <p className="mb-1">{t.officeTitle}</p>
              <p className="mb-1">{t.officeHours}</p>
              <p>{t.officeExtra}</p>
            </div>
          </div>
        </section>

        {/* Contact Info Bar */}
        <section className="py-6 bg-white border-t border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm text-gray-700">
              <a href="tel:+358103156900" className="hover:text-[#002349] transition-colors">
                +358 (0)10 315 6900
              </a>
              <span className="hidden md:inline text-gray-300">|</span>
              <span>Kasarmikatu 34, 00130 Helsinki</span>
              <span className="hidden md:inline text-gray-300">|</span>
              <a href="mailto:info@sothebysrealty.fi" className="hover:text-[#002349] transition-colors">
                info@sothebysrealty.fi
              </a>
            </div>
          </div>
        </section>

        {/* Three Promo Boxes */}
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
                  <Link href="/henkilosto"
                     className="border border-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-white hover:text-[#002349] transition-all">
                    {t.box3Button}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sotheby's History Section */}
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

        {/* About Section - Image Left, Text Right */}
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
                  src="/images/logos/snellman-sothebys-logo-white.png"
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

        {/* Service Philosophy Section - Text Left, Image Right */}
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
                  src="/images/logos/snellman-sothebys-logo-white.png"
                  alt="Snellman Sotheby's"
                  width={180}
                  height={45}
                  className="opacity-80"
                />
              </div>
            </div>
          </div>
        </section>

        {/* "We Open New Doors" Section */}
        <section className="py-16 bg-[#001731] text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-light text-center">
              {t.openDoorsTitle}
            </h2>
          </div>
        </section>

      </main>
    </div>
  );
}
