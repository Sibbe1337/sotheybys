import Image from 'next/image';
import { Link } from '@/lib/navigation';
import ContactForm from '@/components/ContactForm';
import { locales, type Locale } from '@/i18n/config';

// ✅ LINUS FIX: Static generation for all locales
export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 3600; // Revalidate every hour

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

// Staff members data - static, no need for client-side
const staffMembers = [
  {
    id: '1',
    name: 'Heidi Metsänen',
    title: 'Global Sales Coordinator, M.Sc., LKV',
    email: 'heidi@sothebysrealty.fi',
    phone: '+358 (0)50 421 0905',
    image: '/images/staff/heidi-metsanen.jpg',
    flags: ['fi', 'se', 'gb', 'fr', 'de']
  },
  {
    id: '2',
    name: 'Soile Goodall',
    title: 'Senior Broker, LKV',
    email: 'soile@sothebysrealty.fi',
    phone: '+358 (0)40 533 5533',
    image: '/images/staff/soile-goodall.jpg',
    flags: ['fi', 'gb']
  },
  {
    id: '3',
    name: 'Ali Ahola',
    title: 'Senior Broker, LKV',
    email: 'ali@sothebysrealty.fi',
    phone: '+358 (0)40 923 2561',
    image: '/images/staff/ali-ahola.jpg',
    flags: ['fi']
  },
  {
    id: '4',
    name: 'Kadri-Ann Öunap',
    title: 'Sales Associate, Notary, KED, KiAT',
    email: 'kadri-ann@sothebysrealty.fi',
    phone: '+358 (0)40 154 7844',
    image: '/images/staff/kadri-ann-ounap.jpg',
    flags: ['fi', 'gb', 'ee']
  },
  {
    id: '5',
    name: 'Linn Johanson',
    title: 'Sales & Marketing Associate',
    email: 'linn@sothebysrealty.fi',
    phone: '+358 (0)44 055 2342',
    image: '/images/staff/linn-johanson.jpg',
    flags: ['fi', 'se', 'gb']
  },
  {
    id: '6',
    name: 'Sima Shaygan',
    title: 'Sales Associate, B.Sc, KiLaT',
    email: 'sima@sothebysrealty.fi',
    phone: '+358 (0)44 239 3979',
    image: '/images/staff/sima-shaygan.jpg',
    flags: ['fi', 'gb', 'ir', 'tr']
  },
  {
    id: '7',
    name: 'Dennis Forsman',
    title: 'Sales Assistant, B.Sc.',
    email: 'dennis@sothebysrealty.fi',
    phone: '+358 (0)44 599 4407',
    image: '/images/staff/dennis-forsman.jpg',
    flags: ['fi', 'se', 'gb']
  },
  {
    id: '8',
    name: 'Johan Schröder',
    title: 'Graphic Designer',
    email: 'johan@sothebysrealty.fi',
    phone: '+358 (0)50 536 9106',
    image: '/images/staff/johan-schroder.jpg',
    flags: ['fi', 'se', 'gb']
  },
  {
    id: '9',
    name: 'Eeva Kyläkoski',
    title: 'Senior Advisor - Board Member, LKV',
    email: 'eeva@sothebysrealty.fi',
    phone: '+358 (0)46 850 5850',
    image: '/images/staff/eeva-kylakoski.jpg',
    flags: ['fi', 'gb']
  },
  {
    id: '10',
    name: 'Robert Charpentier',
    title: 'Chairman, M.Sc., LKV',
    email: 'robert@sothebysrealty.fi',
    phone: '+358 (0)400 243 011',
    image: '/images/staff/robert-charpentier.jpg',
    flags: ['fi', 'se', 'gb', 'de']
  },
  {
    id: '11',
    name: 'Petteri Huovila',
    title: 'Senior Advisor, LKV',
    email: 'petteri@sothebysrealty.fi',
    phone: '+358 (0)400 889 138',
    image: '/images/staff/petteri-huovila.jpg',
    flags: ['fi', 'se', 'gb']
  }
];

// Flag emoji mapping
const flagEmojis: Record<string, string> = {
  fi: '🇫🇮',
  se: '🇸🇪',
  gb: '🇬🇧',
  de: '🇩🇪',
  fr: '🇫🇷',
  ee: '🇪🇪',
  ir: '🇮🇷',
  tr: '🇹🇷'
};

