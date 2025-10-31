/**
 * Pathname Mappings - DISABLED FOR APP ROUTER
 * 
 * App Router uses filesystem-based routing.
 * All routes use Finnish directory names because that's what exists in filesystem.
 * Cannot translate filesystem structure with pathname mappings in App Router.
 * 
 * Only dynamic catch-all routes work with pathname mappings.
 */

export const pathnames = {
  // Homepage
  '/': '/',
  
  // Blog (same across all locales)
  '/blog': '/blog'
} as const;

export type Pathnames = typeof pathnames;
export type PathnameKey = keyof Pathnames;

