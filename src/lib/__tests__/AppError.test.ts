import { AppError } from '@/lib/errors/AppError';

describe('AppError', () => {
  describe('constructor', () => {
    it('should create an error with default values', () => {
      const error = new AppError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });

    it('should create an error with custom statusCode', () => {
      const error = new AppError('Not found', 404);
      
      expect(error.statusCode).toBe(404);
    });

    it('should create an error with details', () => {
      const error = new AppError('Bad request', 400, 'Invalid input format');
      
      expect(error.details).toBe('Invalid input format');
    });
  });

  describe('static factory methods', () => {
    it('should create unauthorized error', () => {
      const error = AppError.unauthorized('Invalid token');
      
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Invalid token');
    });

    it('should create forbidden error', () => {
      const error = AppError.forbidden('Access denied');
      
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Access denied');
    });

    it('should create not found error', () => {
      const error = AppError.notFound('Resource not found');
      
      expect(error.statusCode).toBe(404);
    });

    it('should create bad request error', () => {
      const error = AppError.badRequest('Invalid data');
      
      expect(error.statusCode).toBe(400);
    });

    it('should create too many requests error', () => {
      const error = AppError.tooManyRequests('Rate limit exceeded');
      
      expect(error.statusCode).toBe(429);
    });

    it('should create internal server error', () => {
      const error = AppError.internal('Database connection failed');
      
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(false);
    });
  });
});
