import { groq } from "@/lib/groq/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decodedClaims;
    try {
      decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const uid = decodedClaims.uid;
    let isPremium = false;

    // Subscription & Rate Limiting Verification
    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      const data = userDoc.data();
      isPremium = !!data?.isPremium;
      
      if (!isPremium) {
        // Daily rate limit logic for FREE tier
        const today = new Date().toISOString().split("T")[0]; // e.g. "2026-04-01"
        const aiUsage = data?.aiUsage || { date: today, count: 0 };
        
        if (aiUsage.date !== today) {
          // Reset count for a new day
          aiUsage.date = today;
          aiUsage.count = 1;
          await userRef.update({ aiUsage });
        } else {
          if (aiUsage.count >= 50) {
            // Free limit hit
            return NextResponse.json({ 
              error: "Rate limit exceeded", 
              details: "You have reached your limit of 50 free daily AI queries. Upgrade to Premium for unlimited access." 
            }, { status: 429 });
          } else {
            // Increment
            aiUsage.count += 1;
            await userRef.update({ aiUsage });
          }
        }
      }
    }

    const { messages, type = "assistant" } = await req.json();

    if (!Array.isArray(messages) || messages.length > 20) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    let systemPrompt = "You are VERDI, a premium legal AI assistant for Nigerian law students. Be professional, academically rigorous, and helpful. Use Nigerian legal precedents where applicable.";

    if (type === "summarize") {
      systemPrompt = `You are VERDI CaseFlow, an expert Nigerian appellate court summarizer. 
Return a strictly formatted summary of the requested case using exactly these Markdown headings:
## Facts
## Issues
## Rule of Law
## Application / Legal Reasoning
## Decision / Conclusion
Ensure the summary is highly academic, cites any supporting Nigerian laws or precedents mentioned in the judgment, and is clear and easy for a student to study.`;
    } else if (type === "exam") {
      systemPrompt = "You are an expert Nigerian law lecturer. Generate high-quality mock exam questions based on the provided text. Mirror the style of Nigerian university law exams.";
    }

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }))
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages as any,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
    });

    return NextResponse.json({
      content: chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.",
    });

  } catch (error: any) {
    console.error("AI API Error Full Details:", error);
    return NextResponse.json({ 
      error: "Failed to generate AI response",
      details: error.message 
    }, { status: 500 });
  }
}
