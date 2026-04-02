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

    const { topic = "General Nigerian Law", daysAvailable = 7 } = await req.json();
    const uid = decodedClaims.uid;
    
    // Simple verification check to ensure user exists
    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
       return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let isPremium = !!userDoc.data()?.isPremium;
    if (!isPremium && daysAvailable > 14) {
      return NextResponse.json({ 
        error: "Premium Required", 
        details: "Free users can only generate study plans up to 14 days. Upgrade to Premium for full semester macro-planning." 
      }, { status: 403 });
    }

    const systemInstruction = `You are VERDI, an expert Academic Planner for Nigerian Law University Students. 
The student wants to study exactly ${topic} over the next ${daysAvailable} days.
Break the topic down into an optimized daily timetable.
Return ONLY a valid JSON array of objects. 
JSON Structure: [{"dayOffset": 0, "title": "...", "focusAreas": ["...", "...", "..."], "estimatedHours": 2}, ...]`;

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
          { role: "user", content: `Generate a ${daysAvailable}-day study schedule for ${topic}.` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      })
    });

    const groqData = await groqRes.json();
    let rawContent = groqData.choices[0]?.message?.content || "{}";
    
    let planData;
    try {
      const parsed = JSON.parse(rawContent);
      planData = Array.isArray(parsed) ? parsed : (parsed.plan || parsed.days || parsed.schedule || Object.values(parsed).find(Array.isArray) || []);
    } catch (e) {
      console.error("Groq Planner parsing error", rawContent);
      return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }

    return NextResponse.json({
      plan: planData.slice(0, daysAvailable),
    });

  } catch (error: any) {
    console.error("Planner API Error Details:", error);
    return NextResponse.json({ 
      error: "Failed to generate plan",
      details: error.message 
    }, { status: 500 });
  }
}
