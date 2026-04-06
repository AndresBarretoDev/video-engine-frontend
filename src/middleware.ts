/**
 * OP Video Engine — Next.js Middleware
 *
 * Route protection layer. Checks for JWT cookie presence.
 * Actual token validation happens on the NestJS backend.
 * This is a UI-level guard to redirect unauthenticated users.
 */

import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Bypass auth in development when NEXT_PUBLIC_AUTH_BYPASS is set */
  if (process.env.NEXT_PUBLIC_AUTH_BYPASS === 'true') {
    return NextResponse.next();
  }

  /* Bypass JWT check when mock mode is enabled — no real backend available */
  if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
    return NextResponse.next();
  }

  /* Allow public routes without auth */
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  /* Allow static assets and API routes */
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  /* Check for JWT cookie (set by NestJS backend as 'access_token') */
  const token = request.cookies.get('access_token');

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
