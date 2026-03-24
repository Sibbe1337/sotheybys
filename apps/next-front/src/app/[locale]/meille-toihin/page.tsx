import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Locale } from '@/lib/domain/property.types';
import { JobPosition } from '@/components/careers/JobPosition';

// 🔥 LINUS FIX: Careers page is ONLY available in English (like current site)
// Redirect fi/sv visitors to English version
export const dynamic = 'force-static';

const translations = {
  fi: {
    title: 'Meille töihin',
    heroTitle: 'Tervetuloa Snellman Sotheby\'s International Realtyyn',
    heroIntro: 'Edustamme ja myymme poikkeuksellisia koteja erilaisissa kategorioissa ja hintapisteissä. Tehtävämme päivittäisessä työssämme kiinteistöalan ammattilaisina on yhdistää taiteellisesti poikkeukselliset kodit poikkeuksellisiin elämiin.',
    heroText1: 'Sotheby\'s International Realty® tunnetaan luksusmarkkinoita palvelevana tavoiteltavana brändinä. Riippumatta siitä, mikä elämäntyyli sinua eniten houkuttaa, olemme täällä palvelemassa sinua.',
    heroText2: 'Luksus ei ole hintapiste, se on elämäntapa',
    heroText3: 'Välittäjänä myyntitiimissämme sinulla on loistava mahdollisuus rakentaa oma urasi sellaisiin kohteisiin, jotka sopivat profiiliisi parhaiten.',
    wishTitle: 'Haluatko liittyä joukkoomme?',
    wishSubtitle: 'Uramahdollisuutemme.',
    
    // Position 1
    pos1Category: 'Kiinteistönvälitys & Myynti',
    pos1Title: 'Paikallinen kiinteistönvälitys- ja myyntiammattilainen',
    pos1Intro: 'Luksuskiinteistönvälittäjien verkostomme tarjoaa vertaansa vailla olevan pääsyn ainutlaatuisiin kiinteistöihin ympäri maailmaa. Arvostetujen asuntojen edustaminen vaatii korkeasti päteviä kiinteistöalan ammattilaisia, joilla on globaali ulottuvuus ja paikallinen asiantuntemus.',
    pos1Description: 'Snellman Sotheby\'s International Realty kasvaa ja etsimme jatkuvasti ammattilaisia myyntitiimimme. Toivotamme nyt tervetulleiksi 2-3 uutta kiinteistönvälittäjää liittymään yritykseemme.\n\nTämä on tilaisuus työskennellä menestyvälle, kasvavalle yritykselle, jolla on vahva globaali läsnäolo ja voimakas brändi. Arvostamme suuresti motivaatiota ja positiivista tiimihenkeä sekä innostusta auttaa yritystämme kasvamaan. Työskentelet itsenäisesti, mutta olet silti osa loistavaa tiimiä.',
    pos1ReqTitle: 'Edellytämme:',
    pos1Req1: 'LKV-pätevyys ja todistettu myyntitulos',
    pos1Req2: 'Vähintään 2+ vuoden kokemus kiinteistönvälittäjänä Suomen markkinoilla, mieluiten pääkaupunkiseudulla',
    pos1Req3: 'Erityinen tuntu luksukselle ja premium-asiakaskeskeisyys',
    pos1Req4: 'Vahvat ihmis- ja sosiaaliset taidot sekä motivaatio kehittää ja laajentaa asiakaskuntaa',
    pos1Req5: 'Sujuva suomen ja englannin kieli vaaditaan. Muut kielitaidot ovat eduksi.',
    pos1Req6: 'Syvällinen tuntemus nykyisestä markkinatilanteesta ja taidot auttaa asiakkaita koko osto-/myyntiprosessin ajan',
    pos1Req7: 'Microsoft Office -ohjelmiston osaaminen sekä paikalliset listausohjelmat ja yleinen tietokoneen käyttö. Huom! Työskentelemme Apple-ympäristössä',
    pos1OfferTitle: 'Tarjoamme:',
    pos1Offer1: 'Kilpailukykyinen suorituspohjainen provisio',
    pos1Offer2: 'Tehokkaat markkinointityökalut paikallisesti ja globaalisti',
    pos1Offer3: 'Kaupungin hienoin näköinen toimisto (erittäin keskeisellä paikalla)',
    pos1Offer4: 'Inspiroiva työympäristö maailman voimakkaimman brändin kanssa',
    pos1Offer5: 'Työskentely kansainvälisten asiakkaiden kanssa',
    pos1Offer6: 'Loistava kokemus ja mahdollisuus kasvaa kansainvälisen yrityksen mukana',
    pos1Offer7: 'Mahdollisuus erikoistua eri segmentteihin / kiinteistötyyppeihin',
    pos1Offer8: 'Hauskat työkaverit 🙂',
    pos1Location: 'Sijainti: Helsinki, Suomi',
    
    // Position 2
    pos2Category: 'Alue-edustus',
    pos2Title: 'Kiinteistöjen alue-edustaja',
    pos2Intro: 'Toimistomme sijaitsee fyysisesti Helsingissä, mutta sitoutumisemme kattaa koko maan. Kohteemme sijaitsevat ympäri Suomea ja vaativat kokeneita alue-edustajia. Teemme yhteistyötä paikallisten välittäjien kanssa tukeaksemme meitä myyntiprosessissa.',
    pos2Description: 'Snellman Sotheby\'s International Realty kasvaa ja etsimme jatkuvasti ammattilaisia myyntitiimimme. Toimistomme sijaitsee Helsingin keskustassa, mutta toimintamme ulottuu koko maahan. Meillä on uskomattomia koteja myynnissä ympäri Suomea, ja tarvitsemme paikallisia / kausiluonteisia ammattilaisia palvelemaan ja edustamaan meitä tietyillä markkinoilla.',
    pos2ReqTitle: 'Edellytämme:',
    pos2Req1: 'LKV-pätevyys',
    pos2Req2: 'Vähintään 2+ vuoden kokemus kiinteistönvälittäjänä Suomen markkinoilla',
    pos2Req3: 'Erityinen tuntu luksukselle ja premium-asiakaskeskeisyys',
    pos2Req4: 'Vahvat ihmis- ja sosiaaliset taidot sekä motivaatio kehittää ja laajentaa asiakaskuntaa',
    pos2Req5: 'Sujuva suomen ja englannin kieli vaaditaan. Muut kielitaidot ovat eduksi',
    pos2Req6: 'Syvällinen tuntemus paikallisesta markkinatilanteesta ja taidot auttaa asiakkaita koko osto-/myyntiprosessin ajan',
    pos2Req7: 'Vakiintunut toimialue jossakin seuraavista alueista: Lappi / Turku / Tampere / Eteläinen saaristo / Järvialue',
    pos2OfferTitle: 'Tarjoamme:',
    pos2Offer1: 'Kilpailukykyinen suorituspohjainen provisio',
    pos2Offer2: 'Tehokkaat markkinointityökalut paikallisesti ja globaalisti',
    pos2Offer3: 'Kansainväliset myyntikanavat',
    pos2Offer4: 'Loistava kokemus ja mahdollisuus kasvaa globaalin yrityksen mukana',
    pos2Offer5: 'Mahdollisuus työskennellä kansainvälisten asiakkaiden kanssa',
    pos2Offer6: 'Tukea uraasi kiinteistöalan ammattilaisena',
    pos2Offer7: 'Mahdollisuus työskennellä eri segmenttien / kiinteistötyyppien parissa',
    pos2Offer8: 'Alueellisten myyntiedustajien verkosto',
    pos2Location: 'Sijainti: Helsinki, Suomi',
    
    contactName: 'Robert Charpentier',
    contactTitle: 'Puheenjohtaja, M.Sc., LKV',
    contactPhone: '+358 (0)400 243 011',
    contactEmail: 'robert@sothebysrealty.fi',
    contactCta: 'Oletko sinä se, jota etsimme? Ota meihin yhteyttä ja lähetä hakemuksesi mahdollisimman pian.',
    applyBtn: 'Hae tähän työhön',
    readMore: 'Lue lisää »',
    forMoreInfo: 'Lisätietoja:',
  },
  sv: {
    title: 'Jobba med oss',
    heroTitle: 'Välkommen till Snellman Sotheby\'s International Realty',
    heroIntro: 'Vi representerar och säljer extraordinära hem i olika kategorier och prisklasser. Vårt uppdrag i det dagliga arbetet som fastighetsexperter är att på ett konstfullt sätt förena extraordinära hem med extraordinära liv.',
    heroText1: 'Sotheby\'s International Realty® är erkänt som ett eftertraktat varumärke som betjänar lyxmarknaden. Oavsett vilken livsstil som lockar dig mest, är vi här för att betjäna dig.',
    heroText2: 'Lyx är inte en prispunkt, det är en livsstil',
    heroText3: 'Som mäklare i vårt säljteam har du en fantastisk möjlighet att bygga din egen karriär på fastigheter som passar din profil bäst.',
    wishTitle: 'Gå med i vårt fantastiska team!',
    wishSubtitle: 'Våra karriärmöjligheter.',
    pos1Category: 'Fastighetsförmedling & Försäljning',
    pos1Title: 'Lokal fastighets- och försäljningsproffs',
    pos1Intro: 'Vårt nätverk av lyxfastighetsmäklare ger oöverträffad tillgång till exklusiva fastigheter runt om i världen. Att representera ett exklusivt hem kräver högkvalificerade fastighetsproffs med global räckvidd och lokal expertis.',
    pos1Description: 'Snellman Sotheby\'s International Realty växer och vi söker ständigt efter proffs att ansluta till vårt säljteam. Vi välkomnar nu 2-3 nya fastighetsmäklare att gå med i vårt företag.\n\nDetta är en möjlighet att arbeta för ett framgångsrikt, växande företag med stark global närvaro och ett kraftfullt varumärke. Vi värderar högt motivation och en positiv laganda samt entusiasm att hjälpa vårt företag växa. Du kommer att arbeta självständigt men ändå vara en del av ett fantastiskt team.',
    pos1ReqTitle: 'Vi kräver:',
    pos1Req1: 'Licensierade fastighetsmäklare LKV med dokumenterad försäljningsframgång',
    pos1Req2: 'Minst 2+ års erfarenhet som fastighetsmäklare på den finska marknaden, helst i Stor-Helsingfors',
    pos1Req3: 'En speciell känsla för lyx och premiumkundfokus',
    pos1Req4: 'Starka sociala färdigheter och motivation att utveckla och utöka kundbasen',
    pos1Req5: 'Flytande finska och engelska krävs. Andra språkkunskaper är meriterande.',
    pos1Req6: 'Djupgående kunskap om den aktuella marknadssituationen och förmåga att hjälpa kunder genom hela köp-/säljprocessen',
    pos1Req7: 'Kunskaper i Microsoft Office samt lokala listningsprogram och allmän datoranvändning. OBS! Vi arbetar i Apple-miljö',
    pos1OfferTitle: 'Vi erbjuder:',
    pos1Offer1: 'Konkurrenskraftig prestationsbaserad provision',
    pos1Offer2: 'Kraftfulla marknadsföringsverktyg på lokal och global nivå',
    pos1Offer3: 'Det snyggaste kontoret i stan (på ett mycket centralt läge)',
    pos1Offer4: 'En inspirerande arbetsmiljö med världens starkaste varumärke',
    pos1Offer5: 'Att arbeta med internationella kunder',
    pos1Offer6: 'En fantastisk erfarenhet och möjlighet att växa med ett internationellt företag',
    pos1Offer7: 'Möjlighet att specialisera sig inom olika segment / fastighetstyper',
    pos1Offer8: 'Roliga kollegor 🙂',
    pos1Location: 'Plats: Helsingfors, Finland',
    pos2Category: 'Områdesrepresentation',
    pos2Title: 'Fastighetsområdesrepresentant',
    pos2Intro: 'Vårt kontor ligger fysiskt i Helsingfors men vårt engagemang täcker hela landet. Våra objekt finns över hela Finland och kräver erfarna områdesrepresentanter. Vi samarbetar med lokala mäklare för att stödja oss i försäljningsprocessen.',
    pos2Description: 'Snellman Sotheby\'s International Realty växer och vi söker ständigt proffs till vårt säljteam. Vårt kontor ligger i centrala Helsingfors, men vår verksamhet når hela landet. Vi har otroliga hem till salu över hela Finland och behöver lokala/säsongsproffs för att representera oss på specifika marknader.',
    pos2ReqTitle: 'Vi kräver:',
    pos2Req1: 'Licensierad fastighetsmäklare LKV',
    pos2Req2: 'Minst 2+ års erfarenhet som fastighetsmäklare på den finska marknaden',
    pos2Req3: 'En speciell känsla för lyx och premiumkundfokus',
    pos2Req4: 'Starka sociala färdigheter och motivation att utveckla och utöka kundbasen',
    pos2Req5: 'Flytande finska och engelska krävs. Andra språkkunskaper är meriterande',
    pos2Req6: 'Djupgående kunskap om den lokala marknadssituationen och förmåga att hjälpa kunder genom hela köp-/säljprocessen',
    pos2Req7: 'Etablerat område i något av följande: Lappland / Åbo / Tammerfors / Södra skärgården / Sjödistriktet',
    pos2OfferTitle: 'Vi erbjuder:',
    pos2Offer1: 'Konkurrenskraftig prestationsbaserad provision',
    pos2Offer2: 'Kraftfulla marknadsföringsverktyg på lokal och global nivå',
    pos2Offer3: 'Internationella försäljningskanaler',
    pos2Offer4: 'En fantastisk erfarenhet och möjlighet att växa med ett globalt företag',
    pos2Offer5: 'Möjlighet att arbeta med internationella kunder',
    pos2Offer6: 'Stöd för din karriär som fastighetsexpert',
    pos2Offer7: 'Möjlighet att arbeta inom olika segment / fastighetstyper',
    pos2Offer8: 'Ett nätverk av regionala försäljningsrepresentanter',
    pos2Location: 'Plats: Helsingfors, Finland',
    contactName: 'Robert Charpentier',
    contactTitle: 'Ordförande, M.Sc., LKV',
    contactPhone: '+358 (0)400 243 011',
    contactEmail: 'robert@sothebysrealty.fi',
    contactCta: 'Är du den vi söker? Kontakta oss och skicka din ansökan så snart som möjligt.',
    applyBtn: 'Sök detta jobb',
    readMore: 'Läs mer »',
    forMoreInfo: 'För mer information:',
  },
  en: {
    title: 'Join Us',
    heroTitle: 'Welcome to Snellman Sotheby\'s International Realty',
    heroIntro: 'We represent and sell extraordinary homes in a variety of categories and price points. The mission in our daily work as real estate professionals is to Artfully Unite Extraordinary Homes with Extraordinary Lives',
    heroText1: 'Sotheby\'s International Realty® is recognized as an aspirational brand serving the luxury market. Regardless of what lifestyle desires you the most, we are here to serve you.',
    heroText2: 'Luxury is not a price point, it is a lifestyle',
    heroText3: 'As a broker in our sales team you have a great opportunity to build your own career on properties that suits your profile best.',
    wishTitle: 'Wish to join us?',
    wishSubtitle: 'Our Career opportunities.',
    pos1Category: 'Real Estate & Sales',
    pos1Title: 'Local Real Estate & Sales Professional',
    pos1Intro: 'Our network of luxury real estate agents provides unrivaled access to distinctive properties around the world. To represent a home of distinction requires highly-qualified real estate professionals with global reach and local expertise.',
    pos1Description: 'Snellman Sotheby\'s International Realty is growing and we are constantly looking for professionals to join our sales team. We are now welcoming 2-3 new real estate agents to join our company.\n\nThis is an opportunity to work for a successful, growing company with a strong global presence and a powerful brand. We highly value motivation and a positive team spirit as well as enthusiasm to help our company grow. You will work independently while still be part of a great team.',
    pos1ReqTitle: 'We Require:',
    pos1Req1: 'Licensed real estate brokers LKV with proven sales record',
    pos1Req2: 'Minimum 2+ years of experience as a real estate broker on the Finnish market, preferably in the Greater Helsinki area',
    pos1Req3: 'A special touch for luxury and premium customer focus',
    pos1Req4: 'Strong people and social skills with the motivation to develop and expand the client base',
    pos1Req5: 'Fluency in Finnish and English required. Other language skills are beneficial.',
    pos1Req6: 'In-depth knowledge of the current market situation and skills to aid clients throughout the whole buying / selling process',
    pos1Req7: 'Working knowledge of Microsoft Office Suite as well as local listing programs and general computer usage. Note! We work in an Apple environment',
    pos1OfferTitle: 'We offer:',
    pos1Offer1: 'Competitive performance based commission',
    pos1Offer2: 'Powerful marketing tools on a local and global basis',
    pos1Offer3: 'The finest looking office in town (in a very central location)',
    pos1Offer4: 'An inspiring work environment with the most powerful brand in the world',
    pos1Offer5: 'To work with international clients',
    pos1Offer6: 'A great experience and opportunity to grow with an international company',
    pos1Offer7: 'Possibility to specialize within different segments / property types',
    pos1Offer8: 'Fun co-workers 🙂',
    pos1Location: 'Location: Helsinki, Finland',
    pos2Category: 'Area Representation',
    pos2Title: 'Real Estate Area Representative',
    pos2Intro: 'Our office may be located physically in Helsinki but our commitment covers the entire country. Our listings are situated all over Finland and require experienced area representatives. We are partnering with local brokers to support us with the sales process.',
    pos2Description: 'Snellman Sotheby\'s International Realty is growing and we are constantly looking for professionals to join our sales team. Our office is located in central Helsinki, but our operations reach the whole country. We have incredible homes for sale all over Finland, and we need local / seasonal professionals to serve and represent us on specific markets.',
    pos2ReqTitle: 'We Require:',
    pos2Req1: 'Licensed real estate broker LKV',
    pos2Req2: 'Minimum 2+ years of experience as a real estate broker on the Finnish market',
    pos2Req3: 'A special touch for luxury and premium customer focus',
    pos2Req4: 'Strong people and social skills and motivation to develop and expand the client base',
    pos2Req5: 'Fluency in Finnish and English required. Other language skills are beneficial',
    pos2Req6: 'In-depth knowledge of the local market situation and skills to aid clients throughout the whole buying / selling process',
    pos2Req7: 'Established territory in some of following areas: Lapland/ Turku / Tampere / Southern Archipelago / Lake District',
    pos2OfferTitle: 'We Offer:',
    pos2Offer1: 'Competitive performance based commission',
    pos2Offer2: 'Powerful marketing tools on a local and global basis',
    pos2Offer3: 'International sales channels',
    pos2Offer4: 'A great experience and opportunity to grow with a global company',
    pos2Offer5: 'Possibility to work with international clients',
    pos2Offer6: 'Support your career as a real estate professional',
    pos2Offer7: 'Possibility to work within different segments / property types',
    pos2Offer8: 'A network of regional sales representatives',
    pos2Location: 'Location: Helsinki, Finland',
    contactName: 'Robert Charpentier',
    contactTitle: 'Chairman, M.Sc., LKV',
    contactPhone: '+358 (0)400 243 011',
    contactEmail: 'robert@sothebysrealty.fi',
    contactCta: 'Are you the one we are looking for? Connect with us and send us your application as soon as possible.',
    applyBtn: 'Apply for this job',
    readMore: 'Read more »',
    forMoreInfo: 'For more information:',
  },
};

