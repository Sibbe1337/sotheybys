import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to:
 * 1. Redirect Finnish pages with ?lang=sv/en to proper Swedish/English pages
 * 2. Extract locale from query params and store in headers for property pages
 */
export function middleware(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get('lang');
  const pathname = request.nextUrl.pathname;
  
  // Redirect Finnish pages with ?lang=sv to Swedish pages
  if (lang === 'sv') {
    const svRedirectMap: Record<string, string> = {
      '/myymassa': '/sv/salj-med-oss',
      '/kansainvalisesti': '/sv/internationellt',
      '/henkilosto': '/sv/personal',
      '/yhteystiedot': '/sv/kontakta-oss',
      '/yritys': '/sv/om-oss',
      '/meille-toihin': '/sv/jobba-hos-oss',
      '/kohteet': '/sv/objekt',
      '/kohteet/vuokrakohteet': '/sv/objekt/hyresobjekt',
      '/kohteet/ostotoimeksiannot': '/sv/objekt/kopuppdrag',
      '/kohteet/referenssit': '/sv/objekt/referenser',
    };
    
    if (svRedirectMap[pathname]) {
      return NextResponse.redirect(new URL(svRedirectMap[pathname], request.url));
    }
  }
  
  // Redirect Finnish pages with ?lang=en to English pages
  if (lang === 'en') {
    const enRedirectMap: Record<string, string> = {
      '/myymassa': '/en/sell-with-us',
      '/kansainvalisesti': '/en/international',
      '/henkilosto': '/en/staff',
      '/yhteystiedot': '/en/contact-us',
      '/yritys': '/en/about-us',
      '/meille-toihin': '/en/work-with-us',
      '/kohteet': '/en/properties',
      '/kohteet/vuokrakohteet': '/en/properties/rentals',
      '/kohteet/ostotoimeksiannot': '/en/properties/purchase-assignments',
      '/kohteet/referenssit': '/en/properties/references',
    };
    
    if (enRedirectMap[pathname]) {
      return NextResponse.redirect(new URL(enRedirectMap[pathname], request.url));
    }
  }
  
  const locale = ['fi', 'sv', 'en'].includes(lang || '') ? lang : 'fi';
  
  const response = NextResponse.next();
  
  // Store locale in a header that layout can read
  response.headers.set('x-locale', locale || 'fi');
  
  return response;
}

export const config = {
  // Match all routes except static files and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
