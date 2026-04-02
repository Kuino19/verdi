const Groq = require("groq-sdk");
require('dotenv').config({ path: '.env.local' });

async function test() {
  console.log("🔍 Testing GROQ Connectivity...");
  
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ GROQ_API_KEY is missing from .env.local");
    return;
  }

  try {
    const groq = new Groq({ apiKey });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Respond with 'GROQ Connection: SUCCESS'",
        },
      ],
      model: "llama3-8b-8192",
    });

    console.log("✅ Success!");
    console.log("Response:", chatCompletion.choices[0]?.message?.content);

  } catch (err) {
    console.error("❌ GROQ Connection FAILED");
    console.error("Error Message:", err.message);
  }
}

test();
