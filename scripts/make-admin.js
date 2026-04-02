const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function promoteToAdmin(email) {
  if (!email) {
    console.error("Usage: node scripts/make-admin.js <email>");
    process.exit(1);
  }

  console.log(`Promoting ${email} to Administrator...`);

  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({ isAdmin: true });

    console.log(`✅ Success: ${email} is now an Admin!`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating user:", error.message);
    process.exit(1);
  }
}

const emailArg = process.argv[2];
promoteToAdmin(emailArg);
