import { doc, getDoc, updateDoc, setDoc, collection } from 'firebase/firestore';
import * as dbFunctions from '@/lib/firebase/db';
import { AppError } from '@/lib/errors/AppError';

// Mock Firebase functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  where: jest.fn(),
  increment: jest.fn(),
}));

// Mock logger
jest.mock('@/lib/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Firebase Database Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);

      await dbFunctions.updateUserProfile('user123', {
        full_name: 'John Doe',
        isPremium: true,
      });

      expect(updateDoc).toHaveBeenCalled();
    });

    it('should throw AppError on failure', async () => {
      (updateDoc as jest.Mock).mockRejectedValueOnce(
        new Error('Firebase error')
      );

      await expect(
        dbFunctions.updateUserProfile('user123', {
          full_name: 'John Doe',
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe('createUserDocumentIfNotExists', () => {
    it('should create user document if not exists', async () => {
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => false,
      });
      (setDoc as jest.Mock).mockResolvedValueOnce(undefined);

      await dbFunctions.createUserDocumentIfNotExists('user123', {
        email: 'test@example.com',
        full_name: 'Test User',
      });

      expect(setDoc).toHaveBeenCalled();
    });

    it('should not create if user already exists', async () => {
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ uid: 'user123' }),
      });

      await dbFunctions.createUserDocumentIfNotExists('user123', {
        email: 'test@example.com',
      });

      expect(setDoc).not.toHaveBeenCalled();
    });
  });

  describe('addPoints', () => {
    it('should add points to user', async () => {
      (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          lastActive: 'different-day',
          streak: 5,
          activityLog: [],
        }),
      });

      await dbFunctions.addPoints('user123', 100);

      expect(updateDoc).toHaveBeenCalled();
    });
  });

  describe('checkIfAdmin', () => {
    it('should return true if user is admin', async () => {
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ isAdmin: true }),
      });

      const isAdmin = await dbFunctions.checkIfAdmin('user123');
      
      expect(isAdmin).toBe(true);
    });

    it('should return false if user is not admin', async () => {
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ isAdmin: false }),
      });

      const isAdmin = await dbFunctions.checkIfAdmin('user123');
      
      expect(isAdmin).toBe(false);
    });

    it('should return false on error', async () => {
      (getDoc as jest.Mock).mockRejectedValueOnce(
        new Error('Firebase error')
      );

      const isAdmin = await dbFunctions.checkIfAdmin('user123');
      
      expect(isAdmin).toBe(false);
    });
  });
});
