import PropertyGridNew from '@/components/Property/PropertyGridNew';
import { Link } from '@/lib/navigation';
import { VideoSection } from '@/components/ui/VideoSection';
import { locales, type Locale } from '@/i18n/config';
import { fetchSoldProperties } from '@/lib/server/fetch-properties';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

// 🔥 LINUS FIX: Translations for References page
const translations = {
  fi: {
    title: 'Referenssit',
    subtitle: 'Valikoima onnistuneesti välittämistämme kohteista',
    infoText: 'Olemme ylpeitä jokaisesta onnistuneesta kaupasta. Tässä valikoima aiemmin välittämistämme kohteista, jotka ovat löytäneet uudet omistajat.',
    noProperties: 'Referenssejä päivitetään säännöllisesti.',
    ctaTitle: 'Haluatko kodistasi seuraavan referenssin?',
    ctaText: 'Ota yhteyttä, niin autamme sinua myymään kotisi parhaaseen hintaan.',
    sellBtn: 'Myy kotisi',
    contactBtn: 'Ota yhteyttä',
    videoTitle: 'Katso referenssejämme',
    videoSubtitle: 'Tutustu onnistuneesti välittämiimme kohteisiin',
  },
  sv: {
    title: 'Referenser',
    subtitle: 'Ett urval av framgångsrikt förmedlade objekt',
    infoText: 'Vi är stolta över varje lyckad affär. Här är ett urval av tidigare förmedlade objekt som har hittat nya ägare.',
    noProperties: 'Referenser uppdateras regelbundet.',
    ctaTitle: 'Vill du att ditt hem ska bli nästa referens?',
    ctaText: 'Kontakta oss så hjälper vi dig sälja ditt hem till bästa pris.',
    sellBtn: 'Sälj ditt hem',
    contactBtn: 'Kontakta oss',
    videoTitle: 'Se våra referenser',
    videoSubtitle: 'Bekanta dig med framgångsrikt förmedlade objekt',
  },
  en: {
    title: 'References',
    subtitle: 'A selection of successfully brokered properties',
    infoText: 'We are proud of every successful transaction. Here is a selection of previously brokered properties that have found new owners.',
    noProperties: 'References are updated regularly.',
    ctaTitle: 'Want your home to be the next reference?',
    ctaText: 'Contact us and we will help you sell your home at the best price.',
    sellBtn: 'Sell your home',
    contactBtn: 'Contact us',
    videoTitle: 'View our references',
    videoSubtitle: 'Explore successfully brokered properties',
  },
};

interface ReferencesPageProps {
  params: { locale: Locale };
}

export default async function ReferencesPage({ params }: ReferencesPageProps) {
  const { locale } = params;
  const t = translations[locale] || translations.fi;
  
  // ✅ SERVER ACTION: Fetch sold properties (no CORS, no duplication)
  const referenceProperties = await fetchSoldProperties(locale);

  return (
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

        {/* Info Section */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-700 font-light leading-relaxed">
                {t.infoText}
              </p>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            {referenceProperties.length > 0 ? (
              <PropertyGridNew properties={referenceProperties} locale={locale} />
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600 font-light">
                  {t.noProperties}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Video Section */}
        <VideoSection 
          videoId="tSTKhZN4DHA"
          title={t.videoTitle}
          subtitle={t.videoSubtitle}
        />

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-light text-gray-900 mb-6">
                {t.ctaTitle}
              </h2>
              <p className="text-lg text-gray-600 font-light mb-8">
                {t.ctaText}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/myymassa"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           bg-[#1a3a4a] text-white hover:bg-[#0f2633] 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  {t.sellBtn}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/yhteystiedot"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  {t.contactBtn}
                </Link>
              </div>
            </div>
          </div>
        </section>
    </main>
  );
}
