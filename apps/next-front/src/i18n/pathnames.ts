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
  // Homepage
  '/': '/',
  
  // Properties - ALL locales use Finnish filesystem path
  '/kohteet': '/kohteet',
  
  // Rentals - ALL locales use Finnish filesystem path
  '/kohteet/vuokrakohteet': '/kohteet/vuokrakohteet',
  
  // Purchase assignments - ALL locales use Finnish filesystem path
  '/kohteet/ostotoimeksiannot': '/kohteet/ostotoimeksiannot',
  
  
  // Sell - ALL locales use Finnish filesystem path
  '/myymassa': '/myymassa',
  
  // International - ALL locales use Finnish filesystem path
  '/kansainvalisesti': '/kansainvalisesti',
  
  // Staff - ALL locales use Finnish filesystem path
  '/henkilosto': '/henkilosto',
  
  // Contact - ALL locales use Finnish filesystem path
  '/yhteystiedot': '/yhteystiedot',
  
  // About - ALL locales use Finnish filesystem path
  '/yritys': '/yritys',
  
  // Careers/Join us - ALL locales use Finnish filesystem path
  '/meille-toihin': '/meille-toihin',
  
  // Property detail - dynamic route
  '/kohde/[slug]': '/kohde/[slug]',
  
  // Blog (same across all locales)
  '/blog': '/blog'
} as const;

export type Pathnames = typeof pathnames;
export type PathnameKey = keyof Pathnames;

