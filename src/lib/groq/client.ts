import Groq from "groq-sdk";

// Initialize GROQ Client
// The key should be added to .env.local as GROQ_API_KEY
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Returns a completion from GROQ using Llama 3 models.
 * @param prompt - The full prompt text.
 * @param model - The model ID (default: llama-3.3-70b-versatile).
 */
export async function getGroqCompletion(prompt: string, model: string = "llama-3.3-70b-versatile") {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: model,
    response_format: { type: "json_object" }, // Ensures structured output
  });

  return chatCompletion.choices[0]?.message?.content;
}
