/**
 * Next.js Middleware for Security Headers
 */

import { NextResponse, NextRequest } from 'next/server';
import { addSecurityHeaders } from '@/lib/api/security-headers';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
