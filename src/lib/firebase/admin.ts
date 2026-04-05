import * as admin from "firebase-admin";

const getAdminApp = () => {
  if (admin.apps.length) return admin.apps[0];
  
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error("Firebase Admin credentials missing:", { 
      projectId: !!projectId, 
      clientEmail: !!clientEmail, 
      privateKey: !!privateKey 
    });
    return null;
  }

  // Robust PEM normalization
  privateKey = privateKey
    .replace(/\\n/g, '\n')     // Handle escaped newlines
    .replace(/^"|"$/g, '')    // Remove wrapping double quotes
    .replace(/^'|'$/g, '')    // Remove wrapping single quotes
    .trim();

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error: any) {
    console.error("Firebase Admin initialization failed:", error.message);
    return null;
  }
};

const app = getAdminApp();

export const adminAuth = app ? admin.auth(app) : null as unknown as admin.auth.Auth;
export const adminDb = app ? admin.firestore(app) : null as unknown as admin.firestore.Firestore;
export const adminStorage = app ? admin.storage(app) : null as unknown as admin.storage.Storage;
