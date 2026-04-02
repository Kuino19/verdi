const Groq = require("groq-sdk");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  console.log("🔍 Fetching available GROQ models...");
  
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ GROQ_API_KEY is missing from .env.local");
    return;
  }

  try {
    const groq = new Groq({ apiKey });
    const models = await groq.models.list();
    
    console.log("✅ Success! Available Models:");
    models.data.forEach(m => {
      console.log(`- ${m.id} (Owner: ${m.owned_by})`);
    });

  } catch (err) {
    console.error("❌ Failed to list GROQ models");
    console.error("Error Message:", err.message);
  }
}

listModels();
