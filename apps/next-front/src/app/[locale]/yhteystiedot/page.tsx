'use client';

import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { useState } from 'react';

// Staff members data
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
    name: 'Kadri-Ann Õunap',
    title: 'Sales Associate, Notary, KED, KiAT',
    email: 'kadri-ann@sothebysrealty.fi',
    phone: '+358 (0)40 154 7844',
    image: '/images/staff/kadri-ann-ounap.jpg',
    flags: ['fi', 'gb', 'ee']
  },
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
    ee: '🇪🇪',
    ir: '🇮🇷',
    tr: '🇹🇷'
  };

  return (
    <div className="flex gap-1 justify-center mb-2">
      {flags.map((flag) => (
        <span key={flag} className="text-sm">{flagEmojis[flag]}</span>
      ))}
    </div>
  );
};

// Translations
const translations = {
  fi: {
    heroTitle: 'Ota yhteyttä',
    privacyLabel: 'Olen tutustunut Tietosuojaselosteeseen',
    privacyLink: 'Tietosuojaseloste',
    recaptchaText: 'Tämän sivun suojaa reCAPTCHA, mikä tarkoittaa, että Googlen tietosuojakäytännöt & käyttöehdot ovat voimassa.',
    submitBtn: 'Lähetä',
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
  },
  sv: {
    heroTitle: 'Kontakta oss',
    privacyLabel: 'Jag har läst integritetspolicyn',
    privacyLink: 'Integritetspolicy',
    recaptchaText: 'Denna sida skyddas av reCAPTCHA, vilket innebär att Googles integritetspolicy och användarvillkor gäller.',
    submitBtn: 'Skicka',
    welcomeTitle: 'Välkommen till en framgångsrik bostadsaffär!',
    welcomeText: 'Välkommen att träffa oss, vi hör gärna hur vi kan betjäna just dig.',
    officeTitle: 'Vårt fantastiska kontor betjänar',
    officeHours: 'er vardagar 10:00 – 17:00',
    officeExtra: 'samt övriga tider enligt överenskommelse.',
    staffTitle: 'Vår personal',
    ctaTitle: 'Om du har frågor kan du alltid kontakta oss genom att ringa, skicka e-post eller besöka vårt kontor!',
    officeLocationTitle: 'Vårt kontor i Helsingfors',
    officeLocationText1: 'På vårt kontor i centrala Helsingfors möter du ett team av motiverade och kunniga mäklare vars mål är att göra din dröm till verklighet.',
    officeLocationText2: 'Vårt kontor omges av det dynamiska Kaserntorget med modebutiker, fine dining-restauranger och högklassiga hotell.',
    officeLocationText3: 'Du går till vårt kontor på bara några minuter från Esplanaden eller Senatstorget.',
    directionsBtn: 'VÄGBESKRIVNING »',
  },
  en: {
    heroTitle: 'Contact us',
    privacyLabel: 'I have read the Privacy Policy',
    privacyLink: 'Privacy Policy',
    recaptchaText: 'This page is protected by reCAPTCHA, which means Google\'s privacy policy and terms of service apply.',
    submitBtn: 'Send',
    welcomeTitle: 'Welcome to a successful property transaction!',
    welcomeText: 'Welcome to meet us, we would love to hear how we can serve you.',
    officeTitle: 'Our beautiful office serves',
    officeHours: 'you on weekdays 10:00 – 17:00',
    officeExtra: 'and at other times by appointment.',
    staffTitle: 'Our Staff',
    ctaTitle: 'If you have any questions, you can always contact us by calling, sending an email, or stopping by our office!',
    officeLocationTitle: 'Our Helsinki Office',
    officeLocationText1: 'At our office in central Helsinki, you will meet a team of motivated and knowledgeable brokers whose goal is to make your dream come true.',
    officeLocationText2: 'Our office is surrounded by the dynamic Kaartinkaupunki with fashion boutiques, fine-dining restaurants, and high-end hotels.',
    officeLocationText3: 'You can walk to our office in just a few minutes from the Esplanade or Senate Square.',
    directionsBtn: 'DIRECTIONS »',
  },
};

