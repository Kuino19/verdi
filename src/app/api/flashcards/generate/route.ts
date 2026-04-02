import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, text } = await req.json();

    if (!title || !text) {
      return NextResponse.json({ error: "Missing title or text" }, { status: 400 });
    }

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
      temperature: 0.1, // Keep it deterministic for JSON parsing
      response_format: { type: "json_object" } // Using json mode if supported, or rely on prompt
    });

    let raw = completion.choices?.[0]?.message?.content || "";
    
    // Parse the JSON. If it returned {"flashcards": [...]}, extract it.
    let cards = [];
    try {
      const parsed = JSON.parse(raw);
      cards = Array.isArray(parsed) ? parsed : (parsed.flashcards || Object.values(parsed)[0]);
    } catch (e) {
      // Fallback regex if it wrapped it in text
      const match = raw.match(/\[([\s\S]*?)\]/);
      if (match) {
        cards = JSON.parse(match[0]);
      } else {
         throw new Error("Could not parse JSON from AI response.");
      }
    }

    return NextResponse.json({ flashcards: cards });

  } catch (error: any) {
    console.error("Flashcard generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
