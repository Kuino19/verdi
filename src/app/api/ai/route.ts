import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

// Initialize the official modern GenAI client
const genAI = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  apiVersion: "v1"
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, type = "assistant" } = await req.json();

    if (!Array.isArray(messages) || messages.length > 20) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    let systemPrompt = "You are VERDI, a premium legal AI assistant for Nigerian law students. Be professional, academically rigorous, and helpful. Use Nigerian legal precedents where applicable.";

    if (type === "summarize") {
      systemPrompt = "You are a legal summarizer. Provide a concise, structured breakdown of the case provided. Focus on Facts, Issues, Legal Reasoning, and Decision. Use clear heading tags.";
    } else if (type === "exam") {
      systemPrompt = "You are an expert Nigerian law lecturer. Generate high-quality mock exam questions based on the provided text. Mirror the style of Nigerian university law exams.";
    }

    // Map history to the modern SDK format
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    // Ensure first message is user to avoid SDK errors
    while (contents.length > 0 && contents[0].role === "model") {
      contents.shift();
    }

    // Call the model using the official unified method with snake_case parameters
    // for confirmed API compatibility on v1 endpoint.
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        // @ts-ignore - Some versions of the GenAI SDK require snake_case for the API
        system_instruction: systemPrompt,
        temperature: 0.7,
        // @ts-ignore
        max_output_tokens: 2048,
      } as any
    });

    return NextResponse.json({
      content: response.text || "I'm sorry, I couldn't process that request.",
    });

  } catch (error: any) {
    console.error("AI API Error Full Details:", error);
    return NextResponse.json({ 
      error: "Failed to generate AI response",
      details: error.message 
    }, { status: 500 });
  }
}
