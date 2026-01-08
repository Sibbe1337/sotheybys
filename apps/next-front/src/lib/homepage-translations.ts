/**
 * Homepage and Property Card Translations
 * Supports Finnish (fi), Swedish (sv), and English (en)
 */

import type { Locale } from '@/i18n/config';

// For backward compatibility
export type SupportedLanguage = Locale;

interface HomepageTranslations {
  [key: string]: {
    fi: string;
    sv: string;
    en: string;
  };
}

export const HOMEPAGE_TRANSLATIONS: HomepageTranslations = {
  // Property Section
  propertiesHeading: {
    fi: 'Myyntikohteet',
    sv: 'Objekt till salu',
    en: 'Properties for Sale'
  },
  propertiesSubtitle: {
    fi: 'Tutustu huolella valittuun kokoelmaamme ylellisiä kiinteistöjä Suomen halutuimmissa kohteissa',
    sv: 'Utforska vårt noggrant utvalda sortiment av lyxfastigheter på de mest eftertraktade platserna i Finland',
    en: 'Explore our carefully curated collection of luxury properties in Finland\'s most desirable locations'
  },
  viewAllProperties: {
    fi: 'Kaikki myynnissä olevat kohteemme',
    sv: 'Alla våra objekt till salu',
    en: 'View All Properties for Sale'
  },
  viewProperty: {
    fi: 'Katso kohde',
    sv: 'Se objekt',
    en: 'View Property'
  },
  
  // Three Column Section
  welcomeHeading: {
    fi: 'Tervetuloa onnistuneeseen asuntokauppaan!',
    sv: 'Välkommen till en extraordinär bostadsaffär!',
    en: 'Welcome to successful property transactions!'
  },
  welcomeText: {
    fi: 'Olemme tuoneet Suomen asuntomarkkinoille yhden maailman suurimman kiinteistönvälitysketjun Sotheby\'s International Realty®:n osaamisen ja kokemuksen. Avaamalla kiinteistömarkkinat yli valtakunnan rajojen haluamme kehittää koko alaa. Inspiraationamme toimivat mielenkiintoiset ja uniikit kohteet kaikkialla maailmassa.',
    sv: 'Vi hämtade en av världens ledande fastighetsskedjor Sotheby\'s International Realty®:s kompetens och erfarenhet till den finländska bostadsmarknaden. Genom att öppna fastighetsmarknaden utöver de nationella gränserna vill vi utveckla hela industrin. Vår inspiration kommer från intressanta och unika objekt runt omkring hela världen.',
    en: 'We have brought the expertise and experience of Sotheby\'s International Realty®, one of the world\'s largest real estate networks, to the Finnish property market. By opening property markets across borders, we aim to develop the entire industry. Our inspiration comes from interesting and unique properties around the world.'
  },
  
  // Three Column Buttons
  openNewDoors: {
    fi: 'Avaamme uusia ovia!',
    sv: 'Vi öppnar nya dörrar!',
    en: 'We Open New Doors!'
  },
  findDreamHome: {
    fi: 'LÖYDÄ UNELMIESI KOTI',
    sv: 'HITTA DITT DRÖMHEM',
    en: 'FIND YOUR DREAM HOME'
  },
  expertiseHeading: {
    fi: 'Asiantuntemus joka ulottuu korttelista kaupunkiin ja aina maailman ympäri',
    sv: 'Expertis som når från kvarteret runt om i hela världen',
    en: 'Expertise that reaches down the block and around the world'
  },
  readMoreAboutUs: {
    fi: 'LUE LISÄÄ YRITYKSESTÄMME',
    sv: 'LÄS MER OM OSS',
    en: 'READ MORE ABOUT US'
  },
  freeValuationHeading: {
    fi: 'Kutsu meidät maksuttomalle arviokäynnille',
    sv: 'Bjud in oss för en kostnadsfri värdering',
    en: 'Invite us for a free property valuation'
  },
  contactUs: {
    fi: 'OTA MEIHIN YHTEYTTÄ',
    sv: 'KONTAKTA OSS',
    en: 'CONTACT US'
  },
  
  // Office Hours
  officeHoursLine1: {
    fi: 'Upea toimistomme palvelee',
    sv: 'Vårt högklassiga kontor betjänar Er',
    en: 'Our wonderful office is open'
  },
  officeHoursLine2: {
    fi: 'teitä arkisin 10:00 – 17:00',
    sv: 'på vardagar 10:00 – 17:00',
    en: 'on weekdays 10:00 – 17:00'
  },
  officeHoursLine3: {
    fi: 'sekä muina aikoina sopimuksen mukaan.',
    sv: 'på helgerna är vi öppna efter överenskommelse.',
    en: 'as well as other times by appointment.'
  },
  
  // Newsletter
  subscribeNewsletter: {
    fi: 'Tilaa Uutiskirjeemme',
    sv: 'Prenumerera på vårt nyhetsbrev',
    en: 'Subscribe to Our Newsletter'
  },
  firstName: {
    fi: 'Etunimi',
    sv: 'Förnamn',
    en: 'First Name'
  },
  lastName: {
    fi: 'Sukunimi',
    sv: 'Efternamn',
    en: 'Last Name'
  },
  email: {
    fi: 'Sähköposti',
    sv: 'E-post',
    en: 'Email'
  },
  privacyConsent: {
    fi: 'Olen tutustunut Tietosuojaselosteeseen',
    sv: 'Jag har läst Integritetspolicyn',
    en: 'I have read the Privacy Policy'
  },
  privacyPolicy: {
    fi: 'Tietosuojaseloste',
    sv: 'Integritetspolicy',
    en: 'Privacy Policy'
  },
  subscribe: {
    fi: 'Tilaa',
    sv: 'Prenumerera',
    en: 'Subscribe'
  },
  
  // Video Section
  videoTitle: {
    fi: 'Katso videomme',
    sv: 'Se vår video',
    en: 'Watch Our Video'
  },
  videoSubtitle: {
    fi: 'Tutustu toimintaamme ja arvoihimme',
    sv: 'Bekanta dig med vår verksamhet och våra värderingar',
    en: 'Learn about our operations and values'
  },
  
  // Property card abbreviations
  bedrooms: {
    fi: 'mh',
    sv: 'sr',
    en: 'br'
  },
  bathrooms: {
    fi: 'kph',
    sv: 'br',
    en: 'ba'
  },
  rooms: {
    fi: 'huonetta',
    sv: 'rum',
    en: 'rooms'
  },
  month: {
    fi: 'kk',
    sv: 'mån',
    en: 'mo'
  },
  
  // Hero Slides
  hero1Title: {
    fi: 'Kansainvälinen välittäjäsi paikallisesti',
    sv: 'Din internationella mäklare lokalt',
    en: 'Your International Agent Locally'
  },
  hero1Subtitle: {
    fi: '26 100 välittäjää • 1100 välitystoimistossa • 84 maassa ja alueella',
    sv: '26 100 mäklare • 1100 kontor • 84 länder och regioner',
    en: '26,100 agents • 1,100 offices • 84 countries and territories'
  },
  hero1Button: {
    fi: 'Avaamme uusia ovia',
    sv: 'Vi öppnar nya dörrar',
    en: 'We Open New Doors'
  },
  hero2Title: {
    fi: 'Tervetuloa onnistuneeseen asuntokauppaan!',
    sv: 'Välkommen till en extraordinär bostadsaffär!',
    en: 'Welcome to successful property transactions!'
  },
  hero2Subtitle: {
    fi: 'Katso kaikki myynnissä olevat kohteemme.',
    sv: 'Se alla våra objekt till salu.',
    en: 'View all our properties for sale.'
  },
  hero2Button: {
    fi: 'Löydä unelmien koti',
    sv: 'Hitta ditt drömhem',
    en: 'Find Your Dream Home'
  },
  hero3Title: {
    fi: 'Snellman Sotheby\'s International Realty®',
    sv: 'Snellman Sotheby\'s International Realty®',
    en: 'Snellman Sotheby\'s International Realty®'
  },
  hero3Subtitle: {
    fi: 'Meillä kaikilla on erilaiset tarpeet ja toiveet, ja me otamme ne huomioon ja räätälöimme ratkaisun teidän tarpeidenne ja toiveidenne mukaan. Tehtävämme on tehdä unelmastasi totta.',
    sv: 'Vi alla har olika behov och preferenser och vi beaktar dem och skräddarsyr en lösning efter ert behov och er önskan. Vår uppgift är att göra din dröm till verklighet.',
    en: 'We all have different needs and preferences, and we consider them and tailor a solution to your needs and wishes. Our mission is to make your dream come true.'
  },
  hero3Button: {
    fi: 'Tutustu toimintatapaamme',
    sv: 'Lär känna vårt arbetssätt',
    en: 'Learn About Our Approach'
  },
  hero4Title: {
    fi: 'Referenssit',
    sv: 'Referenser',
    en: 'References'
  },
  hero4Subtitle: {
    fi: 'Valikoima myydyistä kohteista',
    sv: 'Ett urval av sålda objekt',
    en: 'A selection of sold properties'
  },
  hero4Button: {
    fi: 'Tutustu kohteisiin',
    sv: 'Se objekten',
    en: 'View Properties'
  },
  
  // Loading state
  loading: {
    fi: 'Ladataan…',
    sv: 'Laddar…',
    en: 'Loading…'
  },
  
  // Empty state
  noPropertiesFound: {
    fi: 'Kohteita ei löytynyt.',
    sv: 'Inga objekt hittades.',
    en: 'No properties found.'
  },
  
  // Agent contact
  contact: {
    fi: 'Ota yhteyttä',
    sv: 'Kontakta',
    en: 'Contact'
  },
  contactAgent: {
    fi: 'Ota yhteyttä välittäjään',  // Phase 7: Fixed from 'meklaariin'
    sv: 'Kontakta mäklaren',
    en: 'Contact agent'
  },
  // Address
  address: {
    fi: 'Kasarmikatu 34, 00130 Helsinki',
    sv: 'Kaserngatan 34, 00130 Helsingfors',
    en: 'Kasarmikatu 34, 00130 Helsinki'
  },
};

/**
 * Get translated text for homepage
 */
export function getHomepageTranslation(
  key: string,
  language: SupportedLanguage = 'fi'
): string {
  const translation = HOMEPAGE_TRANSLATIONS[key];
  if (!translation) {
    console.warn(`Missing homepage translation for key: ${key}`);
    return key;
  }
  return translation[language] || translation['fi'];
}

