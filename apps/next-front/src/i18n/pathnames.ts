/**
 * Pathname Mappings - APP ROUTER FILESYSTEM ROUTES
 * 
 * App Router uses filesystem-based routing.
 * All routes use Finnish directory names because that's what exists in filesystem.
 * 
 * ALL LOCALES map to the SAME Finnish filesystem paths:
 * - /kohteet (not /objekt or /properties)
 * - /henkilosto (not /personal or /staff)
 * - /myymassa (not /salj-med-oss or /sell-with-us)
 * 
 * This is required for next-intl Link component type safety.
 */

export const pathnames = {
  '/': '/',
  
  '/kohteet': {
    fi: '/kohteet',
    sv: '/objekt',
    en: '/properties',
  },
  
  '/kohteet/vuokrakohteet': {
    fi: '/kohteet/vuokrakohteet',
    sv: '/objekt/hyresobjekt',
    en: '/properties/rental-listings',
  },
  
  '/kohteet/ostotoimeksiannot': {
    fi: '/kohteet/ostotoimeksiannot',
    sv: '/objekt/kopuppdrag',
    en: '/properties/purchase-mandates',
  },
  
  '/myymassa': {
    fi: '/myymassa',
    sv: '/salj-med-oss',
    en: '/sell-with-us',
  },
  
  '/kansainvalisesti': {
    fi: '/kansainvalisesti',
    sv: '/internationellt',
    en: '/international',
  },
  
  '/henkilosto': {
    fi: '/henkilosto',
    sv: '/personal',
    en: '/personnel',
  },
  
  '/yhteystiedot': {
    fi: '/yhteystiedot',
    sv: '/kontakt',
    en: '/contact',
  },
  
  '/yritys': {
    fi: '/yritys',
    sv: '/om-oss',
    en: '/about',
  },
  
  '/meille-toihin': {
    fi: '/meille-toihin',
    sv: '/jobba-hos-oss',
    en: '/careers',
  },
  
  '/kohde/[slug]': {
    fi: '/kohde/[slug]',
    sv: '/saluobjekt/[slug]',
    en: '/listing/[slug]',
  },
  
  '/blog': '/blog',
} as const;

export type Pathnames = typeof pathnames;
export type PathnameKey = keyof Pathnames;

