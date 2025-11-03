import Image from 'next/image';
import { locales, type Locale } from '@/i18n/config';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

// 🔥 LINUS FIX: Complete translations for Contact page
const translations = {
  fi: {
    title: 'Ota yhteyttä',
    subtitle: 'Olemme täällä sinua varten',
    formTitle: 'Lähetä viesti',
    firstName: 'Etunimi *',
    lastName: 'Sukunimi *',
    email: 'Sähköposti *',
    phone: 'Puhelin',
    subject: 'Aihe',
    selectSubject: 'Valitse aihe',
    buying: 'Olen ostamassa',
    selling: 'Olen myymässä',
    renting: 'Olen vuokraamassa',
    valuation: 'Arviokäynti',
    other: 'Muu asia',
    message: 'Viesti *',
    privacy: 'Olen tutustunut tietosuojaselosteeseen ja hyväksyn tietojeni käsittelyn *',
    submit: 'Lähetä viesti',
    contactInfoTitle: 'Yhteystiedot',
    officeTitle: 'Toimisto',
    hoursTitle: 'Aukioloajat',
    weekdays: 'Arkisin: 10:00 – 17:00',
    saturday: 'Lauantai: Sopimuksen mukaan',
    sunday: 'Sunnuntai: Suljettu',
    companyTitle: 'Yritystiedot',
    companyName: 'Ab Snellman LKV Oy',
    businessId: 'Y-tunnus: 2644749-2',
    mapLabel: 'Kartta',
    officeImageTitle: 'Tervetuloa toimistollemme',
    officeImageSubtitle: 'Upea toimistomme sijaitsee Helsingin ydinkeskustassa Kasarmikadulla',
    officeImageAlt: 'Snellman Sotheby\'s toimisto',
  },
  sv: {
    title: 'Kontakta oss',
    subtitle: 'Vi är här för dig',
    formTitle: 'Skicka meddelande',
    firstName: 'Förnamn *',
    lastName: 'Efternamn *',
    email: 'E-post *',
    phone: 'Telefon',
    subject: 'Ämne',
    selectSubject: 'Välj ämne',
    buying: 'Jag köper',
    selling: 'Jag säljer',
    renting: 'Jag hyr',
    valuation: 'Värderingsbesök',
    other: 'Annat ärende',
    message: 'Meddelande *',
    privacy: 'Jag har läst integritetspolicyn och godkänner hanteringen av mina uppgifter *',
    submit: 'Skicka meddelande',
    contactInfoTitle: 'Kontaktuppgifter',
    officeTitle: 'Kontor',
    hoursTitle: 'Öppettider',
    weekdays: 'Vardagar: 10:00 – 17:00',
    saturday: 'Lördag: Enligt överenskommelse',
    sunday: 'Söndag: Stängt',
    companyTitle: 'Företagsinformation',
    companyName: 'Ab Snellman LKV Oy',
    businessId: 'FO-nummer: 2644749-2',
    mapLabel: 'Karta',
    officeImageTitle: 'Välkommen till vårt kontor',
    officeImageSubtitle: 'Vårt fantastiska kontor ligger i Helsingfors centrum på Kaserngatan',
    officeImageAlt: 'Snellman Sotheby\'s kontor',
  },
  en: {
    title: 'Contact Us',
    subtitle: 'We are here for you',
    formTitle: 'Send Message',
    firstName: 'First Name *',
    lastName: 'Last Name *',
    email: 'Email *',
    phone: 'Phone',
    subject: 'Subject',
    selectSubject: 'Select subject',
    buying: 'I am buying',
    selling: 'I am selling',
    renting: 'I am renting',
    valuation: 'Valuation visit',
    other: 'Other matter',
    message: 'Message *',
    privacy: 'I have read the privacy policy and accept the processing of my data *',
    submit: 'Send message',
    contactInfoTitle: 'Contact Information',
    officeTitle: 'Office',
    hoursTitle: 'Opening Hours',
    weekdays: 'Weekdays: 10:00 – 17:00',
    saturday: 'Saturday: By appointment',
    sunday: 'Sunday: Closed',
    companyTitle: 'Company Information',
    companyName: 'Ab Snellman LKV Oy',
    businessId: 'Business ID: 2644749-2',
    mapLabel: 'Map',
    officeImageTitle: 'Welcome to our office',
    officeImageSubtitle: 'Our beautiful office is located in the heart of Helsinki on Kasarmikatu',
    officeImageAlt: 'Snellman Sotheby\'s office',
  },
};

