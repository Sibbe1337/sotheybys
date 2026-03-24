import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { locales, type Locale } from '@/i18n/config';
import type { Metadata } from 'next';

const meta = {
  fi: {
    title: 'Henkilöstö | Snellman Sotheby\'s International Realty',
    description: 'Tutustu asiantunteviin kiinteistönvälittäjiimme. Ota yhteyttä ja anna meidän auttaa sinua tekemään elämäsi kaupat.',
  },
  sv: {
    title: 'Personal | Snellman Sotheby\'s International Realty',
    description: 'Lär känna våra erfarna fastighetsmäklare. Kontakta oss och låt oss hjälpa dig göra ditt livs affär.',
  },
  en: {
    title: 'Our Team | Snellman Sotheby\'s International Realty',
    description: 'Meet our experienced real estate professionals. Contact us and let us help you make the deal of your life.',
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

// 🔥 LINUS FIX: Translations
const translations = {
  fi: {
    title: 'Henkilöstö',
    intro: 'Kokenut ja ammattitaitoinen henkilökuntamme antaa\nsinulle mielellään lisätietoja.',
    welcome: 'Tervetuloa tapaamaan meitä, kuulemme mielellämme miten voimme palvella juuri sinua.',
    contactTitle: 'Jos mieleesi herää kysymyksiä, voit aina ottaa meihin yhteyttä\nsoittamalla, lähettämällä sähköpostia tai pistäytymällä\ntoimistollamme!',
    officeTitle: 'Helsingin Toimipisteemme',
    officeDesc1: 'Helsingin ydinkeskustassa sijaitsevassa toimistossamme tapaat joukon motivoituneita ja asiantuntevia välittäjiä, joiden päämääränä on tehdä unelmastasi totta.',
    officeDesc2: 'Toimistoamme ympäröi dynaaminen Kaartinkaupunki muotiputiikkeineen, fine-dine-ravintoloineen sekä korkeatasoisine hotelleineen.',
    officeDesc3: 'Kävelet toimistollemme vain muutamassa minuutissa Esplanadilta tai Senaatintorilta.',
    directions: 'Reittiohjeet',
    formFirstName: 'Etunimi',
    formLastName: 'Sukunimi',
    formEmail: 'Sähköposti',
    formPhone: 'Puhelinnumero',
    formAddress: 'Osoite',  
    formMessage: 'Viesti',
    formPrivacyText: 'Olen tutustunut Tietosuojaselosteeseen',
    formPrivacyLink: 'Tietosuojaseloste',
    formRecaptchaText: 'Tämän sivun suojaa reCAPTCHA, mikä tarkoittaa, että Googlen',
    formRecaptchaPrivacy: 'tietosuojakäytännöt',
    formRecaptchaTerms: 'käyttöehdot',
    formRecaptchaEnd: 'ovat voimassa.',
    formSubmit: 'Lähetä',
    // Three boxes
    box1Title: 'Sotheby\'s Huutokauppatalo',
    box1Button: 'LUE LISÄÄ »',
    box2Title: 'Sotheby\'s International Realty®',
    box2Button: 'LUE LISÄÄ »',
    box3Title: 'Tutustu henkilökuntaamme',
    box3Button: 'OTA YHTEYTTÄ »',
    // Intro section
    introTitle: 'Snellman Sotheby\'s International Realty®',
    introText: 'Tänä päivänä 86 maassa, 1 100 välitystoimiston ja 26 000 välittäjän vahvuudella palveleva Sotheby\'s International Realty® kuuluu maailman suurimpiin kiinteistöalan brändeihin. Globaali verkostomme avaa asiakkaille eri puolilla maailmaa oven kansainvälisille arvokiinteistömarkkinoille.',
    officeHoursTitle: 'Upea toimistomme palvelee',
    officeHours: 'teitä arkisin 10:00 – 17:00',
    officeExtra: 'sekä muina aikoina sopimuksen mukaan.',
    addressStreet: 'Kasarmikatu 34,',
    addressCity: '00130 Helsinki',
  },
  sv: {
    title: 'Personal',
    intro: 'Vår erfarna och professionella personal ger dig gärna mer information.',
    welcome: 'Välkommen att träffa oss, vi lyssnar gärna på hur vi kan hjälpa dig.',
    contactTitle: 'Om du har några frågor kan du alltid kontakta oss genom att ringa, skicka ett email eller med att besöka vårt kontor!',
    officeTitle: 'Vårt Helsingfors kontor',
    officeDesc1: 'Hösten 2015 börjar en ny era i Finland. Ab Snellman LKV Oy Sotheby\'s International Realty tillträder den finska marknaden och tar fastighetsförmedling till en helt ny nivå. På huvudkontoret i Finlands dynamiska huvudstad Helsingfors, sitter ett gäng inspirerade förmedlare och arbetstagare och väntar på att få förverkliga just din dröm.',
    officeDesc2: 'Vår verksamhet sköts i huvudsak från huvudstadsregionen, men sträcker sig över hela landet.',
    officeDesc3: 'Från Södra Finlands vackra skärgård upp till det förtrollande Lappland och allting där emellan är vårt att tillsammans erövra.',
    directions: 'Vägbeskrivning',
    formFirstName: 'Förnamn',
    formLastName: 'Efternamn',
    formEmail: 'Email',
    formPhone: 'Telefon',
    formAddress: 'Adress',
    formMessage: 'Ditt meddelande',
    formPrivacyText: 'Jag har bekantat mig med Privacy Policyn',
    formPrivacyLink: 'Tietosuojaseloste',
    formRecaptchaText: 'Den här sidan skyddas av reCAPTCHA, vilket innebär att Googles',
    formRecaptchaPrivacy: 'Sekretesspolicy',
    formRecaptchaTerms: 'Användarvillkor',
    formRecaptchaEnd: 'gäller.',
    formSubmit: 'Skicka',
    // Three boxes
    box1Title: 'Sotheby\'s ® Auktionshus',
    box1Button: 'Läs mera',
    box2Title: 'Sotheby\'s International Realty ®',
    box2Button: 'Läs mer',
    box3Title: 'Lär dig känna vår personal',
    box3Button: 'Kontakta oss',
    // Intro section
    introTitle: 'Snellman Sotheby\'s International Realty®',
    introText: 'I dagens läge har Sotheby\'s International Realty® verksamhet i 86 länder, med 1 100 mäklarbyråer och 26 000 mäklare runt om i världen och sitter på ett av världens starkaste varumärken gällande fastigheter. Företaget följer ett franchise koncept som möjliggör tillträde på den globala marknaden för värdefastigheter runt om i hela världen.',
    officeHoursTitle: 'Vårt högklassiga kontor',
    officeHours: 'betjänar Er på vardagar 10:00 – 17:00',
    officeExtra: 'på helgerna är vi öppna efter överenskommelse.',
    addressStreet: 'Kaserngatan 34,',
    addressCity: '00130 Helsingfors',
  },
  en: {
    title: 'Personnel',
    intro: 'Our experienced and professional personnel will be happy to give you more information.',
    welcome: 'Welcome to meet us, we are more than happy to listen to how we can help you.',
    contactTitle: 'If you have any questions, you can always contact us by calling, sending an email or stopping by our office!',
    officeTitle: 'Our Helsinki Office',
    officeDesc1: 'In 2015 a new era began in Finland. Ab Snellman LKV Oy Sotheby\'s International Realty opened its doors to the Finnish market, with goals to bring real estate to a whole new level. In the office, located in the dynamic capital Helsinki, awaits a team motivated experts ready to make your dream come true.',
    officeDesc2: 'The office may be located in Southern Finland but our sales and operations cover the whole country.',
    officeDesc3: 'From the beautiful archipelago up to enchanting Lapland and everything in-between is ours to conquer.',
    directions: 'Directions',
    formFirstName: 'First name',
    formLastName: 'Last name',
    formEmail: 'Email',
    formPhone: 'Phone',
    formAddress: 'Address',
    formMessage: 'Message',
    formPrivacyText: 'I have read the',
    formPrivacyLink: 'Tietosuojaseloste',
    formRecaptchaText: 'This site is protected by reCAPTCHA and the Google',
    formRecaptchaPrivacy: 'Privacy Policy',
    formRecaptchaTerms: 'Terms of Service',
    formRecaptchaEnd: 'apply.',
    formSubmit: 'Send',
    // Three boxes
    box1Title: 'Sotheby\'s Auction House',
    box1Button: 'READ MORE »',
    box2Title: 'Sotheby\'s International Realty®',
    box2Button: 'READ MORE »',
    box3Title: 'Meet our staff',
    box3Button: 'CONTACT »',
    // Intro section
    introTitle: 'Snellman Sotheby\'s International Realty®',
    introText: 'Today with 86 countries, 1,100 offices and 26,000 agents, Sotheby\'s International Realty® is one of the world\'s largest real estate brands. Our global network opens the door to international luxury real estate markets for clients around the world.',
    officeHoursTitle: 'Our beautiful office serves',
    officeHours: 'you on weekdays 10:00 – 17:00',
    officeExtra: 'and at other times by appointment.',
    addressStreet: 'Kasarmikatu 34,',
    addressCity: '00130 Helsinki',
  },
};

// Actual staff data from Sotheby's website - ordered as on original site
const staffMembers = [
  {
    id: '1',
    name: 'Heidi Metsänen',
    title: 'Senior Broker, Global Sales Coordinator, M.Sc., LKV',
    email: 'heidi@sothebysrealty.fi',
    phone: '+358 (0)50 421 0905',
    image: '/images/staff/heidi-metsanen.jpg',
    description: '',
    flags: ['fi', 'se', 'gb', 'fr', 'de']
  },
  {
    id: '2',
    name: 'Soile Goodall',
    title: 'Senior Broker, LKV',
    email: 'soile@sothebysrealty.fi',
    phone: '+358 (0)40 533 5533',
    image: '/images/staff/soile-goodall.jpg',
    description: '',
    flags: ['fi', 'gb']
  },
  {
    id: '3',
    name: 'Ali Ahola',
    title: 'Senior Broker, LKV',
    email: 'ali@sothebysrealty.fi',
    phone: '+358 (0)40 923 2561',
    image: '/images/staff/ali-ahola.jpg',
    description: '',
    flags: ['fi']
  },
  {
    id: '4',
    name: 'Kadri-Ann Öunap',
    title: 'Sales Associate, Notary, KED, KiAT',
    email: 'kadri-ann@sothebysrealty.fi',
    phone: '+358 (0)40 154 7844',
    image: '/images/staff/kadri-ann-ounap.jpg',
    description: '',
    flags: ['fi', 'gb', 'ee']
  },
  {
    id: '5',
    name: 'Linn Johanson',
    title: 'Sales & Marketing Associate, M.Sc.',
    email: 'linn@sothebysrealty.fi',
    phone: '+358 (0)44 055 2342',
    image: '/images/staff/linn-johanson.jpg',
    description: '',
    flags: ['fi', 'se', 'gb']
  },
  {
    id: '6',
    name: 'Sima Shaygan',
    title: 'Sales Associate, B.Sc, KiLaT',
    email: 'sima@sothebysrealty.fi',
    phone: '+358 (0)44 239 3979',
    image: '/images/staff/sima-shaygan.jpg',
    description: '',
    flags: ['fi', 'gb', 'ir', 'tr']
  },
  {
    id: '7',
    name: 'Dennis Forsman',
    title: 'Sales Assistant, B.Sc.',
    email: 'dennis@sothebysrealty.fi',
    phone: '+358 (0)44 599 4407',
    image: '/images/staff/dennis-forsman.jpg',
    description: '',
    flags: ['fi', 'se', 'gb']
  },
  {
    id: '8',
    name: 'Johan Schröder',
    title: 'Graphic Designer',
    email: 'johan@sothebysrealty.fi',
    phone: '+358 (0)50 536 9106',
    image: '/images/staff/johan-schroder.jpg',
    description: '',
    flags: ['fi', 'se', 'gb']
  },
  {
    id: '9',
    name: 'Robert Charpentier',
    title: 'Chairman, M.Sc., LKV',
    email: 'robert@sothebysrealty.fi',
    phone: '+358 (0)400 243 011',
    image: '/images/staff/robert-charpentier.jpg',
    description: '',
    flags: ['fi', 'se', 'gb', 'de']
  },
  {
    id: '10',
    name: 'Eeva Kyläkoski',
    title: 'Senior Advisor - Board Member, LKV',
    email: 'eeva@sothebysrealty.fi',
    phone: '+358 (0)46 850 5850',
    image: '/images/staff/eeva-kylakoski.jpg',
    description: '',
    flags: ['fi', 'gb']
  },
  {
    id: '11',
    name: 'Petteri Huovila',
    title: 'Senior Advisor, LKV',
    email: 'petteri@sothebysrealty.fi',
    phone: '+358 (0)400 889 138',
    image: '/images/staff/petteri-huovila.jpg',
    description: '',
    flags: ['fi', 'se', 'gb']
  }
];

// Language flag components
const LanguageFlags = ({ flags }: { flags: string[] }) => {
  const flagEmojis: Record<string, string> = {
    fi: '🇫🇮',
    se: '🇸🇪',
    gb: '🇬🇧',
    de: '🇩🇪',
    fr: '🇫🇷',
    ru: '🇷🇺',
    ee: '🇪🇪',
    ir: '🇮🇷',
    tr: '🇹🇷'
  };

  return (
    <div className="flex gap-1 justify-center">
      {flags.map((flag) => (
        <span key={flag} className="text-sm opacity-60" title={flag.toUpperCase()}>
          {flagEmojis[flag] || flag}
        </span>
      ))}
    </div>
  );
};

export default function StaffPage({ params }: { params: { locale: Locale } }) {
  const t = translations[params.locale] || translations.fi;
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section with Background */}
        <section 
          className="relative h-[500px] flex items-center justify-center text-white"
          style={{
            backgroundImage: 'url(/images/content/snellman-sothebys-yritys-01.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white">
              {t.title}
            </h1>
          </div>
        </section>

        {/* Social Media Icons */}
        <section className="py-6 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-6">
              <a 
                href="https://www.facebook.com/Snellmansothebysrealty/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center
                         text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/snellman-sothebys-international-realty" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center
                         text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="mailto:info@sothebysrealty.fi"
                className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center
                         text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-light text-gray-900 mb-6 whitespace-pre-line">
                {t.intro}
              </h2>
              <p className="text-gray-700 font-light">
                {t.welcome}
              </p>
            </div>
          </div>
        </section>

        {/* Staff Grid */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* First 8 members in regular grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {staffMembers.slice(0, 8).map((member) => (
                  <div key={member.id} className="text-center">
                    {/* Photo - Responsive sizing */}
                    <div className="relative mb-3 sm:mb-4 mx-auto w-full max-w-[160px] sm:max-w-[180px] lg:max-w-[200px] aspect-[5/7]">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 200px"
                        className="object-cover grayscale"
                      />
                    </div>
                    
                    {/* Info - Responsive text */}
                    <h3 className="text-base sm:text-lg lg:text-2xl font-normal text-gray-900 mb-0.5 sm:mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-lg text-gray-600 mb-1 sm:mb-2 leading-tight">
                      {member.title}
                    </p>
                    
                    {/* Contact - Responsive text */}
                    <div className="space-y-0.5 sm:space-y-1 mb-2 sm:mb-3">
                      <a 
                        href={`tel:${member.phone.replace(/\s/g, '')}`} 
                        className="block text-xs sm:text-sm lg:text-base text-gray-700 hover:text-[#002349] transition-colors"
                      >
                        {member.phone}
                      </a>
                      <a 
                        href={`mailto:${member.email}`} 
                        className="block text-xs sm:text-sm lg:text-base text-gray-700 hover:text-[#002349] transition-colors truncate"
                      >
                        {member.email}
                      </a>
                    </div>
                    
                    {/* Language Flags */}
                    <LanguageFlags flags={member.flags} />
                  </div>
                ))}
              </div>
              
              {/* Last row centered */}
              {staffMembers.length > 8 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:justify-center gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8">
                  {staffMembers.slice(8).map((member) => (
                    <div key={member.id} className="text-center lg:w-[200px]">
                      {/* Photo - Responsive sizing */}
                      <div className="relative mb-3 sm:mb-4 mx-auto w-full max-w-[160px] sm:max-w-[180px] lg:max-w-[200px] aspect-[5/7]">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 200px"
                          className="object-cover grayscale"
                        />
                      </div>
                      
                      {/* Info - Responsive text */}
                      <h3 className="text-base sm:text-lg lg:text-2xl font-normal text-gray-900 mb-0.5 sm:mb-1">
                        {member.name}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-lg text-gray-600 mb-1 sm:mb-2 leading-tight">
                        {member.title}
                      </p>
                      
                      {/* Contact - Responsive text */}
                      <div className="space-y-0.5 sm:space-y-1 mb-2 sm:mb-3">
                        <a 
                          href={`tel:${member.phone.replace(/\s/g, '')}`} 
                          className="block text-xs sm:text-sm lg:text-base text-gray-700 hover:text-[#002349] transition-colors"
                        >
                          {member.phone}
                        </a>
                        <a 
                          href={`mailto:${member.email}`} 
                          className="block text-xs sm:text-sm lg:text-base text-gray-700 hover:text-[#002349] transition-colors truncate"
                        >
                          {member.email}
                        </a>
                      </div>
                      
                      {/* Language Flags */}
                      <LanguageFlags flags={member.flags} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>


        {/* Contact Form Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-light text-gray-900 mb-4 whitespace-pre-line">
                {t.contactTitle}
              </h2>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-8 text-gray-700 font-light">
                <div>
                  <p className="text-lg">+358 (0)10 315 6900</p>
                </div>
                <div className="hidden md:block text-gray-400">|</div>
                <div>
                  <p className="text-lg">{t.addressStreet}</p>
                  <p className="text-lg">{t.addressCity}</p>
                </div>
                <div className="hidden md:block text-gray-400">|</div>
                <div>
                  <p className="text-lg">info@sothebysrealty.fi</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto bg-gray-100 p-8 md:p-12">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      placeholder={t.formFirstName}
                      className="w-full px-4 py-3 border-0 bg-white placeholder-gray-500 font-light"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder={t.formLastName}
                      className="w-full px-4 py-3 border-0 bg-white placeholder-gray-500 font-light"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder={t.formEmail}
                      className="w-full px-4 py-3 border-0 bg-white placeholder-gray-500 font-light"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder={t.formPhone}
                      className="w-full px-4 py-3 border-0 bg-white placeholder-gray-500 font-light"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <input
                    type="text"
                    placeholder={t.formAddress}
                    className="w-full px-4 py-3 border-0 bg-white placeholder-gray-500 font-light"
                  />
                </div>
                
                <div>
                  <textarea
                    placeholder={t.formMessage}
                    rows={6}
                    className="w-full px-4 py-3 border-0 bg-white placeholder-gray-500 font-light resize-none"
                    required
                  />
                </div>
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy-staff"
                    name="privacy"
                    required
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="privacy-staff" className="text-sm font-light text-gray-700">
                    {t.formPrivacyText} <a href="#" className="text-[var(--color-primary)] underline">{t.formPrivacyLink}</a>
                  </label>
                </div>
                
                <div className="text-center">
                  <p className="text-xs font-light text-gray-600 mb-4">
                    {t.formRecaptchaText}{' '}
                    <a href="#" className="text-[var(--color-primary)] underline">{t.formRecaptchaPrivacy}</a> {t.formRecaptchaTerms &&
                     <>{' '}<a href="#" className="text-[var(--color-primary)] underline">{t.formRecaptchaTerms}</a> {t.formRecaptchaEnd}</>}
                  </p>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[var(--color-primary)] text-white hover:bg-[#0f2633] transition-colors font-light uppercase tracking-wider"
                  >
                    {t.formSubmit}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Office Location Section */}
        <section className="py-0">
          <div className="grid md:grid-cols-2">
            {/* Left Column - Office Info */}
            <div className="p-12 md:p-16" style={{ backgroundColor: '#00234A' }}>
              <h3 className="text-3xl font-light mb-6 text-white">{t.officeTitle}</h3>
              <div className="space-y-4 text-white font-light">
                <p>
                  {t.officeDesc1}
                </p>
                <p>
                  {t.officeDesc2}
                </p>
                <p>
                  {t.officeDesc3}
                </p>
                <a 
                  href="https://goo.gl/maps/LjvLpXQFdT82" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-white border border-white px-6 py-2 hover:bg-white hover:text-[#001731] transition-all"
                >
                  {t.directions} →
                </a>
              </div>
            </div>
            
            {/* Right Column - Map */}
            <div className="h-full min-h-[450px]">
              <iframe 
                loading="lazy" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.9571707835125!2d24.94553971610621!3d60.164887881959004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bc8de21e969%3A0xb98ee1b9d2531ab!2sSnellman+Sotheby's+International+Realty!5e0!3m2!1sen!2sfi!4v1549539258229" 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0, minHeight: '450px' }} 
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}