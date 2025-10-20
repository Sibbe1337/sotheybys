import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_LOCALES = ['fi', 'sv', 'en'] as const;
const DEFAULT_LOCALE = 'fi';
const LANG_COOKIE = 'preferred_lang';

/**
 * Middleware to persist user's language preference
 * 
 * Logic:
 * 1. If ?lang= is in URL → use it and set cookie
 * 2. If no ?lang= but cookie exists → append ?lang= from cookie
 * 3. If neither → use default (fi)
 * 
 * This ensures language persists across navigation without requiring
 * locale segments in the URL structure.
 */
export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  
  // Skip API routes, static files, Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf)$/)
  ) {
    return NextResponse.next();
  }
  
  const langFromQuery = searchParams.get('lang');
  const langFromCookie = req.cookies.get(LANG_COOKIE)?.value;
  
  // If ?lang= is explicitly set in URL
  if (langFromQuery && PUBLIC_LOCALES.includes(langFromQuery as any)) {
    // Update cookie to match URL
    const response = NextResponse.next();
    response.cookies.set(LANG_COOKIE, langFromQuery, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
    return response;
  }
  
  // If no ?lang= but cookie exists, redirect to add ?lang=
  if (!langFromQuery && langFromCookie && PUBLIC_LOCALES.includes(langFromCookie as any)) {
    const url = req.nextUrl.clone();
    url.searchParams.set('lang', langFromCookie);
    return NextResponse.redirect(url);
  }
  
  // If neither query nor cookie, redirect with default locale
  if (!langFromQuery) {
    const url = req.nextUrl.clone();
    url.searchParams.set('lang', DEFAULT_LOCALE);
    const response = NextResponse.redirect(url);
    response.cookies.set(LANG_COOKIE, DEFAULT_LOCALE, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};

