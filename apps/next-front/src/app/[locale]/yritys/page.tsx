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
    ctaTitle: 'Tervetuloa tutustumaan toimintaamme',
    ctaText: 'Olemme täällä sinua varten, oli kyse sitten kodista, sijoituksesta tai unelmasta.',
    ctaContact: 'Ota yhteyttä',
    ctaMeet: 'Tapaa tiimimme',
  },
  sv: {
    heroTitle: 'Snellman Sotheby\'s International Realty',
    heroSubtitle: 'Vi öppnar nya dörrar sedan 2015',
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
    ctaTitle: 'Välkommen att bekanta dig med vår verksamhet',
    ctaText: 'Vi är här för dig, vare sig det gäller ett hem, en investering eller en dröm.',
    ctaContact: 'Kontakta oss',
    ctaMeet: 'Träffa vårt team',
  },
  en: {
    heroTitle: 'Snellman Sotheby\'s International Realty',
    heroSubtitle: 'Opening new doors since 2015',
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
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-6">
                {t.heroTitle}
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-light">
                {t.heroSubtitle}
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

              {/* Values Section */}
              <div className="mb-20">
                <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">
                  {t.valuesTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">{t.value1Title}</h3>
                    <p className="text-gray-600 font-light text-sm">{t.value1Text}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">{t.value2Title}</h3>
                    <p className="text-gray-600 font-light text-sm">{t.value2Text}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#1a3a4a] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">{t.value3Title}</h3>
                    <p className="text-gray-600 font-light text-sm">{t.value3Text}</p>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className="bg-gray-50 p-8 lg:p-12 rounded-lg">
                <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
                  {t.historyTitle}
                </h2>
                <div className="max-w-3xl mx-auto space-y-4 text-gray-700 font-light">
                  <p>{t.historyText1}</p>
                  <p>{t.historyText2}</p>
                  <p>{t.historyText3}</p>
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
                {t.ctaTitle}
              </h2>
              <p className="text-lg font-light mb-8 text-white/90">
                {t.ctaText}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/yhteystiedot"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           bg-white text-[#1a3a4a] hover:bg-gray-100 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  {t.ctaContact}
                </Link>
                <Link
                  href="/henkilosto"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           border border-white text-white hover:bg-white hover:text-[#1a3a4a] 
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
