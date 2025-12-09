import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { locales, type Locale } from '@/i18n/config';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

// Complete staff data matching original site - 4 columns, 3 rows
const staffMembers = [
  // Row 1
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
    name: 'Kadri-Ann Õunap',
    title: 'Sales Associate, Notary, KED, KiAT',
    email: 'kadri-ann@sothebysrealty.fi',
    phone: '+358 (0)40 154 7844',
    image: '/images/staff/kadri-ann-ounap.jpg',
    flags: ['fi', 'gb', 'ee']
  },
  // Row 2
  {
    id: '5',
    name: 'Tea Käyhkö',
    title: 'Senior Broker, BA, MA, LKV',
    email: 'tea@sothebysrealty.fi',
    phone: '+358 (0)50 370 1893',
    image: '/images/staff/tea-kayhko.jpg',
    flags: ['fi', 'se', 'gb']
  },
  {
    id: '6',
    name: 'Sima Shaygan',
    title: 'Sales Associate, B.Sc, KiLaT',
    email: 'sima@sothebysrealty.fi',
    phone: '+358 (0)44 235 3979',
    image: '/images/staff/sima-shaygan.jpg',
    flags: ['fi', 'gb', 'ir', 'tr']
  },
  {
    id: '7',
    name: 'Dennis Forsman',
    title: 'Sales Assistant, B.Sc.',
    email: 'dennis@sothebysrealty.fi',
    phone: '+358 (0)44 999 4407',
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
  // Row 3
  {
    id: '9',
    name: 'Eeva Kyläkoski',
    title: 'Senior Advisor - Board Member, LKV',
    email: 'eeva@sothebysrealty.fi',
    phone: '+358 (0)40 861 4611',
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
    phone: '+358 (0)400 484 138',
    image: '/images/staff/petteri-huovila.jpg',
    flags: ['fi', 'se', 'gb']
  },
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
    <div className="flex gap-1 justify-center mb-2">
      {flags.map((flag) => (
        <span key={flag} className="text-sm" title={flag.toUpperCase()}>
          {flagEmojis[flag] || flag}
        </span>
      ))}
    </div>
  );
};

// Translations
const translations = {
  fi: {
    title: 'Ota yhteyttä',
    firstName: 'Etunimi',
    lastName: 'Sukunimi',
    email: 'Sähköposti',
    phone: 'Puhelin',
    message: 'Viesti',
    privacy: 'Olen tutustunut Tietosuojaselosteeseen',
    privacyLink: 'Tietosuojaseloste',
    recaptcha: 'Tämän sivun suojaa reCAPTCHA, mikä tarkoittaa, että Googlen tietosuojakäytännöt & käyttöehdot ovat voimassa.',
    submit: 'Lähetä',
    welcomeTitle: 'Tervetuloa onnistuneeseen asuntokauppaan!',
    welcomeText: 'Tervetuloa tapaamaan meitä, kuulemme mielellämme miten voimme palvella juuri sinua.',
    officeHoursTitle: 'Upea toimistomme palvelee',
    officeHours: 'teitä arkisin 10:00 – 17:00',
    officeHoursExtra: 'sekä muina aikoina sopimuksen mukaan.',
    staffTitle: 'Henkilökuntamme',
    ctaTitle: 'Jos mieleesi herää kysymyksiä, voit aina ottaa meihin yhteyttä soittamalla, lähettämällä sähköpostia tai pistäytymällä toimistollamme!',
    officeTitle: 'Helsingin Toimipisteemme',
    officeText1: 'Helsingin ydinkeskustassa sijaitsevassa toimistossamme tapaat joukon motivoituneita ja asiantuntevia välittäjiä, joiden päämääränä on tehdä unelmastasi totta.',
    officeText2: 'Toimistoamme ympäröi dynaaminen Kaartinkaupunki muotiputiikkeineen, fine-dine-ravintoloineen sekä korkeatasoisine hotelleineen.',
    officeText3: 'Kävelet toimistollemme vain muutamassa minuutissa Esplanadilta tai Senaatintorilta.',
    directions: 'Reittiohjeet',
  },
  sv: {
    title: 'Kontakta oss',
    firstName: 'Förnamn',
    lastName: 'Efternamn',
    email: 'E-post',
    phone: 'Telefon',
    message: 'Meddelande',
    privacy: 'Jag har läst integritetspolicyn',
    privacyLink: 'Integritetspolicy',
    recaptcha: 'Denna sida skyddas av reCAPTCHA, vilket innebär att Googles integritetspolicy och användarvillkor gäller.',
    submit: 'Skicka',
    welcomeTitle: 'Välkommen till en framgångsrik bostadsaffär!',
    welcomeText: 'Välkommen att träffa oss, vi hör gärna hur vi kan tjäna dig.',
    officeHoursTitle: 'Vårt fantastiska kontor betjänar',
    officeHours: 'er vardagar 10:00 – 17:00',
    officeHoursExtra: 'samt övriga tider enligt överenskommelse.',
    staffTitle: 'Vår personal',
    ctaTitle: 'Om du har frågor kan du alltid kontakta oss genom att ringa, skicka e-post eller besöka vårt kontor!',
    officeTitle: 'Vårt kontor i Helsingfors',
    officeText1: 'I vårt kontor i centrala Helsingfors träffar du ett gäng motiverade och kunniga mäklare vars mål är att göra din dröm till verklighet.',
    officeText2: 'Vårt kontor omges av den dynamiska Gardesstaden med modebutiker, fine dining-restauranger och högklassiga hotell.',
    officeText3: 'Du går till vårt kontor på bara några minuter från Esplanaden eller Senatstorget.',
    directions: 'Vägbeskrivning',
  },
  en: {
    title: 'Contact Us',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    privacy: 'I have read the Privacy Policy',
    privacyLink: 'Privacy Policy',
    recaptcha: 'This page is protected by reCAPTCHA, which means Google\'s privacy policy and terms of service apply.',
    submit: 'Send',
    welcomeTitle: 'Welcome to a successful property transaction!',
    welcomeText: 'Welcome to meet us, we are happy to hear how we can serve you.',
    officeHoursTitle: 'Our beautiful office serves',
    officeHours: 'you on weekdays 10:00 – 17:00',
    officeHoursExtra: 'and at other times by appointment.',
    staffTitle: 'Our Staff',
    ctaTitle: 'If you have any questions, you can always contact us by calling, sending an email or visiting our office!',
    officeTitle: 'Our Helsinki Office',
    officeText1: 'In our office in central Helsinki, you will meet a group of motivated and knowledgeable agents whose goal is to make your dream come true.',
    officeText2: 'Our office is surrounded by the dynamic Kaartinkaupunki district with fashion boutiques, fine dining restaurants and high-class hotels.',
    officeText3: 'You can walk to our office in just a few minutes from Esplanadi or Senate Square.',
    directions: 'Directions',
  },
};

