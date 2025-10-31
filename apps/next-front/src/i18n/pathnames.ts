/**
 * Pathname Mappings for Localized Routes
 * 
 * Maps semantic route keys to localized paths
 * Used by next-intl navigation helpers
 */

export const pathnames = {
  // Homepage
  '/': '/',
  
  // Properties / Kohteet / Objekt
  '/properties': {
    fi: '/kohteet',
    sv: '/objekt',
    en: '/properties'
  },
  
  // Properties for sale
  '/properties/for-sale': {
    fi: '/kohteet',
    sv: '/objekt',
    en: '/properties'
  },
  
  // Rentals / Vuokrakohteet / Hyresobjekt
  '/properties/rentals': {
    fi: '/kohteet/vuokrakohteet',
    sv: '/objekt/hyresobjekt',
    en: '/properties/rentals'
  },
  
  // Purchase assignments
  '/properties/purchase-assignments': {
    fi: '/kohteet/ostotoimeksiannot',
    sv: '/objekt/kopuppdrag',
    en: '/properties/purchase-assignments'
  },
  
  // References
  '/properties/references': {
    fi: '/kohteet/referenssit',
    sv: '/objekt/referenser',
    en: '/properties/references'
  },
  
  // Selling / Myymässä / Sälja
  '/sell': {
    fi: '/myymassa',
    sv: '/salj-med-oss',
    en: '/sell-with-us'
  },
  
  // International
  '/international': {
    fi: '/kansainvalisesti',
    sv: '/internationellt',
    en: '/international'
  },
  
  // Staff / Henkilöstö / Personal
  '/staff': {
    fi: '/henkilosto',
    sv: '/personal',
    en: '/staff'
  },
  
  // Contact
  '/contact': {
    fi: '/ota-yhteytta',
    sv: '/kontakta-oss',
    en: '/contact-us'
  },
  
  // Contact info
  '/contact/info': {
    fi: '/yhteystiedot',
    sv: '/kontakta-oss',
    en: '/contact-us'
  },
  
  // About / Yritys / Företaget
  '/about': {
    fi: '/yritys',
    sv: '/om-oss',
    en: '/about'
  },
  
  // Blog (same across all locales)
  '/blog': '/blog'
} as const;

export type Pathnames = typeof pathnames;
export type PathnameKey = keyof Pathnames;

