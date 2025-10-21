import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to extract locale from query params and store in headers
 * This allows the layout to access the locale server-side
 */
export function middleware(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get('lang');
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
