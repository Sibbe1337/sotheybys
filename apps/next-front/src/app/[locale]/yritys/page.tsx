import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { locales, type Locale } from '@/i18n/config';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

// 🔥 LINUS FIX: Complete translations for Company page
const translations = {
  fi: {
    heroTitle: 'Snellman Sotheby\'s International Realty',
    heroSubtitle: 'Avaamme uusia ovia vuodesta 2015',
    heroStats: '26 100 välittäjää • 1 000 välitystoimistossa • 84 maassa ja alueella',
    aboutTitle: 'Kansainvälinen osaaminen paikallisella kokemuksella',
    aboutText1: 'Snellman Sotheby\'s International Realty on osa maailman johtavaa luksuskiinteistöjen välitysketjua. Yhdistämme Sotheby\'s-brändin 280 vuoden historian ja kansainvälisen verkoston voiman paikalliseen asiantuntemukseen.',
    aboutText2: 'Toimintamme perustuu henkilökohtaiseen palveluun, luottamukseen ja ehdottomaan ammattitaitoon. Jokainen asiakas on meille ainutlaatuinen, ja räätälöimme palvelumme vastaamaan juuri heidän tarpeitaan.',
    aboutText3: 'Vuodesta 2015 lähtien olemme palvelleet asiakkaitamme Suomessa ja auttaneet heitä löytämään unelmiensa kodin tai myymään kiinteistönsä parhaaseen mahdolliseen hintaan.',
    imageAlt: 'Snellman Sotheby\'s toimisto',
    valuesTitle: 'Arvomme',
    value1Title: 'Luottamus',
    value1Text: 'Rakennamme pitkäaikaisia asiakassuhteita luottamuksen pohjalta',
    value2Title: 'Intohimo',
    value2Text: 'Olemme intohimoisia työstämme ja sitoutuneita tuloksiin',
    value3Title: 'Kansainvälisyys',
    value3Text: 'Hyödynnämme globaalia verkostoamme paikallisesti',
    historyTitle: 'Sotheby\'s - 280 vuotta historiaa',
    historyText1: 'Sotheby\'s perustettiin Lontoossa vuonna 1744, ja se on yksi maailman vanhimmista ja arvostetuimmista huutokaupoista. Vuosisatojen aikana Sotheby\'s on rakentanut maineen laadun, asiantuntemuksen ja luotettavuuden synonyyminä.',
    historyText2: 'Sotheby\'s International Realty perustettiin vuonna 1976 palvelemaan Sotheby\'s-huutokaupan asiakkaita, jotka etsivät ainutlaatuisia koteja ympäri maailman. Tänään verkostoomme kuuluu yli 1100 toimistoa 84 maassa ja alueella.',
    historyText3: 'Snellman Sotheby\'s International Realty on ylpeä osa tätä arvostettua perinnettä, tuoden kansainvälisen osaamisen ja verkoston Suomen kiinteistömarkkinoille.',
    philosophyTitle: 'Palvelufilosofiamme',
    philosophyText: 'Unelma täydellisestä kodista on unelmiemme työtä. Jokainen välittämämme koti on yhtä ainutlaatuinen kuin jokainen asiakkaamme. Olemme ylpeitä saadessamme yhdistää toisiinsa täydellisesti yhteensopivat kodit sekä asukkaat.',
    brandStory1Title: 'Bränditarina - Osa 1',
    brandStory1Subtitle: 'Tutustu Snellman Sotheby\'s International Realty -tarinamme alkuun',
    brandStory2Title: 'Bränditarina - Osa 2',
    brandStory2Subtitle: 'Jatkamme tarinaamme ja arvojamme',
    brandStory3Title: 'Bränditarina - Osa 3',
    brandStory3Subtitle: 'Kuinka palvelemme asiakkaitamme',
    ctaTitle: 'Tervetuloa tutustumaan toimintaamme',
    ctaText: 'Olemme täällä sinua varten, oli kyse sitten kodista, sijoituksesta tai unelmasta.',
    ctaContact: 'Ota yhteyttä',
    ctaMeet: 'Tapaa tiimimme',
  },
  sv: {
    heroTitle: 'Snellman Sotheby\'s International Realty',
    heroSubtitle: 'Vi öppnar nya dörrar sedan 2015',
    heroStats: '26 100 mäklare • 1 000 kontor • 84 länder och regioner',
    aboutTitle: 'Internationell kompetens med lokal erfarenhet',
    aboutText1: 'Snellman Sotheby\'s International Realty är en del av världens ledande lyxfastighetsmäklarkedja. Vi kombinerar Sotheby\'s-varumärkets 280-åriga historia och det internationella nätverkets kraft med lokal expertis.',
    aboutText2: 'Vår verksamhet bygger på personlig service, förtroende och absolut professionalism. Varje kund är unik för oss, och vi skräddarsyr våra tjänster för att möta just deras behov.',
    aboutText3: 'Sedan 2015 har vi betjänat våra kunder i Finland och hjälpt dem att hitta sitt drömhem eller sälja sin fastighet till bästa möjliga pris.',
    imageAlt: 'Snellman Sotheby\'s kontor',
    valuesTitle: 'Våra värderingar',
    value1Title: 'Förtroende',
    value1Text: 'Vi bygger långsiktiga kundrelationer baserade på förtroende',
    value2Title: 'Passion',
    value2Text: 'Vi är passionerade för vårt arbete och engagerade i resultat',
    value3Title: 'Internationalism',
    value3Text: 'Vi utnyttjar vårt globala nätverk lokalt',
    historyTitle: 'Sotheby\'s - 280 år av historia',
    historyText1: 'Sotheby\'s grundades i London 1744 och är ett av världens äldsta och mest respekterade auktionshus. Under århundraden har Sotheby\'s byggt ett rykte som synonym med kvalitet, expertis och tillförlitlighet.',
    historyText2: 'Sotheby\'s International Realty grundades 1976 för att betjäna Sotheby\'s auktionshuskunder som sökte unika hem runt om i världen. Idag omfattar vårt nätverk över 1 100 kontor i 84 länder och regioner.',
    historyText3: 'Snellman Sotheby\'s International Realty är stolt del av denna respekterade tradition, och för internationell expertis och nätverk till den finska fastighetsmarknaden.',
    philosophyTitle: 'Vår servicefilosofi',
    philosophyText: 'Drömmen om det perfekta hemmet är vårt drömarbete. Varje hem vi förmedlar är lika unikt som varje kund. Vi är stolta över att kunna förena perfekt kompatibla hem och boende.',
    brandStory1Title: 'Varumärkesberättelse - Del 1',
    brandStory1Subtitle: 'Bekanta dig med början av vår Snellman Sotheby\'s International Realty-historia',
    brandStory2Title: 'Varumärkesberättelse - Del 2',
    brandStory2Subtitle: 'Vi fortsätter vår historia och våra värderingar',
    brandStory3Title: 'Varumärkesberättelse - Del 3',
    brandStory3Subtitle: 'Hur vi betjänar våra kunder',
    ctaTitle: 'Välkommen att bekanta dig med vår verksamhet',
    ctaText: 'Vi är här för dig, vare sig det gäller ett hem, en investering eller en dröm.',
    ctaContact: 'Kontakta oss',
    ctaMeet: 'Träffa vårt team',
  },
  en: {
    heroTitle: 'Snellman Sotheby\'s International Realty',
    heroSubtitle: 'Opening new doors since 2015',
    heroStats: '26,100 agents • 1,000 offices • 84 countries and territories',
    aboutTitle: 'International expertise with local experience',
    aboutText1: 'Snellman Sotheby\'s International Realty is part of the world\'s leading luxury real estate brokerage network. We combine the Sotheby\'s brand\'s 280-year history and the power of an international network with local expertise.',
    aboutText2: 'Our operations are based on personal service, trust, and absolute professionalism. Every client is unique to us, and we tailor our services to meet their specific needs.',
    aboutText3: 'Since 2015, we have served our clients in Finland and helped them find their dream home or sell their property at the best possible price.',
    imageAlt: 'Snellman Sotheby\'s office',
    valuesTitle: 'Our Values',
    value1Title: 'Trust',
    value1Text: 'We build long-term customer relationships based on trust',
    value2Title: 'Passion',
    value2Text: 'We are passionate about our work and committed to results',
    value3Title: 'Internationalism',
    value3Text: 'We leverage our global network locally',
    historyTitle: 'Sotheby\'s - 280 years of history',
    historyText1: 'Sotheby\'s was founded in London in 1744 and is one of the world\'s oldest and most respected auction houses. Over the centuries, Sotheby\'s has built a reputation as synonymous with quality, expertise, and reliability.',
    historyText2: 'Sotheby\'s International Realty was founded in 1976 to serve Sotheby\'s auction house clients seeking unique homes around the world. Today, our network includes over 1,100 offices in 84 countries and regions.',
    historyText3: 'Snellman Sotheby\'s International Realty is a proud part of this respected tradition, bringing international expertise and network to the Finnish real estate market.',
    philosophyTitle: 'Our Service Philosophy',
    philosophyText: 'The dream of the perfect home is our dream work. Every home we broker is as unique as every client. We are proud to bring together perfectly compatible homes and residents.',
    brandStory1Title: 'Brand Story - Part 1',
    brandStory1Subtitle: 'Discover the beginning of our Snellman Sotheby\'s International Realty story',
    brandStory2Title: 'Brand Story - Part 2',
    brandStory2Subtitle: 'We continue our story and values',
    brandStory3Title: 'Brand Story - Part 3',
    brandStory3Subtitle: 'How we serve our clients',
    ctaTitle: 'Welcome to learn about our operations',
    ctaText: 'We are here for you, whether it\'s about a home, an investment, or a dream.',
    ctaContact: 'Contact us',
    ctaMeet: 'Meet our team',
  },
};

