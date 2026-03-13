import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, type = "assistant", context = {} } = await req.json();

    let systemPrompt = "You are VERDI, a premium legal AI assistant for Nigerian law students. Be professional, academically rigorous, and helpful. Use Nigerian legal precedents where applicable.";

    if (type === "summarize") {
      systemPrompt = "You are a legal summarizer. Provide a concise, structured breakdown of the case provided. Focus on Facts, Issues, Legal Reasoning, and Decision. Use clear heading tags.";
    } else if (type === "exam") {
      systemPrompt = "You are an expert Nigerian law lecturer. Generate high-quality mock exam questions based on the provided text. Mirror the style of Nigerian university law exams.";
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
    });

    return NextResponse.json({
      content: completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.",
    });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
  }
}
