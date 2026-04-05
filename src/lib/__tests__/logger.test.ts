import { logger } from '@/lib/logger';

// Mock console methods
jest.spyOn(console, 'log').mockImplementation();
jest.spyOn(console, 'warn').mockImplementation();
jest.spyOn(console, 'error').mockImplementation();
jest.spyOn(console, 'debug').mockImplementation();

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('info', () => {
    it('should log info message', () => {
      logger.info('Test info message');
      
      expect(console.log).toHaveBeenCalled();
      const output = (console.log as jest.Mock).mock.calls[0][0];
      expect(output).toContain('"level":"INFO"');
      expect(output).toContain('Test info message');
    });

    it('should log info with context', () => {
      logger.info('Test message', { userId: 'user123' });
      
      expect(console.log).toHaveBeenCalled();
      const output = (console.log as jest.Mock).mock.calls[0][0];
      expect(output).toContain('userId');
      expect(output).toContain('user123');
    });
  });

  describe('warn', () => {
    it('should log warn message', () => {
      logger.warn('Test warning message');
      
      expect(console.warn).toHaveBeenCalled();
      const output = (console.warn as jest.Mock).mock.calls[0][0];
      expect(output).toContain('"level":"WARN"');
    });
  });

  describe('error', () => {
    it('should log error message', () => {
      logger.error('Test error message');
      
      expect(console.error).toHaveBeenCalled();
      const output = (console.error as jest.Mock).mock.calls[0][0];
      expect(output).toContain('"level":"ERROR"');
    });
  });
});
