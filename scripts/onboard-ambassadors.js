const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "verdi-491800",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = admin.auth();
const db = admin.firestore();

const DEFAULT_PASSWORD = "VerdiAmbassador2026!";

const ambassadors = [
  { email: "nsikanukpe034@gmail.com", name: "Nsikan Ukpe" },
  { email: "chesemeke@gmail.com", name: "Uche-Osemeke Christie-Zion" },
  { email: "chukwukereveronica@gmail.com", name: "Chukwukere Mary" },
  { email: "lawaljohn007@gmail.com", name: "Lawal John" }
];

async function onboardAmbassadors() {
  console.log("🚀 Starting Ambassador Onboarding...");
  
  for (const amb of ambassadors) {
    try {
      console.log(`Processing: ${amb.name} (${amb.email})...`);
      
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(amb.email);
        console.log(`- User already exists, updating properties...`);
      } catch (e) {
        userRecord = await auth.createUser({
          email: amb.email,
          password: DEFAULT_PASSWORD,
          displayName: amb.name,
        });
        console.log(`- New account created!`);
      }

      const userRef = db.collection('users').doc(userRecord.uid);
      await userRef.set({
        uid: userRecord.uid,
        email: amb.email,
        displayName: amb.name,
        isPremium: true,
        role: 'ambassador',
        ambassadorSince: admin.firestore.FieldValue.serverTimestamp(),
        points: 0,
        unlockedCases: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      console.log(`✅ Success for ${amb.name}`);
    } catch (error) {
      console.error(`❌ Error with ${amb.email}:`, error.message);
    }
  }
  
  console.log("\n✨ Onboarding finished!");
  process.exit(0);
}

onboardAmbassadors();
