import { locales, type Locale } from '@/i18n/config';
import type { Metadata } from 'next';
import { company } from '@/lib/config/company';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

const meta = {
  fi: {
    title: 'Tietosuojaseloste | Snellman Sotheby\'s International Realty',
    description: 'Ab Snellman LKV Oy:n tietosuojaseloste. Tietosuojalain ja EU:n yleisen tietosuoja-asetuksen (GDPR) mukainen yhdistetty tietosuojaseloste.',
  },
  sv: {
    title: 'Dataskyddsbeskrivning | Snellman Sotheby\'s International Realty',
    description: 'Ab Snellman LKV Oy:s dataskyddsbeskrivning enligt dataskyddslagen och EU:s allmänna dataskyddsförordning (GDPR).',
  },
  en: {
    title: 'Privacy Policy | Snellman Sotheby\'s International Realty',
    description: 'Ab Snellman LKV Oy privacy policy in accordance with the Data Protection Act and the EU General Data Protection Regulation (GDPR).',
  },
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = meta[(params.locale as keyof typeof meta)] || meta.fi;
  return { title: t.title, description: t.description };
}

export default function PrivacyPolicyPage({ params }: { params: { locale: string } }) {
  return (
    <main className="flex-1 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-sm text-gray-500 mb-8">23.02.2026</p>

        <h1 className="text-3xl font-light mb-8">
          Välitysliike Ab Snellman LKV Oy:n<br />TIETOSUOJASELOSTE
        </h1>

        <p className="text-sm text-gray-700 mb-8 leading-relaxed">
          Tietosuojalain ja Euroopan Unionin yleisen tietosuoja-asetuksen (2016/679/EU) mukainen yhdistetty
          tietosuojaseloste ja informointiasiakirja.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">REKISTERINPITÄJÄ</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Ab Snellman LKV Oy<br />
            Kasarmikatu 34, 00130 Helsinki<br />
            Y-tunnus: {company.businessId}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-4">
            <strong>Yhteyshenkilö tietosuoja-asioissa</strong><br />
            Robert Charpentier, +358 (0)400 243 011<br />
            robert.charpentier@sothebysrealty.fi<br />
            Kasarmikatu 34, 00130 Helsinki
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">REKISTERIN NIMI JA TIETOSISÄLTÖ</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Ab Snellman LKV Oy:n asiakas- ja markkinointirekisteri, (&quot;Asiakasrekisteri&quot;)
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">HENKILÖTIETOJEN KÄSITTELYN TARKOITUS JA OIKEUSPERUSTE</h2>
          
          <h3 className="text-lg font-medium mt-6 mb-3">3.1 Yleistä henkilötietojen käsittelystä</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Siltä osin kuin Asiakasrekisteri sisältää henkilötietoja, niiden käsittelyssä noudatetaan tietosuojalakia ja
            muita kulloinkin voimassaolevia lakeja, asetuksia, määräyksiä ja viranomaisohjeita, jotka koskevat
            henkilötiedon käsittelyä. Henkilötiedolla tarkoitetaan tietoa, joka on yhdistettävissä tiettyyn henkilöön. Tässä
            asiakirjassa kuvataan tarkemmin henkilötietojen keräämistä, käsittelyä ja luovutusta koskevat
            menettelytavat, sekä asiakkaan eli rekisteröidyn oikeudet.
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">3.2 Henkilötietojen keräämisen tarkoitus</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Sopimus-, asiakas- tai niihin rinnastettava muu suhde — Asiakasrekisterin käyttötarkoituksena on rekisterinpitäjän:
          </p>
          <ul className="list-disc pl-6 text-sm text-gray-700 leading-relaxed space-y-1 mb-3">
            <li>sopimus- tai asiakassuhde toimeksiantajan (esim. myyjä tai vuokranantaja) kanssa;</li>
            <li>toimeksiannon suorittamiseen liittyvä suhde toimeksiantajan vastapuolen (esim. ostaja tai vuokralainen) kanssa;</li>
            <li>sopimussuhde arviointitoimeksiannon tai muun asiantuntijapalvelun käyttäjän kanssa.</li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Rekisterinpitäjä voi kerätä tietoja myös esim. asuntoesittelyissä läsnä olevilta henkilöiltä rikosten tai
            väärinkäytösten ennaltaehkäisemiseksi, valvomiseksi ja selvittämiseksi, tai muillakin keinoin mahdollisten
            asiakkaiden kiinnostusten kohteiden selvittämiseksi tai myöhemmän asiakassuhteen
            perustamiseksi/palvelujen tarjoamiseksi ja markkinointiin.
          </p>
          <ol className="list-decimal pl-6 text-sm text-gray-700 leading-relaxed space-y-3">
            <li>Tässä kohdassa mainituista henkilöistä käytetään tässä selosteessa nimitystä Asiakas.</li>
            <li>Kiinteistönvälitysliikkeitä koskeva lainsäädäntö, ml. laki kiinteistönvälitysliikkeistä ja vuokrahuoneiston
            välitysliikkeistä (1075/2000) ja laki kiinteistöjen ja vuokrahuoneistojen välityksestä (1074/2000) ja niihin
            perustuva toimeksiantojen hoitaminen sekä Asiakkaan omien hakujen selvittäminen edellyttävät alla
            kohdassa &quot;Asiakasrekisterin tietosisältö&quot; mainittujen tietojen tallentamista, käyttämistä ja säilyttämistä.
            Välitysliikkeen tulee mm. pitää toimeksiantopäiväkirjaa, johon kuhunkin toimeksiantoon liittyvät henkilö-,
            kohde- ja tapahtumatiedot asiakirjoineen tallennetaan (&quot;Toimeksiantopäiväkirja&quot;).</li>
            <li><strong>Rahanpesun lakisääteinen valvonta</strong> — Lain rahanpesun ja terrorismin rahoittamisen estämisestä (444/2017,
            jäljempänä &quot;Rahanpesulaki&quot;) 3 luvun 3 §:n mukaisesti Asiakkaan tuntemistietoja ja muita lain mukaisia
            henkilötietoja tallennetaan, säilytetään ja voidaan käyttää rahanpesun ja terrorismin rahoittamisen
            estämiseen, paljastamiseen ja selvittämiseen sekä rahanpesun ja terrorismin rahoittamisen ja sen rikoksen,
            jolla rahanpesun tai terrorismin rahoittamisen kohteena oleva omaisuus tai rikoshyöty on saatu, tutkintaan
            saattamista varten.</li>
            <li><strong>Suostumukseen perustuva tietojen tallentaminen</strong> — Sikäli kuin edellä sanottuihin lakeihin tai olosuhteisiin
            perustuva rekisteröintioikeus ylittyy, tai mainittua muuta oikeusperustaa ei ole, pyydetään Asiakkaalta
            erikseen suostumus henkilötietojen tallentamiseen, käsittelyyn ja säilyttämiseen.</li>
          </ol>

          <h3 className="text-lg font-medium mt-6 mb-3">3.3 Tietojen käyttötarkoitus</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Asiakasrekisterissä olevia tietoja voidaan käyttää seuraaviin pääasiallisiin tarkoituksiin:
          </p>
          <ul className="list-disc pl-6 text-sm text-gray-700 leading-relaxed space-y-1">
            <li>asiakassuhteen hoitaminen ja kehittäminen</li>
            <li>palveluiden tuottaminen, tarjoaminen, kehittäminen, parantaminen ja suojaaminen</li>
            <li>laskutus, perintä ja asiakastapahtumien varmentaminen</li>
            <li>mainonnan kohdentaminen</li>
            <li>palveluita koskeva analysointi ja tilastointi</li>
            <li>asiakasviestintä, markkinointi ja mainonta</li>
            <li>palveluihin liittyvien rekisterinpitäjän ja muiden toimeksiantoihin liittyvien henkilöiden ja tahojen oikeuksien ja/tai omaisuuden suojaaminen ja turvaaminen</li>
            <li>rekisterinpitäjän lakisääteisten velvoitteiden hoitaminen</li>
            <li>muut vastaavat käyttötarkoitukset</li>
          </ul>

          <h3 className="text-lg font-medium mt-6 mb-3">3.4 Seuraamukset tietojen saamatta jäämisestä</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Mikäli rekisterinpitäjä ei saa kohdissa 3.2 a), b) ja c) tarkoitettuja tietoja, ei asiakassuhdetta voida aloittaa tai
            jatkaa, taikka ryhtyä muuhun sopimukseen tai osallistua oikeustoimeen Asiakkaan kanssa.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">ASIAKASREKISTERIN TIETOSISÄLTÖ</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Toimeksiantopäiväkirjassa ja sen liitteissä käsitellään, tai voidaan käsitellä, seuraaviin ryhmiin kuuluvia tietoja:
          </p>
          <ul className="list-disc pl-6 text-sm text-gray-700 leading-relaxed space-y-1 mb-4">
            <li>Asiakkaan perustiedot, kuten koko nimi, osoite, kieli</li>
            <li>omasta tai yrityksen puolesta toimivan henkilön henkilötunnus ja mahdollisesti yritystunnus</li>
            <li>laskutukseen ja perintään liittyvät tiedot</li>
            <li>asiakkuuteen ja sopimussuhteeseen liittyvät tiedot</li>
            <li>lupatiedot ja kiellot, kuten suoramarkkinointiluvat ja -kiellot</li>
            <li>mielenkiinnon kohteet ja muut Asiakkaan itse antamat tiedot</li>
            <li>palvelujen muut tapahtumatiedot</li>
            <li>reklamaatiot ja niiden käsittelytiedot</li>
            <li>vuokralaisen luottotiedot ja muut taloudelliset tiedot</li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Rahanpesulain valvontaa koskevissa rekisteritiedoissa käsitellään, tai voidaan käsitellä, seuraavia tietoja:
          </p>
          <ul className="list-disc pl-6 text-sm text-gray-700 leading-relaxed space-y-1">
            <li>nimi, syntymäaika ja henkilötunnus</li>
            <li>edustajan nimi, syntymäaika ja henkilötunnus</li>
            <li>oikeushenkilön täydellinen nimi, rekisterinumero, rekisteröimispäivä ja rekisteriviranomainen</li>
            <li>oikeushenkilön hallituksen jäsenten täydelliset nimet, syntymäajat ja kansalaisuudet</li>
            <li>oikeushenkilön toimiala</li>
            <li>tosiasiallisten edunsaajien nimi, syntymäaika ja henkilötunnus</li>
            <li>henkilöllisyyden todentamisessa käytetyn asiakirjan tiedot</li>
            <li>tiedot Asiakkaan toiminnasta, liiketoiminnan laadusta ja laajuudesta</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">TIETOJEN SÄILYTYSAIKA</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Toimeksiantopäiväkirjan tietoja säilytetään kymmenen (10) vuotta toimeksiannon päättymisestä.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Rahanpesulain mukaisia tietoja säilytetään viisi (5) vuotta, jollei kyseisten tietojen edelleen säilyttäminen ole
            tarpeen rikostutkinnan, vireillä olevan oikeudenkäynnin taikka rekisterinpitäjän oikeuksien turvaamiseksi.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Muut henkilötiedot poistetaan sen jälkeen, kun henkilötiedon säilyttämiselle ei enää ole tarvetta.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">SÄÄNNÖNMUKAISET TIETOLÄHTEET</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Henkilötietoja kerätään Asiakkaalta itseltään toimeksiantosopimuksen, osto- tai vuokratarjouksen ja muiden
            toimeksiantoon liittyvien tapahtumien yhteydessä, rekisterinpitäjän palveluita käytettäessä tai muutoin suoraan Asiakkaalta
            esimerkiksi asunto- ja kohde-esittelyissä sekä yrityksen nettisivuilla täytetyistä yhteydenottolomakkeista ja
            uutiskirjetilauksista. Henkilötietoja voidaan kerätä ja päivittää myös esim. isännöitsijätoimistoista,
            väestörekisteristä ja muista viranomaisrekistereistä sekä luottotietorekistereistä.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">TIETOJEN LUOVUTUS</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Rekisterinpitäjä voi luovuttaa henkilötietoja voimassaolevan lainsäädännön sallimisissa ja velvoittavissa
            rajoissa, sekä osapuolten välisen sopimuksen toteuttamiseksi.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Tietoja ei säännönmukaisesti siirretä Euroopan unionin tai Euroopan talousalueen ulkopuolelle. Tietoja
            voidaan kuitenkin siirtää EU:n ulkopuolelle lain sallimin tavoin. Siirto EU:n ulkopuolelle voi
            väliaikaisesti tapahtua myös erilaisten pilvipalvelujen käyttämisen yhteydessä, kuten esim. OneDriven,
            iCloudin tai Dropboxin yhteydessä.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Kauppahinta- ja kaupan kohteen muita tietoja luovutetaan lisäksi Kiinteistönvälitysalan Keskusliitto (KVKL)
            ry:lle. HSP:n tietosuojaseloste:{' '}
            <a href="http://www.hintaseurantapalvelu.fi/tietosuoja" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline">
              hintaseurantapalvelu.fi/tietosuoja
            </a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">REKISTERIN SUOJAUKSEN PERIAATTEET</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Rekisterin käyttöoikeus edellyttää Asiakasrekisterin pääkäyttäjän myöntämää käyttäjätunnusta. 
            Ainoastaan niillä rekisterinpitäjän työntekijöillä ja alihankkijoiden työntekijöillä on pääsy tietoihin, joille se on 
            työhön liittyvien tehtävien hoitamiseksi tarpeellista. Tiedot kerätään palvelun tietokantoihin, jotka ovat palomuurein, 
            salasanoin ja muin teknisin keinoin suojattuja.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">ASIAKKAAN OIKEUDET</h2>
          
          <h3 className="text-lg font-medium mt-4 mb-2">9.1 Tietojen tarkastaminen, saaminen ja siirtäminen</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Asiakkaalla on oikeus tarkastaa, mitä häntä koskevia tietoja on tallennettu Asiakasrekisteriin.
            Rekisterinpitäjä toimittaa tiedot Asiakkaalle 30 päivän kuluessa tarkastuspyynnön esittämisestä.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">9.2 Virheellisen tiedon oikaiseminen</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Asiakkaalla on oikeus oikaista itseään koskevia henkilörekisteriin tallennettuja tietoja siltä osin kuin ne ovat virheellisiä.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">9.3 Tiedon käsittelyn vastustaminen tai rajoittaminen ja tiedon poistaminen</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Asiakkaalla on oikeus vastustaa häntä itseään koskevia tietojen käsittelyä suoramainontaa, etämyyntiä ja
            muuta suoramarkkinointia varten sekä rajoittaa häntä koskevien tietojen käsittelyä.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">9.4 Suostumuksen peruuttaminen</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Mikäli rekisterissä oleva tieto perustuu Asiakkaan antamaan suostumukseen, on suostumus koska tahansa
            peruutettavissa ilmoittamalla rekisterinpitäjän edustajalle.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">9.5 Menettely oikeuksien käyttämisessä</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Tarkastus-, oikaisu- tai muun pyynnön voi esittää ottamalla yhteyttä rekisterinpitäjän asiakaspalveluun tässä
            selosteessa mainituilla yhteystiedoilla.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">9.6 Erimielisyydet</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Asiakkaalla on oikeus saattaa asia Tietosuojavaltuutetun käsittelyyn, jos rekisterinpitäjä ei noudata
            Asiakkaan oikaisu- tai muuta pyyntöä.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">PROFILOINTI JA AUTOMAATTINEN PÄÄTÖKSENTEKO</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Rekisterinpitäjä ei tee henkilötietojen pohjalta Asiakkaaseen kohdistuvaa profilointia tai käytä automaattista
            päätöksentekoa.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">KOLMANNEN OSAPUOLEN PALVELUT</h2>

          <h3 className="text-lg font-medium mt-4 mb-2">YouTube</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Sivustomme käyttää YouTuben liitännäisiä (YouTube LLC, 901 Cherry Ave., San Bruno, CA 94066, USA).
            Vieraillessasi sivullamme, jossa on YouTube-liitännäinen, muodostetaan yhteys YouTuben palvelimiin.
            Lisätietoja:{' '}
            <a href="https://www.google.de/intl/de/policies/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline">
              Googlen tietosuojakäytäntö
            </a>
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">Google Web Fonts</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Sivusto käyttää Googlen tarjoamia web-fontteja yhtenäiseen esitystapaan. Lisätietoja:{' '}
            <a href="https://www.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline">
              Googlen tietosuojakäytäntö
            </a>
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">Google Analytics</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Google Analytics mahdollistaa vierailujen ja liikennöinnin lähteiden laskemisen, jotta voimme mitata ja parantaa
            sivustomme suorituskykyä. Kaikki evästeiden keräämä tieto on koostettua ja siten anonyymiä.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">Alma Media</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Tutustu Alma Median myyntiehtoihin:{' '}
            <a href="https://www.almamedia.fi/mainostajat/mediamyynnin-ehdot" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline">
              almamedia.fi/mainostajat/mediamyynnin-ehdot
            </a>
          </p>
        </section>

        <hr className="my-10 border-gray-200" />
        <p className="text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} Ab Snellman LKV Oy. Kaikki oikeudet pidätetään.
        </p>
      </div>
    </main>
  );
}
