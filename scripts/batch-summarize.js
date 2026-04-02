const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require("@google/generative-ai");
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

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function processBatch() {
  console.log("🚀 Starting Gemini-1.5-Flash Batch Summarization...");
  
  const casesRef = db.collection('cases');
  // Process cases that haven't been summarized yet
  const snapshot = await casesRef.where('processed', '==', false).get();

  if (snapshot.empty) {
    console.log("✅ No pending cases found.");
    return;
  }

  console.log(`📂 Found ${snapshot.size} cases to process.`);

  for (const doc of snapshot.docs) {
    const caseData = doc.data();
    console.log(`\n🧠 Summarizing: ${caseData.title}...`);

    try {
      // We use a slightly smaller chunk (8,000 chars) to ensure stability
      const prompt = `Analyze this raw legal judgment and provide a structured summary.
      Return the result in a STRICT JSON format with these exact keys:
      {
        "summary": "One sentence highlights",
        "facts": "Concise summary of facts",
        "issues": "Main legal issues identified",
        "reasoning": "The court's legal reasoning",
        "decision": "Final verdict/ruling",
        "subject": "e.g. Tort Law, Criminal Law",
        "topic": "Specific legal topic",
        "landmark": true/false
      }

      Judgment Text:
      ${caseData.fullText.substring(0, 8000)}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      if (!responseText) throw new Error("Empty AI response");

      // Robust JSON extraction
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const structuredData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

      await doc.ref.update({
        ...structuredData,
        processed: true,
        processedAt: new Date().toISOString()
      });

      console.log(`✅ Success: ${caseData.title}`);
      
      // Delay (5s) to respect 15 RPM free tier limit
      await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (error) {
      console.error(`❌ Failed: ${caseData.title}`);
      console.error("Error details:", error.message);
      
      if (error.message.includes('429')) {
        console.warn("⚠️ Rate limit hit. Sleeping for 30s...");
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }
  }

  console.log("\n🏁 Batch processing complete!");
  process.exit();
}

processBatch();