// Translations
const translations = {
  fi: {
    heroTitle: 'Ota yhteyttä',
    privacyLabel: 'Olen tutustunut Tietosuojaselosteeseen',
    privacyLink: 'Tietosuojaseloste',
    recaptchaText: 'Tämän sivun suojaa reCAPTCHA, mikä tarkoittaa, että Googlen tietosuojakäytännöt & käyttöehdot ovat voimassa.',
    submitBtn: 'Lähetä',
    namePlaceholder: 'Nimi',
    emailPlaceholder: 'Sähköposti',
    phonePlaceholder: 'Puhelin',
    messagePlaceholder: 'Viesti',
    welcomeTitle: 'Tervetuloa onnistuneeseen asuntokauppaan!',
    welcomeText: 'Tervetuloa tapaamaan meitä, kuulemme mielellämme miten voimme palvella juuri sinua.',
    officeTitle: 'Upea toimistomme palvelee',
    officeHours: 'teitä arkisin 10:00 – 17:00',
    officeExtra: 'sekä muina aikoina sopimuksen mukaan.',
    staffTitle: 'Henkilökuntamme',
    ctaTitle: 'Jos mieleesi herää kysymyksiä, voit aina ottaa meihin yhteyttä soittamalla, lähettämällä sähköpostia tai pistäytymällä toimistollamme!',
    officeLocationTitle: 'Helsingin Toimipisteemme',
    officeLocationText1: 'Helsingin ydinkeskustassa sijaitsevassa toimistossamme tapaat joukon motivoituneita ja asiantuntevia välittäjiä, joiden päämääränä on tehdä unelmastasi totta.',
    officeLocationText2: 'Toimistoamme ympäröi dynaaminen Kaartinkaupunki muotiputiikkeineen, fine-dine-ravintoloineen sekä korkeatasoisine hotelleineen.',
    officeLocationText3: 'Kävelet toimistollemme vain muutamassa minuutissa Esplanadilta tai Senaatintorilta.',
    directionsBtn: 'REITTIOHJEET »',
    addressStreet: 'Kasarmikatu 34,',
    addressCity: '00130 Helsinki',
  },
  sv: {
    heroTitle: 'Kontakta oss',
    privacyLabel: 'Jag har bekantat mig med Privacy Policyn',
    privacyLink: 'Tietosuojaseloste',
    recaptchaText: 'Den här sidan skyddas av reCAPTCHA, vilket innebär att Googles Sekretesspolicy och Användarvillkor gäller.',
    submitBtn: 'Skicka',
    namePlaceholder: 'Förnamn',
    emailPlaceholder: 'Email',
    phonePlaceholder: 'Telefonnummer',
    messagePlaceholder: 'Meddelande',
    welcomeTitle: 'Vår dörr är alltid öppen för dig.',
    welcomeText: 'Vårt kontor ligger i kärncentrum, med både livliga Esplanaden med alla dess caféer och Finska vikens underbara vattenbryn och Senatstorget nära till hands. Titta gärna förbi och säg hej så bjuder vi på en kopp kaffe och berättar mer om oss själva.',
    officeTitle: 'Vårt högklassiga kontor',
    officeHours: 'betjänar Er på vardagar 10:00 – 17:00',
    officeExtra: 'på helgerna är vi öppna efter överenskommelse.',
    staffTitle: 'Våra medarbetare',
    ctaTitle: 'Om du har några frågor kan du alltid kontakta oss genom att ringa, skicka ett email eller med att besöka vårt kontor!',
    officeLocationTitle: 'Vårt Helsingfors kontor',
    officeLocationText1: 'Hösten 2015 börjar en ny era i Finland. Ab Snellman LKV Oy Sotheby\'s International Realty tillträder den finska marknaden och tar fastighetsförmedling till en helt ny nivå. På huvudkontoret i Finlands dynamiska huvudstad Helsingfors, sitter ett gäng inspirerade förmedlare och arbetstagare och väntar på att få förverkliga just din dröm.',
    officeLocationText2: 'Vår verksamhet sköts i huvudsak från huvudstadsregionen, men sträcker sig över hela landet.',
    officeLocationText3: 'Från Södra Finlands vackra skärgård upp till det förtrollande Lappland och allting där emellan är vårt att tillsammans erövra.',
    directionsBtn: 'Vägbeskrivning',
    addressStreet: 'Kaserngatan 34,',
    addressCity: '00130 Helsingfors',
  },
  en: {
    heroTitle: 'Contact us',
    privacyLabel: 'I have read the',
    privacyLink: 'Tietosuojaseloste',
    recaptchaText: 'This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.',
    submitBtn: 'Send',
    namePlaceholder: 'First name',
    emailPlaceholder: 'Email',
    phonePlaceholder: 'Phonenumber',
    messagePlaceholder: 'Message',
    welcomeTitle: 'Your international broker locally.',
    welcomeText: 'Our office is located right in the center of Helsinki. The lively Esplanadi with all its cafés and Senaatintori with its beautiful seashore as neighbors on Kasarmikatu 34. You are always welcome to stop by, say hello and have a cup of coffee to talk of and get inspired by the real estate market. We are happy to tell you more about ourselves and all our amazing properties for sale.',
    officeTitle: 'Our wonderful office is open',
    officeHours: 'on weekdays 10:00 – 17:00',
    officeExtra: 'as well as other times by appointment.',
    staffTitle: 'Our personnel',
    ctaTitle: 'If you have any questions, you can always contact us by calling, sending an email or stopping by our office!',
    officeLocationTitle: 'Our Helsinki Office',
    officeLocationText1: 'In 2015 a new era began in Finland. Ab Snellman LKV Oy Sotheby\'s International Realty opened its doors to the Finnish market, with goals to bring real estate to a whole new level. In the office, located in the dynamic capital Helsinki, awaits a team motivated experts ready to make your dream come true.',
    officeLocationText2: 'The office may be located in Southern Finland but our sales and operations cover the whole country.',
    officeLocationText3: 'From the beautiful archipelago up to enchanting Lapland and everything in-between is ours to conquer.',
    directionsBtn: 'Directions',
    addressStreet: 'Kasarmikatu 34,',
    addressCity: '00130 Helsinki',
  },
};

