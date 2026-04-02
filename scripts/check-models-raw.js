const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function check() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("❌ Error: GEMINI_API_KEY is missing from .env.local");
    return;
  }

  console.log(`Using Key ending in: ...${apiKey.slice(-5)}`);
  const genAI = new GoogleGenerativeAI(apiKey);

  const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];

  for (const modelName of models) {
    console.log(`\n🔍 Checking model: ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say 'System Check Successful'");
      console.log(`✅ ${modelName}: SUCCESS!`);
      console.log(`Response: ${result.response.text()}`);
    } catch (e) {
      console.log(`❌ ${modelName}: FAILED`);
      console.log(`- Status: ${e.status || 'N/A'}`);
      console.log(`- Message: ${e.message}`);
      if (e.errorDetails) {
        console.log(`- Details: ${JSON.stringify(e.errorDetails, null, 2)}`);
      }
    }
  }
}

check();
