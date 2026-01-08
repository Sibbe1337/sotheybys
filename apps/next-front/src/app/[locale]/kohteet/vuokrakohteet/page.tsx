import PropertyGridNew from '@/components/Property/PropertyGridNew';
import { Link } from '@/lib/navigation';
import { locales, type Locale } from '@/i18n/config';
import { fetchRentalProperties } from '@/lib/server/fetch-properties';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

// 🔥 LINUS FIX: Complete translations for Rentals page
const translations = {
  fi: {
    title: 'Vuokrakohteet',
    noProperties: 'Ei vuokrakohteita saatavilla tällä hetkellä.',
    heroTitle: 'Palveleva vuokranvälityksesi!',
    heroText: 'Onko kotisi tai toimistotilasi vuokraaminen ajankohtaista? Ammattitaitoiset välittäjämme auttavat sinua myös silloin, kun kotisi tai sijoitusasuntosi on vuokralaisen tarpeessa. Ota yhteyttä, niin keskustellaan mielellämme asunnon vuokraamisesta kanssasi.',
    contactBtn: 'Ota yhteyttä',
    rentalsBtn: 'Vuokrakohteet',
    welcomeTitle: 'Tervetuloa poikkeukselliseen kiinteistöilmoitukseen!',
    welcomeText: 'Katso kaikki myytävät kiinteistömme.',
    findHomeBtn: 'Löydä unelmiesi koti',
    missionTitle: 'Snellman Sotheby\'s International Realty®',
    missionText: 'Meillä kaikilla on erilaiset tarpeet ja toiveet, keskustelemme ja räätälöimme asiakkaidemme toiveiden ja vaatimusten mukaan. Tehtävämme on tehdä unelmastasi totta.',
    missionBtn: 'Tee elämäsi ilmoitus',
    referencesTitle: 'Referenssit',
    referencesSubtitle: 'Näyte myydyistä kohteista',
    referencesBtn: 'Katso lisää',
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
    heroTitle: 'Välkommen som vår kund!',
    heroText: 'Vill du hyra ditt hem eller din affärslokal till en pålitlig hyresgäst? Snellman Sotheby\'s International Realty erbjuder också uthyrningstjänster för krävande objekt.',
    contactBtn: 'Kontakta oss',
    rentalsBtn: 'Hyresobjekt',
    welcomeTitle: 'Välkommen till en exceptionell fastighetsannons!',
    welcomeText: 'Se alla våra fastigheter till salu.',
    findHomeBtn: 'Hitta ditt drömhem',
    missionTitle: 'Snellman Sotheby\'s International Realty®',
    missionText: 'Vi har alla olika behov och önskemål, vi diskuterar och skräddarsyr enligt våra kunders önskemål och krav. Vårt uppdrag är att göra din dröm till verklighet.',
    missionBtn: 'Gör din livs annons',
    referencesTitle: 'Referenser',
    referencesSubtitle: 'Prov på sålda objekt',
    referencesBtn: 'Se mer',
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
    heroTitle: 'Welcome as our customer!',
    heroText: 'Do you want to rent your home or business premises to a reliable tenant? Snellman Sotheby\'s International Realty also offers rental services for demanding properties.',
    contactBtn: 'Contact us',
    rentalsBtn: 'Rental listings',
    welcomeTitle: 'Welcome to an exceptional property listing!',
    welcomeText: 'See all our properties for sale.',
    findHomeBtn: 'Find your dream home',
    missionTitle: 'Snellman Sotheby\'s International Realty®',
    missionText: 'We all have different needs and wishes, we discuss and tailor according to our customers\' wishes and requirements. Our mission is to make your dream come true.',
    missionBtn: 'Make your life\'s listing',
    referencesTitle: 'References',
    referencesSubtitle: 'Sample of sold properties',
    referencesBtn: 'See more',
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

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
            {t.heroTitle}
          </h1>
          <p className="text-xl font-light text-gray-700 leading-relaxed mb-12 max-w-4xl mx-auto">
            {t.heroText}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/yhteystiedot"
              className="inline-block bg-[var(--color-primary)] text-white px-10 py-4 
                       hover:bg-[var(--color-primary-dark)] transition-colors 
                       uppercase tracking-wider text-sm font-light"
            >
              {t.contactBtn}
            </Link>
            <a
              href="#vuokrakohteet"
              className="inline-block border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 py-4 
                       hover:bg-[var(--color-primary)] hover:text-white transition-all 
                       uppercase tracking-wider text-sm font-light"
            >
              {t.rentalsBtn}
            </a>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
            {t.welcomeTitle}
          </h2>
          <p className="text-xl font-light text-gray-700 mb-8">
            {t.welcomeText}
          </p>
          <Link
            href="/kohteet"
            className="inline-block bg-[var(--color-primary)] text-white px-10 py-4 
                     hover:bg-[var(--color-primary-dark)] transition-colors 
                     uppercase tracking-wider text-sm font-light"
          >
            {t.findHomeBtn}
          </Link>
        </div>
      </section>

      {/* Company Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              {t.missionTitle}
            </h2>
            <p className="text-lg font-light text-gray-700 leading-relaxed mb-8">
              {t.missionText}
            </p>
            <Link
              href="/myymassa"
              className="inline-block border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 py-4 
                       hover:bg-[var(--color-primary)] hover:text-white transition-all 
                       uppercase tracking-wider text-sm font-light"
            >
              {t.missionBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
            {t.referencesTitle}
          </h2>
          <p className="text-lg font-light text-gray-600 mb-12">
            {t.referencesSubtitle}
          </p>
          <Link
            href="/kohteet/referenssit"
            className="inline-block border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 py-4 
                     hover:bg-[var(--color-primary)] hover:text-white transition-all 
                     uppercase tracking-wider text-sm font-light"
          >
            {t.referencesBtn}
          </Link>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              {t.contactInfoTitle}
            </h2>
            <p className="text-lg font-light text-gray-700 leading-relaxed mb-12">
              {t.contactInfoText1}
            </p>
            <p className="text-lg font-light text-gray-700 mb-12 whitespace-pre-line">
              {t.contactInfoText2}
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl mb-4">📞</div>
                <a href="tel:+358103156900" className="text-lg text-[var(--color-primary)] hover:underline font-light">
                  +358 (0)10 315 6900
                </a>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">📍</div>
                <p className="text-lg text-gray-700 font-light">
                  {t.addressStreet}<br />
                  {t.addressCity}
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">✉️</div>
                <a href="mailto:info@sothebysrealty.fi" className="text-lg text-[var(--color-primary)] hover:underline font-light">
                  info@sothebysrealty.fi
                </a>
              </div>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder={t.formEmail}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder={t.formPhone}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <textarea
                    placeholder={t.formMessage}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
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
