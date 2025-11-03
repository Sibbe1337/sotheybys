import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/domain/property.types';

// 🔥 LINUS FIX: Complete translations for Careers/Join Us page
const translations = {
  fi: {
    title: 'Meille töihin',
    heroTitle: 'Haluatko töihin meille?',
    heroStats: '26 100 välittäjää • 1 000 välitystoimistossa • 84 maassa ja alueella',
    missionTitle: 'Artfully Unite Extraordinary Homes with Extraordinary Lives',
    missionText: 'Tehtävämme on yhdistää taiteellisesti ainutlaatuiset kodit ainutlaatuisten elämien kanssa. Etsimme intohimoisia ammattilaisia, jotka haluavat olla osa maailman johtavaa luksuskiinteistöbrändiä.',
    
    lifestyleTitle: 'Luksus ei ole hinta, se on elämäntapa',
    lifestyleText: 'Sotheby\'s International Realty® edustaa jotain enemmän kuin kiinteistönvälitystä. Se on elämäntapa, jossa yhdistyvät taide, kulttuuri ja maailmanluokan palvelu. Meillä työskentely tarjoaa ainutlaatuisen mahdollisuuden palvella vaativimpia asiakkaita ja työskennellä maailman hienoimpien kiinteistöjen parissa.',
    
    opportunitiesTitle: 'Uramahdollisuudet',
    opportunitiesIntro: 'Tarjoamme monipuolisia uramahdollisuuksia motivoituneille ja kunnianhimoisille ammattilaisille:',
    
    agentTitle: 'Kiinteistönvälittäjä',
    agentText: 'Liity huippuammattilaisista koostuvaan tiimiimme ja välitä ainutlaatuisia kohteita vaativille asiakkaille. Tarjoamme parhaat työkalut, koulutuksen ja globaalin verkoston tueksesi.',
    
    requirementsTitle: 'Mitä etsimme?',
    requirement1: 'LKV-pätevyys tai valmius hankkia se',
    requirement2: 'Erinomainen asiakaspalveluosaaminen',
    requirement3: 'Intohimo luksuskiinteistöjä kohtaan',
    requirement4: 'Sujuva suomen kieli, ruotsin ja englannin kieli eduksi',
    requirement5: 'Kyky työskennellä itsenäisesti ja osana tiimiä',
    requirement6: 'Halu jatkuvaan oppimiseen ja kehittymiseen',
    
    benefitsTitle: 'Mitä tarjoamme?',
    benefit1: 'Maailmanluokan brändi ja markkinointiresurssit',
    benefit2: 'Kattava perehdytys ja jatkuva koulutus',
    benefit3: 'Globaali verkosto 84 maassa',
    benefit4: 'Kilpailukykyinen palkkio- ja provisiorakenne',
    benefit5: 'Inspiroiva ja kannustava työympäristö',
    benefit6: 'Mahdollisuus työskennellä ainutlaatuisten kohteiden parissa',
    
    cultureTitle: 'Työkulttuuri',
    cultureText: 'Toimistollamme arvostetaan laatua, ammattitaitoa ja asiakaskeskeisyyttä. Luomme ympäristön, jossa jokainen tiimin jäsen voi kukoistaa ja saavuttaa täyden potentiaalinsa. Uskomme yhteistyöhön, innovaatioon ja jatkuvaan kehittymiseen.',
    
    ctaTitle: 'Kiinnostuitko?',
    ctaText: 'Lähetä hakemuksesi ja CV:si meille. Kerro miksi haluat liittyä Sotheby\'s International Realty® -perheeseen ja mitä voit tuoda tiimimme.',
    ctaEmail: 'info@sothebysrealty.fi',
    ctaBtn: 'Ota yhteyttä',
    
    officeTitle: 'Helsingin toimistomme',
    officeAddress: 'Kasarmikatu 34, 00130 Helsinki',
    officePhone: '+358 (0)10 315 6900',
    officeEmail: 'info@sothebysrealty.fi',
    officeHours: 'Arkisin 10:00 – 17:00 • Muina aikoina sopimuksen mukaan',
  },
  sv: {
    title: 'Jobba hos oss',
    heroTitle: 'Vill du arbeta hos oss?',
    heroStats: '26 100 mäklare • 1 000 kontor • 84 länder och regioner',
    missionTitle: 'Artfully Unite Extraordinary Homes with Extraordinary Lives',
    missionText: 'Vårt uppdrag är att konstnärligt förena extraordinära hem med extraordinära liv. Vi söker passionerade proffs som vill vara en del av världens ledande lyxfastighetsmärke.',
    
    lifestyleTitle: 'Lyx är inte ett pris, det är en livsstil',
    lifestyleText: 'Sotheby\'s International Realty® representerar något mer än fastighetsförmedling. Det är en livsstil där konst, kultur och världsklass service förenas. Att arbeta hos oss erbjuder en unik möjlighet att betjäna de mest krävande kunderna och arbeta med världens finaste fastigheter.',
    
    opportunitiesTitle: 'Karriärmöjligheter',
    opportunitiesIntro: 'Vi erbjuder mångfaldiga karriärmöjligheter för motiverade och ambitiösa proffs:',
    
    agentTitle: 'Fastighetsmäklare',
    agentText: 'Gå med i vårt team av toppproffs och förmedla unika objekt till krävande kunder. Vi erbjuder de bästa verktygen, utbildningen och det globala nätverket som stöd.',
    
    requirementsTitle: 'Vad söker vi?',
    requirement1: 'Fastighetsmäklarkompetens eller beredskap att skaffa den',
    requirement2: 'Utmärkt kundservicekunskap',
    requirement3: 'Passion för lyxfastigheter',
    requirement4: 'Flytande finska, svenska och engelska är en fördel',
    requirement5: 'Förmåga att arbeta självständigt och som en del av ett team',
    requirement6: 'Vilja till kontinuerligt lärande och utveckling',
    
    benefitsTitle: 'Vad erbjuder vi?',
    benefit1: 'Världsklass varumärke och marknadsföringsresurser',
    benefit2: 'Omfattande introduktion och fortlöpande utbildning',
    benefit3: 'Globalt nätverk i 84 länder',
    benefit4: 'Konkurrenskraftig lön och provisionsstruktur',
    benefit5: 'Inspirerande och stödjande arbetsmiljö',
    benefit6: 'Möjlighet att arbeta med unika objekt',
    
    cultureTitle: 'Arbetskultur',
    cultureText: 'På vårt kontor värdesätter vi kvalitet, professionalitet och kundfokus. Vi skapar en miljö där varje teammedlem kan blomstra och nå sin fulla potential. Vi tror på samarbete, innovation och kontinuerlig utveckling.',
    
    ctaTitle: 'Intresserad?',
    ctaText: 'Skicka din ansökan och ditt CV till oss. Berätta varför du vill gå med i Sotheby\'s International Realty®-familjen och vad du kan bidra med till vårt team.',
    ctaEmail: 'info@sothebysrealty.fi',
    ctaBtn: 'Kontakta oss',
    
    officeTitle: 'Vårt kontor i Helsingfors',
    officeAddress: 'Kasarmikatu 34, 00130 Helsingfors',
    officePhone: '+358 (0)10 315 6900',
    officeEmail: 'info@sothebysrealty.fi',
    officeHours: 'Vardagar 10:00 – 17:00 • Andra tider enligt överenskommelse',
  },
  en: {
    title: 'Join Us',
    heroTitle: 'Do You Want to Work for Us?',
    heroStats: '26,100 agents • 1,000 offices • 84 countries and territories',
    missionTitle: 'Artfully Unite Extraordinary Homes with Extraordinary Lives',
    missionText: 'Our mission is to artfully unite extraordinary homes with extraordinary lives. We are looking for passionate professionals who want to be part of the world\'s leading luxury real estate brand.',
    
    lifestyleTitle: 'Luxury is not a price point, it is a lifestyle',
    lifestyleText: 'Sotheby\'s International Realty® represents something more than real estate brokerage. It is a lifestyle where art, culture and world-class service unite. Working with us offers a unique opportunity to serve the most demanding clients and work with the world\'s finest properties.',
    
    opportunitiesTitle: 'Career Opportunities',
    opportunitiesIntro: 'We offer diverse career opportunities for motivated and ambitious professionals:',
    
    agentTitle: 'Real Estate Agent',
    agentText: 'Join our team of top professionals and broker unique properties to demanding clients. We offer the best tools, training and global network to support you.',
    
    requirementsTitle: 'What are we looking for?',
    requirement1: 'Real estate agent qualification or willingness to obtain it',
    requirement2: 'Excellent customer service skills',
    requirement3: 'Passion for luxury real estate',
    requirement4: 'Fluent Finnish, Swedish and English are an advantage',
    requirement5: 'Ability to work independently and as part of a team',
    requirement6: 'Desire for continuous learning and development',
    
    benefitsTitle: 'What do we offer?',
    benefit1: 'World-class brand and marketing resources',
    benefit2: 'Comprehensive onboarding and continuous training',
    benefit3: 'Global network in 84 countries',
    benefit4: 'Competitive salary and commission structure',
    benefit5: 'Inspiring and supportive work environment',
    benefit6: 'Opportunity to work with unique properties',
    
    cultureTitle: 'Work Culture',
    cultureText: 'At our office, we value quality, professionalism and customer focus. We create an environment where each team member can flourish and reach their full potential. We believe in collaboration, innovation and continuous development.',
    
    ctaTitle: 'Interested?',
    ctaText: 'Send us your application and CV. Tell us why you want to join the Sotheby\'s International Realty® family and what you can bring to our team.',
    ctaEmail: 'info@sothebysrealty.fi',
    ctaBtn: 'Contact us',
    
    officeTitle: 'Our Helsinki office',
    officeAddress: 'Kasarmikatu 34, 00130 Helsinki',
    officePhone: '+358 (0)10 315 6900',
    officeEmail: 'info@sothebysrealty.fi',
    officeHours: 'Weekdays 10:00 – 17:00 • Other times by appointment',
  },
};

