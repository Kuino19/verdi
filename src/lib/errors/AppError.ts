/**
 * Custom Application Error Class
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    details?: string,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static unauthorized(message: string = 'Unauthorized', details?: string) {
    return new AppError(message, 401, details);
  }

  static forbidden(message: string = 'Forbidden', details?: string) {
    return new AppError(message, 403, details);
  }

  static notFound(message: string = 'Not Found', details?: string) {
    return new AppError(message, 404, details);
  }

  static badRequest(message: string = 'Bad Request', details?: string) {
    return new AppError(message, 400, details);
  }

  static conflict(message: string = 'Conflict', details?: string) {
    return new AppError(message, 409, details);
  }

  static tooManyRequests(message: string = 'Too Many Requests', details?: string) {
    return new AppError(message, 429, details);
  }

  static internal(message: string = 'Internal Server Error', details?: string) {
    return new AppError(message, 500, details, false);
  }
}
