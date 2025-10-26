import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques (pas de vérification d'authentification)
  const publicPaths = ['/', '/admin/login', '/partner/login', '/partner/register', '/partner/pending'];
  
  // Laisser passer les routes publiques, _next, et api
  if (
    publicPaths.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Pour les routes protégées, on laisse le client-side (useAuth) gérer la redirection
  // Le middleware ne bloque pas car les tokens sont dans localStorage, pas dans les cookies
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf:
     * - api (API routes)
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
