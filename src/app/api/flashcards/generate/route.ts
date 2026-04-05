import { Groq } from "groq-sdk";
import { FlashcardGenerateSchema } from "@/lib/validators/schemas";
import { validateSessionCookie } from "@/lib/api/auth-middleware";
import { handleError, createSuccessResponse } from "@/lib/errors/handler";
import { AppError } from "@/lib/errors/AppError";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  try {
    // Validate session
    const authData = await validateSessionCookie(req as any);
    if (!authData) {
      throw AppError.unauthorized("Session expired or invalid");
    }

    const body = await req.json();
    
    // Validate request payload
    const validatedData = FlashcardGenerateSchema.parse(body);
    const { text, count, difficulty } = validatedData;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const prompt = `You are an expert legal AI tutor. Read the following case/legal text:
    =============
    ${text}
    =============
    
    Generate exactly 5 brilliant, highly educational flashcards based on this case. Focus on the core rule of law (ratio decidendi), key facts, and legal reasoning.
    
    You MUST respond with ONLY a raw JSON object containing a single key "flashcards" which maps to an array of objects. NO markdown formatting.
    
    Format example:
    {
      "flashcards": [
        { "question": "What is the primary legal issue?", "answer": "The core answer in 1-2 sentences." }
      ]
    }`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    let raw = completion.choices?.[0]?.message?.content || "";
    if (!raw) {
      throw AppError.internal("No response from AI model");
    }
    
    // Parse the JSON
    let cards = [];
    try {
      const parsed = JSON.parse(raw);
      cards = Array.isArray(parsed) ? parsed : (parsed.flashcards || Object.values(parsed)[0]);
      
      if (!Array.isArray(cards) || cards.length === 0) {
        throw new Error("Invalid flashcard format");
      }
    } catch (e) {
      throw AppError.badRequest(
        "Failed to parse AI response",
        e instanceof Error ? e.message : "Invalid JSON from AI"
      );
    }

    logger.info("Flashcards generated successfully", { uid: authData.uid, count: cards.length, requestId });
    return createSuccessResponse({ flashcards: cards }, 200);

  } catch (error) {
    logger.error("Flashcard generation error", { 
      error: error instanceof Error ? error.message : String(error), 
      requestId 
    });
    return handleError(error, requestId);
  }
}
