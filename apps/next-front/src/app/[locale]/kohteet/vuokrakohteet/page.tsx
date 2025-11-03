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
  },
  sv: {
    title: 'Hyresobjekt',
    noProperties: 'Inga hyresobjekt tillgängliga för tillfället.',
    heroTitle: 'Din serviceinriktade hyresförmedling!',
    heroText: 'Är det aktuellt att hyra ut ditt hem eller kontorsutrymme? Våra professionella mäklare hjälper dig även när ditt hem eller din investeringslägenhet behöver en hyresgäst. Kontakta oss så diskuterar vi gärna uthyrning av bostaden med dig.',
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
    contactInfoText1: 'Vill du hyra ut ditt hem eller din lokal till en pålitlig hyresgäst? Snellman Sotheby\'s International Realty erbjuder uthyrningstjänster även för krävande fastigheter.',
    contactInfoText2: 'Din professionella uthyrningsförmedlare betjänar dig måndag till fredag kl. 10 – 17,\nsamt andra tider enligt överenskommelse.',
    formTitle: 'Hyresvärd, kontakta oss!',
    formSubtitle: 'Berätta hur vi kan hjälpa dig, så återkommer vi så snart som möjligt.',
    formDescription: 'Vår tjänst omfattar uthyrningsförmedling från början till slut, dvs. bl.a. värdering av bostad eller lokal, sökning av hyresgäst som motsvarar dina kriterier samt upprättande av hyreskontrakt.',
    formName: 'Namn *',
    formEmail: 'E-post *',
    formPhone: 'Telefon',
    formMessage: 'Meddelande *',
    formPrivacy: 'Jag har läst',
    formPrivacyLink: 'Integritetspolicyn',
    formSubmit: 'Skicka meddelande',
  },
  en: {
    title: 'Rental Properties',
    noProperties: 'No rental properties available at the moment.',
    heroTitle: 'Your service-oriented rental agency!',
    heroText: 'Is renting out your home or office space relevant? Our professional agents also help you when your home or investment property needs a tenant. Contact us and we\'ll be happy to discuss renting your property with you.',
    contactBtn: 'Contact us',
    rentalsBtn: 'Rental Properties',
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
    contactInfoText1: 'Do you want to rent your home or business premises to a reliable tenant? Snellman Sotheby\'s International Realty offers rental services also for demanding properties.',
    contactInfoText2: 'Your professional rental agent serves you Monday to Friday from 10 am to 5 pm,\nand at other times by agreement.',
    formTitle: 'Landlord, contact us!',
    formSubtitle: 'Tell us how we can help, and we will get back to you as soon as possible.',
    formDescription: 'Our service includes rental brokerage from start to finish, i.e. property or commercial space appraisals, finding a tenant that meets your criteria, and drafting a rental agreement.',
    formName: 'Name *',
    formEmail: 'Email *',
    formPhone: 'Phone',
    formMessage: 'Message *',
    formPrivacy: 'I have read the',
    formPrivacyLink: 'Privacy Policy',
    formSubmit: 'Send message',
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
                  Kasarmikatu 34,<br />
                  00130 Helsinki
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
