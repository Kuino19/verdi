/**
 * Centralized Error Handler for API Routes
 */

import { NextResponse } from 'next/server';
import { AppError } from './AppError';
import { logger } from '@/lib/logger';

export interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
  statusCode: number;
  requestId?: string;
}

export function handleError(error: unknown, requestId?: string): NextResponse<ErrorResponse> {
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Error) {
    appError = new AppError(
      error.message,
      500,
      error.message,
      false
    );
  } else {
    appError = new AppError(
      'An unexpected error occurred',
      500,
      String(error),
      false
    );
  }

  // Log the error
  if (!appError.isOperational) {
    logger.error('Unhandled application error', {
      error: appError.message,
      details: appError.details,
      stack: appError.stack,
      requestId,
    });
  } else {
    logger.warn('Operational error', {
      error: appError.message,
      statusCode: appError.statusCode,
      requestId,
    });
  }

  return NextResponse.json(
    {
      success: false,
      error: appError.message,
      details: appError.details,
      statusCode: appError.statusCode,
      requestId,
    },
    { status: appError.statusCode }
  );
}

export function createSuccessResponse<T = any>(data: T, statusCode: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      statusCode,
    },
    { status: statusCode }
  );
}