interface CareersPageProps {
  params: { locale: Locale };
}

export default function CareersPage({ params }: CareersPageProps) {
  const { locale } = params;
  const t = translations[locale] || translations.fi;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] bg-[#1a3a4a] text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-light mb-6 whitespace-pre-line">
            {t.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            {t.heroStats}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-light text-[#1a3a4a] mb-8 text-center italic">
            {t.missionTitle}
          </h2>
          <p className="text-lg text-gray-700 text-center leading-relaxed">
            {t.missionText}
          </p>
        </div>
      </section>

      {/* Lifestyle Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-lg shadow-md p-10 md:p-12 border-2 border-[#1a3a4a]/10">
            <h2 className="text-3xl font-light text-[#1a3a4a] mb-6">
              {t.lifestyleTitle}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t.lifestyleText}
            </p>
          </div>
        </div>
      </section>

      {/* Career Opportunities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-light text-[#1a3a4a] mb-6 text-center">
            {t.opportunitiesTitle}
          </h2>
          <p className="text-lg text-gray-700 mb-12 text-center">
            {t.opportunitiesIntro}
          </p>

          <div className="bg-gray-50 rounded-lg p-8 md:p-10 mb-12">
            <h3 className="text-2xl font-medium text-[#1a3a4a] mb-4">
              {t.agentTitle}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {t.agentText}
            </p>
          </div>

          {/* Requirements & Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
              <h3 className="text-2xl font-medium text-[#1a3a4a] mb-6">
                {t.requirementsTitle}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#1a3a4a] mr-3">✓</span>
                  <span className="text-gray-700">{t.requirement1}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1a3a4a] mr-3">✓</span>
                  <span className="text-gray-700">{t.requirement2}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1a3a4a] mr-3">✓</span>
                  <span className="text-gray-700">{t.requirement3}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1a3a4a] mr-3">✓</span>
                  <span className="text-gray-700">{t.requirement4}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1a3a4a] mr-3">✓</span>
                  <span className="text-gray-700">{t.requirement5}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1a3a4a] mr-3">✓</span>
                  <span className="text-gray-700">{t.requirement6}</span>
                </li>
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
              <h3 className="text-2xl font-medium text-[#1a3a4a] mb-6">
                {t.benefitsTitle}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#1a3a4a] mr-3">★</span>
                  <span className="text-gray-700">{t.benefit1}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1a3a4a] mr-3">★</span>
                  <span className="text-gray-700">{t.benefit2}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1a3a4a] mr-3">★</span>
                  <span className="text-gray-700">{t.benefit3}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1a4a] mr-3">★</span>
                  <span className="text-gray-700">{t.benefit4}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1a3a4a] mr-3">★</span>
                  <span className="text-gray-700">{t.benefit5}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1a3a4a] mr-3">★</span>
                  <span className="text-gray-700">{t.benefit6}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-light text-[#1a3a4a] mb-6 text-center">
            {t.cultureTitle}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            {t.cultureText}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1a3a4a] text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-light mb-6">
            {t.ctaTitle}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {t.ctaText}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href={`mailto:${t.ctaEmail}`}
              className="inline-block px-8 py-4 bg-white text-[#1a3a4a] rounded hover:bg-gray-100 transition-colors font-medium"
            >
              {t.ctaBtn}
            </a>
            <a
              href={`mailto:${t.ctaEmail}`}
              className="text-white hover:underline text-lg"
            >
              {t.ctaEmail}
            </a>
          </div>
        </div>
      </section>

      {/* Office Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h3 className="text-2xl font-light text-[#1a3a4a] mb-6">
            {t.officeTitle}
          </h3>
          <div className="space-y-2 text-gray-700">
            <p>{t.officeAddress}</p>
            <p>{t.officePhone}</p>
            <p>{t.officeEmail}</p>
            <p className="text-sm text-gray-600 mt-4">{t.officeHours}</p>
          </div>
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
    description: t.missionText,
  };
}