export default function ContactPage({ params }: { params: { locale: Locale } }) {
  const t = translations[params.locale] || translations.fi;
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section with Contact Form Overlay */}
        <section className="relative min-h-[500px] md:min-h-[600px]">
          {/* Background Image - Office interior, centered to show desk and painting */}
          <div className="absolute inset-0">
            <Image
              src="/images/content/snellman-sothebys-toimisto.jpg"
              alt="Snellman Sotheby's Office"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-5xl font-light text-white text-center mb-12">
              {t.title}
            </h1>

            {/* Contact Form Card */}
            <div className="max-w-xl mx-auto bg-white p-8 shadow-lg">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t.firstName}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#002349] font-light text-sm"
                  />
                  <input
                    type="text"
                    placeholder={t.lastName}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#002349] font-light text-sm"
                  />
                </div>
                <input
                  type="email"
                  placeholder={t.email}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#002349] font-light text-sm"
                />
                <input
                  type="tel"
                  placeholder={t.phone}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#002349] font-light text-sm"
                />
                <textarea
                  placeholder={t.message}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#002349] font-light text-sm resize-none"
                />
                
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="privacy" className="mt-1" />
                  <label htmlFor="privacy" className="text-xs text-gray-600">
                    {t.privacy} <a href="#" className="text-[#002349] underline">{t.privacyLink}</a>
                  </label>
                </div>

                <p className="text-xs text-gray-500">
                  {t.recaptcha}
                </p>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#8e740b] text-white font-medium hover:bg-[#6d5708] transition-colors"
                >
                  {t.submit}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Social Icons */}
        <section className="py-8 bg-white">
          <div className="flex justify-center gap-4">
            <a 
              href="https://www.facebook.com/snellmansothebysrealty" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#002349] hover:text-[#002349] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/company/snellman-sotheby-s-international-realty" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#002349] hover:text-[#002349] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a 
              href="mailto:info@sothebysrealty.fi"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#002349] hover:text-[#002349] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
                {t.welcomeTitle}
              </h2>
              <p className="text-gray-600 font-light mb-6">
                {t.welcomeText}
              </p>
              <div className="text-gray-600 font-light">
                <p className="mb-1">{t.officeHoursTitle}</p>
                <p className="mb-1">{t.officeHours}</p>
                <p>{t.officeHoursExtra}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Staff Section - 4 columns like original */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 text-center mb-12">
              {t.staffTitle}
            </h2>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {staffMembers.map((member) => (
                  <div key={member.id} className="text-center">
                    {/* Photo */}
                    <div className="relative w-full aspect-[3/4] mb-4 mx-auto max-w-[180px]">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="180px"
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    
                    {/* Language Flags */}
                    <LanguageFlags flags={member.flags} />
                    
                    {/* Name */}
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    
                    {/* Title */}
                    <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                      {member.title}
                    </p>
                    
                    {/* Phone */}
                    <a 
                      href={`tel:${member.phone.replace(/\s/g, '')}`}
                      className="block text-xs text-gray-600 hover:text-[#002349] transition-colors mb-1"
                    >
                      {member.phone}
                    </a>
                    
                    {/* Email */}
                    <a 
                      href={`mailto:${member.email}`}
                      className="block text-xs text-gray-600 hover:text-[#002349] transition-colors"
                    >
                      {member.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-12 bg-white border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg md:text-xl font-light text-gray-700 italic mb-8">
                {t.ctaTitle}
              </p>
              
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm text-gray-600">
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
          </div>
        </section>

        {/* Office Location Section - Dark blue background */}
        <section className="relative py-16 text-white">
          {/* Background Image - Office interior centered */}
          <div className="absolute inset-0">
            <Image
              src="/images/content/snellman-sothebys-toimisto.jpg"
              alt="Helsinki Office"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#001731]/85"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-light mb-8">
                {t.officeTitle}
              </h3>
              <div className="space-y-4 font-light leading-relaxed text-white/90">
                <p>{t.officeText1}</p>
                <p>{t.officeText2}</p>
                <p>{t.officeText3}</p>
              </div>
              <a 
                href="https://goo.gl/maps/LjvLpXQFdT82" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-8 border border-white text-white px-6 py-2 hover:bg-white hover:text-[#001731] transition-all uppercase text-sm tracking-wider"
              >
                {t.directions} →
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