export default function ContactPage({ params }: { params: { locale: Locale } }) {
  const t = translations[params.locale] || translations.fi;
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-6">
                {t.title}
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-light">
                {t.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <h2 className="text-2xl font-light text-gray-900 mb-8">
                    {t.formTitle}
                  </h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-light text-gray-700 mb-2">
                          {t.firstName}
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:border-[#1a3a4a] font-light"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-light text-gray-700 mb-2">
                          {t.lastName}
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:border-[#1a3a4a] font-light"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
                        {t.email}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:border-[#1a3a4a] font-light"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-light text-gray-700 mb-2">
                        {t.phone}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:border-[#1a3a4a] font-light"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-light text-gray-700 mb-2">
                        {t.subject}
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:border-[#1a3a4a] font-light"
                      >
                        <option value="">{t.selectSubject}</option>
                        <option value="buying">{t.buying}</option>
                        <option value="selling">{t.selling}</option>
                        <option value="renting">{t.renting}</option>
                        <option value="valuation">{t.valuation}</option>
                        <option value="other">{t.other}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-light text-gray-700 mb-2">
                        {t.message}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:border-[#1a3a4a] font-light resize-none"
                      />
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="privacy"
                        name="privacy"
                        required
                        className="mt-1 mr-3"
                      />
                      <label htmlFor="privacy" className="text-sm font-light text-gray-700">
                        {t.privacy}
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full md:w-auto px-8 py-4 bg-[#1a3a4a] text-white 
                               hover:bg-[#0f2633] transition-colors duration-300 
                               font-light tracking-wider uppercase text-sm"
                    >
                      {t.submit}
                    </button>
                  </form>
                </div>

                {/* Contact Information */}
                <div className="lg:pl-12">
                  <h2 className="text-2xl font-light text-gray-900 mb-8">
                    {t.contactInfoTitle}
                  </h2>
                  
                  <div className="space-y-8">
                    {/* Office Info */}
                    <div>
                      <h3 className="text-lg font-light text-gray-900 mb-4">
                        {t.officeTitle}
                      </h3>
                      <div className="space-y-2 text-gray-700 font-light">
                        <p>Kasarmikatu 34, 00130 Helsinki</p>
                        <p className="mt-4">
                          <a href="tel:+358103156900" className="text-[#1a3a4a] hover:text-[#0f2633] transition-colors">
                            +358 (0)10 315 6900
                          </a>
                        </p>
                        <p>
                          <a href="mailto:info@sothebysrealty.fi" className="text-[#1a3a4a] hover:text-[#0f2633] transition-colors">
                            info@sothebysrealty.fi
                          </a>
                        </p>
                      </div>
                    </div>

                    {/* Opening Hours */}
                    <div>
                      <h3 className="text-lg font-light text-gray-900 mb-4">
                        {t.hoursTitle}
                      </h3>
                      <div className="space-y-2 text-gray-700 font-light">
                        <p>{t.weekdays}</p>
                        <p>{t.saturday}</p>
                        <p>{t.sunday}</p>
                      </div>
                    </div>

                    {/* Company Info */}
                    <div>
                      <h3 className="text-lg font-light text-gray-900 mb-4">
                        {t.companyTitle}
                      </h3>
                      <div className="space-y-2 text-gray-700 font-light">
                        <p>{t.companyName}</p>
                        <p>{t.businessId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="mt-12">
                    <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 font-light">{t.mapLabel}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Image Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-gray-900 mb-4">
                  {t.officeImageTitle}
                </h2>
                <p className="text-lg text-gray-600 font-light">
                  {t.officeImageSubtitle}
                </p>
              </div>
              <div className="relative h-96 lg:h-[500px]">
                <Image
                  src="/images/content/snellman-sothebys-toimisto.jpg"
                  alt={t.officeImageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>    </div>
  );
}
