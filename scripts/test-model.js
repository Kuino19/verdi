const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function check() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Test");
    console.log("✅ Success with gemini-1.5-flash");
  } catch (e) {
    console.log("❌ Failed gemini-1.5-flash:", e.message);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent("Test");
      console.log("✅ Success with gemini-1.5-pro");
    } catch (e2) {
      console.log("❌ Failed gemini-1.5-pro:", e2.message);
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Test");
      console.log("✅ Success with gemini-pro");
    } catch (e3) {
      console.log("❌ Failed gemini-pro:", e3.message);
    }
  }
}
check();
