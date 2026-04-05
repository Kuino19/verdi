import '@testing-library/jest-dom';

// Mock environment variables for tests (NODE_ENV is already set by Jest)
Object.defineProperty(process.env, 'NEXT_PUBLIC_FIREBASE_API_KEY', {
  value: 'test-api-key',
  writable: true,
  configurable: true,
});
Object.defineProperty(process.env, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', {
  value: 'test.firebaseapp.com',
  writable: true,
  configurable: true,
});
Object.defineProperty(process.env, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', {
  value: 'test-project',
  writable: true,
  configurable: true,
});
Object.defineProperty(process.env, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', {
  value: 'test.appspot.com',
  writable: true,
  configurable: true,
});
Object.defineProperty(process.env, 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', {
  value: '123456789',
  writable: true,
  configurable: true,
});
Object.defineProperty(process.env, 'NEXT_PUBLIC_FIREBASE_APP_ID', {
  value: 'test-app-id',
  writable: true,
  configurable: true,
});

// Suppress specific console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