type LocaleType = 'fi' | 'sv' | 'en';

// ✅ SERVER COMPONENT - pre-rendered at build time
export default function ContactPage({ params }: { params: { locale: string } }) {
  const locale = (params.locale || 'fi') as LocaleType;
  const t = translations[locale] || translations.fi;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        
        {/* Hero Section with Contact Form */}
        <section className="relative min-h-[500px] md:min-h-[600px]">
          {/* Background Image - static */}
          <div className="absolute inset-0">
            <Image
              src="/images/content/snellman-sothebys-yritys-01.jpg"
              alt=""
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-16 flex items-center justify-center min-h-[500px] md:min-h-[600px]">
            <div className="max-w-md w-full">
              {/* Contact Form - Client Component */}
              <ContactForm translations={{
                heroTitle: t.heroTitle,
                privacyLabel: t.privacyLabel,
                privacyLink: t.privacyLink,
                recaptchaText: t.recaptchaText,
                submitBtn: t.submitBtn,
                namePlaceholder: t.namePlaceholder,
                emailPlaceholder: t.emailPlaceholder,
                phonePlaceholder: t.phonePlaceholder,
                messagePlaceholder: t.messagePlaceholder,
              }} />
            </div>
          </div>
        </section>

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

        {/* Welcome Section - static */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                {t.welcomeTitle}
              </h2>
              <p className="text-sm text-gray-600 font-light mb-6">
                {t.welcomeText}
              </p>
              <div className="text-gray-600 font-light text-sm">
                <p className="mb-1">{t.officeTitle}</p>
                <p className="mb-1">{t.officeHours}</p>
                <p>{t.officeExtra}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Staff Section - static */}
        <section className="py-12 lg:py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-10 lg:mb-16 text-center">
              {t.staffTitle}
            </h2>
            
            <div className="max-w-7xl mx-auto">
              {/* First 8 members in regular grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                {staffMembers.slice(0, 8).map((member) => (
                <div key={member.id} className="text-center">
                    {/* Photo - Larger responsive sizing */}
                    <div className="relative mb-4 mx-auto w-full max-w-[160px] sm:max-w-[180px] lg:max-w-[200px] aspect-[5/7]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                        sizes="(max-width: 640px) 160px, (max-width: 1024px) 180px, 200px"
                      className="object-cover object-top grayscale"
                    />
                  </div>
                  
                  {/* Flags */}
                  <div className="flex gap-1 justify-center mb-2">
                    {member.flags.map((flag) => (
                        <span key={flag} className="text-base">{flagEmojis[flag]}</span>
                    ))}
                  </div>
                  
                  {/* Name */}
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  
                  {/* Title */}
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 leading-tight">
                    {member.title}
                  </p>
                  
                  {/* Phone */}
                    <a 
                      href={`tel:${member.phone.replace(/\s/g, '')}`}
                      className="block text-xs sm:text-sm text-gray-600 hover:text-[#002349] transition-colors mb-1"
                    >
                    {member.phone}
                    </a>
                  
                  {/* Email */}
                  <a 
                    href={`mailto:${member.email}`}
                      className="text-xs sm:text-sm text-gray-600 hover:text-[#002349] transition-colors"
                    >
                      {member.email}
                    </a>
                  </div>
                ))}
              </div>
              
              {/* Last row centered (remaining 3 members) */}
              {staffMembers.length > 8 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:justify-center gap-6 sm:gap-8 lg:gap-10 mt-8 lg:mt-12">
                  {staffMembers.slice(8).map((member) => (
                    <div key={member.id} className="text-center lg:w-[200px]">
                      {/* Photo - Larger responsive sizing */}
                      <div className="relative mb-4 mx-auto w-full max-w-[160px] sm:max-w-[180px] lg:max-w-[200px] aspect-[5/7]">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="(max-width: 640px) 160px, (max-width: 1024px) 180px, 200px"
                          className="object-cover object-top grayscale"
                        />
                      </div>
                      
                      {/* Flags */}
                      <div className="flex gap-1 justify-center mb-2">
                        {member.flags.map((flag) => (
                          <span key={flag} className="text-base">{flagEmojis[flag]}</span>
                        ))}
                      </div>
                      
                      {/* Name */}
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      
                      {/* Title */}
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 leading-tight">
                        {member.title}
                      </p>
                      
                      {/* Phone */}
                      <a 
                        href={`tel:${member.phone.replace(/\s/g, '')}`}
                        className="block text-xs sm:text-sm text-gray-600 hover:text-[#002349] transition-colors mb-1"
                      >
                        {member.phone}
                      </a>
                      
                      {/* Email */}
                      <a 
                        href={`mailto:${member.email}`}
                        className="text-xs sm:text-sm text-gray-600 hover:text-[#002349] transition-colors"
                  >
                    {member.email}
                  </a>
                </div>
              ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact CTA Section - static */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-gray-700 font-light italic mb-8">
                {t.ctaTitle}
              </p>
              
              {/* Contact Info Bar */}
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm text-gray-700">
                <a href="tel:+358103156900" className="hover:text-[#002349] transition-colors">
                  +358 (0)10 315 6900
                </a>
                <span className="hidden md:inline text-gray-300">|</span>
                <span>{t.addressStreet}<br className="md:hidden" /> {t.addressCity}</span>
                <span className="hidden md:inline text-gray-300">|</span>
                <a href="mailto:info@sothebysrealty.fi" className="hover:text-[#002349] transition-colors">
                  info@sothebysrealty.fi
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Office Location Section with Map - same as henkilosto page */}
        <section className="py-0">
          <div className="grid md:grid-cols-2">
            {/* Left Column - Office Info with background image */}
            <div className="relative p-12 md:p-16 min-h-[450px] flex flex-col justify-center">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src="/images/content/snellman-sothebys-yritys.jpg"
                  alt=""
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-[#00234A]/80"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <h3 className="text-3xl font-light mb-6 text-white">{t.officeLocationTitle}</h3>
                <div className="space-y-4 text-white font-light">
                  <p>{t.officeLocationText1}</p>
                  <p>{t.officeLocationText2}</p>
                  <p>{t.officeLocationText3}</p>
                </div>
                <a 
                  href="https://goo.gl/maps/LjvLpXQFdT82" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-6 text-white border border-white px-6 py-2 hover:bg-white hover:text-[#001731] transition-all uppercase tracking-wider text-sm"
                >
                  {t.directionsBtn}
                </a>
              </div>
            </div>
            
            {/* Right Column - Google Map */}
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
