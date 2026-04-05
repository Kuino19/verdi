import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, focusAreas = [] } = await req.json();

    const systemInstruction = `You are VERDI, an expert Legal Tutor for Nigerian Law Students.
Construct a comprehensive, immersive "Legal Study Guide" for the topic provided. 
This is NOT a summary; it is a high-depth reading aid designed to help students master the material for exams.

Structure your response using professional Markdown:
# [TOPIC NAME]
## ⚖️ CORE LEGAL PRINCIPLES
(Detailed explanation of the underlying laws, doctrines, or legal theories).

## 📜 STATUTORY AUTHORITY
(List and explain relevant sections from the Nigerian Constitution, Acts, or Rules).

## 🏛️ LANDMARK & PERSUASIVE CASES
(Provide an exhaustive list of 3-5 key cases with their full citations and a 1-sentence ratio/significance for each).

## ⚠️ EXAM HOTSPOTS & KEY DISTINCTIONS
(Identify common traps, important legal distinctions, or areas where students often lose marks).

Use clear bolding, bullet points, and high-impact formatting for readability. Be authoritative and academically rigorous.`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Explain: ${title}. Focus: ${focusAreas.join(", ")}` }
        ],
        temperature: 0.2
      })
    });

    const groqData = await groqRes.json();

    if (!groqRes.ok) {
        console.error("Groq API Error Detail:", JSON.stringify(groqData, null, 2));
        return NextResponse.json({ error: groqData.error?.message || "AI failed to generate briefing." }, { status: groqRes.status });
    }

    const brief = groqData.choices?.[0]?.message?.content || "No briefing available.";
    return NextResponse.json({ brief });

  } catch (error: any) {
    console.error("Brief API Exception:", error);
    return NextResponse.json({ error: "Network Error: AI could not be reached." }, { status: 500 });
  }
}