interface CareersPageProps {
  params: { locale: Locale };
}

export default function CareersPage({ params }: CareersPageProps) {
  const { locale } = params;
  
  // 🔥 LINUS FIX: Careers page is ONLY available in English (like current sothebysrealty.fi site)
  // Redirect fi/sv visitors to English version
  if (locale !== 'en') {
    redirect('/en/meille-toihin');
  }
  
  const t = translations.en; // Always use English translations

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 text-center">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center max-w-4xl mx-auto">
            {t.heroIntro}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center max-w-4xl mx-auto">
            {t.heroText1}
          </p>
          <p className="text-xl font-light text-gray-900 mb-6 text-center italic">
            {t.heroText2}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            {t.heroText3}
          </p>
        </div>
      </section>

      {/* Wish to Join Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
            {t.wishTitle}
          </h2>
          <p className="text-xl text-gray-700">
            {t.wishSubtitle}
          </p>
        </div>
      </section>

      {/* Positions - Expandable */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <JobPosition
            category={t.pos1Category}
            title={t.pos1Title}
            intro={t.pos1Intro}
            description={t.pos1Description}
            requirements={[t.pos1Req1, t.pos1Req2, t.pos1Req3, t.pos1Req4, t.pos1Req5, t.pos1Req6, t.pos1Req7]}
            reqTitle={t.pos1ReqTitle}
            offers={[t.pos1Offer1, t.pos1Offer2, t.pos1Offer3, t.pos1Offer4, t.pos1Offer5, t.pos1Offer6, t.pos1Offer7, t.pos1Offer8]}
            offerTitle={t.pos1OfferTitle}
            location={t.pos1Location}
            contactName={t.contactName}
            contactTitle={t.contactTitle}
            contactPhone={t.contactPhone}
            contactEmail={t.contactEmail}
            forMoreInfo={t.forMoreInfo}
            contactCta={t.contactCta}
            applyBtn={t.applyBtn}
            readMore={t.readMore}
          />

          <JobPosition
            category={t.pos2Category}
            title={t.pos2Title}
            intro={t.pos2Intro}
            description={t.pos2Description}
            requirements={[t.pos2Req1, t.pos2Req2, t.pos2Req3, t.pos2Req4, t.pos2Req5, t.pos2Req6, t.pos2Req7]}
            reqTitle={t.pos2ReqTitle}
            offers={[t.pos2Offer1, t.pos2Offer2, t.pos2Offer3, t.pos2Offer4, t.pos2Offer5, t.pos2Offer6, t.pos2Offer7, t.pos2Offer8]}
            offerTitle={t.pos2OfferTitle}
            location={t.pos2Location}
            contactName={t.contactName}
            contactTitle={t.contactTitle}
            contactPhone={t.contactPhone}
            contactEmail={t.contactEmail}
            forMoreInfo={t.forMoreInfo}
            contactCta={t.contactCta}
            applyBtn={t.applyBtn}
            readMore={t.readMore}
          />
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: CareersPageProps) {
  const { locale } = params;
  const t = translations[locale] || translations.fi;
  
  return {
    title: `${t.title} | Snellman Sotheby's International Realty`,
    description: t.heroIntro,
  };
}
