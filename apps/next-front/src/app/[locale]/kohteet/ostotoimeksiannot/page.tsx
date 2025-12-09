import { Link } from '@/lib/navigation';
import { locales, type Locale } from '@/i18n/config';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

// 🔥 LINUS FIX: Translations for Purchase Assignments page
const translations = {
  fi: {
    heroTitle: 'Asiakkaamme etsii',
    videoPrivate: 'Tämä video on yksityinen',
    ctaBtn: 'KATSO NYKYISET OSTOTOIMEKSIANNOT »',
    mainTitle: 'Ostotoimeksiannot',
    mainText: 'Asiakkaamme, eli ostaja, maksaa täyden välityspalkkion. Oletko harkinnut kotisi myyntiä?',
    contactText: 'Jos sinulla on kysyttävää, voit aina ottaa meihin yhteyttä soittamalla, lähettämällä sähköpostia tai käymällä toimistollamme!',
    officeTitle: 'Helsingin toimistomme',
    officeText: 'Vuonna 2015 alkoi uusi aikakausi Suomessa. Ab Snellman LKV Oy Sotheby\'s International Realty avasi ovensa suomalaisille markkinoille tavoitteenaan nostaa kiinteistönvälitys aivan uudelle tasolle. Dynaamisessa pääkaupungissa Helsingissä sijaitsevassa toimistossa odottaa motivoitunut asiantuntijatiimi, joka on valmis toteuttamaan unelmasi. Vaikka toimisto sijaitsee Etelä-Suomessa, myyntimme ja toimintamme kattavat koko maan. Kauniista saaristosta lumovaan Lappiin ja kaikkea siltä väliltä.',
    directionsBtn: 'REITTIOHJEET »',
  },
  sv: {
    heroTitle: 'Vår kund söker',
    videoPrivate: 'Denna video är privat',
    ctaBtn: 'SE AKTUELLA KÖPUPPDRAG »',
    mainTitle: 'Köpuppdrag',
    mainText: 'Vår kund, det vill säga köparen, betalar full förmedlingsavgift. Har du övervägt att sälja ditt hem?',
    contactText: 'Om du har frågor kan du alltid kontakta oss genom att ringa, skicka e-post eller besöka vårt kontor!',
    officeTitle: 'Vårt kontor i Helsingfors',
    officeText: 'År 2015 började en ny era i Finland. Ab Snellman LKV Oy Sotheby\'s International Realty öppnade sina dörrar för den finska marknaden med målet att lyfta fastighetsförmedling till en helt ny nivå. I det dynamiska huvudstaden Helsingfors väntar ett motiverat expertteam som är redo att förverkliga dina drömmar. Även om kontoret ligger i södra Finland täcker vår försäljning och verksamhet hela landet. Från den vackra skärgården till förtrollande Lappland och allt däremellan.',
    directionsBtn: 'VÄGBESKRIVNING »',
  },
  en: {
    heroTitle: 'Our client is looking',
    videoPrivate: 'This video is private',
    ctaBtn: 'SEE CURRENT PURCHASE ASSIGNMENTS »',
    mainTitle: 'Purchase Assignments',
    mainText: 'Our client, i.e. the buyer, pays the full brokerage fee. Have you considered selling your home?',
    contactText: 'If you have any questions, you can always contact us by calling, sending an email or visiting our office!',
    officeTitle: 'Our Helsinki office',
    officeText: 'In 2015, a new era began in Finland. Ab Snellman LKV Oy Sotheby\'s International Realty opened its doors to the Finnish market with the aim of raising real estate brokerage to a whole new level. In the dynamic capital city of Helsinki, a motivated team of experts awaits, ready to make your dreams come true. Although the office is located in Southern Finland, our sales and operations cover the entire country. From the beautiful archipelago to enchanting Lapland and everything in between.',
    directionsBtn: 'DIRECTIONS »',
  },
};

