const { VertexAI } = require('@google-cloud/vertexai');
require('dotenv').config({ path: '.env.local' });

async function test() {
  console.log("🔍 Testing Vertex AI Connectivity...");
  
  const project = process.env.FIREBASE_PROJECT_ID;
  const location = 'us-central1';

  try {
    const vertexAI = new VertexAI({
      project: project,
      location: location,
      googleAuthOptions: {
        credentials: {
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }
      }
    });

    const model = vertexAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Respond with 'Vertex AI Connection: SUCCESS'");
    
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("✅ Success!");
    console.log("Response:", responseText);

  } catch (err) {
    console.error("❌ Vertex AI Connection FAILED");
    console.error("Error Message:", err.message);
    if (err.errorDetails) {
      console.error("Details:", JSON.stringify(err.errorDetails, null, 2));
    }
  }
}

test();
