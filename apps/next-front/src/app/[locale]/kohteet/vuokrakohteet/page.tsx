import PropertyGridNew from '@/components/Property/PropertyGridNew';
import { locales, type Locale } from '@/i18n/config';
import { fetchRentalProperties } from '@/lib/server/fetch-properties';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

// Translations for Rentals page - cleaned up unused keys
const translations = {
  fi: {
    title: 'Vuokrakohteet',
    noProperties: 'Ei vuokrakohteita saatavilla tällä hetkellä.',
    contactInfoTitle: 'Tervetuloa asiakkaaksemme!',
    contactInfoText1: 'Haluatko vuokrata kotisi tai liiketilasi luotettavalle vuokralaiselle? Snellman Sotheby\'s International Realty tarjoaa vuokrauspalveluja myös vaativille kiinteistöille.',
    contactInfoText2: 'Ammattitaitoinen vuokranvälittäjäsi palvelee sinua maanantaista perjantaihin klo 10 – 17,\nsekä muina aikoina sopimuksen mukaan.',
    formTitle: 'Vuokranantaja, ota yhteyttä!',
    formSubtitle: 'Kerro meille miten voimme auttaa, niin palaamme asiaan mahdollisimman pian.',
    formDescription: 'Palveluumme kuuluu vuokranvälitys alusta loppuun, eli mm. asunnon tai liiketilan arvioinnit, kriteerejäsi vastaavan vuokralaisen etsintä sekä vuokrasopimuksen laatiminen.',
    formName: 'Nimi *',
    formEmail: 'Sähköposti *',
    formPhone: 'Puhelin',
    formMessage: 'Viesti *',
    formPrivacy: 'Olen lukenut',
    formPrivacyLink: 'Tietosuojaselosteen',
    formSubmit: 'Lähetä viesti',
    addressStreet: 'Kasarmikatu 34,',
    addressCity: '00130 Helsinki',
  },
  sv: {
    title: 'Hyresobjekt',
    noProperties: 'Inga hyresobjekt tillgängliga för tillfället.',
    contactInfoTitle: 'Välkommen som vår kund!',
    contactInfoText1: 'Vill du hyra ditt hem eller din affärslokal till en pålitlig hyresgäst? Snellman Sotheby\'s International Realty erbjuder också uthyrningstjänster för krävande objekt.',
    contactInfoText2: 'Din professionella uthyrnings mäklare betjänar er från måndag till fredag från 10 – 17,\nandra tider är vi öppna efter överenskommelse.',
    formTitle: 'Hyresvärd, kontakta oss!',
    formSubtitle: 'Meddela oss hur vi kan hjälpa så återkommer vi så snart som möjligt.',
    formDescription: 'Vår tjänst inkluderar uthyrningsförmedling från början till slut, dvs bland annat visning av lägenheten eller kommersiellt utrymmet, sökandet efter en hyresgäst som uppfyller dina kriterier och upprättandet av ett hyresavtal.',
    formName: 'Förnamn',
    formEmail: 'Email',
    formPhone: 'Telefon',
    formMessage: 'Ditt meddelande',
    formPrivacy: 'Jag har bekantat mig med Privacy Policyn',
    formPrivacyLink: 'Tietosuojaseloste',
    formSubmit: 'Skicka',
    addressStreet: 'Kaserngatan 34,',
    addressCity: '00130 Helsingfors',
  },
  en: {
    title: 'Rental listings',
    noProperties: 'No rental properties available at the moment.',
    contactInfoTitle: 'Welcome as our customer!',
    contactInfoText1: 'Do you want to rent your home or business premises to a reliable tenant? Snellman Sotheby\'s International Realty also offers rental services for demanding properties.',
    contactInfoText2: 'Your professional rental broker serves you from Monday to Friday 10 – 17,\nas well as other times by appointment.',
    formTitle: 'Landlord, contact us!',
    formSubtitle: 'Please let us know how we can help and we will get back to you as soon as possible.',
    formDescription: 'Our service includes rental brokerage from start to finish, ie, among other things, appraisals of the apartment or Commercial spaces, the search for a tenant that meets your criteria, and the preparation of a lease agreement.',
    formName: 'First name',
    formEmail: 'Email',
    formPhone: 'Phone',
    formMessage: 'Message *',
    formPrivacy: 'I have read the',
    formPrivacyLink: 'Privacy Policy',
    formSubmit: 'Send message',
    addressStreet: 'Kasarmikatu 34,',
    addressCity: '00130 Helsinki',
  },
};

interface RentalPropertiesPageProps {
  params: { locale: Locale };
}

export default async function RentalPropertiesPage({ params }: RentalPropertiesPageProps) {
  const { locale } = params;
  const t = translations[locale] || translations.fi;
  
  // ✅ SERVER ACTION: Fetch rental properties (no CORS, no duplication)
  const rentalProperties = await fetchRentalProperties(locale);

  return (
    <main className="flex-1 bg-white">
      {/* Latest Rental Listings - MOVED TO TOP */}
      <section id="vuokrakohteet" className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-12 text-center">
            {t.title}
          </h1>

          {rentalProperties.length > 0 ? (
            <PropertyGridNew properties={rentalProperties} locale={locale} />
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 font-light">
                {t.noProperties}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Info Section - Clean horizontal layout like other pages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              {t.contactInfoTitle}
            </h2>
            <p className="text-lg font-light text-gray-700 leading-relaxed mb-8">
              {t.contactInfoText1}
            </p>
            <p className="text-lg font-light text-gray-700 mb-12 whitespace-pre-line">
              {t.contactInfoText2}
            </p>
            
            {/* Contact Info Bar - matching other pages */}
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

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 text-center">
              {t.formTitle}
            </h2>
            <p className="text-lg font-light text-gray-700 text-center mb-12">
              {t.formSubtitle}
            </p>
            <p className="text-base font-light text-gray-700 text-center mb-12">
              {t.formDescription}
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      placeholder={t.formName}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder={t.formEmail}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder={t.formPhone}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <textarea
                    placeholder={t.formMessage}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="mt-1"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600">
                    {t.formPrivacy}{' '}
                    <a href="/tietosuojaseloste" className="text-[var(--color-primary)] hover:underline">
                      {t.formPrivacyLink}
                    </a>
                  </label>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-[var(--color-primary)] text-white px-12 py-4 
                             hover:bg-[var(--color-primary-dark)] transition-colors 
                             uppercase tracking-wider text-sm font-light"
                  >
                    {t.formSubmit}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