type Locale = 'fi' | 'sv' | 'en';

export default function ContactPage({ params }: { params: { locale: string } }) {
  const locale = (params.locale || 'fi') as Locale;
  const t = translations[locale] || translations.fi;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    privacy: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        
        {/* Hero Section with Contact Form */}
        <section className="relative min-h-[500px] md:min-h-[600px]">
          {/* Background Image */}
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
          <div className="relative z-10 container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto md:ml-auto md:mr-16">
              {/* Contact Form Card */}
              <div className="bg-white/95 backdrop-blur-sm p-8 shadow-lg">
                <h1 className="text-2xl font-light text-gray-900 mb-6 text-center">
                  {t.heroTitle}
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nimi / Name"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-[#002349] focus:outline-none text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder="Sähköposti / Email"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-[#002349] focus:outline-none text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <input
                    type="tel"
                    placeholder="Puhelin / Phone"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-[#002349] focus:outline-none text-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <textarea
                    placeholder="Viesti / Message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-[#002349] focus:outline-none text-sm resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                  
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="privacy"
                      className="mt-1"
                      checked={formData.privacy}
                      onChange={(e) => setFormData({...formData, privacy: e.target.checked})}
                    />
                    <label htmlFor="privacy" className="text-xs text-gray-600">
                      {t.privacyLabel} <a href="#" className="text-[#002349] underline">{t.privacyLink}</a>
                    </label>
                  </div>
                  
                  <p className="text-[10px] text-gray-500 leading-tight">
                    {t.recaptchaText}
                  </p>
                  
                  <button
                    type="submit"
                    className="w-full bg-[#002349] text-white py-3 hover:bg-[#001731] transition-colors text-sm uppercase tracking-wider"
                  >
                    {t.submitBtn}
                  </button>
                </form>
              </div>
            </div>
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

        {/* Welcome Section */}
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

        {/* Staff Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-light text-gray-900 mb-10 text-center">
              {t.staffTitle}
            </h2>
            
            {/* Staff Grid - 4 columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {staffMembers.map((member) => (
                <div key={member.id} className="text-center">
                  {/* Photo */}
                  <div className="relative w-32 h-40 mx-auto mb-3 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top grayscale"
                    />
                  </div>
                  
                  {/* Flags */}
                  <LanguageFlags flags={member.flags} />
                  
                  {/* Name */}
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  
                  {/* Title */}
                  <p className="text-xs text-gray-600 mb-2 leading-tight">
                    {member.title}
                  </p>
                  
                  {/* Phone */}
                  <p className="text-xs text-gray-600 mb-1">
                    {member.phone}
                  </p>
                  
                  {/* Email */}
                  <a 
                    href={`mailto:${member.email}`}
                    className="text-xs text-gray-600 hover:text-[#002349] transition-colors"
                  >
                    {member.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
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
                <span>Kasarmikatu 34,<br className="md:hidden" /> 00130 Helsinki</span>
                <span className="hidden md:inline text-gray-300">|</span>
                <a href="mailto:info@sothebysrealty.fi" className="hover:text-[#002349] transition-colors">
                  info@sothebysrealty.fi
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Office Location Section */}
        <section className="relative py-20 bg-[#001731] text-white">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/content/snellman-sothebys-yritys.jpg"
              alt=""
              fill
              className="object-cover object-center opacity-40"
            />
          </div>
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-light mb-6">
                {t.officeLocationTitle}
              </h2>
              <div className="space-y-4 text-sm font-light leading-relaxed text-white/90 mb-8">
                <p>{t.officeLocationText1}</p>
                <p>{t.officeLocationText2}</p>
                <p>{t.officeLocationText3}</p>
              </div>
              <a
                href="https://www.google.com/maps/dir//Kasarmikatu+34,+00130+Helsinki"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-white text-white px-6 py-2 hover:bg-white hover:text-[#001731] transition-all text-sm uppercase tracking-wider"
              >
                {t.directionsBtn}
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
