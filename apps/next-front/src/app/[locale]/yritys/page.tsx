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
        {/* Hero Carousel Section */}
        <section 
          className="relative h-[500px] flex items-center justify-center text-white"
          style={{
            backgroundImage: 'url(/images/content/snellman-sothebys-yritys-01.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-[#002349]/60"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-light mb-4">
              {params.locale === 'fi' ? 'Kansainvälinen välittäjäsi paikallisesti' : params.locale === 'sv' ? 'Din internationella mäklare lokalt' : 'Your international broker locally'}
            </h1>
            <p className="text-lg font-light mb-6">
              {params.locale === 'fi' ? '26 100 välittäjää 1100 välitystoimistossa 84 maassa ja alueella' : params.locale === 'sv' ? '26 100 mäklare 1100 kontor 84 länder och regioner' : '26,100 agents 1,100 offices 84 countries and territories'}
            </p>
            <p className="text-xl font-light">
              {params.locale === 'fi' ? 'Avaamme uusia ovia' : params.locale === 'sv' ? 'Vi öppnar nya dörrar' : 'We open new doors'}
            </p>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                {params.locale === 'fi' ? 'Tervetuloa onnistuneeseen asuntokauppaan!' : params.locale === 'sv' ? 'Välkommen till en framgångsrik bostadsaffär!' : 'Welcome to a successful property transaction!'}
              </h2>
              <p className="text-lg text-gray-700 font-light">
                {params.locale === 'fi' ? 'Katso kaikki myynnissä olevat kohteemme.' : params.locale === 'sv' ? 'Se alla våra försäljningsobjekt.' : 'See all our properties for sale.'}
              </p>
            </div>
          </div>
        </section>

        {/* Three Large Image Cards */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sotheby's Huutokauppakamari */}
              <a 
                href="https://www.sothebys.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative h-96 group overflow-hidden block"
              >
                <Image
                  src="/images/content/sothebys-auction-house.jpg"
                  alt="Sotheby's Huutokauppakamari"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover grayscale"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-2xl font-light mb-4 text-center">
                    Sotheby's<br/>Huutokauppakamari
                  </h3>
                  <span className="text-sm font-light uppercase tracking-wider">
                    Lue lisää
                  </span>
                </div>
              </a>

              {/* Sotheby's International Realty */}
              <a 
                href="https://www.sothebysrealty.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative h-96 group overflow-hidden block"
              >
                <Image
                  src="/images/content/sothebys-international-realty.jpg"
                  alt="Sotheby's International Realty"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-[#002349]/60 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-2xl font-light mb-4 text-center">
                    Sotheby's<br/>International Realty®
                  </h3>
                  <span className="text-sm font-light uppercase tracking-wider">
                    Lue lisää
                  </span>
                </div>
              </a>

              {/* Tutustu henkilökuntaamme */}
              <Link 
                href="/henkilosto"
                className="relative h-96 group overflow-hidden block"
              >
                <Image
                  src="/images/content/snellman-sothebys-henkilosto.jpg"
                  alt="Henkilökunta"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover grayscale"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-2xl font-light mb-4 text-center">
                    {params.locale === 'fi' ? 'Tutustu henkilökuntaamme' : params.locale === 'sv' ? 'Möt vår personal' : 'Meet our staff'}
                  </h3>
                  <span className="text-sm font-light uppercase tracking-wider">
                    {params.locale === 'fi' ? 'Ota yhteyttä' : params.locale === 'sv' ? 'Kontakta' : 'Contact'}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Snellman Sotheby's International Realty Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-light text-gray-900 mb-8">
                Snellman Sotheby's International Realty®
              </h2>
              <div className="space-y-4 text-gray-700 font-light leading-relaxed text-center">
                <p>
                  {params.locale === 'fi' 
                    ? 'Tänä päivänä 84 maassa, 1100 välitystoimiston ja 26 100 välittäjän vahvuudella palveleva Sotheby\'s International Realty® kuuluu maailman suurimpiin kiinteistöalan brändeihin. Globaali verkostomme avaa asiakkaille eri puolilla maailmaa oven kansainvälisille arvokiinteistömarkkinoille.'
                    : params.locale === 'sv'
                    ? 'Idag med 84 länder, 1100 kontor och 26 100 mäklare är Sotheby\'s International Realty® ett av världens största fastighetsmärken. Vårt globala nätverk öppnar dörren till internationella lyxfastighetsmarknader för kunder runt om i världen.'
                    : 'Today with 84 countries, 1,100 offices and 26,100 agents, Sotheby\'s International Realty® is one of the world\'s largest real estate brands. Our global network opens the door to international luxury real estate markets for clients around the world.'}
                </p>
                <div className="pt-8 space-y-2 text-lg">
                  <p className="font-medium">
                    {params.locale === 'fi' ? 'Upea toimistomme palvelee teitä arkisin 10:00 – 17:00' : params.locale === 'sv' ? 'Vårt fantastiska kontor betjänar er vardagar 10:00 – 17:00' : 'Our beautiful office serves you on weekdays 10:00 – 17:00'}
                  </p>
                  <p>
                    {params.locale === 'fi' ? 'sekä muina aikoina sopimuksen mukaan.' : params.locale === 'sv' ? 'samt övriga tider enligt överenskommelse.' : 'and at other times by appointment.'}
                  </p>
                  <p className="pt-4">+358 (0)10 315 6900</p>
                  <p>Kasarmikatu 34, 00130 Helsinki</p>
                  <p>info@sothebysrealty.fi</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sotheby's & Sotheby's International Realty Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-light text-gray-900 mb-8 text-center">
                Sotheby's® & Sotheby´s International Realty®
              </h2>
              <div className="space-y-4 text-gray-700 font-light leading-relaxed">
                <p>
                  {params.locale === 'fi'
                    ? 'Vuonna 1744 perustetun, perinteikkään Sotheby\'s huutokauppakamarin rinnalle perustettiin vuonna 1976 kiinteistönvälitysketju, jonka toiminnan kulmakivenä on tarjota laatutietoisille asiakkaille kiinteistömarkkinoilla yhtä vahvaa markkinaosaamista ja palvelutasoa kuin taiteen ja antiikin välityksessä, yksilöllisesti ja hienovaraisesti.'
                    : params.locale === 'sv'
                    ? 'Vid sidan av det traditionella Sotheby\'s auktionshuset som grundades 1744, grundades 1976 en fastighetsmäklarkedja vars hörnsten är att erbjuda kvalitetsmedvetna kunder samma starka marknadskunskap och servicenivå på fastighetsmarknaden som inom konst- och antikförmedling, individuellt och diskret.'
                    : 'Alongside the traditional Sotheby\'s auction house founded in 1744, a real estate brokerage chain was founded in 1976 whose cornerstone is to offer quality-conscious customers the same strong market knowledge and service level in the real estate market as in art and antique brokerage, individually and discreetly.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Snellman Sotheby's International Realty Finland Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-light text-gray-900 mb-8 text-center">
                Snellman Sotheby's International Realty®
              </h2>
              <div className="space-y-4 text-gray-700 font-light leading-relaxed">
                <p>
                  {params.locale === 'fi'
                    ? 'Snellman Sotheby\'s International Realty Finland aloitti toimintansa Helsingissä syksyllä 2015. Olemme yksi harvoista arvokiinteistöihin erikoistuneista välittäjistä, joka pystyy tarjoamaan laatutietoisille asiakkaille ainutlaatuisia kohteita ja yksilöityä palvelua niin Suomessa kuin ympäri maailmaa. Välitämme ainutlaatuisia kohteita, tyylillä.'
                    : params.locale === 'sv'
                    ? 'Snellman Sotheby\'s International Realty Finland startade sin verksamhet i Helsingfors hösten 2015. Vi är en av få mäklare specialiserade på värdefullafast igheter som kan erbjuda kvalitetsmedvetna kunder unika objekt och individuell service både i Finland och runt om i världen. Vi förmedlar unika objekt, med stil.'
                    : 'Snellman Sotheby\'s International Realty Finland started its operations in Helsinki in the fall of 2015. We are one of the few brokers specializing in valuable properties that can offer quality-conscious customers unique properties and individualized service both in Finland and around the world. We broker unique properties, with style.'}
                </p>
                <p>
                  {params.locale === 'fi'
                    ? 'Oletpa ostamassa tai myymässä asuntoa, kiinteistöä, vapaa-ajan kohdetta, maatilaa tai kokonaista kartanoaluetta, haluamme auttaa sinua tekemään elämäsi kaupat.'
                    : params.locale === 'sv'
                    ? 'Oavsett om du köper eller säljer en bostad, fastighet, fritidsobjekt, gård eller ett helt herrgårdsområde, vill vi hjälpa dig att göra livets affär.'
                    : 'Whether you are buying or selling a home, property, vacation property, farm or an entire manor area, we want to help you make the deal of your life.'}
                </p>
                <p>
                  {params.locale === 'fi'
                    ? 'Olemme kotonamme niin kotikulmillasi kuin kansainvälisillä arvokiinteistömarkkinoilla.'
                    : params.locale === 'sv'
                    ? 'Vi är hemma både i ditt närområde och på internationella lyxfastighetsmarknader.'
                    : 'We are at home both in your local area and in international luxury real estate markets.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Palvelufilosofiamme Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-light text-gray-900 mb-8 text-center">
                {params.locale === 'fi' ? 'Palvelufilosofiamme' : params.locale === 'sv' ? 'Vår servicefilosofi' : 'Our Service Philosophy'}
              </h2>
              <div className="space-y-4 text-gray-700 font-light leading-relaxed">
                <p>
                  {params.locale === 'fi'
                    ? 'Unelma täydellisestä kodista on unelmiemme työtä, sillä koti on paikka, jossa saavutettavissa oleva elämänlaatu kiteytyy parhaiten. Parasta luksusta koti on silloin, kun siinä on jotakin erityistä verrattuna alueen muihin asuntoihin sekä silloin, kun se vastaa asukkaidensa elämäntyyliä ja unelmia. Eksklusiivinen koti on erityinen niin ratkaisuiltaan, rakennuksena kuin sijainniltaan.'
                    : params.locale === 'sv'
                    ? 'Drömmen om det perfekta hemmet är vårt drömarbete, eftersom hemmet är platsen där den uppnåeliga livskvaliteten kristalliseras bäst. Bästa lyxen är hemmet när det har något speciellt jämfört med andra bostäder i området och när det motsvarar invånarnas livsstil och drömmar. Ett exklusivt hem är speciellt både i lösningar, som byggnad och i läge.'
                    : 'The dream of the perfect home is our dream work, because home is the place where achievable quality of life is best crystallized. The best luxury is home when it has something special compared to other homes in the area and when it matches its residents\' lifestyle and dreams. An exclusive home is special in solutions, as a building and in location.'}
                </p>
                <p>
                  {params.locale === 'fi'
                    ? 'Kiinteistönvälittäjänä ja arvoasuntojen asiantuntijana olemme ylpeitä saadessamme yhdistää toisiinsa täydellisesti yhteensopivat kodit sekä asukkaat. Jokainen välittämämme koti on yhtä ainutlaatuinen kuin jokainen asiakkaamme.'
                    : params.locale === 'sv'
                    ? 'Som fastighetsmäklare och expert på värdebostäder är vi stolta över att få förena perfekt kompatibla hem och invånare. Varje hem vi förmedlar är lika unikt som varje kund.'
                    : 'As a real estate broker and expert in valuable homes, we are proud to bring together perfectly compatible homes and residents. Every home we broker is as unique as every customer.'}
                </p>
                <p>
                  {params.locale === 'fi'
                    ? 'Suomessa olemme keskittyneet välittämään pääkaupunkiseudun ja sitä ympäröivän rannikkoalueen premium-asuntoja ja -kiinteistöjä. Valikoimaamme kuuluu muun muassa laadukkaita loft- ja penthouse-asuntoja sekä arvokkaita uudisrakennuskohteita. Lisäksi välitämme vapaa-ajankohteita rannikon huviloista Lapin hiihtomajoihin.'
                    : params.locale === 'sv'
                    ? 'I Finland har vi koncentrerat oss på att förmedla premium-bostäder och fastigheter i huvudstadsregionen och det omgivande kustområdet. Vårt sortiment inkluderar bland annat högkvalitativa loft- och takvåningar samt värdefulla nybyggnadsobjekt. Dessutom förmedlar vi fritidsobjekt från kustvillor till Lapplands skidboenden.'
                    : 'In Finland, we have focused on brokering premium apartments and properties in the capital region and the surrounding coastal area. Our selection includes, among other things, high-quality loft and penthouse apartments as well as valuable new construction properties. In addition, we broker vacation properties from coastal villas to Lapland ski accommodations.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Avaamme uusia ovia CTA Section */}
        <section className="py-16 bg-[#002349] text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-light mb-4">
                {params.locale === 'fi' ? 'Avaamme uusia ovia' : params.locale === 'sv' ? 'Vi öppnar nya dörrar' : 'We open new doors'}
              </h2>
            </div>
          </div>
        </section>
      </main>    </div>
  );
}