export default function PurchaseAssignmentsPage({ params }: { params: { locale: Locale } }) {
  const t = translations[params.locale] || translations.fi;
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Video Section */}
        <section className="relative bg-[#3a3a3a] text-white py-32 lg:py-40">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-light mb-8" style={{ color: '#c9a961' }}>
                {t.heroTitle}
              </h1>
              
              {/* Video Placeholder */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="relative bg-[#2a2a2a] rounded-lg overflow-hidden" style={{ paddingBottom: '40%' }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-white/80 flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold">!</span>
                    </div>
                    <p className="text-white text-lg">{t.videoPrivate}</p>
                  </div>
                </div>
              </div>
              
              <Link
                href="/yhteystiedot"
                className="inline-block border-2 border-[#c9a961] text-[#c9a961] px-8 py-3 
                         hover:bg-[#c9a961] hover:text-white transition-all duration-300 
                         uppercase tracking-wider text-sm font-light"
              >
                {t.ctaBtn}
              </Link>
            </div>
          </div>
        </section>

        {/* Social Share & Title */}
        <section className="py-12 bg-white">
          <div className="max-w-[1400px] mx-auto px-6">
            {/* Social Icons */}
            <div className="flex justify-center gap-4 mb-12">
              <a href="https://www.facebook.com/SnellmanSIR/" target="_blank" rel="noopener noreferrer"
                 className="w-12 h-12 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] 
                          flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/snellman-sotheby's-international-realty/" target="_blank" rel="noopener noreferrer"
                 className="w-12 h-12 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] 
                          flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="mailto:info@sothebysrealty.fi"
                 className="w-12 h-12 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] 
                          flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </a>
            </div>

            {/* Title & Description */}
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-8">
                {t.mainTitle}
              </h2>
              <p className="text-xl text-gray-700 font-light leading-relaxed mb-12">
                {t.mainText}
              </p>
            </div>

            {/* Contact Info */}
            <div className="max-w-6xl mx-auto">
              <p className="text-center text-lg text-gray-700 font-light mb-12">
                {t.contactText}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-20">
                <div>
                  <h4 className="text-lg font-light">
                    <a href="tel:+358103156900" className="text-gray-900 hover:text-[#1a3a4a] transition-colors">
                      +358 (0)10 315 6900
                    </a>
                  </h4>
                </div>
                <div>
                  <h4 className="text-lg font-light">
                    <a
                      href="https://goo.gl/maps/8HptT8TwUp42"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-[#1a3a4a] transition-colors"
                    >
                      Kasarmikatu 34, 00130 Helsinki
                    </a>
                  </h4>
                </div>
                <div>
                  <h4 className="text-lg font-light">
                    <a
                      href="mailto:info@sothebysrealty.fi"
                      className="text-gray-900 hover:text-[#1a3a4a] transition-colors"
                    >
                      info@sothebysrealty.fi
                    </a>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Helsinki Office Section - Two columns: Text + Map */}
        <section className="bg-[#001731] text-white">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Text content */}
            <div className="lg:w-1/2 py-16 px-8 lg:px-16">
              <div className="max-w-xl mx-auto lg:mx-0">
                <h3 className="text-2xl md:text-3xl font-light mb-8">
                  {t.officeTitle}
                </h3>
                <div className="space-y-4 font-light leading-relaxed text-white/90 text-sm">
                  <p>{t.officeText}</p>
                </div>
                <a 
                  href="https://goo.gl/maps/LjvLpXQFdT82" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-8 border border-white text-white px-6 py-2 hover:bg-white hover:text-[#001731] transition-all uppercase text-sm tracking-wider"
                >
                  {t.directionsBtn}
                </a>
              </div>
            </div>
            
            {/* Right side - Google Map */}
            <div className="lg:w-1/2 h-[300px] lg:h-auto lg:min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.4!2d24.9456!3d60.1656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bcb6d8b8e8f%3A0x5c8b8e8f8e8f8e8f!2sKasarmikatu%2034%2C%2000130%20Helsinki!5e0!3m2!1sfi!2sfi!4v1699999999999!5m2!1sfi!2sfi"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '300px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Snellman Sotheby's Office Location"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