export default function CompanyPage({ params }: { params: { locale: Locale } }) {
  const t = translations[params.locale] || translations.fi;
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section with Background Image */}
        <section 
          className="relative h-[500px] flex items-center justify-center text-white"
          style={{
            backgroundImage: 'url(/images/international/snellman-sothebys-international-kakumae-web-768x480.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
              {params.locale === 'fi' ? 'Kansainvälinen välittäjäsi paikallisesti' : params.locale === 'sv' ? 'Din internationella mäklare lokalt' : 'Your international broker locally'}
            </h1>
            <p className="text-base lg:text-lg font-light mb-8">
              {t.heroStats}
            </p>
            <a 
              href="#content"
              className="inline-block border-2 border-white text-white px-8 py-3 
                       hover:bg-white hover:text-gray-900 transition-all duration-300
                       font-light uppercase tracking-wider text-sm"
            >
              {params.locale === 'fi' ? 'Avaamme uusia ovia' : params.locale === 'sv' ? 'Vi öppnar nya dörrar' : 'We open new doors'}
            </a>
          </div>
        </section>

        {/* Three Column Section */}
        <section id="content" className="py-0 bg-white">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Column 1 - Kohteet */}
              <Link href="/kohteet" className="relative h-80 group overflow-hidden block">
                <Image
                  src="/images/content/snellman-sothebys-yritys.jpg"
                  alt={params.locale === 'fi' ? 'Avaamme uusia ovia' : params.locale === 'sv' ? 'Vi öppnar nya dörrar' : 'We open new doors'}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-2xl font-light mb-4 text-center">
                    {params.locale === 'fi' ? 'Avaamme uusia ovia!' : params.locale === 'sv' ? 'Vi öppnar nya dörrar!' : 'We open new doors!'}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-6 py-2
                             group-hover:bg-white group-hover:text-[#1a3a4a] transition-all duration-300
                             font-light uppercase tracking-wider text-sm"
                  >
                    {params.locale === 'fi' ? 'Löydä unelmiesi koti' : params.locale === 'sv' ? 'Hitta ditt drömhem' : 'Find your dream home'}
                  </span>
                </div>
              </Link>

              {/* Column 2 - Yritys */}
              <Link href="/yritys" className="relative h-80 group overflow-hidden block">
                <Image
                  src="/images/content/snellman-sothebys-kutsu-arviokaynnille.jpg"
                  alt={params.locale === 'fi' ? 'Asiantuntemus' : params.locale === 'sv' ? 'Expertis' : 'Expertise'}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#324b72] bg-opacity-80 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-2xl font-light mb-4 text-center">
                    {params.locale === 'fi' ? 'Asiantuntemus joka ulottuu korttelista kaupunkiin ja aina maailman ympäri' : params.locale === 'sv' ? 'Expertis som sträcker sig från kvarteret till staden och världen runt' : 'Expertise from the block to the city and around the world'}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-6 py-2
                             group-hover:bg-white group-hover:text-[#324b72] transition-all duration-300
                             font-light uppercase tracking-wider text-sm"
                  >
                    {params.locale === 'fi' ? 'Lue lisää yrityksestämme' : params.locale === 'sv' ? 'Läs mer om oss' : 'Read more about us'}
                  </span>
                </div>
              </Link>

              {/* Column 3 - Myymässä */}
              <Link href="/myymassa" className="relative h-80 group overflow-hidden block">
                <Image
                  src="/images/content/snellman-sothebys-nakoalapaikka.jpg"
                  alt={params.locale === 'fi' ? 'Arviokäynti' : params.locale === 'sv' ? 'Värderingsbesök' : 'Valuation visit'}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gray-800 bg-opacity-60 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-2xl font-light mb-4 text-center">
                    {params.locale === 'fi' ? 'Kutsu meidät maksuttomalle arviokäynnille' : params.locale === 'sv' ? 'Bjud in oss för en gratis värdering' : 'Invite us for a free valuation'}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-6 py-2
                             group-hover:bg-white group-hover:text-gray-800 transition-all duration-300
                             font-light uppercase tracking-wider text-sm"
                  >
                    {params.locale === 'fi' ? 'Ota meihin yhteyttä' : params.locale === 'sv' ? 'Kontakta oss' : 'Contact us'}
                  </span>
                </div>
              </Link>
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
                    {t.aboutTitle}
                  </h2>
                  <div className="space-y-4 text-gray-700 font-light">
                    <p>{t.aboutText1}</p>
                    <p>{t.aboutText2}</p>
                    <p>{t.aboutText3}</p>
                  </div>
                </div>
                <div className="relative h-96 lg:h-[500px]">
                  <Image
                    src="/images/content/snellman-sothebys-yritys.jpg"
                    alt={t.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* History Section */}
              <div className="bg-gray-50 p-8 lg:p-12 rounded-lg mb-20">
                <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
                  {t.historyTitle}
                </h2>
                <div className="max-w-3xl mx-auto space-y-4 text-gray-700 font-light">
                  <p>{t.historyText1}</p>
                  <p>{t.historyText2}</p>
                  <p>{t.historyText3}</p>
                </div>
              </div>

              {/* Philosophy Section */}
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-light text-gray-900 mb-6">
                  {t.philosophyTitle}
                </h2>
                <p className="text-xl text-gray-700 font-light leading-relaxed">
                  {t.philosophyText}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-light mb-6 text-gray-900">
                {t.ctaTitle}
              </h2>
              <p className="text-lg font-light mb-8 text-gray-700">
                {t.ctaText}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/yhteystiedot"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           bg-[#002349] text-white hover:bg-[#001731] 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  {t.ctaContact}
                </Link>
                <Link
                  href="/henkilosto"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  {t.ctaMeet}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>    </div>
  );
}
