/**
 * Authentication Middleware - Validates Session Cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { AppError } from '@/lib/errors/AppError';
import { logger } from '@/lib/logger';

export interface AuthenticatedRequest extends NextRequest {
  uid: string;
  email: string;
  claims: any;
}

export async function validateSessionCookie(request: NextRequest): Promise<{
  uid: string;
  email: string;
  claims: any;
} | null> {
  try {
    const cookies = request.cookies;
    const sessionCookie = cookies.get('session')?.value;

    if (!sessionCookie) {
      logger.warn('Missing session cookie');
      return null;
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email || '',
      claims: decodedClaims,
    };
  } catch (error) {
    logger.warn('Session validation failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export function requireAuth(handler: (req: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: any) => {
    const auth = await validateSessionCookie(req);

    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          statusCode: 401,
        },
        { status: 401 }
      );
    }

    // Attach auth info to request
    (req as any).uid = auth.uid;
    (req as any).email = auth.email;
    (req as any).claims = auth.claims;

    return handler(req, context);
  };
}
